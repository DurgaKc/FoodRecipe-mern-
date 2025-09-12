import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login({ onClose }) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // 🔹 Mutation for login/signup
  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (isSignup) {
        return axios.post(`${backendUrl}/signup`, formData); // signup API
      } else {
        return axios.post(`${backendUrl}/login`, formData); // login API
      }
    },
    onSuccess: (res) => {
      console.log("✅ Success:", res.data);
      // Save token and user info
      localStorage.setItem("token", res.data.token); // assuming backend returns { token: "...", user: {...} }
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(isSignup ? "Account created Successfully!" : "Logged in Successfully!");
      onClose();
    },
    onError: (err) => {
      toast.error("Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(values); // send values to backend
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1e293b" }}
        >
          {isSignup ? "Create Account ✨" : "Welcome Back 👋"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#4b5563" }}>
          {isSignup
            ? "Please sign up to get started"
            : "Please login to continue"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <TextField
              label="Full Name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={mutation.isLoading}
            sx={{
              py: 1.5,
              backgroundColor: "#5fb298",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#44927c" },
            }}
          >
            {mutation.isLoading
              ? "Processing..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </Button>
        </form>

        <Typography sx={{ mt: 2, color: "#4b5563" }}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <Button
            variant="text"
            onClick={() => setIsSignup(!isSignup)}
            sx={{
              color: "#bf2450",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {isSignup ? "Login" : "Create new account"}
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
