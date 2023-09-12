namespace CrushChatApi;

public class ImageInfo
{
    public string id {  get; set; }
    public ImageRequest request { get; set; }
    public string url { get; set; }
    public string originalUrl { get; set; }
    public ImageInfo Load(string id)
    {
        this.id = id;
        url = $"/api/images/{id}";
        return this;
    }
}
