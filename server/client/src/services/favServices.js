//Get favorites for a user
export const getFavs = (userId)=>{
    const allFav = JSON.parse(localStorage.getItem("fav")) || {};
    return allFav[userId] || [];
}

//save updated favourites
export const saveFavs = (userId, favItems)=>{
  const allFav = JSON.parse(localStorage.getItem("fav")) || {};
  allFav[userId] = favItems;
  localStorage.setItem("fav",JSON.stringify(allFav));
}

//toggle favourite and return updated list
 export const toggleFav = (recipeId, favItems,userId)=>{
    if(!userId) return favItems;

    let updatedFav = [...favItems];
    if(favItems.includes(recipeId)){
        updatedFav = updatedFav.filter((id)=> id !== recipeId);
    }else{
        updatedFav.push(recipeId);
    }
    saveFavs(userId, updatedFav);
    return updatedFav;
 }