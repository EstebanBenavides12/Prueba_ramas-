import { useState } from "react";

const pedidosDisponibles = [
  "Café americano",
  "Capuchino",
  "Latte",
  "Té verde",
  "Jugo de naranja",
  "Agua mineral",
  "Croissant",
  "Sándwich de pollo",
  "Tostada con mermelada",
  "Brownie",
];

const estadoConfig = {
  Pendiente: { bg: "#FFF3CD", color: "#856404", border: "#FFECB5" },
  "En preparación": { bg: "#CCE5FF", color: "#004085", border: "#B8DAFF" },
  Entregado: { bg: "#D4EDDA", color: "#155724", border: "#C3E6CB" },
  Cancelado: { bg: "#F8D7DA", color: "#721C24", border: "#F5C6CB" },
};

const initialForm = { nombre: "", pedido: "", precio: "", estado: "Pendiente" };

export default function RegistroCafeteria() {
  const [registros, setRegistros] = useState([
    { id: 1, nombre: "Laura Gómez", pedido: "Capuchino", precio: 4500, estado: "Entregado" },
    { id: 2, nombre: "Carlos Ruiz", pedido: "Sándwich de pollo", precio: 8900, estado: "En preparación" },
    { id: 3, nombre: "Valentina Torres", pedido: "Brownie", precio: 3200, estado: "Pendiente" },
  ]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.pedido || !form.precio) return;
    if (editId !== null) {
      setRegistros(registros.map((r) =>
        r.id === editId ? { ...r, ...form, precio: Number(form.precio) } : r
      ));
      setEditId(null);
    } else {
      const nuevo = { id: Date.now(), ...form, precio: Number(form.precio) };
      setRegistros([...registros, nuevo]);
    }
    setForm(initialForm);
  };

  const handleEdit = (r) => {
    setForm({ nombre: r.nombre, pedido: r.pedido, precio: r.precio, estado: r.estado });
    setEditId(r.id);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter((r) => r.id !== id));
    if (editId === id) { setEditId(null); setForm(initialForm); }
  };

  const handleEstado = (id, estado) => {
    setRegistros(registros.map((r) => r.id === id ? { ...r, estado } : r));
  };

  const filtered = registros.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.pedido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const total = registros
    .filter((r) => r.estado === "Entregado")
    .reduce((sum, r) => sum + r.precio, 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerLabel}>Sistema de registro</div>
            <h1 style={styles.headerTitle}>Cafetería</h1>
          </div>
          <div style={styles.totalBox}>
            <div style={styles.totalLabel}>Total entregado</div>
            <div style={styles.totalAmount}>${total.toLocaleString("es-CO")}</div>
          </div>
        </div>

        {/* Formulario */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>{editId ? "Editar registro" : "Nuevo registro"}</div>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre del cliente</label>
              <input
                style={styles.input}
                name="nombre"
                placeholder="Ej: Ana López"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Pedido</label>
              <select style={styles.input} name="pedido" value={form.pedido} onChange={handleChange}>
                <option value="">Seleccionar pedido</option>
                {pedidosDisponibles.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Precio ($)</label>
              <input
                style={styles.input}
                name="precio"
                type="number"
                placeholder="Ej: 4500"
                value={form.precio}
                onChange={handleChange}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Estado</label>
              <select style={styles.input} name="estado" value={form.estado} onChange={handleChange}>
                {Object.keys(estadoConfig).map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formActions}>
            {editId && (
              <button style={styles.btnSecondary} onClick={() => { setEditId(null); setForm(initialForm); }}>
                Cancelar
              </button>
            )}
            <button style={styles.btnPrimary} onClick={handleSubmit}>
              {editId ? "Guardar cambios" : "Agregar registro"}
            </button>
          </div>
        </div>

        {/* Búsqueda y tabla */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <div style={styles.cardTitle}>
              Registros <span style={styles.badge}>{registros.length}</span>
            </div>
            <input
              style={{ ...styles.input, width: "220px", margin: 0 }}
              placeholder="Buscar por nombre o pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={styles.empty}>No hay registros que mostrar.</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Cliente", "Pedido", "Precio", "Estado", "Acciones"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const cfg = estadoConfig[r.estado];
                    return (
                      <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}>
                        <td style={styles.td}><span style={styles.clientName}>{r.nombre}</span></td>
                        <td style={styles.td}>{r.pedido}</td>
                        <td style={styles.td}><strong>${r.precio.toLocaleString("es-CO")}</strong></td>
                        <td style={styles.td}>
                          <select
                            style={{ ...styles.estadoPill, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                            value={r.estado}
                            onChange={(e) => handleEstado(r.id, e.target.value)}
                          >
                            {Object.keys(estadoConfig).map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </td>
                        <td style={styles.td}>
                          <button style={styles.btnEdit} onClick={() => handleEdit(r)}>Editar</button>
                          <button style={styles.btnDelete} onClick={() => handleDelete(r.id)}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F5F3EF", fontFamily: "'Georgia', serif", padding: "32px 16px" },
  container: { maxWidth: "900px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" },
  headerLabel: { fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9C8A72", marginBottom: "4px" },
  headerTitle: { fontSize: "36px", fontWeight: "700", color: "#2C1A0E", margin: 0, letterSpacing: "-0.5px" },
  totalBox: { background: "#2C1A0E", borderRadius: "12px", padding: "14px 24px", textAlign: "right" },
  totalLabel: { fontSize: "11px", color: "#C4A882", letterSpacing: "0.08em", textTransform: "uppercase" },
  totalAmount: { fontSize: "22px", fontWeight: "700", color: "#F5F0E8", marginTop: "2px" },
  card: { background: "#fff", borderRadius: "14px", padding: "24px", marginBottom: "20px", border: "1px solid #EDE8E0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#2C1A0E", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" },
  badge: { background: "#F0EAE0", color: "#7A5C3A", fontSize: "12px", padding: "2px 8px", borderRadius: "20px", fontFamily: "monospace" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#7A5C3A", letterSpacing: "0.04em", textTransform: "uppercase" },
  input: { padding: "9px 12px", border: "1px solid #DDD5C8", borderRadius: "8px", fontSize: "14px", color: "#2C1A0E", background: "#FDFCFB", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  formActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" },
  btnPrimary: { background: "#2C1A0E", color: "#F5F0E8", border: "none", borderRadius: "8px", padding: "10px 22px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
  btnSecondary: { background: "transparent", color: "#7A5C3A", border: "1px solid #DDD5C8", borderRadius: "8px", padding: "10px 18px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9C8A72", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 12px", borderBottom: "2px solid #EDE8E0" },
  td: { padding: "12px 12px", fontSize: "14px", color: "#2C1A0E", borderBottom: "1px solid #F0EAE0", verticalAlign: "middle" },
  clientName: { fontWeight: "600" },
  estadoPill: { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", outline: "none", fontFamily: "inherit" },
  btnEdit: { background: "#F0EAE0", color: "#7A5C3A", border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer", marginRight: "6px", fontFamily: "inherit" },
  btnDelete: { background: "#FDE8E8", color: "#9B2C2C", border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" },
  empty: { textAlign: "center", color: "#9C8A72", padding: "40px 0", fontSize: "14px" },
};