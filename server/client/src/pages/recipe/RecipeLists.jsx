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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchRecipes } from "../../api/recipeApi";
import { getFavs, toggleFav } from "../../services/favServices";
import { useAuth } from "../../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function RecipeLists() {
  const { user } = useAuth();
  const [favItems, setFavItems] = useState([]);
  const navigate = useNavigate();

  // Load favorites when user changes
  useEffect(() => {
    if (user?._id) {
      setFavItems(getFavs(user._id));
    } else {
      setFavItems([]);
    }
  }, [user]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipes,
  });

  const handleToggleFav = (recipeId) => {
    if (!user?._id) return;
    const updatedFav = toggleFav(recipeId, favItems, user._id);
    setFavItems(updatedFav);
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
                    height: 200,
                    overflow: "hidden",
                    borderRadius: "20px 20px 0 0",
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
