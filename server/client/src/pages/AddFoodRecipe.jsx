import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { addRecipe } from "../api/recipeApi";

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
    mutationFn: (formData) => {
      const token = localStorage.getItem("token");
      return addRecipe(formData, token);
    },
    onSuccess: () => {
      toast.success("Recipe added successfully!");
      navigate("/myRecipe");
      refetch();
    },
    onError: () => {
      toast.error("Failed to add recipe.");
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
   <div className="flex justify-center my-10">
      <div className="relative w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 border">

        {/* Close */}
        <IoMdClose
          onClick={() => navigate("/")}
          size={28}
          className="absolute top-4 right-4 text-gray-600 cursor-pointer hover:text-black transition"
        />

        <h2 className="text-center text-2xl font-bold text-[#5fb298] mb-4">
          Add Your Recipe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-3 font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="col-span-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5fb298] outline-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-3 font-medium">Time</label>
            <input
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="col-span-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5fb298] outline-none"
            />
          </div>

          {/* Ingredients */}
          <div className="grid grid-cols-12 items-start gap-2">
            <label className="col-span-3 font-medium">Ingredients</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              required
              className="col-span-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5fb298] outline-none"
            />
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-12 items-start gap-2">
            <label className="col-span-3 font-medium">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              required
              className="col-span-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5fb298] outline-none"
            />
          </div>

          {/* Image Upload */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-3 font-medium">Cover Image</label>

            <div className="col-span-9">
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#5fb298] file:text-white cursor-pointer"
              />

              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    className="max-w-[200px] rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-[#5fb298] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#44927c] transition"
            >
              Add Recipe
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
