import {Router} from "express";
import * as authController from "../controllers/authController.js"

const authRouter = Router();

authRouter.post("/register",authController.register);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/resend-otp",authController.resendOtp);
export default authRouter;