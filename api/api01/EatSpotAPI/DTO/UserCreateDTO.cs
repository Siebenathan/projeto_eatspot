using EatSpotAPI.Models;

namespace EatSpotAPI.DTO
{
    public record struct UserCreateDTO(string email, string password, string dataNasc, string username, string nacionality);
}