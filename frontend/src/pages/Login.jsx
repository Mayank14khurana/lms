import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authAPI";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [registerIsLoading, setRegisterIsLoading] = useState(false);
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  
  const sendOtp = async () => {
    if (!signupInput.email) {
      toast.error("Please enter email first");
      return;
    }
    try {
      setSendingOtp(true);
      const response = await fetch("http://localhost:4000/api/v1/user/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupInput.email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "OTP Sent Successfully");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoding, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginisLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    if (type === "signup" && (!otp || !otpSent)) {
      toast.error("Please verify your email with OTP before signing up");
      return;
    }
    const inputData = type == "signup" ?{ ...signupInput, otp }: loginInput
    const action = type == "login" ? loginUser : registerUser
    await action(inputData)
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup Successfull");
      
      setActiveTab('login');
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login Successfull");
      navigate('/');
    }
    if (registerError) {
      toast.error(registerData.data.message || "Signup failed");
    }
    if (loginError) {
      toast.error(loginData.data.message || "Login failed");
    }
  }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError]);

  return (
    <div className="flex items-center justify-center w-full mt-20">
      <div className="w-[400px]">
        {/* Tabs */}
        <div className="flex w-full mb-4">
          <button
            className={`w-1/2 py-2 text-center font-semibold ${activeTab === "signup"
              ? "border-b-2 border-blue-500 text-blue-500 "
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
          <button
            className={`w-1/2 py-2 text-center font-semibold ${activeTab === "login"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>

        {/* Signup Tab Content */}
        {activeTab === "signup" && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="text-lg font-bold dark:text-gray-600">Signup</h2>
            <p className="text-sm text-gray-500 mb-4">
              Create a new account and click signup when you're done.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium dark:text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. ABCD"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-600">
                  Email
                </label>
                <div className="flex">
                  <input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. abc@gmail.com"
                    required
                    className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                  >
                    {sendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>



              <div>
                <label htmlFor="password" className="block text-sm font-medium dark:text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. xyz"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                />
              </div>
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium dark:text-gray-600">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              >
                {registerIsLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                    <span>Please wait</span>
                  </div>
                ) : (
                  "Signup"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Login Tab Content */}
        {activeTab === "login" && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="text-lg font-bold dark:text-gray-600">Login</h2>
            <p className="text-sm text-gray-500 mb-4">
              Login your password here. After signup, you'll be logged in.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium dark:text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. abc@gmail.com"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium dark:text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. xyz"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              >
                {loginIsLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                    <span>Please wait</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
