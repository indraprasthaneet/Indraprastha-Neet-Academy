import sgMail from '@sendgrid/mail'
import dotenv from "dotenv"
dotenv.config()

// 1. Set the API Key using the environment variable from Render
sgMail.setApiKey(process.env.SENDGRID_KEY)


const sendMail = async (to, otp) => {
    // 2. Define the message object
    const msg = {
        to: to, // Recipient email address
        from: process.env.EMAIL || 'your-verified-sender@example.com', // MUST be a verified sender in SendGrid
        subject: "Reset Your Password",
        html: `<p>Your OTP for Password Reset is <b>${otp}</b>. 
               It expires in 5 minutes.</p>`,
    }

    // 3. Send the mail using the HTTP API
    try {
        await sgMail.send(msg)
        console.log('Email sent successfully via SendGrid!')
    } catch (error) {
        console.error('SendGrid Error:', error.response.body)
        // Log the actual error response from SendGrid for debugging
    }
}

export default sendMail