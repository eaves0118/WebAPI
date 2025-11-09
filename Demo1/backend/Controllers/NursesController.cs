using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NursesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NursesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetNurses() =>
            await _context.Nurses.Include(n => n.Ward).ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetNurse(int id)
        {
            var nurse = await _context.Nurses.Include(n => n.Ward).FirstOrDefaultAsync(n => n.NurseId == id);
            if (nurse == null) return NotFound();
            return nurse;
        }

        [HttpPost]
        public async Task<ActionResult<Nurse>> CreateNurse(Nurse nurse)
        {
            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNurse), new { id = nurse.NurseId }, nurse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNurse(int id, Nurse nurse)
        {
            if (id != nurse.NurseId) return BadRequest();
            _context.Entry(nurse).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNurse(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);
            if (nurse == null) return NotFound();
            _context.Nurses.Remove(nurse);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
