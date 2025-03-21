﻿using System.Security.Cryptography;

using System.Text;
using System.Text.Json;

namespace CrushChatApi;

public static class ExtensionMethods
{
    public static async Task<string> GetBodyAsStringAsync(this HttpRequest @this)
    {
        using var stream = new StreamReader(@this.Body);
        return await stream.ReadToEndAsync();
    }

    public static string ToJson<T>(this T @this)
    {
        return JsonSerializer.Serialize(@this);
    }

    public static void WriteJsonTo<T>(this T @this, FileInfo file)
    {
        var contents = @this.ToJson();
        lock (Utils.Lock(file.FullName))
            File.WriteAllText(file.FullName, contents);
    }

    public static T ReadAsJson<T>(this FileInfo @this, T defaultValue = default)
    {
        if (!@this.Exists)
            return defaultValue;

        string contents;

        lock (Utils.Lock(@this.FullName))
            contents = File.ReadAllText(@this.FullName);

        return contents.FromJson<T>();
    }

    public static T FromJson<T>(this string @this)
    {
        return JsonSerializer.Deserialize<T>(@this);
    }

    public static string ToMD5(this string @this)
        => MD5.HashData(
            Encoding.UTF8.GetBytes(@this)
        ).Aggregate(
            new StringBuilder(),
            (x, y) => x.Append(y.ToString("x2"))
        ).ToString();

    public static string TranslateTo(this string @this, string targetLanguage)
    {
        var file = Utils.GetTranslationFile_DeepL(targetLanguage, @this.Trim().ToLower().ToMD5());

        if (!file.Exists)
            file = Utils.GetTranslationFile_LibreTranslate(targetLanguage, @this.Trim().ToLower().ToMD5());

        if (!file.Exists)
            return null;

        return file.ReadAsJson<Translation>().translation;
    }

    public static bool NeedsTranslation(this HttpRequest @this, out string language)
    {
        if (!@this.Headers.TryGetValue("X-Language", out var _language))
        {
            language = null;
            return false;
        }

        language = _language;
        if (string.IsNullOrEmpty(_language) || _language == "EN")
            return false;

        return true;
    }

    public static string GetQueryString(this HttpRequest @this, string key, string defaultValue = null)
        => @this.GetQueryValue(key, x => x, defaultValue);

    public static bool GetQueryBoolean(this HttpRequest @this, string key, bool defaultValue = false)
        => @this.GetQueryValue(key, x => x.Equals("true", StringComparison.InvariantCultureIgnoreCase), defaultValue);

    public static int GetQueryInteger(this HttpRequest @this, string key, int defaultValue = 0)
        => @this.GetQueryValue(key, x => int.TryParse(x, out var value) ? value : 0, defaultValue);

    static T GetQueryValue<T>(this HttpRequest @this, string key, Func<string, T> getValue, T defaultValue)
    {
        if (@this.Query.TryGetValue(key, out var value))
            return getValue(value);
        return defaultValue;
    }

    public static bool HasQueryValue(this HttpContext @this, string key)
        => @this.Request.Query.ContainsKey(key);

    public static void TryDelete(this FileInfo @this)
    {
        if (@this.Exists)
            @this.Delete();
    }
}
