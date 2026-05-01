import React, { useState } from "react";
import "./Login.css";

export const Login: React.FC = () => {
  const [name, setName] = useState("Victor");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Usuario: ${name}, Contraseña: ${password}`);
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
        </ul>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};
