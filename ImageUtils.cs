using SkiaSharp;

namespace CrushChatApi;

public static class ImageUtils
{
    public static SKBitmap CreateBitmap(FileInfo file, int? size = null)
    {
        using var stream = file.OpenRead();

        var bitmap = SKBitmap.Decode(stream);

        if (size.HasValue)
        {
            var _bitmap = bitmap;
            bitmap = bitmap.Resize(
                new SKImageInfo(size.Value, size.Value),
                SKFilterQuality.High
            );
            _bitmap.Dispose();
        }

        return bitmap;
    }
}
