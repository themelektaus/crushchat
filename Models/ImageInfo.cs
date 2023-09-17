namespace CrushChatApi;

public class ImageInfo
{
    public string userId { get; set; }
    public string id { get; set; }
    public ImageRequest request { get; set; }
    public string url { get; set; }
    public string originalUrl { get; set; }
    public ImageInfo Load(string userId, string id)
    {
        this.userId = userId;
        this.id = id;
        url = $"/api/images/{userId}/{id}";
        return this;
    }
}
