import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch all recipes
const fetchRecipes = async () => {
  const response = await fetch(`${backendUrl}/recipe`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
};

export default function RecipeLists() {
  const [favItems, setFavItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Load user and favorites from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) setUserId(user._id);

    const storedFav = JSON.parse(localStorage.getItem("fav")) || {};
    setFavItems(storedFav[user?._id] || []);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipes,
  });

  // Toggle favorite
  const toggleFav = (recipeId) => {
    if (!userId) return;

    let updatedFav = [...favItems];
    if (favItems.includes(recipeId)) {
      updatedFav = updatedFav.filter((id) => id !== recipeId);
    } else {
      updatedFav.push(recipeId);
    }

    setFavItems(updatedFav);

    // Save per user in localStorage
    const allFav = JSON.parse(localStorage.getItem("fav")) || {};
    allFav[userId] = updatedFav;
    localStorage.setItem("fav", JSON.stringify(allFav));
  };

  return (
    <div className="min-h-screen">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          p: 4,
          justifyContent: "center",
        }}
      >
        {/* Loading */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Typography color="error" align="center" sx={{ width: "100%" }}>
            {error.message}
          </Typography>
        )}

        {/* Recipes */}
        {data &&
          Array.isArray(data) &&
          data.map((recipe) => (
            <Card
              key={recipe._id}
              sx={{
                width: 300,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
                },
                cursor: "pointer",
              }}
            >
              {/* Image */}
              {recipe.coverImage && (
                <Box
                  sx={{
                    width: "100%",
                    height: 200, // fixed height
                    overflow: "hidden",
                    borderRadius: "20px 20px 0 0", // top corners rounded
                  }}
                >
                  <img
                    src={`http://localhost:5000/images/${recipe.coverImage}`}
                    alt={recipe.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // cover the container
                      display: "block",
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ backgroundColor: "#f0fdf4" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  align="center"
                  color="#1e293b"
                >
                  {recipe.title}
                </Typography>

                <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="body2" color="#4b5563">
                    ⏱️ {recipe.time} mins
                  </Typography>
                  <IconButton onClick={() => toggleFav(recipe._id)}>
                    <FaHeart color={favItems.includes(recipe._id) ? "#ef4444" : "#ccc"} />
                  </IconButton>
                  <button
                className="bg-green-300 p-1 rounded-lg text-sm hover:bg-green-400"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                View Details
              </button>
                </Grid>
              </CardContent>
            </Card>
          ))}
      </Box>
    </div>
  );
}
