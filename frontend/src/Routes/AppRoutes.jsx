import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import MainLayout from '../Layout/MainLayout'
import RecipeLists from '../pages/recipe/RecipeLists'
import Login from '../pages/Login'
import MyRecipe from '../pages/MyRecipe'
import Favourites from '../pages/Favourites'
import AddFoodRecipe from '../pages/AddFoodRecipe'
import RecipeDetails from '../pages/recipe/RecipeDetails'
import EditRecipe from '../pages/recipe/EditRecipe'
import DeleteRecipe from '../pages/recipe/DeleteRecipe'

const AppRoutes = () => {
  return (
   <BrowserRouter>
   <Routes>

    <Route path='/' element={<MainLayout/>}>
    <Route index element={<Home/>}/>
    <Route path='/addrecipe' element={<AddFoodRecipe/>}/>
    <Route path='/recipelist' element={<RecipeLists/>}/>
    <Route path='/myrecipe' element={<MyRecipe/>}/>
    <Route path='/favourite' element={<Favourites/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/recipe/:id' element={<RecipeDetails/>}/>
    <Route path='/updateRecipe/:id' element={<EditRecipe/>}/>
    <Route path='/:id' element={<DeleteRecipe/>}/>
    </Route>
    
   </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes