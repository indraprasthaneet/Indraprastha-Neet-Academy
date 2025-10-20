import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();

// 1. Set the API Key using the environment variable from Render
// Note: Assuming your environment variable is correctly named SENDGRID_KEY on Render.
sgMail.setApiKey(process.env.SENDGRID_KEY);


const sendMail = async (to, otp, purpose = 'verification') => {
    
    let subject;
    let htmlContent;

    // Determine subject and content based on the purpose
    if (purpose === 'reset') {
        subject = "Reset Your Password";
        htmlContent = `<p>Your OTP for **Password Reset** is <b>${otp}</b>. 
                       It expires in 5 minutes.</p>`;
    } else { // Defaults to 'verification' or any other value
        subject = "Verify Your Account";
        htmlContent = `<p>Thank you for signing up! Your **Verification OTP** is <b>${otp}</b>. 
                       It expires in 5 minutes.</p>`;
    }

    // 2. Define the message object
    const msg = {
        to: to, // Recipient email address
        from: process.env.EMAIL || 'your-verified-sender@example.com', // MUST be a verified sender in SendGrid
        subject: subject,
        html: htmlContent,
    };

    // 3. Send the mail using the HTTP API
    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully via SendGrid for: ${purpose}!`);
    } catch (error) {
        // Log the actual error response from SendGrid for debugging
        console.error('SendGrid Error:', error.response ? error.response.body : error);
    }
};

export default sendMail;
