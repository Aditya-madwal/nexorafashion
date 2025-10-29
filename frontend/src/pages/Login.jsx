import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import { useContext } from "react";
import loginImage from "../assets/login_image.jpg";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { me, setMe } = useContext(MyContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/login", {
        username: email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMe(response.data.user);

      console.log("Login successful:", response.data);
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-1/2 bg-white overflow-y-auto p-8 md:p-12">
        <div className="flex flex-col justify-between min-h-full">
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Welcome to{" "}
                <span className="text-green-600">NexoraFashion!</span>
              </h1>
              <p className="text-gray-600 text-base">
                Please enter your username and password to login.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="username"
                  placeholder="Username"
                  name="username"
                  id="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-4 text-sm text-green-600">
                Already have an account?{" "}
                <Link
                  to="/register"
                  className="text-green-600 hover:text-green-700 font-medium underline">
                  Register
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            {/* Contact Information */}
            <div className="mt-12">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Contact us if you have any questions
              </p>
              <a
                href="mailto:support@bonsante.com"
                className="text-sm text-green-600 hover:text-green-700 font-medium">
                support@nexorafashion.com
              </a>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            All rights reserved Betterise Technologies 2020
          </div>
        </div>
      </div>

      <div className="w-1/2 hidden md:block h-screen overflow-hidden">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
