import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function DeleteRecipe({ id, onClose }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Function to call API
  const deleteRecipe = async (_id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${backendUrl}/recipe/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete recipe");
    return response.json();
  };

  // React Query mutation
  const mutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      toast.success("Recipe deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["recipe"] }); // refresh cached recipes
      onClose(); // close dialog
      navigate("/myrecipe"); // redirect to recipe list
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Delete Recipe</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this recipe? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={() => mutation.mutate(id)}
          color="error"
          variant="contained"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
