using Miro.Models;
using Miro.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    // Inyectamos la interfaz
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user, string password)
    {
      
        var result = await _authService.RegisterUserAsync(user, password);
        if (result == null) return BadRequest("El usuario ya existe.");
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string password)
    {
       
        var token = await _authService.LoginUserAsync(email, password);
        if (token == null) return Unauthorized("Email o contraseña incorrectos.");
        return Ok(new { token });
    }
}