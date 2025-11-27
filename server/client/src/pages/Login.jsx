import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (isSignup) {
        return axios.post(`${backendUrl}/signup`, formData);
      } else {
        return axios.post(`${backendUrl}/login`, formData);
      }
    },
    onSuccess: (res) => {
      const { user, token } = res.data;

      if (!user || !token) {
        toast.error("Invalid login response");
        return;
      }

      login(user, token); // store in context + localStorage
      toast.success(isSignup ? "Account created!" : "Logged in!");
      onClose();
      navigate("/myRecipe"); // redirect after login
    },
    onError: () => {
      toast.error("Login failed. Check your credentials.");
    },
  });

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); mutation.mutate(values); };

  return (
    <Box>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 4, textAlign: "center", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }} elevation={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1e293b" }}>
          {isSignup ? "Create Account ✨" : "Welcome Back 👋"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#4b5563" }}>
          {isSignup ? "Please sign up to get started" : "Please login to continue"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {isSignup && <TextField label="Full Name" name="name" value={values.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />}
          <TextField label="Email" name="email" type="email" value={values.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ py: 1.5, backgroundColor: "#5fb298", fontWeight: "bold", borderRadius: "12px", "&:hover": { backgroundColor: "#44927c" } }}>
            {mutation.isLoading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <Typography sx={{ mt: 2, color: "#4b5563" }}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <Button variant="text" onClick={() => setIsSignup(!isSignup)} sx={{ color: "#bf2450", fontWeight: "bold", textTransform: "none" }}>
            {isSignup ? "Login" : "Create new account"}
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
