namespace CrushChatApi;

public class Character
{
    public abstract class Creation
    {
        public class New : Creation
        {

        }

        public class Edit : Creation
        {
            public class WithDetails : Edit
            {
                public Details details { get; set; }

                public void WriteDetails(string userId, string userFolder)
                {
                    if (details is null)
                        return;

                    details.WriteJsonTo(Utils.GetCharacterDetailsFile(userId, userFolder, id));
                    details = null;
                }
            }

            public string id { get; set; }
        }

        public string name { get; set; }
        public string description { get; set; }
        public string persona { get; set; }
        public string imagePrompt { get; set; }
        public string negativePrompt { get; set; }
        public bool imagePromptVisible { get; set; }
        public string defaultModel { get; set; }
        public string initialMessages { get; set; }
        public string[] tags { get; set; }
        public bool isPrivate { get; set; }
        public string authorNotes { get; set; }
    }

    public string id { get; set; }
    public string userId { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string descriptionTranslated { get; set; }
    public string imagePrompt { get; set; }
    public string thumbnail { get; set; }
    public string persona { get; set; }
    public string personaFiltered { get; set; }
    public string personaFilteredTranslated { get; set; }
    public string initialMessages { get; set; }
    public int upvotes { get; set; }
    public bool isPrivate { get; set; }

    public bool recent { get; set; }

    public class Details
    {
        public string thumbnail { get; set; }

        public class Memory
        {
            //public string role { get; set; }
            public string content { get; set; }
        }
        public List<Memory> memories { get; set; }
    }

    public Details details { get; set; }

    public Character Prepare(string userId, string userFolder)
    {
        initialMessages ??= "[]";

        var index = persona.IndexOf("'s Persona:");
        personaFiltered = persona[(index + 11)..].Trim();

        details = Utils.GetCharacterDetailsFile(userId, userFolder, id).ReadAsJson<Details>(new());

        return this;
    }

    public void TranslateTo(string language)
    {
        descriptionTranslated = description.TranslateTo(language);
        personaFilteredTranslated = personaFiltered.TranslateTo(language);

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
