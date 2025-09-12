import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Dialog,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import toast from "react-hot-toast";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const handleLoginDialog = () => setOpenLoginDialog(true);
  const handleCloseLoginDialog = () => setOpenLoginDialog(false);

let user = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user = JSON.parse(storedUser);
  }
} catch (err) {
  console.error("Invalid user in localStorage:", err);
  user = null;
}



  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  // ✅ Check token on mount and open login dialog if not logged in
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(false);
    // setOpenLoginDialog(true); // force login on start
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(false);
    // setOpenLoginDialog(true); // force login after logout
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // ✅ Handle click on protected links
  const handleProtectedClick = (path) => {
    if (isLogin) {
      navigate(path);
      setMobileOpen(false); // close mobile drawer
    } else {
      setOpenLoginDialog(true);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "My Recipe", path: "/myrecipe", protected: true },
    { name: "Favourites", path: "/favourite", protected: true },
    { name: "RecipeLists", path: "/recipelist", protected: true },
  ];

  const renderLinks = (isMobile = false) =>
    links.map((link) => (
      <Typography
        key={link.name}
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "1.125rem",
          cursor: "pointer",
          textAlign: isMobile ? "center" : "left",
          my: isMobile ? 1 : 0,
        }}
        onClick={() =>
          link.protected ? handleProtectedClick(link.path) : navigate(link.path)
        }
      >
        {link.name}
      </Typography>
    ));

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#5fb298", color: "#333", boxShadow: "none" }}
      >
        <Toolbar className="flex justify-between">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            🍴 FoodRecipe
          </Typography>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center ">
            {renderLinks()}
            <Button
              // variant="contained"
              onClick={isLogin ? handleLogout : handleLoginDialog}
              sx={{
                fontWeight: "bold",
                fontSize: "1.125rem",
                cursor: "pointer",
                color: "black",
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              {isLogin ? "Logout" : "Login"}
              {user?.email ? `(${user?.email})` : ""}
            </Button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="flex flex-col items-center px-6 py-4 bg-[#b5e9d5] md:hidden">
            {renderLinks(true)}
            <Button
              onClick={isLogin ? handleLogout : handleLoginDialog}
              sx={{
                fontWeight: "bold",
                fontSize: "1.125rem",
                cursor: "pointer",
                color: "black",
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              {isLogin ? "Logout" : "Login"}
              {user?.email ? `(${user?.email})` : ""}
            </Button>
          </div>
        )}
      </AppBar>

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
    </>
  );
}
