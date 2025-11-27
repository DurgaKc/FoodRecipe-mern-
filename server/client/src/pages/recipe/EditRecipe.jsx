import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { fetchRecipeById, updateRecipe } from "../../api/recipeApi";

export default function EditRecipe() {
  const [preview, setPreview] = useState(null);
  const { id } = useParams(); // get recipe ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries(["recipes"]);

  const [formData, setFormData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    image: null,
  });

  // ✅ fetch recipe by id
  const { data: recipeData, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => fetchRecipeById(id),
    enabled: !!id, // only fetch if ID exists
  });

  // ✅ Prefill form when data loads
  useEffect(() => {
    if (recipeData) {
      setFormData({
        title: recipeData.title || "",
        time: recipeData.time || "",
        ingredients: recipeData.ingredients?.join(", ") || "", // convert array → string
        instructions: recipeData.instructions || "",
        image: recipeData.image || null,
      });
      if (recipeData.image) {
        setPreview(`${backendUrl}/images/${recipeData.image}`);
      }
    }
  }, [recipeData]);

  // ✅ mutation for updating recipe
  const updateRecipeMutation = useMutation({
    mutationFn: (updatedRecipe) => {
      const token = localStorage.getItem("token");
      return updateRecipe(id, updatedRecipe, token); //from api
    },
    onSuccess: () => {
      toast.success("Recipe updated successfully!");
      navigate("/myRecipe");
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update recipe.");
    },
  });

  // ✅ Handle text changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    updateRecipeMutation.mutate(formData);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 4,
        position: "relative",
      }}
    >
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
          onClick={() => navigate("/myRecipe")}
          size={28}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 16,
            right: 16,
            color: "#555",
          }}
        />

        <Typography
          textAlign="center"
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ pb: 3, color: "#5fb298" }}
        >
          Update Your Recipe
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
              Edit Recipe
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
