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
import { fetchRecipes } from "../api/recipeApi";
import { getFavs, toggleFav } from "../services/favServices";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Favourites() {
  const [favItems, setFavItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load user and favorites
  useEffect(() => {
    const stored = localStorage.getItem("user");
    let user = null;

    if (stored && stored !== "undefined" && stored !== "null") {
      try {
        user = JSON.parse(stored);
      } catch (err) {
        console.error("Invalid JSON in localStorage for user:", err);
        localStorage.removeItem("user"); // remove corrupted data
      }
    }

    if (user && user._id) {
      setUserId(user._id);
      const favs = getFavs(user._id);
      setFavItems(Array.isArray(favs) ? favs : []);
    } else {
      setUserId(null);
      setFavItems([]);
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipes,
  });

  const handleToggleFav = (recipeId) => {
    if (!userId) return; // prevent toggling if no user
    const updatedFav = toggleFav(recipeId, favItems, userId);
    setFavItems(Array.isArray(updatedFav) ? updatedFav : []);
  };

  const favoriteRecipes = data?.filter((recipe) => favItems.includes(recipe._id)) || [];

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

        {/* No Favorites */}
        {!isLoading && favoriteRecipes.length === 0 && (
          <Typography align="center" sx={{ width: "100%" }}>
            You have no favorite recipes.
          </Typography>
        )}

        {/* Favorite Recipes */}
        {favoriteRecipes.map((recipe) => (
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
            {recipe.coverImage && (
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={`${backendUrl}/images/${recipe.coverImage}`}
                  alt={recipe.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                <IconButton onClick={() => handleToggleFav(recipe._id)}>
                  <FaHeart color={favItems.includes(recipe._id) ? "#ef4444" : "#ccc"} />
                </IconButton>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
