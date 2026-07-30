import { useEffect, useState } from "react";
import { createEmployee, getEmployees } from "./api";

const EMPTY_FORM = { name: "", age: "", department: "" };

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      setEmployees(await getEmployees());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.department) return;

    try {
      setSubmitting(true);
      setError(null);
      await createEmployee({
        name: form.name,
        age: Number(form.age),
        department: form.department,
      });
      setForm(EMPTY_FORM);
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Employee Management System</h1>
        <p>Manage your team, all in one place.</p>
      </header>

      <main className="container">
        <section className="card">
          <h2>Add Employee</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="age"
              type="number"
              min="16"
              max="100"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />
            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Employee"}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Employees ({employees.length})</h2>
            <button className="secondary" onClick={loadEmployees} type="button">
              Refresh
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p className="muted">Loading employees…</p>
          ) : employees.length === 0 ? (
            <p className="muted">No employees yet. Add your first one above.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Employee Management System · Node.js, PostgreSQL, Kubernetes</p>
      </footer>
    </div>
  );
}

export default App;
