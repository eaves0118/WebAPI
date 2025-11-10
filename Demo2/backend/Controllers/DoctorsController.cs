using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DoctorsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> Get()
        {
            return await _context.Doctors.Include(d => d.Hospital).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> Get(int id)
        {
            var d = await _context.Doctors.Include(d => d.Hospital).FirstOrDefaultAsync(x => x.DoctorId == id);
            if (d == null) return NotFound();
            return d;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Doctor doctor)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!_context.Hospitals.Any(h => h.HospitalId == doctor.HospitalId))
                return BadRequest("HospitalId is invalid.");

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = doctor.DoctorId }, doctor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.DoctorId) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!_context.Hospitals.Any(h => h.HospitalId == doctor.HospitalId))
                return BadRequest("HospitalId is invalid.");

            _context.Entry(doctor).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Doctors.Any(e => e.DoctorId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var d = await _context.Doctors.FindAsync(id);
            if (d == null) return NotFound();
            _context.Doctors.Remove(d);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
