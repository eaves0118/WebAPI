using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Ward
    {
        [Key]
        public int WardId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public int Capacity { get; set; }

        public ICollection<Nurse> Nurses { get; set; }
    }
}
