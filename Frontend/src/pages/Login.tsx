import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthStore from "../store/AuthStore";

interface User {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const {setAccessToken} = AuthStore();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<User>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: User): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        {
          withCredentials: true,
        },
      );


      setAccessToken(response.data.accessToken);

      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const email = error.response?.data?.email;

        if (message === "USER_NOT_REGISTERED") {
          setError("email", {
            type: "server",
            message: "User is not registered",
          });
        } else if (message === "EMAIL_NOT_VERIFIED") {
          navigate("/verify-email", {
            state: {
              email,
            },
          });
        } else if (message === "WRONG_PASSWORD") {
          setError("password", {
            type: "server",
            message: "Incorrect password",
          });
        } else {
          console.log("Backend error: ", error.response?.data);
        }
      } else {
        console.log("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-3 md:p-5">
      <div className="w-full max-w-375 min-h-180 bg-white rounded-[22px] shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
       

        <div className="w-full lg:w-[46%] flex flex-col">
          

          <div className="px-8 md:px-12 pt-8">
            <h1 className="text-[30px] font-bold tracking-tight text-[#202020]">
              HYF<span className="text-[#f27c0c]">I</span>N
            </h1>
          </div>

         

          <div className="flex-1 flex items-center justify-center px-8 md:px-16 lg:px-20 py-12">
            <div className="w-full max-w-107.5">
             

              <div className="mb-8">
                <h2 className="text-[30px] md:text-[34px] font-semibold tracking-tight text-[#171717]">
                  Welcome back
                </h2>

                <p className="mt-2 text-[15px] text-gray-500">
                  Sign in to continue to your account
                </p>
              </div>

             

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[14px] font-medium text-[#202020] mb-2"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full h-12.5 rounded-lg border px-4 text-[15px] outline-none transition
                      ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-[#f27c0c] focus:ring-2 focus:ring-orange-100"
                      }
                    `}
                    {...register("email", {
                      required: "Email is required",

                      minLength: {
                        value: 8,
                        message: "Email must be at least 8 characters",
                      },

                      maxLength: {
                        value: 255,
                        message: "Email must not exceed 255 characters",
                      },

                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-[13px] text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-[14px] font-medium text-[#202020]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        console.log("Forgot password");
                      }}
                      className="text-[13px] text-gray-500 hover:text-[#f27c0c] transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`w-full h-12.5 rounded-lg border px-4 pr-16 text-[15px] outline-none transition
                        ${
                          errors.password
                            ? "border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-[#f27c0c] focus:ring-2 focus:ring-orange-100"
                        }
                      `}
                      {...register("password", {
                        required: "Password is required",

                        minLength: {
                          value: 8,
                          message: "Password should be minimum 8 characters",
                        },

                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
                          message:
                            "Password must contain lowercase, uppercase and special character",
                        },
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-gray-500 hover:text-[#f27c0c]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-[13px] text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 accent-[#f27c0c]"
                  />

                  <label
                    htmlFor="remember"
                    className="text-[13px] text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full h-12.5 rounded-lg bg-[#f27c0c] text-white text-[15px] font-medium transition hover:bg-[#df6f06] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Logging in..." : "Continue"}
                </button>
              </form>

             

              <div className="mt-8 text-center">
                <p className="text-[14px] text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-medium text-[#202020] hover:text-[#f27c0c] transition"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

       

        <div className="hidden lg:flex flex-1 bg-[#f7f7f7] relative overflow-hidden">
          <div className="w-full px-16 xl:px-24 pt-24">
            <div className="max-w-162.5">
              <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#f27c0c] mb-5">
                Welcome back
              </p>

              <h2 className="text-[48px] xl:text-[56px] leading-[1.05] font-medium tracking-[-2px] text-[#171717]">
                Everything you need,
                <br />
                all in one place.
              </h2>

              <p className="mt-8 text-[18px] leading-7 text-gray-500 max-w-142.5">
                Manage your account securely and get back to what matters most.
                Simple, fast and built around you.
              </p>
            </div>

            

            <div className="absolute left-[12%] right-[-10%] -bottom-25">
              <div className="bg-white border border-gray-300 rounded-[20px] shadow-lg p-5 -rotate-3">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#f27c0c]" />

                    <div>
                      <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
                      <div className="h-2 w-12 bg-gray-100 rounded-full mt-2" />
                    </div>
                  </div>

                  <div className="h-8 w-24 bg-gray-100 rounded-lg" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="h-28 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <div className="h-2 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-24 bg-gray-300 rounded-full mt-5" />
                  </div>

                  <div className="h-28 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <div className="h-2 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-20 bg-gray-300 rounded-full mt-5" />
                  </div>

                  <div className="h-28 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <div className="h-2 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-24 bg-[#f27c0c] rounded-full mt-5" />
                  </div>
                </div>

                <div className="mt-5 h-56 rounded-xl border border-gray-100 bg-white p-5">
                  <div className="h-2.5 w-28 bg-gray-200 rounded-full" />

                  <div className="mt-8 flex items-end gap-4 h-32">
                    <div className="w-10 h-[35%] bg-gray-100 rounded-t" />
                    <div className="w-10 h-[55%] bg-gray-200 rounded-t" />
                    <div className="w-10 h-[45%] bg-gray-100 rounded-t" />
                    <div className="w-10 h-[75%] bg-[#f27c0c] rounded-t" />
                    <div className="w-10 h-[65%] bg-gray-200 rounded-t" />
                    <div className="w-10 h-[90%] bg-gray-300 rounded-t" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
