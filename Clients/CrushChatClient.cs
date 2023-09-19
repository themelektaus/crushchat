using System.Text;

namespace CrushChatApi;

public class CrushChatClient : IDisposable
{
    readonly HttpRequest request;

    readonly HttpClientHandler handler;
    readonly HttpClient client;

    public string userId { get; private set; }
    public bool nsfw { get; private set; }

    public CrushChatClient(HttpRequest request)
    {
        this.request = request;

        handler = new HttpClientHandler() { UseCookies = false };
        client = new(handler) { BaseAddress = new("https://crushchat.app") };

        if (request.Headers.TryGetValue("X-User-ID", out var _userId))
            userId = _userId;

        if (request.Headers.TryGetValue("X-NSFW", out var _nsfw))
            nsfw = _nsfw == "true";
    }

    public void Dispose()
    {
        client.Dispose();
        handler.Dispose();
    }

    public async Task<(bool success, HttpResponseMessage response)> SendAsync(HttpRequestMessage request)
    {
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
            return (true, response);

        Console.WriteLine(await response.Content.ReadAsStringAsync());
        return (false, response);
    }

    public async Task<T> GetAsync<T>(string requestUri)
    {
        using var message = CreateMessage(HttpMethod.Get, requestUri);
        var (success, response) = await SendAsync(message);
        return success ? await response.Content.ReadFromJsonAsync<T>() : default;
    }

    public async Task<List<Character>> GetCharactersAsync()
    {
        if (userId is null)
            return new();

        List<Character> characters;

        var folder = new DirectoryInfo(Path.Combine("UserData", userId, "Characters"));

        var cachedCharactersEnumerable = folder.Exists
            ? folder.EnumerateFiles()
                .Select(x => File.ReadAllText(x.FullName).FromJson<Character>())
            : Enumerable.Empty<Character>();

        var search = request.GetQueryString("search");
        if (!string.IsNullOrEmpty(search))
        {
            cachedCharactersEnumerable = cachedCharactersEnumerable
                .Where(x => x.name.ToLower().Contains(search.ToLower()));
        }
        var cachedCharacters = cachedCharactersEnumerable.ToList();

        if (request.GetQueryBoolean("cache", true))
        {
            characters = cachedCharacters;
        }
        else
        {
            var path = "/api/characters";
            var queryString = $"&search=&limit=25";

#if DEBUG
            var recentCharacters = (await GetAsync<List<Character>>($"{path}/recent?page=1{queryString}&sortBy=Top"));
            recentCharacters.ForEach(x => x.recent = true);
#endif

            var privateCharacters = await GetAsync<List<Character>>($"{path}?page=1{queryString}&sortBy=Top&isPrivate=true");
            privateCharacters.ForEach(x => x.isPrivate = true);

#if DEBUG
            var publicCharacters = new List<Character>();
            publicCharacters.AddRange(await GetAsync<List<Character>>($"{path}?page=1{queryString}&sortBy=Hot&tags="));
            publicCharacters.ForEach(x => x.hot = true);
#endif

            characters = Enumerable.Empty<Character>()
#if DEBUG
                .Concat(recentCharacters)
#endif
                .Concat(privateCharacters)
#if DEBUG
                .Concat(publicCharacters)
#endif
                .Concat(cachedCharacters)
                .OrderByDescending(x => x.recent)
                .ThenByDescending(x => x.isPrivate)
                .ThenByDescending(x => x.hot)
                .ThenByDescending(x => x.upvote)
                .DistinctBy(x => x.id)
                .ToList();

            folder.Create();

            foreach (var character in characters)
                File.WriteAllText(Path.Combine(folder.FullName, $"{character.id}.json"), character.ToJson());
        }

        characters.ForEach(x => x.Prepare(userId));
#if !DEBUG
        characters.RemoveAll(x => x.details.hidden);
#endif

        if (request.NeedsTranslation(out var language))
            foreach (var character in characters)
                character.TranslateTo(language);

        return characters;
    }

    public Character GetCharacter(string characterId)
    {
        if (userId is null)
            return default;

        var file = new FileInfo(Path.Combine("UserData", userId, "Characters", $"{characterId}.json"));
        return file.Exists
            ? File.ReadAllText(file.FullName).FromJson<Character>().Prepare(userId)
            : default;
    }

    public async Task<List<Character.Message>> GetCharacterMessagesAsync(
        string characterId,
        bool preferCache,
        bool initialize = false,
        bool translate = false
    )
    {
        if (userId is null)
            return new();

        var jsonFile = Path.Combine("UserData", userId, "Messages", $"{characterId}.json");

        var path = $"/api/messages?characterId={characterId}&limit=80";

        var needsTranslation = request.NeedsTranslation(out var language);
        if (needsTranslation && translate)
        {
            using var translationClient = ITranslationClient.Create(request);
            if (translationClient is not null)
            {
                var _character = (await GetCharactersAsync()).FirstOrDefault(x => x.id == characterId);

                var text = new List<string>() {
                    _character.description.Trim(),
                    _character.personaFiltered
                };

                text.AddRange((await GetAsync<Character>(path)).messages.Select(x => x.content));

                await translationClient.TranslateAsync("EN", language, text.ToArray());
            }
        }

        List<Character.Message> messages;

        if (!initialize && (preferCache || request.GetQueryBoolean("cache", true)) && File.Exists(jsonFile))
        {
            messages = File.ReadAllText(jsonFile).FromJson<List<Character.Message>>() ?? new();
        }
        else
        {
            var character = await GetAsync<Character>(path);
            messages = character.messages ?? new();

            if (initialize && messages.Count == 0)
            {
                await PutMessageAsync("You", characterId, 0, "");

                using var message = CreateMessage(
                    HttpMethod.Delete,
                    $"/api/messages?characterId={characterId}"
                );
                var (_, response) = await SendAsync(message);

                character = await GetAsync<Character>(path);
                messages = character.messages ?? new();
            }

            messages.ForEach(x => x.content = x.content.Trim());

            Directory.CreateDirectory(Path.Combine("UserData", userId, "Messages"));
            File.WriteAllText(jsonFile, messages.ToJson());
        }

        if (needsTranslation)
            foreach (var message in messages)
                message.TranslateTo(language);

        return messages;
    }

    public void AddMemories(List<Character.Message> messages, string characterId)
    {
        var character = GetCharacter(characterId);
        if (character is null)
            return;

        var details = character.details;
        if (details is null)
            return;

        if (messages.Count == 0)
            return;

        var memories = details.memories;
        if (memories is null)
            return;

        var firstIndex = messages.Min(x => x.messageIndex);
        var note = "Another important information about me";

        for (int i = memories.Count - 1; i >= 0; i--)
        {
            if (i == 0)
                note = "Important information about my persona";

            messages.Insert(0, new()
            {
                messageIndex = --firstIndex,
                content = $"*{note}* {memories[i].content}",
                upvote = 1,
                role = "Bot" //memories[i].role
            });
        }
    }

    public async Task<MessageRequest.Response> GenerateResponseAsync(MessageRequest messageRequest)
    {
        using var message = CreateMessage(HttpMethod.Post, "/api/generate-response-v2");

        message.Content = new StringContent(
            messageRequest.ToJson(),
            Encoding.UTF8,
            "application/json"
        );

        var (success, response) = await SendAsync(message);
        return success
            ? await response.Content.ReadFromJsonAsync<MessageRequest.Response>()
            : default;
    }

    public async Task<MessageRequest.Result> PutMessageAsync(string role, string characterId, int index, string content)
    {
        var json = "{\"message\":{\"role\":\"" + role + "\",\"content\":" + content.ToJson() + ",\"index\":" + index + "},\"characterId\":\"" + characterId + "\"}";

        using var message = CreateMessage(HttpMethod.Put, "/api/messages");
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var (success, response) = await SendAsync(message);
        return success
            ? await response.Content.ReadFromJsonAsync<MessageRequest.Result>()
            : default;
    }

    public async Task<MessageRequest.Result> PutMessageAsync(string characterId, Character.Message characterMessage)
    {
        var json = "{\"message\":" + characterMessage.ToJson() + ",\"characterId\":\"" + characterId + "\"}";

        using var message = CreateMessage(HttpMethod.Put, "/api/messages");
        message.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var (success, response) = await SendAsync(message);
        return success
            ? await response.Content.ReadFromJsonAsync<MessageRequest.Result>()
            : default;
    }

    public async Task<ImageInfo> GenerateImageAsync(ImageRequest imageRequest)
    {
        if (userId is null)
            return default;

        using var message = CreateMessage(HttpMethod.Post, "/api/generate-image");

        message.Content = new StringContent(
            imageRequest.ToJson(),
            Encoding.UTF8,
            "application/json"
        );

        var (success, response) = await SendAsync(message);
        if (!success)
            return default;

        var statusId = (await response.Content.ReadFromJsonAsync<ImageRequest.Response>()).id;

        ImageRequest.Status status;

        for (; ; )
        {
            status = await GetAsync<ImageRequest.Status>($"/api/images/status/{statusId}");
            if (status.status == "error" || status.status == "completed")
                break;

            await Task.Delay(3000);
        }

        var imageUrl = status.reply.output.FirstOrDefault()?.image;

        var imageResponse = await client.GetAsync(imageUrl);
        if (!imageResponse.IsSuccessStatusCode)
            return default;

        var imagesFolder = Path.Combine("UserData", userId, "Images");
        Directory.CreateDirectory(imagesFolder);

        var imageName = imageUrl.ToMD5();
        var imageFileName = $"{imageName}.png";
        var imagePath = Path.Combine(imagesFolder, imageFileName);

        using (var stream = new FileStream(imagePath, FileMode.CreateNew))
            await imageResponse.Content.CopyToAsync(stream);

        var imageInfo = new ImageInfo { request = imageRequest, originalUrl = imageUrl };

        await File.WriteAllTextAsync(
            Path.Combine(imagesFolder, $"{imageName}.json"),
            imageInfo.ToJson()
        );

        return imageInfo.Load(userId, imageName);
    }

    public async Task<HttpResponseMessage> CreateCharacterAsync(Character.Creation.New character)
    {
        var message = CreateMessage(HttpMethod.Post, "/api/characters/create");

        message.Content = new StringContent(
            character.ToJson(),
            Encoding.UTF8,
            "application/json"
        );

        var (_, response) = await SendAsync(message);

        return response;
    }

    public async Task<HttpResponseMessage> EditCharacterAsync(Character.Creation.Edit.WithDetails character)
    {
        if (userId is null)
            return default;

        HttpResponseMessage response = default;

        var _character = GetCharacter(character.id);
        if (_character is not null && _character.userId == userId)
        {
            var message = CreateMessage(HttpMethod.Post, "/api/characters/update");

            message.Content = new StringContent(
                (character as Character.Creation.Edit).ToJson(),
                Encoding.UTF8,
                "application/json"
            );

            (_, response) = await SendAsync(message);
        }

        character.WriteDetails(userId);

        _character = GetCharacter(character.id);
        if (_character is not null && _character.userId == userId)
        {
            _character.name = character.name;
            _character.description = character.description;
            _character.imagePrompt = character.imagePrompt;
            _character.initialMessages = character.initialMessages;
            _character.persona = character.persona;

            Directory.CreateDirectory(Path.Combine("UserData", userId, "Characters"));
            File.WriteAllText(
                Path.Combine("UserData", userId, "Characters", $"{character.id}.json"),
                _character.ToJson()
            );
        }

        return response;
    }

    public async Task<HttpResponseMessage> DeleteCharacterAsync(string characterId)
    {
        if (userId is null)
            return default;

        if (GetCharacter(characterId).userId != userId)
            return default;

        using var message = CreateMessage(
            HttpMethod.Delete,
            $"/api/characters/{characterId}/delete"
        );

        var (sucess, response) = await SendAsync(message);

        foreach (var path in new[]
        {
            Path.Combine("UserData", userId, "CharacterDetails", $"{characterId}.json"),
            Path.Combine("UserData", userId, "Characters", $"{characterId}.json"),
            Path.Combine("UserData", userId, "Messages", $"{characterId}.json")
        })
        {
            if (File.Exists(path))
                File.Delete(path);
        }

        return response;
    }

    public HttpRequestMessage CreateMessage(HttpMethod method, string requestUri)
    {
        var message = new HttpRequestMessage(method, requestUri);

        message.Headers.Add("Cookie", $"" +
            $"__Host-next-auth.csrf-token={request.Headers["X-CSRF-Token"]}; " +
            $"__Secure-next-auth.session-token={request.Headers["X-Session-Token"]}"
        );

        return message;
    }
}
