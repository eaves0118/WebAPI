import React, { useState, useEffect } from "react";
import api from "../api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      showToast("Failed to fetch doctors", "error");
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await api.get("/hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!doctorName || !selectedHospitalId)
      return showToast("Doctor name and hospital are required", "error");

    const payload = {
      name: doctorName,
      specialty: specialty,
      hospitalId: Number(selectedHospitalId),
    };

    try {
      if (editDoctorId) {
        await api.put(`/doctors/${editDoctorId}`, {
          doctorId: editDoctorId,
          ...payload,
        });
        showToast("Doctor updated successfully");
      } else {
        await api.post("/doctors", payload);
        showToast("Doctor added successfully");
      }

      setDoctorName("");
      setSpecialty("");
      setSelectedHospitalId("");
      setEditDoctorId(null);

      fetchDoctors();
    } catch (error) {
      showToast("Error saving doctor", "error");
    }
  };

  const handleEdit = (doctor) => {
    setEditDoctorId(doctor.doctorId);
    setDoctorName(doctor.name);
    setSpecialty(doctor.specialty);
    setSelectedHospitalId(doctor.hospitalId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await api.delete(`/doctors/${id}`);
      showToast("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      showToast("Error deleting doctor", "error");
    }
  };

  return (
    <div>
      <h2>Doctors</h2>

      {toast && (
        <div
          className={`toast ${toast.type === "error" ? "error" : "success"}`}
        >
          {toast.message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
        <input
          placeholder="Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
        <select
          value={selectedHospitalId}
          onChange={(e) => setSelectedHospitalId(e.target.value)}
        >
          <option value="">-- Select Hospital --</option>
          {hospitals.map((h) => (
            <option key={h.hospitalId} value={h.hospitalId}>
              {h.name}
            </option>
          ))}
        </select>

        <button type="submit">{editDoctorId ? "Update" : "Add"}</button>
        {editDoctorId && (
          <button
            type="button"
            onClick={() => {
              setEditDoctorId(null);
              setDoctorName("");
              setSpecialty("");
              setSelectedHospitalId("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Hospital</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.doctorId}>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>
                {doctor.hospital?.name ||
                  hospitals.find((h) => h.hospitalId === doctor.hospitalId)
                    ?.name ||
                  ""}
              </td>
              <td className="actions">
                <button onClick={() => handleEdit(doctor)}>Edit</button>
                <button onClick={() => handleDelete(doctor.doctorId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctors;
