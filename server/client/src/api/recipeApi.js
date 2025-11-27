import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

//Add recipe
export const addRecipe = async (data,token)=>{
    const form = new FormData();
      form.append("title", data.title);
      form.append("time", data.time);
      form.append("ingredients", JSON.stringify(data.ingredients));
      form.append("instructions", data.instructions);
      if (data.image) form.append("coverImage", data.image);

      return axios.post(`${backendUrl}/recipe/addRecipe`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
}

// Fetch all recipes
 export const fetchRecipes = async () => {
  const response = await fetch(`${backendUrl}/recipe`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
 };

 // ✅ Fetch recipes created by current user
// ✅ Fetch all recipes
export const getAllRecipes = async () => {
  const res = await axios.get(`${backendUrl}/recipe`);
  return res.data;
};

// ✅ Fetch recipes created by current user
export const getMyRecipes = async (userId) => {
  const res = await axios.get(`${backendUrl}/recipe`);
  return res.data.filter((recipe) => recipe.createdBy === userId);
};

//UPDATE THE RECIPE

  // ✅ fetch recipe by id
export const fetchRecipeById = async (id) => {
  const res = await axios.get(`${backendUrl}/recipe/${id}`);
  return res.data;
};
  // update the recipe
 export const updateRecipe = async (id, updatedRecipe, token)=>{
  const form = new FormData();
      form.append("title", updatedRecipe.title);
      form.append("time", updatedRecipe.time);
      form.append(
        "ingredients",
        JSON.stringify(
          updatedRecipe.ingredients.split(",").map((i) => i.trim())
        )
      );
      form.append("instructions", updatedRecipe.instructions);

      // handle image
      if (updatedRecipe.image instanceof File) {
        form.append("image", updatedRecipe.image);
      } else if (typeof updatedRecipe.image === "string") {
        form.append("existingImage", updatedRecipe.image); // backend should handle keeping old image
      }

      const res = await axios.put(
        `${backendUrl}/recipe/updateRecipe/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    }

    //DELETE THE RECIPE
    // ✅ Delete recipe by ID
   export const deleteRecipe = async (id, token) => {
     const res = await axios.delete(`${backendUrl}/recipe/${id}`, {
     headers: {
      Authorization: `Bearer ${token}`,
      },
     });
     return res.data;
   };

