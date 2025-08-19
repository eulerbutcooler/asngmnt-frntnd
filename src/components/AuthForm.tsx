import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  type: "login" | "signup";
  onSuccess: (token: string, role: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = type === "login" ? "/auth/login" : "/auth/signup";
      const response = await api.post(endpoint, { email, password });

      if (type === "login") {
        const token = response.data.token;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        onSuccess(token, decoded.user.role);
      } else {
        alert("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-8 rounded-lg shadow-lg bg-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        {type === "login" ? "Login" : "Signup"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {type === "login" ? "Login" : "Signup"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
