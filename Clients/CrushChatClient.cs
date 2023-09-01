using System.Text;

namespace CrushChatApi;

public class CrushChatClient : IDisposable
{
    readonly HttpRequest request;

    readonly HttpClientHandler handler;
    readonly HttpClient client;

    public CrushChatClient(HttpRequest request)
    {
        this.request = request;

        handler = new HttpClientHandler() { UseCookies = false };
        client = new(handler) { BaseAddress = new("https://crushchat.app") };
    }

    public async Task<T> GetAsync<T>(string requestUri)
    {
        using var message = CreateMessage(HttpMethod.Get, requestUri);
        var result = await client.SendAsync(message);

        if (!result.IsSuccessStatusCode)
            Console.WriteLine(await result.Content.ReadAsStringAsync());

        return await result.Content.ReadFromJsonAsync<T>();
    }

    public async Task DeleteAsync(string requestUri)
    {
        using var message = CreateMessage(HttpMethod.Delete, requestUri);
        await client.SendAsync(message);
    }

    public async Task<List<Character>> GetCharactersAsync()
    {
        List<Character> characters;

        var folder = new DirectoryInfo(Path.Combine("Data", "Characters"));

        var cachedCharacters = folder.Exists ? folder
            .EnumerateFiles()
            .Select(x => File.ReadAllText(x.FullName).FromJson<Character>())
            .ToList() : new();

        if (request.GetQueryBoolean("cache"))
        {
            characters = cachedCharacters;
        }
        else
        {
            var path = "/api/characters";
            var queryString = $"&search=&limit={request.Headers["X-Character-Limit"]}";

            var privateCharacters = await GetAsync<List<Character>>($"{path}?page=1{queryString}&sortBy=Top&isPrivate=true");
            privateCharacters.ForEach(x => x.isPrivate = true);

            var recentCharacters = (await GetAsync<List<Character>>($"{path}/recent?page=1{queryString}&sortBy=Top"));
            recentCharacters.ForEach(x => x.recent = true);

            var publicCharacters = new List<Character>();
            publicCharacters.AddRange(await GetAsync<List<Character>>($"{path}?page=1{queryString}&sortBy=Hot&tags="));
            publicCharacters.ForEach(x => x.hot = true);

            //foreach (var key in new[] { "Top", "Hot", "New" })
            //{
            //    for (int i = 1; i <= 5; i++)
            //    {
            //        publicCharacters.AddRange(
            //            await GetAsync<List<Character>>(
            //                $"{path}?page={i}{queryString}&sortBy={key}&tags="
            //            )
            //        );
            //    }
            //}

            characters = Enumerable.Empty<Character>()
                .Concat(privateCharacters)
                .Concat(recentCharacters)
                .Concat(publicCharacters)
                .Concat(cachedCharacters)
                .DistinctBy(x => x.id)
                .OrderByDescending(x => x.isPrivate)
                .ThenByDescending(x => x.recent)
                .ThenByDescending(x => x.hot)
                .ThenByDescending(x => x.upvotes)
                .ToList();

            folder.Create();

            foreach (var character in characters)
                File.WriteAllText(Path.Combine(folder.FullName, $"{character.id}.json"), character.ToJson());
        }

        if (request.NeedsTranslation(out var language))
            foreach (var character in characters)
                character.TranslateTo(language);

        return characters;
    }

    public async Task<List<Character.Message>> GetCharacterMessagesAsync(string characterId, bool preferCache, bool initialize = false)
    {
        var jsonFile = Path.Combine("Data", "Messages", $"{characterId}.json");

        List<Character.Message> messages;

        if (!initialize && (preferCache || request.GetQueryBoolean("cache")) && File.Exists(jsonFile))
        {
            messages = File.ReadAllText(jsonFile).FromJson<List<Character.Message>>() ?? new();
        }
        else
        {
            var path = $"/api/messages?characterId={characterId}&limit={request.Headers["X-Message-Limit"]}";
            var character = await GetAsync<Character>(path);
            messages = character.messages ?? new();

            if (initialize && messages.Count == 0)
            {
                await PutMessageAsync("You", characterId, 0, "");
                await DeleteAsync($"/api/messages?characterId={characterId}");

                character = await GetAsync<Character>(path);
                messages = character.messages ?? new();
            }

            Directory.CreateDirectory(Path.Combine("Data", "Messages"));
            File.WriteAllText(jsonFile, messages.ToJson());
        }

        if (request.NeedsTranslation(out var language))
            foreach (var message in messages)
                message.TranslateTo(language);

        return messages;
    }

    public async Task<MessageRequest.Response> GenerateResponseAsync(string characterId, MessageRequest messageRequest)
    {
        using var message = CreateMessage(HttpMethod.Post, "/api/generate-response-v2");
        message.Headers.Add("Referer", $"https://crushchat.app/characters/chat/{characterId}");
        var json = messageRequest.ToJson();
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");
        var result = await client.SendAsync(message);
        return await result.Content.ReadFromJsonAsync<MessageRequest.Response>();
    }

    public async Task<MessageRequest.Result> PutMessageAsync(string role, string characterId, int index, string content)
    {
        var json = "{\"message\":{\"role\":\"" + role + "\",\"content\":" + content.ToJson() + ",\"index\":" + index + "},\"characterId\":\"" + characterId + "\"}";

        using var message = CreateMessage(HttpMethod.Put, "/api/messages");
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var result = await client.SendAsync(message);
        if (!result.IsSuccessStatusCode)
            Console.WriteLine(await result.Content.ReadAsStringAsync());

        return await result.Content.ReadFromJsonAsync<MessageRequest.Result>();
    }

    public async Task<MessageRequest.Result> PutMessageAsync(string characterId, Character.Message characterMessage)
    {
        var json = "{\"message\":" + characterMessage.ToJson() + ",\"characterId\":\"" + characterId + "\"}";

        using var message = CreateMessage(HttpMethod.Put, "/api/messages");
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var result = await client.SendAsync(message);
        if (!result.IsSuccessStatusCode)
            Console.WriteLine(await result.Content.ReadAsStringAsync());

        return await result.Content.ReadFromJsonAsync<MessageRequest.Result>();
    }

    public async Task<ImageRequest.Response> GenerateImageAsync(string characterId, ImageRequest imageRequest)
    {
        using var message = CreateMessage(HttpMethod.Post, "/api/generate-image");
        message.Headers.Add("Referer", $"https://crushchat.app/characters/chat/{characterId}");
        var json = imageRequest.ToJson();
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");
        var result = await client.SendAsync(message);
        return await result.Content.ReadFromJsonAsync<ImageRequest.Response>();
    }

    public void Dispose()
    {
        client.Dispose();
        handler.Dispose();
    }

    HttpRequestMessage CreateMessage(HttpMethod method, string requestUri)
    {
        var message = new HttpRequestMessage(method, requestUri);
        message.Headers.Add("Cookie", $"" +
            $"__Host-next-auth.csrf-token={request.Headers["X-CSRF-Token"]}; " +
            $"__Secure-next-auth.session-token={request.Headers["X-Session-Token"]}"
        );
        return message;
    }
}
