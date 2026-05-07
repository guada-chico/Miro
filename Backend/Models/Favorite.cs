namespace Miro.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }

        // Estas propiedades permiten hacer el .Include(f => f.Book) en el controlador
        public User? User { get; set; }
        public Book? Book { get; set; }
    }
}
