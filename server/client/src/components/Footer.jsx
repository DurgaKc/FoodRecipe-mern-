import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full mt-auto">
      <div className="max-w-7xl mx-auto flex justify-center">
        <Typography variant="body1" className="text-gray-300 text-center">
          © {new Date().getFullYear()} FoodRecipe. All rights reserved by Durga Khanal
        </Typography>
      </div>
    </footer>
  );
}