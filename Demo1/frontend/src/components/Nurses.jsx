import React, { useState, useEffect } from "react";
import api from "../api";

const Nurses = () => {
  const [nurses, setNurses] = useState([]);
  const [wards, setWards] = useState([]);
  const [name, setName] = useState("");
  const [cert, setCert] = useState("");
  const [wardId, setWardId] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNurses();
    fetchWards();
  }, []);

  const fetchNurses = async () => {
    const res = await api.get("/nurses");
    setNurses(res.data);
  };
  const fetchWards = async () => {
    const res = await api.get("/wards");
    setWards(res.data);
  };

  const handleSubmit = async () => {
    if (!name || !cert || !wardId) return alert("Enter full information");

    if (editId) {
      await api.put(`/nurses/${editId}`, {
        nurseId: editId,
        name,
        certification: cert,
        wardId: Number(wardId),
      });
      setEditId(null);
    } else {
      await api.post("/nurses", {
        name,
        certification: cert,
        wardId: Number(wardId),
      });
    }
    setName("");
    setCert("");
    setWardId("");
    fetchNurses();
  };

  const handleEdit = (n) => {
    setEditId(n.nurseId);
    setName(n.name);
    setCert(n.certification);
    setWardId(n.wardId);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      await api.delete(`/nurses/${id}`);
      fetchNurses();
    }
  };

  return (
    <div>
      <h2>Nurses Manage</h2>
      <input
        placeholder="Nurses Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Certificate"
        value={cert}
        onChange={(e) => setCert(e.target.value)}
      />
      <select value={wardId} onChange={(e) => setWardId(e.target.value)}>
        <option value="">Select Ward</option>
        {wards.map((w) => (
          <option key={w.wardId} value={w.wardId}>
            {w.name}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>{editId ? "Update" : "Add new"}</button>

      <table>
        <thead>
          <tr>
            <th>Nurse Name</th>
            <th>Certificate</th>
            <th>Ward</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map((n) => (
            <tr key={n.nurseId}>
              <td>{n.name}</td>
              <td>{n.certification}</td>
              <td>{n.ward?.name}</td>
              <td>
                <button onClick={() => handleEdit(n)}>Edit</button>
                <button onClick={() => handleDelete(n.nurseId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Nurses;
