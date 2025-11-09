using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WardsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public WardsController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ward>>> GetWards() =>
            await _context.Wards.Include(w => w.Nurses).ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Ward>> GetWard(int id)
        {
            var ward = await _context.Wards.Include(w => w.Nurses).FirstOrDefaultAsync(w => w.WardId == id);
            if (ward == null) return NotFound();
            return ward;
        }

        [HttpPost]
        public async Task<ActionResult<Ward>> CreateWard(Ward ward)
        {
            _context.Wards.Add(ward);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWard), new { id = ward.WardId }, ward);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWard(int id, Ward ward)
        {
            if (id != ward.WardId) return BadRequest();
            _context.Entry(ward).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWard(int id)
        {
            var ward = await _context.Wards.FindAsync(id);
            if (ward == null) return NotFound();
            _context.Wards.Remove(ward);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
