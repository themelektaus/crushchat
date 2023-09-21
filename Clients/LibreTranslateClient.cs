using System.Text;
using System.Text.RegularExpressions;

namespace CrushChatApi;

public class LibreTranslateClient : ITranslationClient
{
    class Response
    {
        public string translatedText { get; set; }
    }

    readonly HttpClient client;

    public LibreTranslateClient(HttpRequest request)
    {
        client = new() { BaseAddress = new(request.Headers["X-LibreTranslate-URL"]) };
    }

    public async Task<List<Translation>> TranslateAsync(string sourceLanguage, string targetLanguage, params string[] text)
    {
        List<Translation> translations = new();
        List<Translation> pending = new();

        foreach (var t in text)
        {
            var _t = t.Trim();
            var md5 = _t.ToLower().ToMD5();

            var translation = Utils.GetTranslationFile_LibreTranslate(targetLanguage, md5).ReadAsJson<Translation>();
            if (translation is not null)
            {
                translations.Add(translation);
                continue;
            }

            pending.Add(new() { original = _t, translation = null });
        }

        foreach (var translation in pending)
        {
            var original = translation.original;
            original = Regex.Replace(original, "\\*(.*?)\\*", "($1)").Trim();

            Console.WriteLine($"LibreTranslate translates from {sourceLanguage} to {targetLanguage}: \"{original}\"");

            using var message = CreateMessage(sourceLanguage, targetLanguage, original);

            var result = await client.SendAsync(message);

            if (!result.IsSuccessStatusCode)
            {
                var content = await result.Content.ReadAsStringAsync();
                throw new(content);
            }

            var response = await result.Content.ReadFromJsonAsync<Response>();

            translation.translation = response.translatedText.Trim();

            var md5 = translation.original.ToLower().ToMD5();
            translation.WriteJsonTo(Utils.GetTranslationFile_LibreTranslate(targetLanguage, md5));

            translations.Add(translation);
        }

        return translations;
    }

    public void Dispose()
    {
        client.Dispose();
    }

    static HttpRequestMessage CreateMessage(string sourceLanguage, string targetLanguage, string text)
    {
        var message = new HttpRequestMessage(HttpMethod.Post, "/translate");

        var json = "{\"q\":" + text.ToJson() + ",\"source\":\"" + sourceLanguage.ToLower() + "\",\"target\":\"" + targetLanguage.Split('-')[0].ToLower() + "\"}";
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        return message;
    }
}
