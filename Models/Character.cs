namespace CrushChatApi;

public class Character
{
    public string id { get; set; }
    public string userId { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string descriptionTranslated { get; set; }
    public string imagePrompt { get; set; }
    public string thumbnail { get; set; }
    public string persona { get; set; }
    public string personaTranslated { get; set; }
    public int upvotes { get; set; }

    public bool isPrivate { get; set; }
    public bool recent { get; set; }
    public bool hot { get; set; }

    public void TranslateTo(string language)
    {
        descriptionTranslated = description.TranslateTo(language);
        personaTranslated = persona.TranslateTo(language);

        if (messages is null)
            return;

        foreach (var message in messages)
            message.TranslateTo(language);
    }

    public class Message
    {
        public string id { get; set; }
        public int index => messageIndex;
        public int messageIndex { get; set; }
        public string chatId { get; set; }
        public string userId { get; set; }
        public string content { get; set; }
        public string contentTranslated { get; set; }
        public string createdAt { get; set; }
        public int upvote { get; set; }
        public string role { get; set; }
        public string image { get; set; }

        public void TranslateTo(string language)
        {
            contentTranslated = content.TranslateTo(language);
        }
    }

    public List<Message> messages { get; set; }
}
