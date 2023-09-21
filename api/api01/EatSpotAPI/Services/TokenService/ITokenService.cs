using EatSpotAPI.Models;

namespace EatSpotAPI.Services
{
    public interface ITokenService
    {
        string GenerateToken(Usuario usuario);
    }
}