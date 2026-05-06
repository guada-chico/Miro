namespace Miro.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Author { get; set; } = "";
        public string Category { get; set; } = "";
        public string Synopsis { get; set; } = "";
        public string? ImageUrl { get; set; }
        public int TotalPages { get; set; }
    }
}
