import React, { useState, useEffect } from "react";
import api from "../api";

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    const res = await api.get("/wards");
    setWards(res.data);
  };

  const handleSubmit = async () => {
    if (!name || !capacity) return alert("Nhập đầy đủ thông tin");

    if (editId) {
      await api.put(`/wards/${editId}`, {
        wardId: editId,
        name,
        capacity: Number(capacity),
      });
      setEditId(null);
    } else {
      await api.post("/wards", { name, capacity: Number(capacity) });
    }
    setName("");
    setCapacity("");
    fetchWards();
  };

  const handleEdit = (ward) => {
    setEditId(ward.wardId);
    setName(ward.name);
    setCapacity(ward.capacity);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await api.delete(`/wards/${id}`);
      fetchWards();
    }
  };

  return (
    <div>
      <h2>Wards Manage</h2>
      <input
        placeholder="Ward Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button onClick={handleSubmit}>{editId ? "Update" : "Add new"}</button>

      <table>
        <thead>
          <tr>
            <th>Ward Name</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((w) => (
            <tr key={w.wardId}>
              <td>{w.name}</td>
              <td>{w.capacity}</td>
              <td>
                <button onClick={() => handleEdit(w)}>Edit</button>
                <button onClick={() => handleDelete(w.wardId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wards;
