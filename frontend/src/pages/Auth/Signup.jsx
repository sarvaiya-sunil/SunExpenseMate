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
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Card Container */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-black text-center md:text-left">
            Create an Account
          </h3>

          <p className="text-sm text-slate-600 mt-2 mb-6 text-center md:text-left">
            Join us today by entering your details below.
          </p>

          <form className="space-y-4">
            {/* Profile Photo */}
            <div className="flex justify-center md:justify-start">
              <ProfilePhotoSelector />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                type="text"
              />

              <Input label="Email" placeholder="Enter email" type="email" />

              <div className="md:col-span-2">
                <Input
                  label="Password"
                  placeholder="Minimum 8 characters"
                  type="password"
                />
              </div>
            </div>

            {/* Error Message */}
            <p className="text-sm text-red-500 text-center md:text-left">
              Error message here
            </p>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-white font-medium transition hover:opacity-90"
            >
              Sign Up
            </button>

            <p className="text-sm text-slate-700 text-center mt-4">
              Already have an account?{" "}
              <span className="font-medium text-primary underline cursor-pointer">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
