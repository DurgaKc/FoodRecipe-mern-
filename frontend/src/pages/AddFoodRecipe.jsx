import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddRecipe() {
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    image: null,
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries(["addRecipe"]);

  const addRecipeMutation = useMutation({
    mutationFn: (data) => {
      const form = new FormData();
      form.append("title", data.title);
      form.append("time", data.time);
      form.append("ingredients", JSON.stringify(data.ingredients));
      form.append("instructions", data.instructions);
      if (data.image) form.append("coverImage", data.image);

      const token = localStorage.getItem("token");

      return axios.post(`${backendUrl}/recipe/addRecipe`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Recipe added successfully!");
      navigate("/myRecipe");
      refetch();
      setFormData({
        title: "",
        time: "",
        ingredients: "",
        instructions: "",
        image: null,
      });
    },
    onError: (error) => {
      toast.error("Failed to add recipe.");
      // console.error(error);
    },
  });

  const handleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value.split(",")
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipe Submitted:", formData);
    addRecipeMutation.mutate(formData);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 800,
          borderRadius: 2,
          position: "relative",
        }}
        elevation={4}
      >
        {/* Close Icon at Top Right */}
        <IoMdClose
          onClick={() => navigate("/")}
          size={28}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 16, // distance from top
            right: 16, // distance from right
            color: "#555",
          }}
        />
        <Typography
          textAlign="center"
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#5fb298",marginBottom:"10px" }}
        >
          Add Your Recipe
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={2.5}>
              <Typography>Title</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          {/* Time */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={2.5}>
              <Typography>Time</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                name="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          {/* Ingredients */}
          <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Grid item xs={2.5}>
              <Typography>Ingredients</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>

          {/* Instructions */}
          <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Grid item xs={2.5}>
              <Typography>Instructions</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>

          {/* Recipe Image */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={2.5}>
              <Typography>Cover Image</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <input
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: "100%" }}
              />
              {preview && (
                <Box mt={2}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: "bold",
                backgroundColor: "#5fb298",
                "&:hover": { backgroundColor: "#44927c" },
              }}
            >
              Add Recipe
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
