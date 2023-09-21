namespace CrushChatApi;

public static class Utils
{
    static readonly object handlesLock = new();
    static readonly Dictionary<int, object> handles = new();

    public static object Lock(string @string)
    {
        return Lock(@string.GetHashCode());
    }

    public static object Lock(int hashCode)
    {
        object result;
        lock (handlesLock)
        {
            if (!handles.ContainsKey(hashCode))
                handles.Add(hashCode, new object());

            result = handles[hashCode];
        }
        return result;
    }



    public static DirectoryInfo GetTranslationsFolder_DeepL(string language)
    {
        return GetTranslationsFolder("DeepL", language);
    }

    public static FileInfo GetTranslationFile_DeepL(string language, string id)
    {
        return GetJsonFile(GetTranslationsFolder_DeepL(language), id);
    }

    public static DirectoryInfo GetTranslationsFolder_LibreTranslate(string language)
    {
        return GetTranslationsFolder("LibreTranslate", language);
    }

    public static FileInfo GetTranslationFile_LibreTranslate(string language, string id)
    {
        return GetJsonFile(GetTranslationsFolder_LibreTranslate(language), id);
    }

    static DirectoryInfo GetTranslationsFolder(string client, string language)
    {
        return GetDataFolder(Path.Combine("Translations", client, language));
    }



    public static DirectoryInfo GetCharacterDetailsFolder(string userId, string userFolder)
    {
        return GetUserDataFolder(userId, userFolder, "CharacterDetails");
    }

    public static FileInfo GetCharacterDetailsFile(CrushChatClient client, string id)
    {
        return GetCharacterDetailsFile(client.userId, client.userFolder, id);
    }

    public static FileInfo GetCharacterDetailsFile(string userId, string userFolder, string id)
    {
        return GetJsonFile(GetCharacterDetailsFolder(userId, userFolder), id);
    }



    public static DirectoryInfo GetCharactersFolder(string userId, string userFolder)
    {
        return GetUserDataFolder(userId, userFolder, "Characters");
    }

    public static IEnumerable<FileInfo> GetCharacterFiles(CrushChatClient client)
    {
        return GetCharacterFiles(client.userId, client.userFolder);
    }

    public static IEnumerable<FileInfo> GetCharacterFiles(string userId, string userFolder)
    {
        return GetCharactersFolder(userId, userFolder).EnumerateFiles("*.json");
    }

    public static FileInfo GetCharacterFile(CrushChatClient client, string id)
    {
        return GetCharacterFile(client.userId, client.userFolder, id);
    }

    public static FileInfo GetCharacterFile(string userId, string userFolder, string id)
    {
        return GetJsonFile(GetCharactersFolder(userId, userFolder), id);
    }



    public static DirectoryInfo GetImagesFolder(string userId, string userFolder)
    {
        return GetUserDataFolder(userId, userFolder, "Images");
    }

    public static FileInfo GetImageFile(CrushChatClient client, string id)
    {
        return GetImageFile(client.userId, client.userFolder, id);
    }

    public static FileInfo FindImageFile(string id)
    {
        return new DirectoryInfo("UserData")
            .EnumerateFiles($"{id}.png", SearchOption.AllDirectories)
            .FirstOrDefault();
    }

    public static FileInfo GetImageFile(string userId, string userFolder, string id)
    {
        return GetFile(GetImagesFolder(userId, userFolder), id, "png");
    }

    public static IEnumerable<FileInfo> GetImageInfoFiles(CrushChatClient client)
    {
        return GetImageInfoFiles(client.userId, client.userFolder);
    }

    public static IEnumerable<FileInfo> GetImageInfoFiles(string userId, string userFolder)
    {
        return GetImagesFolder(userId, userFolder).EnumerateFiles("*.json");
    }

    public static FileInfo GetImageInfoFile(CrushChatClient client, string id)
    {
        return GetImageInfoFile(client.userId, client.userFolder, id);
    }

    public static FileInfo GetImageInfoFile(string userId, string userFolder, string id)
    {
        return GetJsonFile(GetImagesFolder(userId, userFolder), id);
    }



    public static DirectoryInfo GetMessagesFolder(string userId, string userFolder)
    {
        return GetUserDataFolder(userId, userFolder, "Messages");
    }

    public static FileInfo GetMessageFile(CrushChatClient client, string id)
    {
        return GetMessageFile(client.userId, client.userFolder, id);
    }

    public static FileInfo GetMessageFile(string userId, string userFolder, string id)
    {
        return GetJsonFile(GetMessagesFolder(userId, userFolder), id);
    }



    public static IEnumerable<T> EnumerateJsonFiles<T>(DirectoryInfo info)
    {
        return EnumerateJsonFiles(info).Select(x => x.ReadAsJson<T>());
    }

    public static IEnumerable<FileInfo> EnumerateJsonFiles(DirectoryInfo info)
    {
        if (info.Exists)
            return info.EnumerateFiles("*.json");

        return Enumerable.Empty<FileInfo>();
    }

    static FileInfo GetJsonFile(DirectoryInfo info, string id)
    {
        return GetFile(info, id, "json");
    }

    static FileInfo GetFile(DirectoryInfo info, string id, string ext)
    {
        return new(Path.Combine(info.FullName, $"{id}.{ext}"));
    }

    static DirectoryInfo GetDataFolder(string name)
    {
        return Directory.CreateDirectory(Path.Combine("Data", name));
    }

    static DirectoryInfo GetUserDataFolder(string userId, string userFolder, string name)
    {
        return Directory.CreateDirectory(
            Path.Combine("UserData", userId, userFolder, name)
        );
    }
}
