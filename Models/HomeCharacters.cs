namespace CrushChatApi;

public class HomeCharacters
{
    public List<Character> @private { get; } = new();
    public List<Character> recent { get; } = new();
    public List<Character> @public { get; } = new();
}
