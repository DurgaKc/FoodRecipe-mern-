const express = require("express")
const { getRecipes,getRecipe,addRecipe,updateRecipe,deleteRecipe,upload } = require("../controller/recipe")
const verifyToken = require("../middleware/auth")
const router = express.Router()

//getAll
router.get("/",getRecipes)

// get by id
router.get("/:id",getRecipe)

// add recipe
router.post("/addRecipe",upload.single('coverImage'),verifyToken,addRecipe)

// Edit recipe
router.put("/updateRecipe/:id",upload.single("image"),verifyToken,updateRecipe)

// delete recipe
router.delete("/:id",verifyToken,deleteRecipe)


module.exports=router;