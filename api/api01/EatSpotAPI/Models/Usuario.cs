using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Components.Forms;

namespace EatSpotAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int CountryId { get; set; }
        public int RoleId { get; set; }
        [Column(TypeName = "DATE")]
        public DateTime DateOfBirth { get; set; }
        public DateTime AccountCreationDate { get; set; }
        public Country Country { get; set; }
        public Role Role { get; set; }
    }
}