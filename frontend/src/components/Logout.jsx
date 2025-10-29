import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      // Clear localStorage regardless of API call success
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");
    };

    handleLogout();
  }, [navigate]);

  // Show loading while logout is processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
