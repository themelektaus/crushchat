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

    public string description { get; set; }
    public bool isRealistic { get; set; }
    public bool justPrompt { get; set; }
    public bool paidGeneration { get; set; }
    public string paidPrompt { get; set; }
    public string prompt { get; set; }
}
