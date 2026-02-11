import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter the email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, loggedInUser } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(loggedInUser);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Card Container */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-black text-center md:text-left">
            Welcome Back
          </h3>

          <p className="text-sm text-slate-600 mt-2 mb-6 text-center md:text-left">
            Please enter your details to log in
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="sunil@example.com"
              type="email"
              autoComplete="off"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              autoComplete="new-password"
            />

            {error && (
              <p className="text-red-500 text-sm text-center md:text-left">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-white font-medium transition hover:opacity-90"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-slate-700 text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
