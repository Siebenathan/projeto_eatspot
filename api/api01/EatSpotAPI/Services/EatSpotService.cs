using EatSpotAPI.Database;
using EatSpotAPI.DTO;
using EatSpotAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EatSpotAPI.Services
{
    public class EatSpotService : IEatSpotService
    {
        private readonly Context _context;
        private readonly ITokenService _tokenService;
        public EatSpotService(Context context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<List<Usuario>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<string> PostUsuario(UserCreateDTO usuario)
        {
            var checkIfUserExist = _context.Usuarios.Where(u => u.UserName == usuario.username && u.Email == usuario.email).FirstOrDefault();
            if (checkIfUserExist != null)
            {
                return "usuario já existe";
            }

            var country = await _context.Countries.Where(c => c.Name == usuario.nacionality).FirstAsync();
            var role = await _context.Roles.Where(r => r.Name == "Usuário").FirstAsync();

            var usuarioDB = new Usuario
            {
                AccountCreationDate = DateTime.UtcNow,
                CountryId = country.Id,
                DateOfBirth = DateTime.Parse(usuario.dataNasc),
                Email = usuario.email,
                UserName = usuario.username,
                Password = usuario.password,
                RoleId = role.Id,
            };

            await _context.Usuarios.AddAsync(usuarioDB);
            await _context.SaveChangesAsync();

            return "usuario registrado com sucesso";
        }

        public async Task<string> UserLogin(UserLoginDTO usuario)
        {
            var user = await _context.Usuarios.Where(x => x.Email == usuario.email && x.Password == usuario.password).FirstOrDefaultAsync();
            if(user == null) {
                return "usuario não encontrado!";
            }
            var token = _tokenService.GenerateToken(user);
            return token;

        }

        public async Task<dynamic> SetCountrys(List<CountryDTO> countryDTOs)
        {
            var country = await _context.Countries.FindAsync(1);

            if (country != null)
            {
                return "já tem pais";
            }

            countryDTOs.ForEach(async (country) =>
            {
                var countryDB = new Country
                {
                    Name = country.name,
                    ImgPath = country.ImgPath
                };
                await _context.Countries.AddAsync(countryDB);
            });
            await _context.SaveChangesAsync();
            return await _context.Countries.ToListAsync();


        }

    }
}