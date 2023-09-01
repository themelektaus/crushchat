namespace CrushChatApi;

public class MessageRequest
{
    public class Response
    {
        public string id { get; set; }
        public int tokens { get; set; }
    }

    public class Status
    {
        public string status { get; set; }
        public string reply { get; set; }
    }

    public class Result
    {
        public string message { get; set; }
    }

    public string botName { get; set; }
    public string persona { get; set; }
    public List<Character.Message> messages { get; set; }
}
