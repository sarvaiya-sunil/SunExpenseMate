import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-[60%] flex flex-col px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Logo Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="logo.png"
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Expense Tracker
          </h2>
        </div>

        {/* Auth Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right Section (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[40%] relative bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center p-8 overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute -top-6 -left-6 w-40 h-40 bg-purple-600 rounded-3xl" />
        <div className="absolute top-1/3 right-10 w-40 h-48 border-[18px] border-fuchsia-600 rounded-3xl" />
        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-violet-500 rounded-3xl" />

        {/* Card Section */}
        <div className="relative z-10 w-full flex flex-col justify-center">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-primary"
          />

          <img
            src="card2.png"
            alt="Card Preview"
            className="mt-10 w-full max-w-xs lg:max-w-sm mx-auto shadow-lg shadow-blue-400/20"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
      <div
        className={`w-12 h-12 flex items-center justify-center text-xl text-white ${color} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>
  );
};
