namespace CrushChatApi;

public class Translation
{
    public class Debug : Translation
    {
        public string filename { get; set; }
        public string filenameRegenerated { get; set; }
    }

    public string original { get; set; }
    public string translation { get; set; }
}
