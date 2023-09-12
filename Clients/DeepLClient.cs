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

        var languageFolder = Directory.CreateDirectory(Path.Combine("Data", "Translations", "DeepL", targetLanguage));

        foreach (var t in text)
        {
            var md5 = t.Trim().ToLower().ToMD5();

            var languageFilePath = Path.Combine(languageFolder.FullName, $"{md5}.json");

            if (File.Exists(languageFilePath))
            {
                translations.Add(File.ReadAllText(languageFilePath).FromJson<Translation>());
                continue;
            }

            pending.Add(new() { original = t, translation = null });
        }

        while (pending.Count > 0)
        {
            var block = pending.Take(int.Parse(request.Headers["X-DeepL-Block-Size"])).ToList();

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
                block[i].translation = response.translations[i].text;

            foreach (var translation in block)
            {
                var md5 = translation.original.Trim().ToLower().ToMD5();
                var languageFilePath = Path.Combine(languageFolder.FullName, $"{md5}.json");
                File.WriteAllText(languageFilePath, translation.ToJson());
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

        var json = "{\"text\":[" + string.Join(",", text.Select(x => x.ToJson())) + "],\"source_lang\":\"" + sourceLanguage + "\",\"target_lang\":\"" + targetLanguage + "\",\"formality\":\"prefer_less\"}";
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        return message;
    }
}
