using EatSpotAPI.DTO;
using EatSpotAPI.Models;

namespace EatSpotAPI.Services {
    public interface IEatSpotService {
        Task<List<Usuario>> GetUsuarios();
        Task<string> PostUsuario(UserCreateDTO usuario);
        Task<string> UserLogin(UserLoginDTO usuario);
        Task<dynamic> SetCountrys(List<CountryDTO> countryDTOs);
    }
}