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

    public class SamplingParams
    {
        public int mirostat_tau { get; set; } = 2;
        public int mirostat_mode { get; set; } = 3;
        public float temperature { get; set; } = 0.7f;
        public float repetition_penalty { get; set; } = 1.11f;
        public int repetition_penalty_range { get; set; } = 1048;
        public float mirostat_eta { get; set; } = 0.2f;
        public float min_p { get; set; } = 0.01f;
        public int top_k { get; set; } = 20;
        public float top_p { get; set; } = 0.82f;
    }
    public SamplingParams samplingParams { get; set; } = new();

    public string mode { get; set; } = "storytelling";
    public bool earlyStopping { get; set; } = true;
}
