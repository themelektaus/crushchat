﻿using System.Text;
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

        var languageFolder = Directory.CreateDirectory(Path.Combine("Data", "Translations", "LibreTranslate", targetLanguage));

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

        foreach (var translation in pending)
        {
            var original = translation.original;

            original = Regex.Replace(original, "\\*(.*?)\\*", "($1)");

            using var message = CreateMessage(sourceLanguage, targetLanguage, original);

            var result = await client.SendAsync(message);

            if (!result.IsSuccessStatusCode)
            {
                var content = await result.Content.ReadAsStringAsync();
                throw new(content);
            }

            var response = await result.Content.ReadFromJsonAsync<Response>();

            translation.translation = response.translatedText;

            var md5 = translation.original.Trim().ToLower().ToMD5();
            var languageFilePath = Path.Combine(languageFolder.FullName, $"{md5}.json");
            File.WriteAllText(languageFilePath, translation.ToJson());

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
