import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full mt-auto">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-4">

    {/* Left Side */}
    <Typography variant="body1" className="text-gray-300">
      Copyright© {new Date().getFullYear()}, FoodRecipe, ALL RIGHTS RESERVED.
    </Typography>

    {/* Right Side */}
    <p className="text-gray-300">
      Developed &amp; Managed By{" "}
      <a
        href="https://www.linkedin.com/in/durga-khanal/"
        className="text-red-500 hover:underline"
      >
        @DurgaKhanal
      </a>
    </p>

  </div>
</footer>

  );
}