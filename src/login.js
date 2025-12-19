import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ADMIN
    if (role === "admin" && email === "admin@gmail.com" && password === "admin123") {
      onLogin("admin", null);
    }
    // INSTRUCTOR
    else if (role === "instructor" && email === "inst@gmail.com" && password === "inst123") {
      onLogin("instructor", 1); // instructorId = 1
    }
    else {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <select
          className="w-full mb-3 border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
