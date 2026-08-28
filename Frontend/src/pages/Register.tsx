import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface User {
    username: string;
    password: string;
    email: string;
}

const Register = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isValid
        },
        setError
    } = useForm<User>({
        mode: "onChange",
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: User): Promise<void> => {

        try {

            const result = await axios.post(
                "http://localhost:3000/api/auth/register",
                data
            );

            console.log(result.data.expiryTime);

            localStorage.setItem("expiryTime", result.data.expiryTime);

           

            console.log("Stored expiry:", localStorage.getItem("expiryTime"));

            navigate("/verify-email", {
                state: {
                    email: data.email,
                }
            });

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const message = error.response?.data?.message;

                if (message === "EMAIL_ALREADY_EXIST") {

                    setError("email", {
                        type: "server",
                        message: "This email is already registered"
                    });

                } else if (message === "USERNAME_ALREADY_EXIST") {

                    setError("username", {
                        type: "server",
                        message: "This username is already taken"
                    });

                } else {

                    console.log(
                        "Backend error:",
                        error.response?.data
                    );
                }

            } else {

                console.log("Something went wrong");
            }
        }
    };

    return (

        <div className="min-h-screen bg-[#f7f7f5] p-3 md:p-5">

            <div className="flex min-h-[calc(100vh-24px)] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">

               

                <div className="flex w-full flex-col lg:w-[48%]">

              

                    <div className="px-8 py-7 md:px-12">

                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f47c0b]">

                                <span className="text-lg font-bold text-white">
                                    A
                                </span>

                            </div>

                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                AuthFlow
                            </span>

                        </div>

                    </div>


                

                    <div className="flex flex-1 items-center justify-center px-8 pb-12 md:px-12">

                        <div className="w-full max-w-md">

                         

                            <div className="mb-8">

                                <p className="mb-3 text-sm font-medium text-[#f47c0b]">
                                    GET STARTED
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                                    Create your account
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Create an account to get started.
                                    It only takes a minute.
                                </p>

                            </div>


                           

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >

                             

                                <div>

                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-medium text-gray-800"
                                    >
                                        Username
                                    </label>

                                    <input
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="Choose a username"
                                        className={`
                                            h-12 w-full rounded-xl border
                                            bg-white px-4 text-sm
                                            text-gray-900 outline-none
                                            transition
                                            placeholder:text-gray-400
                                            ${
                                                errors.username
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-200 focus:border-[#f47c0b]"
                                            }
                                        `}
                                        {...register("username", {

                                            required:
                                                "Username is required",

                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Username must be at least 3 characters"
                                            },

                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Username must not exceed 50 characters"
                                            },

                                            pattern: {
                                                value:
                                                    /^[a-zA-Z0-9_]+$/,
                                                message:
                                                    "Only letters, numbers and underscores are allowed"
                                            }

                                        })}
                                    />

                                    {errors.username && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.username.message}
                                        </p>
                                    )}

                                </div>


                               

                                <div>

                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-gray-800"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className={`
                                            h-12 w-full rounded-xl border
                                            bg-white px-4 text-sm
                                            text-gray-900 outline-none
                                            transition
                                            placeholder:text-gray-400
                                            ${
                                                errors.email
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-200 focus:border-[#f47c0b]"
                                            }
                                        `}
                                        {...register("email", {

                                            required:
                                                "Email is required",

                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Email must be at least 8 characters"
                                            },

                                            maxLength: {
                                                value: 255,
                                                message:
                                                    "Email must not exceed 255 characters"
                                            },

                                            pattern: {
                                                value:
                                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    "Please enter a valid email address"
                                            }

                                        })}
                                    />

                                    {errors.email && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}

                                </div>


                              

                                <div>

                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-800"
                                        >
                                            Password
                                        </label>

                                        <span className="text-xs text-gray-400">
                                            Min. 8 characters
                                        </span>

                                    </div>

                                    <div className="relative">

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            placeholder="Create a strong password"
                                            className={`
                                                h-12 w-full rounded-xl border
                                                bg-white px-4 pr-16
                                                text-sm text-gray-900
                                                outline-none transition
                                                placeholder:text-gray-400
                                                ${
                                                    errors.password
                                                        ? "border-red-400 focus:border-red-500"
                                                        : "border-gray-200 focus:border-[#f47c0b]"
                                                }
                                            `}
                                            {...register("password", {

                                                required:
                                                    "Password is required",

                                                minLength: {
                                                    value: 8,
                                                    message:
                                                        "Password must be at least 8 characters"
                                                },

                                                pattern: {
                                                    value:
                                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
                                                    message:
                                                        "Password must contain lowercase, uppercase and special character"
                                                }

                                            })}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    previous =>
                                                        !previous
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                    {errors.password && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}

                                </div>


                               

                                <button
                                    type="submit"
                                    disabled={
                                        !isValid ||
                                        isSubmitting
                                    }
                                    className="
                                        h-12 w-full rounded-xl
                                        bg-[#f47c0b]
                                        text-sm font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-[#df6f08]
                                        active:scale-[0.99]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {isSubmitting
                                        ? "Creating account..."
                                        : "Create account"}
                                </button>

                            </form>


                            

                            <div className="mt-7 text-center">

                                <p className="text-sm text-gray-500">

                                    Already have an account?{" "}

                                    <Link
                                        to="/login"
                                        className="font-semibold text-gray-900 hover:text-[#f47c0b]"
                                    >
                                        Sign in
                                    </Link>

                                </p>

                            </div>


                       

                            <p className="mt-8 text-center text-xs leading-5 text-gray-400">

                                By creating an account, you agree to our{" "}

                                <span className="cursor-pointer underline underline-offset-2">
                                    Terms of Service
                                </span>

                                {" "}and{" "}

                                <span className="cursor-pointer underline underline-offset-2">
                                    Privacy Policy
                                </span>

                                .

                            </p>

                        </div>

                    </div>

                </div>


                

                <div className="relative hidden flex-1 overflow-hidden bg-[#f1f1ee] lg:block">

                   

                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-black/5" />

                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-black/5" />


                  

                    <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">

                        <div className="max-w-2xl">

                            <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-gray-600">
                                SIMPLE. SECURE. FAST.
                            </span>

                            <h2 className="mt-8 max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight text-gray-950 xl:text-6xl">

                                Your account,
                                <br />

                                <span className="text-[#f47c0b]">
                                    your control.
                                </span>

                            </h2>

                            <p className="mt-7 max-w-lg text-base leading-7 text-gray-500">
                                Everything you need to securely manage
                                your account, verify your identity and
                                keep your information protected.
                            </p>

                        </div>


                    

                        <div className="relative mt-12 flex justify-center">

                       

                            <div className="
                                w-full max-w-xl
                                -rotate-3
                                rounded-2xl
                                border border-black/10
                                bg-white
                                p-5
                                shadow-2xl
                            ">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2">

                                        <div className="h-8 w-8 rounded-lg bg-[#f47c0b]" />

                                        <span className="text-sm font-semibold">
                                            AuthFlow
                                        </span>

                                    </div>

                                    <div className="h-8 w-24 rounded-lg bg-gray-100" />

                                </div>


                                <div className="mt-7 grid grid-cols-[120px_1fr] gap-5">

                                    <div className="space-y-3">

                                        <div className="h-7 rounded-lg bg-[#fff1e3]" />

                                        <div className="h-7 rounded-lg bg-gray-100" />

                                        <div className="h-7 rounded-lg bg-gray-100" />

                                        <div className="h-7 rounded-lg bg-gray-100" />

                                    </div>


                                    <div>

                                        <div className="h-5 w-32 rounded bg-gray-100" />

                                        <div className="mt-6 h-32 rounded-xl bg-[#fafafa] border border-gray-100">

                                            <div className="flex h-full items-end gap-3 px-5 pb-5">

                                                <div className="h-10 flex-1 rounded-t bg-[#f47c0b]/20" />

                                                <div className="h-16 flex-1 rounded-t bg-[#f47c0b]/30" />

                                                <div className="h-12 flex-1 rounded-t bg-[#f47c0b]/40" />

                                                <div className="h-24 flex-1 rounded-t bg-[#f47c0b]/60" />

                                                <div className="h-20 flex-1 rounded-t bg-[#f47c0b]" />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                           

                            <div className="
                                absolute
                                -bottom-8
                                -left-2
                                rounded-2xl
                                border border-black/10
                                bg-white
                                p-4
                                shadow-xl
                                xl:left-4
                            ">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                                        <span className="text-green-600">
                                            ✓
                                        </span>

                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-400">
                                            Account status
                                        </p>

                                        <p className="text-sm font-semibold text-gray-900">
                                            Email verified
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                    

                        <div className="mt-16 grid grid-cols-3 gap-5 border-t border-black/10 pt-7">

                            <div>

                                <p className="text-lg font-semibold text-gray-900">
                                    01
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Secure authentication
                                </p>

                            </div>

                            <div>

                                <p className="text-lg font-semibold text-gray-900">
                                    02
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Email verification
                                </p>

                            </div>

                            <div>

                                <p className="text-lg font-semibold text-gray-900">
                                    03
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Protected account
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;