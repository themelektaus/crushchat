namespace CrushChatApi;

public class Me
{
    public class User
    {
        public string id { get; set; }
        public string name { get; set; }
        public string nameKnownToBot { get; set; }
        public string email { get; set; }
        public string emailVerified { get; set; }
        public string image { get; set; }
        public string createdAt { get; set; }
        public bool isSubscriptionActive { get; set; }
        public bool isBanned { get; set; }
        public string persona { get; set; }
        public List<Character> characters { get; set; }
    }
    public User user { get; set; }
}
