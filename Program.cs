using CrushChatApi;

using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();



#region GET /api/me

app.MapGet("/api/me", async (HttpRequest request) =>
{
    using var client = new CrushChatClient(request);
    var me = await client.GetAsync<Me>("/api/me");
    return me?.user;
});

#endregion



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



#region GET /api/characters/{characterId}

app.MapGet("/api/characters/{characterId}", (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);
    return client.GetCharacter(characterId);
});

#endregion



#region GET /api/characters/{characterId}/messages

app.MapGet("/api/characters/{characterId}/messages", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);
    return await client.GetCharacterMessagesAsync(
        characterId,
        preferCache: request.GetQueryBoolean("cache", true),
        initialize: request.GetQueryBoolean("initialize", false),
        translate: request.GetQueryBoolean("translate", false)
    );
});

#endregion



#region POST /api/characters/{characterId}/messages

app.MapPost("/api/characters/{characterId}/messages", async (HttpRequest request, string characterId) =>
{
    var body = await request.GetBodyAsStringAsync();

    if (request.NeedsTranslation(out var language))
    {
        using var translationClient = ITranslationClient.Create(request);
        if (translationClient is not null)
        {
            var translations = await translationClient.TranslateAsync(language, "EN-US", body);

            var translation = translations.FirstOrDefault();
            if (translation is null)
                return default;

            translations = await translationClient.TranslateAsync("EN", language, translation.translation);
            translation = translations.FirstOrDefault();
            if (translation is null)
                return default;

            if (string.IsNullOrEmpty(translation.translation))
                return default;

            body = translation.original;
        }
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
    var body = await request.GetBodyAsStringAsync();

    if (request.NeedsTranslation(out var language))
    {
        using var translationClient = ITranslationClient.Create(request);
        if (translationClient is not null)
        {
            var translations = await translationClient.TranslateAsync(language, "EN-US", body);

            var translation = translations.FirstOrDefault();
            if (translation is null)
                return default;

            translations = await translationClient.TranslateAsync("EN", language, translation.translation);
            translation = translations.FirstOrDefault();
            if (translation is null)
                return default;

            if (string.IsNullOrEmpty(translation.translation))
                return default;

            body = translation.original;
        }
    }

    using var client = new CrushChatClient(request);

    var messages = await client.GetCharacterMessagesAsync(characterId, preferCache: true);
    var message = messages.FirstOrDefault(x => x.index == index);
    message.content = body;

    var result = await client.PutMessageAsync(characterId, message);

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
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

    client.AddMemories(messages, character.id);

    var messageRequest = new MessageRequest
    {
        botName = character.name,
        persona = character.persona,
        messages = messages
    };

    var response = await client.GenerateResponseAsync(messageRequest);

    MessageRequest.Status status;

    for (; ; )
    {
        status = await client.GetAsync<MessageRequest.Status>($"/api/v2/status/{response.id}");
        if (status.status == "error" || status.status == "completed")
            break;

        await Task.Delay(3000);
    }

    var index = messages.Count == 0 ? 0 : messages.Max(x => x.index);
    var result = await client.PutMessageAsync("Bot", characterId, index + 1, status.reply);

    if (result.message != "Message saved successfully.")
    {
        Console.WriteLine(result.message);
        return default;
    }

    if (request.NeedsTranslation(out var language))
    {
        using var translationClient = ITranslationClient.Create(request);
        if (translationClient is not null)
            await translationClient.TranslateAsync("EN", language, status.reply);
    }

    await client.GetCharacterMessagesAsync(characterId, preferCache: false);

    return messageRequest;
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

    client.AddMemories(messages, character.id);

    var messageRequest = new MessageRequest
    {
        botName = character.name,
        persona = character.persona,
        messages = messages.Where(x => x.index < index).ToList()
    };

    var response = await client.GenerateResponseAsync(messageRequest);

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
        using var translationClient = ITranslationClient.Create(request);
        if (translationClient is not null)
            await translationClient.TranslateAsync("EN", language, status.reply);
    }

    await client.GetCharacterMessagesAsync(characterId, preferCache: false);

    return messageRequest;
});

#endregion



#region GET /api/characters/{characterId}/messages/delete/{index}

app.MapGet("/api/characters/{characterId}/messages/delete/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);

    using var message = client.CreateMessage(
        HttpMethod.Delete,
        $"/api/messages?characterId={characterId}&index={index}"
    );

    var (success, response) = await client.SendAsync(message);
    if (success)
        File.Delete(Path.Combine("Data", "Messages", $"{characterId}.json"));

    return response;
});

#endregion



#region GET /api/characters/{characterId}/messages/clear

app.MapGet("/api/characters/{characterId}/messages/clear", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);

    using var message = client.CreateMessage(
        HttpMethod.Delete,
        $"/api/messages?characterId={characterId}"
    );

    var (success, response) = await client.SendAsync(message);
    if (success)
        File.Delete(Path.Combine("Data", "Messages", $"{characterId}.json"));

    return response;
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

    string paidPrompt, prompt;

    if (request.Headers.TryGetValue("X-Prompt", out var _prompt))
    {
        paidPrompt = _prompt.ToString().Replace("\"", "");
        prompt = paidPrompt;
    }
    else
    {
        paidPrompt = $"\"{message.content.Replace("\"", "")}\",detailed,masterpiece";
        prompt = $"\"{message.content.Replace("\"", "").Replace(',', '-')}\", nsfw, {character.imagePrompt}";
    }

    var imageRequest = new ImageRequest
    {
        description = character.imagePrompt,
        isRealistic = false,
        justPrompt = true,
        paidGeneration = true,
        paidPrompt = paidPrompt,
        prompt = prompt
    };

    var imageInfo = await client.GenerateImageAsync(imageRequest);

    //message.image = imageInfo.originalUrl;
    message.image = imageInfo.url;

    var result = await client.PutMessageAsync(characterId, message);

    if (result.message != "Message saved successfully.")
        return default;

    return await client.GetCharacterMessagesAsync(characterId, preferCache: false);
});

#endregion



#region GET /api/characters/{characterId}/regenerate-image

app.MapGet("/api/characters/{characterId}/regenerate-image", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);

    using var message = client.CreateMessage(
        HttpMethod.Put,
        $"/api/characters/{characterId}/regenerate-image"
    );

    var (_, response) = await client.SendAsync(message);

    return response;
});

#endregion



#region GET /api/generate-image

app.MapGet("/api/generate-image", async (HttpRequest request) =>
{
    if (!request.Headers.TryGetValue("X-Prompt", out var _prompt))
        return Results.BadRequest();

    var prompt = _prompt.ToString().Replace("\"", "");

    using var client = new CrushChatClient(request);

    var info = await client.GenerateImageAsync(new()
    {
        description = string.Empty,
        isRealistic = request.GetQueryBoolean("realistic", false),
        justPrompt = true,
        paidGeneration = true,
        paidPrompt = prompt,
        prompt = prompt
    });

    return Results.Text(info.url);
});

#endregion



#region GET /api/images

app.MapGet("/api/images", () =>
{
    return Directory
        .EnumerateFiles(Path.Combine("Data", "Images"), "*.json")
        .Select(x => new FileInfo(x))
        .OrderByDescending(x => x.CreationTimeUtc)
        .Select(x =>
        {
            var info = File.ReadAllText(x.FullName).FromJson<ImageInfo>();
            return info.Load(Path.GetFileNameWithoutExtension(x.FullName));
        });
});

#endregion



#region GET /api/images/{id}

app.MapGet("/api/images/{id}", async (HttpRequest request, string id) =>
{
    var basePath = Path.Combine("Data", "Images", id);
    if (request.GetQueryBoolean("delete", false))
    {
        if (File.Exists($"{basePath}.json"))
            File.Delete($"{basePath}.json");

        if (File.Exists($"{basePath}.png"))
            File.Delete($"{basePath}.png");

        return Results.Ok();
    }

    var content = await File.ReadAllBytesAsync($"{basePath}.png");

    return Results.File(content, contentType: "image/png");
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



#region POST /api/characters/create

app.MapPost("/api/characters/create", async (HttpRequest request, [FromBody] Character.Creation.New character) =>
{
    using var client = new CrushChatClient(request);
    character.persona = $"{character.name}'s Persona: {character.persona.Trim()}\n";
    return await client.CreateCharacterAsync(character);
});

#endregion



#region POST /api/characters/update

app.MapPost("/api/characters/update", async (HttpRequest request, [FromBody] Character.Creation.Edit.WithDetails character) =>
{
    using var client = new CrushChatClient(request);
    character.persona = $"{character.name}'s Persona: {character.persona.Trim()}\n";
    return await client.EditCharacterAsync(character);
});

#endregion



#region GET /api/characters/{characterId}/delete

app.MapGet("/api/characters/{characterId}/delete", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);
    return await client.DeleteCharacterAsync(characterId);
});

#endregion



app.Run("http://0.0.0.0:5000");
