import React, { use, useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";
const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.resposne.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Join us today by entering your details below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Profile Selector */}
            <div className="flex justify-center">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
              />
            </div>

            {/* Full Name */}
            <div>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full Name"
                placeholder="Sunil Sarvaiya"
                type="text"
              />
            </div>

            {/* Email */}
            <div>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="sunil@example.com"
                type="email"
              />
            </div>

            {/* Password */}
            <div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                placeholder="Minimum 8 characters"
                type="password"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};
export default Signup;
