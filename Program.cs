using CrushChatApi;



var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseStaticFiles();
app.MapFallbackToFile("index.html");



#region GET /api/characters

app.MapGet("/api/characters", async (HttpRequest request) =>
{
    using var client = new CrushChatClient(request);
    var characters = await client.GetCharactersAsync();

    var homeCharacters = new HomeCharacters();

    foreach (var character in characters)
        if (character.isPrivate)
            homeCharacters.@private.Add(character);
        else if (character.recent)
            homeCharacters.recent.Add(character);
        else
            homeCharacters.@public.Add(character);

    return homeCharacters;
});

#endregion



#region GET /api/characters/{characterId}/messages

app.MapGet("/api/characters/{characterId}/messages", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);
    return await client.GetCharacterMessagesAsync(
        characterId,
        preferCache: request.GetQueryBoolean("cache"),
        initialize: request.GetQueryBoolean("initialize")
    );
});

#endregion



#region POST /api/characters/{characterId}/messages

app.MapPost("/api/characters/{characterId}/messages", async (HttpRequest request, string characterId) =>
{
    string body = null;
    using (var stream = new StreamReader(request.Body))
        body = await stream.ReadToEndAsync();

    if (request.NeedsTranslation(out var language))
    {
        using var deeplClient = new DeepLClient(request);
        var translations = await deeplClient.TranslateAsync(language, "EN-US", body);

        var translation = translations.FirstOrDefault();
        if (translation is null)
            return default;

        translations = await deeplClient.TranslateAsync("EN", language, translation.translation);
        translation = translations.FirstOrDefault();
        if (translation is null)
            return default;

        if (string.IsNullOrEmpty(translation.translation))
            return default;

        body = translation.original;
    }

    using var client = new CrushChatClient(request);

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);
    var index = messages.LastOrDefault()?.index ?? -1;

    var result = await client.PutMessageAsync("You", characterId, index + 1, body);

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region POST /api/characters/{characterId}/messages/{index}

app.MapPost("/api/characters/{characterId}/messages/{index}", async (HttpRequest request, string characterId, int index) =>
{
    string body = null;
    using (var stream = new StreamReader(request.Body))
        body = await stream.ReadToEndAsync();

    if (request.NeedsTranslation(out var language))
    {
        using var deeplClient = new DeepLClient(request);
        var translations = await deeplClient.TranslateAsync(language, "EN-US", body);

        var translation = translations.FirstOrDefault();
        if (translation is null)
            return default;

        translations = await deeplClient.TranslateAsync("EN", language, translation.translation);
        translation = translations.FirstOrDefault();
        if (translation is null)
            return default;

        if (string.IsNullOrEmpty(translation.translation))
            return default;

        body = translation.original;
    }

    using var client = new CrushChatClient(request);

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);
    var message = messages.FirstOrDefault(x => x.index == index);
    message.content = body;

    var result = await client.PutMessageAsync(characterId, message);

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region GET /api/characters/{characterId}/messages/translate

app.MapGet("/api/characters/{characterId}/messages/translate", async (HttpRequest request, string characterId) =>
{
    if (!request.NeedsTranslation(out var language))
        return default;

    using var client = new CrushChatClient(request);

    var characters = await client.GetCharactersAsync();
    var character = characters.FirstOrDefault(x => x.id == characterId);
    if (character is null)
        return default;

    var text = new List<string>() {
        character.description.Trim(),
        character.persona.Trim()
    };

    character = await client.GetAsync<Character>($"/api/messages?characterId={characterId}&limit={request.Headers["X-Message-Limit"]}");
    var messages = character.messages;
    text.AddRange(messages.Select(x => x.content));

    using var deeplClient = new DeepLClient(request);
    await deeplClient.TranslateAsync("EN", language, text.ToArray());

    characters = await client.GetCharactersAsync();
    character = characters.FirstOrDefault(x => x.id == characterId);
    if (character is null)
        return default;

    character.messages = messages;
    character.TranslateTo(language);

    return character;
});

#endregion



#region GET /api/characters/{characterId}/messages/generate

app.MapGet("/api/characters/{characterId}/messages/generate", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);

    var characters = await client.GetCharactersAsync();
    var character = characters.FirstOrDefault(x => x.id == characterId);

    if (character is null)
        return default;

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);

    var messageRequest = new MessageRequest
    {
        botName = character.name,
        persona = character.persona,
        messages = messages
    };

    var response = await client.GenerateResponseAsync(characterId, messageRequest);

    MessageRequest.Status status;

    for (; ; )
    {
        status = await client.GetAsync<MessageRequest.Status>($"/api/v2/status/{response.id}");
        if (status.status == "error" || status.status == "completed")
            break;

        await Task.Delay(3000);
    }

    var index = messages.LastOrDefault()?.index ?? -1;
    var result = await client.PutMessageAsync("Bot", characterId, index + 1, status.reply);

    if (result.message != "Message saved successfully.")
        return default;

    if (request.NeedsTranslation(out var language))
    {
        using var deeplClient = new DeepLClient(request);
        await deeplClient.TranslateAsync("EN", language, status.reply);
    }

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region GET /api/characters/{characterId}/messages/generate/{index}

app.MapGet("/api/characters/{characterId}/messages/generate/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);

    var characters = await client.GetCharactersAsync();
    var character = characters.FirstOrDefault(x => x.id == characterId);

    if (character is null)
        return default;

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);

    var messageRequest = new MessageRequest
    {
        botName = character.name,
        persona = character.persona,
        messages = messages.Where(x => x.index < index).ToList()
    };

    var response = await client.GenerateResponseAsync(characterId, messageRequest);

    MessageRequest.Status status;

    for (; ; )
    {
        status = await client.GetAsync<MessageRequest.Status>($"/api/v2/status/{response.id}");
        if (status.status == "error" || status.status == "completed")
            break;

        await Task.Delay(3000);
    }

    var result = await client.PutMessageAsync("Bot", characterId, index, status.reply);

    if (result.message != "Message saved successfully.")
        return default;

    if (request.NeedsTranslation(out var language))
    {
        using var deeplClient = new DeepLClient(request);
        await deeplClient.TranslateAsync("EN", language, status.reply);
    }

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region GET /api/characters/{characterId}/messages/delete/{index}

app.MapGet("/api/characters/{characterId}/messages/delete/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);
    await client.DeleteAsync($"/api/messages?characterId={characterId}&index={index}");

    File.Delete(Path.Combine("Data", "Messages", $"{characterId}.json"));
});

#endregion



#region GET /api/characters/{characterId}/messages/clear

app.MapGet("/api/characters/{characterId}/messages/clear", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);
    await client.DeleteAsync($"/api/messages?characterId={characterId}");

    File.Delete(Path.Combine("Data", "Messages", $"{characterId}.json"));
});

#endregion



#region GET /api/characters/{characterId}/messages/generate-image/{index}

app.MapGet("/api/characters/{characterId}/messages/generate-image/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);

    var characters = await client.GetCharactersAsync();
    var character = characters.FirstOrDefault(x => x.id == characterId);

    if (character is null)
        return default;

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);
    var message = messages.FirstOrDefault(x => x.index == index);

    var imageRequest = new ImageRequest
    {
        description = character.imagePrompt,
        isRealistic = false,
        justPrompt = true,
        paidGeneration = true,
        paidPrompt = $"\"{message.content.Replace("\"", "")}\",detailed,masterpiece",
        prompt = $"\"{message.content.Replace("\"", "").Replace(',', '-')}\", nsfw, {character.imagePrompt}"
    };

    var response = await client.GenerateImageAsync(characterId, imageRequest);

    ImageRequest.Status status;

    for (; ; )
    {
        status = await client.GetAsync<ImageRequest.Status>($"/api/images/status/{response.id}");
        if (status.status == "error" || status.status == "completed")
            break;

        await Task.Delay(3000);
    }

    message.image = status.reply.output.FirstOrDefault()?.image;

    var result = await client.PutMessageAsync(characterId, message);

    if (result.message != "Message saved successfully.")
        return default;

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region GET /api/characters/{characterId}/messages/delete-image/{index}

app.MapGet("/api/characters/{characterId}/messages/delete-image/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);
    var message = messages.FirstOrDefault(x => x.index == index);
    message.image = null;

    var result = await client.PutMessageAsync(characterId, message);

    if (result.message != "Message saved successfully.")
        return default;

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



app.Run("http://0.0.0.0:5000");