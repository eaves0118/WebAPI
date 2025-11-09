using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Nurse
    {
        [Key]
        public int NurseId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public string Certification { get; set; }

        [ForeignKey("Ward")]
        public int WardId { get; set; }

        public Ward Ward { get; set; }

    }
}
