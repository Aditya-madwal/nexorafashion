import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return children;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp > currentTime) {
      // Token is valid, redirect to dashboard
      return <Navigate to="/" replace />;
    }

    // Token is expired, remove it and show the page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return children;
  } catch (error) {
    // Invalid token, remove it and show the page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return children;
  }
};

export default RedirectIfAuthenticated;
