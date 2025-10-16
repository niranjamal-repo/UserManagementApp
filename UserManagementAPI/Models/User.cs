using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace UserManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z\s\-']+$", ErrorMessage = "First name can only contain letters, spaces, hyphens, and apostrophes.")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z\s\-']+$", ErrorMessage = "Last name can only contain letters, spaces, hyphens, and apostrophes.")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(12, ErrorMessage = "Mobile number cannot exceed 12 characters.")]
        [RegularExpression(@"^[0-9]{1,12}$", ErrorMessage = "Mobile number must contain only numeric values and be maximum 12 characters.")]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
