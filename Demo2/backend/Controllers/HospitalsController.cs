using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public HospitalsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hospital>>> Get()
        {
            return await _context.Hospitals.Include(h => h.Doctors).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Hospital>> Get(int id)
        {
            var h = await _context.Hospitals.Include(h => h.Doctors).FirstOrDefaultAsync(x => x.HospitalId == id);
            if (h == null) return NotFound();
            return h;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Hospital hospital)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = hospital.HospitalId }, hospital);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Hospital hospital)
        {
            if (id != hospital.HospitalId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(hospital).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Hospitals.Any(e => e.HospitalId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var h = await _context.Hospitals.FindAsync(id);
            if (h == null) return NotFound();
            _context.Hospitals.Remove(h);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
