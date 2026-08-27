import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

interface OTP {
    otp: string;
}

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email as string | undefined;

    const [timer, setTimer] = useState(RESEND_COOLDOWN);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState("");

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: {
            errors,
            isSubmitting,
            isValid
        }
    } = useForm<OTP>({
        mode: "onChange",
        defaultValues: {
            otp: ""
        }
    });


    /*
     * If user directly visits /verify-email
     * there will be no email in router state.
     */
    useEffect(() => {

        if (!email) {
            navigate("/register", { replace: true });
        }

    }, [email, navigate]);


    /*
     * Countdown
     */
    useEffect(() => {

        if (timer <= 0) {
            return;
        }

        const interval = setInterval(() => {

            setTimer((previousTimer) => {

                if (previousTimer <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return previousTimer - 1;
            });

        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);


    /*
     * Verify OTP
     */
    const onSubmit = async (data: OTP): Promise<void> => {

        try {

            await axios.post(
                "http://localhost:3000/api/auth/verify-email",
                {
                    email,
                    otp: data.otp
                }
            );

            /*
             * Email successfully verified.
             *
             * Change this route later to your login/dashboard route.
             */
            navigate("/login", {
                replace: true
            });

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const message = error.response?.data?.message;

                if (message === "EMAIL_ALREADY_VERIFIED") {

                    setError("otp", {
                        type: "server",
                        message: "This email has already been verified."
                    });

                } else if (message === "OTP_EXPIRED_OR_NOT_FOUND") {

                    setError("otp", {
                        type: "server",
                        message: "Your OTP has expired. Please request a new one."
                    });

                } else if (message === "INVALID_OTP") {

                    setError("otp", {
                        type: "server",
                        message: "The OTP you entered is incorrect."
                    });

                } else {

                    setError("otp", {
                        type: "server",
                        message: "Something went wrong. Please try again."
                    });
                }

            } else {

                setError("otp", {
                    type: "server",
                    message: "Something went wrong. Please try again."
                });
            }
        }
    };


    /*
     * Resend OTP
     */
    const resendOtp = async (): Promise<void> => {

        if (timer > 0 || resendLoading || !email) {
            return;
        }

        setResendLoading(true);
        setResendMessage("");
        setResendError("");

        try {

            await axios.post(
                "http://localhost:3000/api/auth/resend-otp",
                {
                    email
                }
            );

            /*
             * Clear the old OTP from the input.
             */
            reset({
                otp: ""
            });

            /*
             * Start a fresh 60 second cooldown.
             */
            setTimer(RESEND_COOLDOWN);

            setResendMessage(
                "A new verification code has been sent to your email."
            );

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const message = error.response?.data?.message;

                if (message === "EMAIL_ALREADY_VERIFIED") {

                    setResendError(
                        "This email has already been verified."
                    );

                } else if (message === "EMAIL_DOES_NOT_EXIST") {

                    setResendError(
                        "We couldn't find an account with this email."
                    );

                } else {

                    setResendError(
                        "Unable to resend the OTP. Please try again."
                    );
                }

            } else {

                setResendError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setResendLoading(false);
        }
    };


    if (!email) {
        return null;
    }


    return (

        <div className="min-h-screen bg-[#fafafa] p-3 sm:p-5">

            <div className="flex min-h-[calc(100vh-24px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


                {/* ================= LEFT SIDE ================= */}

                <div className="flex w-full flex-col lg:w-[45%]">

                    {/* Logo */}

                    <div className="px-8 pt-8 sm:px-12 sm:pt-10">

                        <div className="text-3xl font-bold tracking-tight text-[#252525]">
                            HYF<span className="text-[#f27c0b]">I</span>N
                        </div>

                    </div>


                    {/* Form */}

                    <div className="flex flex-1 items-center justify-center px-8 py-12 sm:px-12">

                        <div className="w-full max-w-md">


                            {/* Heading */}

                            <div className="mb-8">

                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                        stroke="currentColor"
                                        className="h-6 w-6 text-[#f27c0b]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 8.25l-9.72 6.075a3.75 3.75 0 01-4.06 0L2.25 8.25m19.5 0A2.25 2.25 0 0019.5 6h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v7.5A2.25 2.25 0 0119.5 18h-15a2.25 2.25 0 01-2.25-2.25v-7.5"
                                        />
                                    </svg>

                                </div>


                                <h1 className="text-3xl font-semibold tracking-tight text-[#202020] sm:text-4xl">
                                    Verify your email
                                </h1>

                                <p className="mt-3 text-[15px] leading-6 text-gray-500">
                                    We've sent a 6-digit verification code
                                    to your email address.
                                </p>

                            </div>


                            {/* Email */}

                            <div className="mb-7 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Verification email
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-gray-800">
                                    {email}
                                </p>

                            </div>


                            {/* OTP Form */}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                            >

                                <label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Verification code
                                </label>


                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    placeholder="000000"

                                    className={`
                                        h-16
                                        w-full
                                        rounded-xl
                                        border
                                        bg-white
                                        px-4
                                        text-center
                                        text-3xl
                                        font-semibold
                                        tracking-[0.5em]
                                        text-gray-900
                                        outline-none
                                        transition

                                        placeholder:text-gray-300
                                        placeholder:tracking-[0.4em]

                                        focus:border-[#f27c0b]
                                        focus:ring-4
                                        focus:ring-orange-100

                                        ${errors.otp
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300"
                                        }
                                    `}

                                    {...register("otp", {

                                        required: "Verification code is required",

                                        minLength: {
                                            value: 6,
                                            message: "OTP must contain 6 digits"
                                        },

                                        maxLength: {
                                            value: 6,
                                            message: "OTP must contain 6 digits"
                                        },

                                        pattern: {
                                            value: /^\d{6}$/,
                                            message: "OTP must contain only 6 digits"
                                        }

                                    })}
                                />


                                {errors.otp && (

                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.otp.message}
                                    </p>

                                )}


                                {/* Verify button */}

                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}

                                    className="
                                        mt-6
                                        h-12
                                        w-full
                                        rounded-lg
                                        bg-[#f27c0b]
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition

                                        hover:bg-[#df7008]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {isSubmitting
                                        ? "Verifying..."
                                        : "Verify email"
                                    }

                                </button>

                            </form>


                            {/* Resend */}

                            <div className="mt-7 text-center">

                                {resendMessage && (

                                    <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                                        {resendMessage}
                                    </p>

                                )}


                                {resendError && (

                                    <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                        {resendError}
                                    </p>

                                )}


                                {timer > 0 ? (

                                    <p className="text-sm text-gray-500">

                                        Didn't receive the code?

                                        <span className="ml-1 font-medium text-gray-700">
                                            Resend in {timer}s
                                        </span>

                                    </p>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={resendOtp}
                                        disabled={resendLoading}

                                        className="
                                            text-sm
                                            font-semibold
                                            text-[#f27c0b]
                                            transition
                                            hover:text-[#d96d05]
                                            disabled:opacity-50
                                        "
                                    >

                                        {resendLoading
                                            ? "Sending new code..."
                                            : "Resend verification code"
                                        }

                                    </button>

                                )}

                            </div>


                            {/* Back */}

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="
                                    mx-auto
                                    mt-8
                                    block
                                    text-sm
                                    text-gray-500
                                    transition
                                    hover:text-gray-800
                                "
                            >
                                ← Back to registration
                            </button>

                        </div>

                    </div>

                </div>


                {/* ================= RIGHT SIDE ================= */}

                <div className="relative hidden overflow-hidden bg-[#f7f7f7] lg:flex lg:w-[55%]">

                    <div className="flex w-full flex-col justify-center px-16 xl:px-24">

                        <div className="max-w-2xl">

                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#f27c0b]">
                                Almost there
                            </p>

                            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#171717] xl:text-6xl">

                                One quick step
                                <br />

                                <span className="text-[#f27c0b]">
                                    and you're in.
                                </span>

                            </h2>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-500">

                                Verify your email address to keep your
                                account secure and start using your
                                HYFIN account.

                            </p>

                        </div>


                        {/* Decorative verification card */}

                        <div className="relative mt-16">

                            <div className="absolute -right-20 -top-10 h-64 w-64 rounded-full bg-orange-100 blur-3xl" />

                            <div className="relative max-w-xl -rotate-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs font-medium text-gray-400">
                                            ACCOUNT SECURITY
                                        </p>

                                        <p className="mt-2 text-xl font-semibold text-gray-800">
                                            Email verification
                                        </p>

                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="h-5 w-5 text-[#f27c0b]"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>

                                    </div>

                                </div>


                                <div className="mt-7 h-2 overflow-hidden rounded-full bg-gray-100">

                                    <div className="h-full w-2/3 rounded-full bg-[#f27c0b]" />

                                </div>


                                <div className="mt-4 flex justify-between text-xs text-gray-400">

                                    <span>
                                        Account created
                                    </span>

                                    <span>
                                        Verify email
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default VerifyEmail;