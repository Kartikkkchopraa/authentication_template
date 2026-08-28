import { Request, Response } from "express";
import { pool } from "../config/database.js";
import argon2  from "argon2";
import { generateOtp, getOtpHtml } from "../utils/mailUtils.js";
import { sendEmail } from "../service/emailService.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {randomUUID} from "crypto";

interface RegisterBody{
    username: string;
    email: string;
    password: string;
}

export async function register(req : Request,res : Response) : Promise<void> {

    const user: RegisterBody = req.body;

    const resultEmail = await pool.query("Select id from users where email = $1 " ,[user.email]);

    

    if(resultEmail.rows.length > 0){

        console.log(resultEmail.rows);

        res.status(409).json({
            message: "EMAIL_ALREADY_EXIST"
        })

        return;
    };


    const resultUsername = await pool.query("Select id from users where username = $1",[user.username]);

    

    if(resultUsername.rows.length > 0){
        console.log(resultUsername.rows);

        res.status(409).json({
            message: "USERNAME_ALREADY_EXIST"
        })

        return;
    }

    const hashedPassword = await argon2.hash(user.password);

   const result =  await pool.query("Insert into users (username,email,password_hash) values ($1,$2,$3) returning id, username, email, email_verified", [user.username,user.email,hashedPassword]);


   const newUser = result.rows[0];

   const otp = generateOtp();
   const html = getOtpHtml(otp);

   const otpHash = await argon2.hash(otp);

   
   
   const response = await pool.query("insert into Otp (user_id, otp_hash, expires_at) values ($1, $2, NOW() + INTERVAL '2 minutes') returning expires_at ", [newUser.id,otpHash]);

   const expiryTime = response.rows[0].expires_at;

    await sendEmail(newUser.email, "Verify your email", `Your OTP is ${otp}`, html);


   res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        email_verified: newUser.email_verified,
        expiryTime: expiryTime
   })
   
}

export async function verifyEmail(req: Request, res: Response): Promise<void>{

    const {otp, email} = req.body;

    
    const registeredUser = await pool.query("select id, email_verified from users where email = $1", [email]);

    if(registeredUser.rows.length === 0){
        res.status(404).json({
            message: "EMAIL_DOESNOT_EXISTS"
        });

        return;
    }


    if (registeredUser.rows[0].email_verified) {
        res.status(409).json({
            message: "EMAIL_ALREADY_VERIFIED"
        });

        return;
    }

    const userId = registeredUser.rows[0].id;


    const result = await pool.query(
        `SELECT *
        FROM otp
        WHERE user_id = $1
        AND used = false
        AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1`,
        [userId]
    );

    if (result.rows.length === 0) {
        res.status(400).json({
            message: "OTP_EXPIRED"
        });

        return;
    }

    const otpRecord = result.rows[0];

    const isValid = await argon2.verify(otpRecord.otp_hash,otp);
    
    if(!isValid){
        res.status(400).json({
            message: "INVALID_OTP"
        })

        return;
    };

    await pool.query("delete from Otp where id = $1", [otpRecord.id]);

    await pool.query("update users set email_verified = true where id = $1" ,[otpRecord.user_id]);


    res.status(200).json({
        message: "EMAIL_VERIFIED"
    })
}

export async function resendOtp(req: Request, res: Response): Promise<void> {

    const { email } = req.body;

    if (typeof email !== "string") {
        res.status(400).json({
            message: "INVALID_EMAIL"
        });

        return;
    }

    const result = await pool.query(
        "SELECT id, email_verified FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        res.status(404).json({
            message: "EMAIL_DOES_NOT_EXIST"
        });

        return;
    }

    const user = result.rows[0];

    if (user.email_verified) {
        res.status(409).json({
            message: "EMAIL_ALREADY_VERIFIED"
        });

        return;
    }

    const otp = generateOtp();
    const otpHash = await argon2.hash(otp);
    const html = getOtpHtml(otp);

    await pool.query(
        "DELETE FROM otp WHERE user_id = $1",
        [user.id]
    );

    const response = await pool.query(
        `INSERT INTO otp
            (user_id, otp_hash, expires_at)
         VALUES
            ($1, $2, NOW() + INTERVAL '2 minutes') returning expires_at`,
        [user.id, otpHash]
    );

    const expiryTime = response.rows[0].expires_at;

    await sendEmail(
        email,
        "Verify your email",
        `Your OTP is ${otp}`,
        html
    );

    res.status(200).json({
        message: "OTP_SENT",
        expiryTime: expiryTime
    });
}

export async function login(req: Request, res: Response) : Promise<void>{

    const {email, password} = req.body;

    
    const result = await pool.query("Select * from users where email = $1" , [email]);

    if(result.rows.length === 0){
        res.status(404).json({
            message: "USER_NOT_REGISTERED"
        })

        return;
    }

    const isVerified = result.rows[0].email_verified;

    if(!isVerified){
        res.status(401).json({
            message: "EMAIL_NOT_VERIFIED"
        })
        return;
    }

    const hashedPassword = result.rows[0].password_hash;

    const isValid = await argon2.verify(hashedPassword, password);

    if(!isValid){
        res.status(401).json({
            message: "WRONG_PASSWORD"
        })
        return;
    }

    const userId = result.rows[0].id;
    
    

    const sessionId = randomUUID();

    const refreshToken = jwt.sign(
        {
            userId,
            sessionId
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const refreshTokenHash = await argon2.hash(refreshToken);

    await pool.query(
        `INSERT INTO sessions
            (id, user_id, refresh_token_hash, expires_at, ip_address, user_agent)
        VALUES
            ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5)`,
        [
            sessionId,
            userId,
            refreshTokenHash,
            req.ip,
            req.get("user-agent")
        ]
    );

    const accessToken = jwt.sign(
        {
            userId,
        },
        config.JWT_SECRET,
        {
            expiresIn : "15m"
        }
    )


    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        secure: false, //becuase we are right now on localHost. True is used for https
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })
    
    res.status(200).json({
        message: "LOGIN_SUCCESSFUL",
        user:{
            username: result.rows[0].username,
            email: email
        },
        accessToken
    })
    

}
