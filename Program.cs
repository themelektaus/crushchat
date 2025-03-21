using CrushChatApi;

using Microsoft.AspNetCore.Mvc;



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

    var characters = await client.GetCharactersAsync(
        request.GetQueryBoolean("cache", true),
        request.GetQueryString("search")
    );

    var result = new List<Character>();

    if (request.GetQueryBoolean("all"))
    {
        result.AddRange(characters.Where(x => x.recent));
        result.AddRange(characters.Where(x => x.isPrivate));
        result.AddRange(characters);
    }
    else
    {
        if (request.GetQueryBoolean("recent"))
            result.AddRange(characters.Where(x => x.recent));

        if (request.GetQueryBoolean("private"))
            result.AddRange(characters.Where(x => x.isPrivate));

        if (request.GetQueryBoolean("public"))
            result.AddRange(characters.Where(x => !x.isPrivate && !x.recent));
    }

    var page = request.GetQueryInteger("page", 1);
    var limit = request.GetQueryInteger("limit", 10);

    if (limit == 0)
        return result.DistinctBy(x => x.id);

    return result.DistinctBy(x => x.id).Skip((page - 1) * limit).Take(limit);
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
        request.GetQueryBoolean("cache", true),
        request.GetQueryBoolean("initialize", false),
        request.GetQueryBoolean("translate", false)
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

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

    var index = messages.LastOrDefault()?.index ?? -1;

    var result = await client.PutMessageAsync("You", characterId, index + 1, body);

    return await client.GetCharacterMessagesAsync(characterId, cache: false);
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

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

    var message = messages.FirstOrDefault(x => x.index == index);
    message.content = body;

    var result = await client.PutMessageAsync(characterId, message);

    return await client.GetCharacterMessagesAsync(characterId, cache: false);
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

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

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

    await client.GetCharacterMessagesAsync(characterId, cache: false);

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

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

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

    await client.GetCharacterMessagesAsync(characterId, cache: false);

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
        Utils.GetMessageFile(client, characterId).TryDelete();

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
        Utils.GetMessageFile(client, characterId).TryDelete();

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

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

    var message = messages.FirstOrDefault(x => x.index == index);

    string prompt;

    if (request.Headers.TryGetValue("X-Prompt", out var _prompt))
    {
        prompt = _prompt.ToString().Replace("\"", "");
        prompt += client.nsfw ? "" : ", sfw";
    }
    else
    {
        prompt = $"\"{message.content.Replace("\"", "").Replace(',', '-')}\", {(client.nsfw ? "" : "sfw, ")}{character.imagePrompt}";
    }

    var imageRequest = new ImageRequest
    {
        onlyPrompt = false,
        modelType = request.GetQueryBoolean("realistic", false) ? "realistic" : "anime",
        prompt = character.imagePrompt,
        negativePrompt = string.Empty,
        characterName = character.name,
        conversation = [message],
        userName = string.Empty
    };

    var imageInfo = await client.GenerateImageAsync(imageRequest);

    //message.image = imageInfo.originalUrl;
    message.image = imageInfo.url;

    var result = await client.PutMessageAsync(characterId, message);

    if (result.message != "Message saved successfully.")
        return default;

    return await client.GetCharacterMessagesAsync(characterId, cache: false);
});

#endregion



#region GET /api/characters/{characterId}/regenerate-image

app.MapGet("/api/characters/{characterId}/regenerate-image", async (HttpRequest request, string characterId) =>
{
    using var client = new CrushChatClient(request);

    var characters = await client.GetCharactersAsync();

    var character = characters.FirstOrDefault(x => x.id == characterId);

    if (character is null)
        return default;

    string prompt;

    if (request.Headers.TryGetValue("X-Prompt", out var _prompt))
    {
        prompt = _prompt.ToString().Replace("\"", "");
        prompt += client.nsfw ? "" : ", sfw";
    }
    else
    {
        prompt = $"{(client.nsfw ? "" : "sfw, ")}{character.imagePrompt}";
    }

    var imageRequest = new ImageRequest
    {
        onlyPrompt = true,
        modelType = request.GetQueryBoolean("realistic", false) ? "realistic" : "anime",
        prompt = character.imagePrompt,
        negativePrompt = string.Empty,
        characterName = character.name,
        conversation = [],
        userName = string.Empty
    };

    var imageInfo = await client.GenerateImageAsync(imageRequest);

    var result = await client.UpdateThumbnailAsync(characterId, imageInfo.originalUrl);

    if (!result.IsSuccessStatusCode)
        return default;

    return await client.GetCharacterMessagesAsync(characterId, cache: false);
});

#endregion



#region GET /api/generate-image

app.MapGet("/api/generate-image", async (HttpRequest request) =>
{
    if (!request.Headers.TryGetValue("X-Prompt", out var _prompt))
        return Results.BadRequest();

    using var client = new CrushChatClient(request);

    var prompt = _prompt.ToString().Replace("\"", "");

    if (!client.nsfw && !prompt.Contains("sfw"))
        prompt = "sfw, " + prompt;

    var info = await client.GenerateImageAsync(new()
    {
        onlyPrompt = true,
        modelType = request.GetQueryBoolean("realistic", false) ? "realistic" : "anime",
        prompt = prompt,
        negativePrompt = string.Empty,
        characterName = string.Empty,
        conversation = [],
        userName = string.Empty
    });

    if (info is null)
        return Results.StatusCode(StatusCodes.Status429TooManyRequests);

    return Results.Text(info.url);
});

#endregion



#region GET /api/images

app.MapGet("/api/images", (HttpRequest request) =>
{
    using var client = new CrushChatClient(request);
    if (!client.isUser)
        return new();

    return Utils.GetImageInfoFiles(client)
        .OrderByDescending(x => x.CreationTimeUtc)
        .Select(x =>
        {
            var info = x.ReadAsJson<ImageInfo>();
            return info.Load(client.userId, client.userFolder, Path.GetFileNameWithoutExtension(x.FullName));
        })
        .ToList();
});

#endregion



#region GET /api/images/{id}

app.MapGet("/api/images/{id}", FindImage);
app.MapGet("/api/images/{id}.jpg", FindJpg);
app.MapGet("/api/images/{id}.png", FindImage);
app.MapGet("/api/images/{_}/{id}", (string _, string id) => FindJpg(id));
app.MapGet("/api/images/{_}/{id}.jpg", (string _, string id) => FindJpg(id));
app.MapGet("/api/images/{_}/{id}.png", (string _, string id) => FindImage(id));
app.MapGet("/api/images/{userId}/{userFolder}/{id}", GetJpg);
app.MapGet("/api/images/{userId}/{userFolder}/{id}.jpg", GetJpg);
app.MapGet("/api/images/{userId}/{userFolder}/{id}.png", GetImage);

static IResult FindJpg(string id)
{
    var file = Utils.FindImageFile(id);
    ConvertToJpg(in file, id, out var jpg);
    return Results.File(jpg.FullName, contentType: "image/jpg");
}

static IResult GetJpg(HttpRequest request, string userId, string userFolder, string id)
{
    var file = Utils.GetImageFile(userId, userFolder, id);
    ConvertToJpg(in file, id, out var jpg);
    return Results.File(jpg.FullName, contentType: "image/jpg");
}

static void ConvertToJpg(in FileInfo file, string id, out FileInfo jpg)
{
    jpg = new FileInfo($"{file.FullName[..^3]}jpg");
    if (jpg.Exists)
        return;

    lock (Utils.Lock(jpg.FullName))
    {
        using var bitmap = ImageUtils.CreateBitmap(file);
        using var data = bitmap.Encode(SkiaSharp.SKEncodedImageFormat.Jpeg, 80);
        using var stream = jpg.OpenWrite();
        data.SaveTo(stream);
    }
}

static IResult FindImage(string id)
{
    var file = Utils.FindImageFile(id);

    byte[] content;

    lock (Utils.Lock(file.FullName))
        content = File.ReadAllBytes(file.FullName);

    return Results.File(content, contentType: "image/png");
}

static IResult GetImage(HttpRequest request, string userId, string userFolder, string id)
{
    var file = Utils.GetImageFile(userId, userFolder, id);

    if (request.GetQueryBoolean("delete", false))
    {
        using var client = new CrushChatClient(request);
        {
            if (client.userId != userId || client.userFolder != userFolder)
                return Results.BadRequest();
        }

        Utils.GetImageInfoFile(userId, userFolder, id).TryDelete();

        file.TryDelete();
        new FileInfo($"{file.FullName[..^3]}jpg").TryDelete();

        return Results.Ok();
    }

    byte[] content;

    lock (Utils.Lock(file.FullName))
        content = File.ReadAllBytes(file.FullName);

    return Results.File(content, contentType: "image/png");
}

#endregion



#region GET /api/characters/{characterId}/messages/delete-image/{index}

app.MapGet("/api/characters/{characterId}/messages/delete-image/{index}", async (HttpRequest request, string characterId, int index) =>
{
    using var client = new CrushChatClient(request);

    var messages = await client.GetCharacterMessagesAsync(characterId, cache: true);

    var message = messages.FirstOrDefault(x => x.index == index);
    message.image = null;

    var result = await client.PutMessageAsync(characterId, message);

    if (result.message != "Message saved successfully.")
        return default;

    return await client.GetCharacterMessagesAsync(characterId, cache: false);
});

#endregion



#region POST /api/characters/create

app.MapPost("/api/characters/create", async (HttpRequest request, [FromBody] Character.Creation.New character) =>
{
    using var client = new CrushChatClient(request);

    if (!client.nsfw && !character.imagePrompt.Contains("sfw"))
        character.imagePrompt += (string.IsNullOrEmpty(character.imagePrompt) ? "" : ", ") + "sfw";

    character.persona = $"{character.name}'s Persona: {character.persona.Trim()}\n";
    return await client.CreateCharacterAsync(character);
});

#endregion



#region POST /api/characters/update

app.MapPost("/api/characters/update", async (HttpRequest request, [FromBody] Character.Creation.Edit.WithDetails character) =>
{
    using var client = new CrushChatClient(request);

    if (!client.nsfw && !character.imagePrompt.Contains("sfw"))
        character.imagePrompt += (string.IsNullOrEmpty(character.imagePrompt) ? "" : ", ") + "sfw";

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



#region /api/translations

app.MapGet("/api/translations", () =>
{
    return new[]
    {
        "/api/translations/deepl/de",
        "/api/translations/deepl/de/update",
        "/api/translations/deepl/en-us",
        "/api/translations/deepl/en-us/update",
        "/api/translations/deepl/es",
        "/api/translations/deepl/es/update",
        "/api/translations/libretranslate/de",
        "/api/translations/libretranslate/de/update",
        "/api/translations/libretranslate/en-us",
        "/api/translations/libretranslate/en-us/update",
        "/api/translations/libretranslate/es",
        "/api/translations/libretranslate/es/update"
    };
});

#endregion



#region /api/translations/{client}/{language}

app.MapGet("/api/translations/{client}/{language}", (string client, string language) =>
{
    DirectoryInfo folder;

    switch (client)
    {
        case "deepl":
            folder = Utils.GetTranslationsFolder_DeepL(language.ToUpper());
            break;

        case "libretranslate":
            folder = Utils.GetTranslationsFolder_LibreTranslate(language.ToUpper());
            break;

        default:
            return Enumerable.Empty<Translation>();
    }

    return Utils.EnumerateJsonFiles(folder)
        .Select(x => x.ReadAsJson<Translation>())
        .OrderBy(x => x.original);
});

#endregion



#region /api/translations/{client}/{language}/update

app.MapGet("/api/translations/{client}/{language}/update", (string client, string language) =>
{
    DirectoryInfo folder;

    switch (client)
    {
        case "deepl":
            folder = Utils.GetTranslationsFolder_DeepL(language.ToUpper());
            break;

        case "libretranslate":
            folder = Utils.GetTranslationsFolder_LibreTranslate(language.ToUpper());
            break;

        default:
            return Enumerable.Empty<Translation>();
    }

    var translations = new List<Translation.Debug>();

    foreach (var file in Utils.EnumerateJsonFiles(folder))
    {
        var translation = file.ReadAsJson<Translation.Debug>();
        translation.original = translation.original.Trim();
        translation.translation = translation.translation.Trim();
        translation.filename = Path.GetFileNameWithoutExtension(file.Name);
        translation.filenameRegenerated = translation.original.ToLower().ToMD5();
        (translation as Translation).WriteJsonTo(file);
        translations.Add(translation);
    }

    return translations;
});

#endregion



app.Run("http://0.0.0.0:5000");
