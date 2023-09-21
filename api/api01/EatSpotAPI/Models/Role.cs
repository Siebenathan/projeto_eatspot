namespace EatSpotAPI.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Usuario> Usuarios { get; set; }
    }
}