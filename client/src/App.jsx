import React, { useEffect, useState } from "react";
import { CheckCircle2, LogOut, Plus, Shield, Trash2 } from "lucide-react";
import { apiRequest, clearSession, getStoredUser, setSession } from "./api.js";

const emptyTask = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

export const App = () => {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(getStoredUser);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showSuccess = (text) => {
    setMessage(text);
    setError("");
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  const loadTasks = async () => {
    if (!user) return;

    try {
      const body = await apiRequest("/tasks");
      setTasks(body.data.tasks);
    } catch (apiError) {
      showError(apiError.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const path = mode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        mode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const body = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setSession(body.data);
      setUser(body.data.user);
      showSuccess(body.message);
      setAuthForm({ name: "", email: "", password: "" });
    } catch (apiError) {
      showError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate || undefined
      };
      const body = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setTasks([body.data.task, ...tasks]);
      setTaskForm(emptyTask);
      showSuccess(body.message);
    } catch (apiError) {
      showError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (task, status) => {
    try {
      const body = await apiRequest(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      setTasks(tasks.map((item) => (item._id === task._id ? body.data.task : item)));
      showSuccess("Task updated");
    } catch (apiError) {
      showError(apiError.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const body = await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== taskId));
      showSuccess(body.message);
    } catch (apiError) {
      showError(apiError.message);
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setTasks([]);
    showSuccess("Logged out");
  };

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Backend Intern Assignment</p>
          <h1>MERN Task Manager API Demo</h1>
        </div>
        {user && (
          <button className="ghost-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        )}
      </section>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      {!user ? (
        <section className="auth-layout">
          <div className="intro-panel">
            <Shield size={38} />
            <h2>Secure API demo</h2>
            <p>Register, log in, receive a JWT, and manage protected task data from this UI.</p>
            <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer">
              Open Swagger Docs
            </a>
          </div>

          <form className="panel form-panel" onSubmit={handleAuth}>
            <div className="segmented">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
                Register
              </button>
            </div>

            {mode === "register" && (
              <label>
                Name
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                placeholder="Password123"
                required
              />
            </label>

            <button className="primary-button" disabled={loading}>
              {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Login"}
            </button>
          </form>
        </section>
      ) : (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <p className="eyebrow">Protected Dashboard</p>
              <h2>Welcome, {user.name}</h2>
            </div>
            <span className="role-pill">{user.role}</span>
          </div>

          <form className="panel task-form" onSubmit={handleCreateTask}>
            <input
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
              placeholder="Task title"
              required
            />
            <input
              value={taskForm.description}
              onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
              placeholder="Description"
            />
            <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
            />
            <button className="primary-button" disabled={loading}>
              <Plus size={18} />
              Add
            </button>
          </form>

          <div className="task-grid">
            {tasks.map((task) => (
              <article className="task-card" key={task._id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                </div>
                <div className="task-meta">
                  <span>{task.priority}</span>
                  <select value={task.status} onChange={(event) => updateTaskStatus(task, event.target.value)}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="task-actions">
                  {task.status === "done" && (
                    <span className="done">
                      <CheckCircle2 size={16} />
                      Done
                    </span>
                  )}
                  <button className="icon-button" onClick={() => deleteTask(task._id)} aria-label="Delete task">
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {tasks.length === 0 && <p className="empty-state">No tasks yet. Create your first protected task.</p>}
        </section>
      )}
    </main>
  );
};
