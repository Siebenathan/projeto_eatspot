using Microsoft.AspNetCore.Mvc;
using EatSpotAPI.Models;
using EatSpotAPI.Database;
using Microsoft.EntityFrameworkCore;
using EatSpotAPI.Services;
using Microsoft.AspNetCore.Authorization;
using EatSpotAPI.DTO;

namespace EatSpotAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EatSpotController : ControllerBase
{
    private readonly IEatSpotService _eatSpotService;

    public EatSpotController(IEatSpotService eatSpotService, ITokenService tokenService)
    {
        _eatSpotService = eatSpotService;
    }

    [HttpGet]
    public async Task<List<Usuario>> GetUsuarios()
    {
        return await _eatSpotService.GetUsuarios();
    }

    [HttpPost]
    [Route("postuser")]
    public async Task<IActionResult> PostUser([FromBody] UserCreateDTO usuario)
    {
        var response = await _eatSpotService.PostUsuario(usuario);
        if(response == "usuario já existe") {
            return BadRequest(response);
        }
        return Ok(response);
    }


    [HttpGet]
    [Route("login")]
    public async Task<IActionResult> UserLogin([FromBody] UserLoginDTO usuario) {
        var response = await _eatSpotService.UserLogin(usuario);
        if(response == "usuario não encontrado!") {
            return NotFound(response);
        }
        return Ok(new JsonResult(response));
    }

    [HttpPost]
    //TODO: quando o sistema de registro estiver pronto setar com o JWT, apenas pessoas com role admin
    [Route("admin/set/paises")]
    public async Task<IActionResult> SetCountrys([FromBody] List<CountryDTO> countries)
    {
        var response = await _eatSpotService.SetCountrys(countries);
        if(response is string) {
            return BadRequest(response);
        }
        return Ok(response);
    }

}
