using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Models;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersControllerSimple : ControllerBase
    {
        private static List<User> _users = new List<User>
        {
            new User { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Mobile = "1234567890", Address = "123 Main St" },
            new User { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com", Mobile = "0987654321", Address = "456 Oak Ave" }
        };

        // GET: api/users
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            return Ok(_users);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public ActionResult<User> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (_users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email already exists");
            }

            user.Id = _users.Count + 1;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            _users.Add(user);
            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public IActionResult PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = _users.FirstOrDefault(u => u.Id == id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Check if email already exists for another user
            if (_users.Any(u => u.Email == user.Email && u.Id != id))
            {
                return BadRequest("Email already exists");
            }

            // Update user
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.Mobile = user.Mobile;
            existingUser.Address = user.Address;
            existingUser.UpdatedAt = DateTime.UtcNow;

            return NoContent();
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            _users.Remove(user);
            return NoContent();
        }
    }
}
