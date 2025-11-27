import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Divider,
  Box,
  Dialog,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import DeleteRecipe from "./DeleteRecipe";
import { useState, useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const fetchRecipeById = async (id) => {
  const response = await fetch(`${backendUrl}/recipe/${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe details");
  return response.json();
};

export default function RecipeDetails() {
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) setUserId(user._id);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id),
  });

  if (isLoading)
    return (
      <div className="flex justify-center mt-10">
        <CircularProgress />
      </div>
    );
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const isOwner = data.createdBy === userId; // ✅ Check if logged-in user is creator

  return (
    <>
      <Card
        className="max-w-lg mx-auto my-8 shadow-lg"
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          },
        }}
      >
        {/* Image */}
        {data.coverImage && (
          <CardMedia
            component="img"
            image={`${backendUrl}/images/${data.coverImage}`}
            alt={data.title}
            className="w-full h-60 object-cover mx-auto rounded-lg"
          />
        )}

        <CardContent className="p-6 bg-white">
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {data.title}
          </Typography>

          <Box className="flex items-center justify-between my-2">
            {/* Left side: Chip */}
            <Chip
              label={`⏱️ ${data.time} mins`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />

            {/* Right side: Icons (only if owner) */}
            {isOwner && (
              <Box className="flex items-center gap-4">
                <Link
                  to={`/updateRecipe/${data._id}`}
                  className="text-blue-600 cursor-pointer"
                >
                  <TiEdit size={32} />
                </Link>
                <IconButton onClick={handleOpenDialog} sx={{ color: "red" }}>
                  <MdDelete size={30} />
                </IconButton>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Ingredients */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Ingredients:
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            {Array.isArray(data.ingredients)
              ? data.ingredients.join(", ")
              : data.ingredients}
          </Typography>

          {/* Instructions */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.instructions}
          </Typography>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DeleteRecipe onClose={handleCloseDialog} id={id} />
      </Dialog>
    </>
  );
}
