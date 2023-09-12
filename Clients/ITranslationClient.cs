namespace CrushChatApi;

public interface ITranslationClient : IDisposable
{
    public Task<List<Translation>> TranslateAsync(string sourceLanguage, string targetLanguage, params string[] text);

    public static ITranslationClient Create(HttpRequest request)
    {
        if (request.Headers["X-Translation-Client"] == "DeepL")
            if (!string.IsNullOrEmpty(request.Headers["X-DeepL-Auth-Key"]))
                return new DeepLClient(request);

        if (request.Headers["X-Translation-Client"] == "LibreTranslate")
            if (!string.IsNullOrEmpty(request.Headers["X-LibreTranslate-URL"]))
                return new LibreTranslateClient(request);

        return null;
    }
}
