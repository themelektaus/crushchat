using System.Text;

namespace CrushChatApi;

public class DeepLClient : ITranslationClient
{
    class Response
    {
        public class Translation
        {
            public string detected_source_language { get; set; }
            public string text { get; set; }
        }
        public Translation[] translations { get; set; }
    }

    readonly HttpRequest request;
    readonly HttpClient client;

    public DeepLClient(HttpRequest request)
    {
        this.request = request;

        client = new() { BaseAddress = new("https://api-free.deepl.com") };
    }

    public async Task<List<Translation>> TranslateAsync(string sourceLanguage, string targetLanguage, params string[] text)
    {
        List<Translation> translations = new();
        List<Translation> pending = new();

        foreach (var t in text)
        {
            var _t = t.Trim();
            var md5 = _t.ToLower().ToMD5();

            var translation = Utils.GetTranslationFile_DeepL(targetLanguage, md5).ReadAsJson<Translation>();
            if (translation is not null)
            {
                translations.Add(translation);
                continue;
            }

            pending.Add(new() { original = _t, translation = null });
        }

        while (pending.Count > 0)
        {
            var block = pending.Take(10).ToList();

            foreach (var item in block)
                Console.WriteLine($"DeepL translates from {sourceLanguage} to {targetLanguage}: \"{item.original}\"");

            using var message = CreateMessage(
                request.Headers["X-DeepL-Auth-Key"],
                sourceLanguage,
                targetLanguage,
                pending.Select(x => x.original).ToArray()
            );

            var result = await client.SendAsync(message);

            if (!result.IsSuccessStatusCode)
            {
                var content = await result.Content.ReadAsStringAsync();
                throw new(content);
            }

            var response = await result.Content.ReadFromJsonAsync<Response>();

            for (int i = 0; i < block.Count; i++)
                block[i].translation = response.translations[i].text.Trim();

            foreach (var translation in block)
            {
                var md5 = translation.original.ToLower().ToMD5();
                translation.WriteJsonTo(Utils.GetTranslationFile_DeepL(targetLanguage, md5));
            }

            translations.AddRange(block);

            pending.RemoveRange(0, block.Count);
        }

        return translations;
    }

    public void Dispose()
    {
        client.Dispose();
    }

    static HttpRequestMessage CreateMessage(string authKey, string sourceLanguage, string targetLanguage, string[] text)
    {
        var message = new HttpRequestMessage(HttpMethod.Post, "/v2/translate");
        message.Headers.Add("Authorization", $"DeepL-Auth-Key {authKey}");

        var json = "{\"text\":[" + string.Join(",", text.Select(x => x.ToJson())) + "],\"source_lang\":\""
            + sourceLanguage + "\",\"target_lang\":\"" + targetLanguage + "\",\"formality\":\"prefer_less\"}";

        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        return message;
    }
}
