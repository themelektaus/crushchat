namespace CrushChatApi;

public class ImageInfo
{
    public string userId { get; set; }
    public string userFolder { get; set; }
    public string id { get; set; }
    public ImageRequest request { get; set; }
    public string url { get; set; }
    public string originalUrl { get; set; }

    public ImageInfo Load(string userId, string userFolder, string id)
    {
        this.userId = userId;
        this.userFolder = userFolder;
        this.id = id;
        url = $"/api/images/{id}.jpg";
        return this;
    }
}
