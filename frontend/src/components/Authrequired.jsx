import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.jsx";
import { ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// routes that require the visitor to have bearer token to access :

const AuthRequiringRoutes = ({ children }) => {
  const [IsAuth, SetIsAuth] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth().catch(() => {
      SetIsAuth(false);
    });
  });

  // const refreshToken = async () => {
  //   const reftoken = localStorage.getItem(ACCESS_TOKEN);
  //   try {
  //     const res = await api.post("users/userapi/token/refresh/", {
  //       refresh: reftoken,
  //     });
  //     if (res.status === 200) {
  //       localStorage.setItem(ACCESS_TOKEN, String(res.data.access));
  //       SetIsAuth(true);
  //     } else {
  //       SetIsAuth(false);
  //     }
  //   } catch {}
  // };

  const checkAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(token);

    if (token === null) {
      SetIsAuth(false);
    } else {
      const decodedToken = jwtDecode(token);
      const expdate = decodedToken.exp;
      const today = Date.now() / 1000;

      if (today > expdate) {
        // token has expired
        localStorage.removeItem(ACCESS_TOKEN);
        SetIsAuth(false);
        navigate("/login");
      } else {
        SetIsAuth(true);
        navigate("/");
      }
    }
  };

  if (IsAuth === null) {
    return <div>Loading...</div>;
  }

  return IsAuth ? children : <Navigate to="/login" />;
};

export default AuthRequiringRoutes;
