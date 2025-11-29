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
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ===== Favorite helpers =====
export const getFavs = (userId) => {
  if (!userId) return [];
  try {
    const favData = JSON.parse(localStorage.getItem("favs") || "{}");
    return Array.isArray(favData[userId]) ? favData[userId] : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
};

export const toggleFav = (recipeId, userId) => {
  if (!userId) return [];
  
  try {
    const favData = JSON.parse(localStorage.getItem("favs") || "{}");
    const currentFavs = getFavs(userId);
    
    let updatedFavs;
    const stringRecipeId = String(recipeId);
    const stringCurrentFavs = currentFavs.map(String);
    
    if (stringCurrentFavs.includes(stringRecipeId)) {
      updatedFavs = currentFavs.filter(id => String(id) !== stringRecipeId);
    } else {
      updatedFavs = [...currentFavs, recipeId];
    }

    favData[userId] = updatedFavs;
    localStorage.setItem("favs", JSON.stringify(favData));
    return updatedFavs;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return [];
  }
};

export default function Favourites() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [favItems, setFavItems] = useState([]);

  // Load user's favorite IDs
  useEffect(() => {
    if (userId) {
      const favs = getFavs(userId);
      setFavItems(favs);
    } else {
      setFavItems([]);
    }
  }, [userId]);

  // Fetch all recipes
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  const handleToggleFav = (recipeId) => {
    if (!userId) {
      console.log("No user ID available");
      return;
    }
    
    console.log("Toggling favorite for recipe:", recipeId);
    const updatedFav = toggleFav(recipeId, userId);
    setFavItems(updatedFav);
  };

  // Filter recipes to show only favorites
  const favoriteRecipes = data?.filter((recipe) => 
    favItems.map(String).includes(String(recipe._id))
  ) || [];

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
            {error.message || "Failed to load recipes"}
          </Typography>
        )}

        {/* No Favorites */}
        {!isLoading && favoriteRecipes.length === 0 && (
          <Typography align="center" sx={{ width: "100%" }}>
            {userId ? "You have no favorite recipes." : "Please log in to view favorites."}
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

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Typography variant="body2" color="#4b5563">
                  ⏱️ {recipe.time} mins
                </Typography>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFav(recipe._id);
                  }}
                >
                  <FaHeart
                    color={favItems.map(String).includes(String(recipe._id))
                      ? "#ef4444"
                      : "#ccc"}
                  />
                </IconButton>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}