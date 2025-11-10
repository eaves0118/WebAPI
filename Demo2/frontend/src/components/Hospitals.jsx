import React, { useState, useEffect } from "react";
import api from "../api";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalCapacity, setHospitalCapacity] = useState("");
  const [editHospitalId, setEditHospitalId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.get("/hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!hospitalName)
      return showToast("Hospital name cannot be empty", "error");

    const payload = {
      name: hospitalName,
      address: hospitalAddress,
      capacity: Number(hospitalCapacity || 0),
    };

    try {
      if (editHospitalId) {
        await api.put(`/hospitals/${editHospitalId}`, {
          hospitalId: editHospitalId,
          ...payload,
        });
        showToast("Hospital updated successfully");
      } else {
        await api.post("/hospitals", payload);
        showToast("Hospital added successfully");
      }

      // Reset form
      setHospitalName("");
      setHospitalAddress("");
      setHospitalCapacity("");
      setEditHospitalId(null);

      fetchHospitals();
    } catch (error) {
      showToast("Error saving hospital", "error");
    }
  };

  const handleEdit = (hospital) => {
    setEditHospitalId(hospital.hospitalId);
    setHospitalName(hospital.name);
    setHospitalAddress(hospital.address);
    setHospitalCapacity(hospital.capacity);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?"))
      return;

    try {
      await api.delete(`/hospitals/${id}`);
      showToast("Hospital deleted successfully");
      fetchHospitals();
    } catch (error) {
      showToast("Error deleting hospital", "error");
    }
  };

  return (
    <div>
      <h2>Hospitals</h2>

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
          placeholder="Hospital Name"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
        />
        <input
          placeholder="Address"
          value={hospitalAddress}
          onChange={(e) => setHospitalAddress(e.target.value)}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={hospitalCapacity}
          onChange={(e) => setHospitalCapacity(e.target.value)}
        />
        <button type="submit">{editHospitalId ? "Update" : "Add"}</button>
        {editHospitalId && (
          <button
            type="button"
            onClick={() => {
              setEditHospitalId(null);
              setHospitalName("");
              setHospitalAddress("");
              setHospitalCapacity("");
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
            <th>Address</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.hospitalId}>
              <td>{hospital.name}</td>
              <td>{hospital.address}</td>
              <td>{hospital.capacity}</td>
              <td className="actions">
                <button onClick={() => handleEdit(hospital)}>Edit</button>
                <button onClick={() => handleDelete(hospital.hospitalId)}>
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

export default Hospitals;
