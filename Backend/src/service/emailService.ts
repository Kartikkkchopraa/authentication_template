import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
});


transporter.verify((error, success) => { 
    if(error) {
        console.log(error);
    } else {
        console.log("Ready to send emails");
    }
});

export const sendEmail = async (to : string, subject:string, text:string, html:string) => {
    const mailOptions = {
        from: config.GOOGLE_USER,
        to,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export default transporter;
