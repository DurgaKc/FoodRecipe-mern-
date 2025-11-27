import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

export default function Home() {
  const navigate=useNavigate()
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const handleLoginDialog = () => setOpenLoginDialog(true);
  const handleCloseLoginDialog = () => setOpenLoginDialog(false);
    const [isLogin, setIsLogin] = useState(false);
  
  const addRecipe=()=>{
      let token = localStorage.getItem("token");
   if(token){
    navigate("/addRecipe")
   }else{
    setOpenLoginDialog(true);
   }
    
  }
  return (
    <div className=" flex flex-col min-h-screen justify-between bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100">
      {/* Main Content */}
      <div className="max-w-7xl mt-8 mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            🍕 Discover & Share <br />
            <span className="text-red-600">Delicious Recipes</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Welcome to <span className="font-semibold">FoodRecipe</span>, 
            your go-to place to explore mouthwatering recipes and share your own creations.  
            Let’s make cooking <span className="text-red-500 font-bold">fun & tasty!</span>
          </p>
          <Button
          onClick={addRecipe}
            variant="contained"
            sx={{
              backgroundColor: "#77cfaf",
              "&:hover": { backgroundColor: "#5fb298" },
              paddingX: 4,
              paddingY: 1,
              marginY:5,
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: "14px",
              textTransform: "none",
              boxShadow: "0px 6px 14px rgba(0,0,0,0.2)",
            }}
          >
            Share your recipe
          </Button>
        </div>

        {/* Right Content - Pizza Image */}
        <div className="flex justify-center">
          <img
            src="/pizza.jpg"
            alt="Pizza"
            className="mt-10 rounded-3xl shadow-2xl w-[60%] md:w-[70%] hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 320"
        className="w-full"
        
      >
        <path
          fill="#b5e9d5"
          fillOpacity="1"
          d="M0,64L60,90.7C120,117,240,171,360,160C480,149,600,75,720,85.3C840,96,960,192,1080,224C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      {/* Login Dialog */}
            <Dialog
              sx={{ backgroundColor: "rgba(255, 255, 250, 0.6)" }}
              open={openLoginDialog}
              onClose={handleCloseLoginDialog}
            >
              <Login
                onClose={() => {
                  handleCloseLoginDialog();
                  const token = localStorage.getItem("token");
                  if (token) setIsLogin(true); // update login state after successful login
                }}
              />
            </Dialog>
    </div>
    
  );
}
