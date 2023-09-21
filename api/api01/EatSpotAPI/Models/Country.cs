namespace EatSpotAPI.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImgPath { get; set; }
        public List<Usuario> Usuarios { get; set; }
    }
}