import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  CircularProgress,} from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import helpers
import { getMyRecipes } from "../api/recipeApi";
import { getFavs, toggleFav } from "../services/favServices";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyRecipe() {
  const [favItems, setFavItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      setUserId(user._id);
      setFavItems(getFavs(user._id)); // load favorites
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["myRecipes", userId],
     queryFn: () => getMyRecipes(userId),
    enabled: !!userId, // only fetch if user exists
  });
  
    const handleToggleFav = (recipeId)=>{
      const updated = toggleFav(recipeId, favItems, userId);
      setFavItems(updated);
    }
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
        {isLoading && (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center" sx={{ width: "100%" }}>
            {error.message}
          </Typography>
        )}

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
              {recipe.coverImage && (
                <Box
                  sx={{
                    width: "100%",
                    height: 200, // fixed height
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
                      objectFit: "cover", // cover fills the box without stretching
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
                  <IconButton onClick={() => handleToggleFav(recipe._id)}>
                    <FaHeart
                      color={favItems.includes(recipe._id) ? "#ef4444" : "#ccc"}
                    />
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
