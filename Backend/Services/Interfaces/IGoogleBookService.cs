using Miro.Models;

namespace Miro.Services.Interfaces
{
    public interface IGoogleBookService
    {
        Task<IEnumerable<Book>> SearchBooksAsync(string query);
    }
}
