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

                public void WriteDetails(string userId)
                {
                    if (details is null)
                        return;

                    var folder = Directory.CreateDirectory(Path.Combine("UserData", userId, "CharacterDetails"));
                    var path = Path.Combine(folder.FullName, $"{id}.json");
                    File.WriteAllText(path, details.ToJson());
                    details = null;
                }
            }

            public string id { get; set; }
        }

        public string name { get; set; }
        public string description { get; set; }
        public string persona { get; set; }
        public string imagePrompt { get; set; }
        public string initialMessages { get; set; }
        public string thumbnail { get; set; }
        public string[] tags { get; set; }
        public bool isPrivate { get; set; }
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
    public int upvote { get; set; }
    public bool isPrivate { get; set; }

    public bool recent { get; set; }
    public bool hot { get; set; }

    public class Details
    {
        public string thumbnail { get; set; }

        public class Memory
        {
            //public string role { get; set; }
            public string content { get; set; }
        }
        public List<Memory> memories { get; set; }

        public bool hidden { get; set; }
    }
    
    public Details details { get; set; }

    public Character Prepare(string userId)
    {
        initialMessages ??= "[]";

        var index = persona.IndexOf("'s Persona:");
        personaFiltered = persona[(index + 11)..].Trim();

        var folder = Directory.CreateDirectory(Path.Combine("UserData", userId, "CharacterDetails"));
        var file = new FileInfo(Path.Combine(folder.FullName, $"{id}.json"));

        details = file.Exists
            ? File.ReadAllText(file.FullName).FromJson<Details>()
            : new();

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
