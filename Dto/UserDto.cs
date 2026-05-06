using System.ComponentModel.DataAnnotations;

namespace Miro.Dto
{
    public class UserDto
    {
            [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
            public string Name { get; set; }

            [Required(ErrorMessage = "El email es obligatorio.")]
            [EmailAddress(ErrorMessage = "Formato de email inválido.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria.")]
          
            //  Al menos una mayúscula y al menos un carácter especial (punto, coma, @, etc.)
            [RegularExpression(@"^(?=.*[A-Z])(?=.*[.,!@#$%^&*])(?=.{8,}).*$",
             ErrorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial (ej: un punto).")]
            public string Password { get; set; }
        }
    }
