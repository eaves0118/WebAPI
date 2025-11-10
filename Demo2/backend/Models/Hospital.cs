using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Hospital
    {
        [Key]
        public int HospitalId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string Address { get; set; }

        public int? Capacity { get; set; }

        public ICollection<Doctor> Doctors { get; set; }
    }
}
