namespace CrushChatApi;

public class ImageRequest
{
    public class Response
    {
        public string id { get; set; }
    }

    public class Status
    {
        public string status { get; set; }

        public class Reply
        {
            public class Output
            {
                public string image { get; set; }
            }
            public Output[] output { get; set; }
        }
        public Reply reply { get; set; }
    }

    public class Result
    {
        public string message { get; set; }
    }

    public bool onlyPrompt { get; set; }
    public string modelType { get; set; }
    public string prompt { get; set; }
    public string negativePrompt { get; set; }
    public string characterName { get; set; }
    public Character.Message[] conversation { get; set; }
    public string userName { get; set; }

}
