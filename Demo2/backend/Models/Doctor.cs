using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Specialty { get; set; }

        [ForeignKey("Hospital")]
        public int HospitalId { get; set; }

        public Hospital Hospital { get; set; }
    }
}
