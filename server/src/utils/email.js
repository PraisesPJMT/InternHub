import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API_KEY) console.error("RESEND_API_KEY not set");
if (!process.env.FROM_EMAIL) console.error("FROM_EMAIL not set");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `InternHub <${process.env.FROM_EMAIL}>`;

const baseTemplate = (content) => `
  <div style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05);">

            <tr>
              <td style="background-color:#5c60f8; padding:30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:600;">
                  InternHub
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px 30px;">
                ${content}
              </td>
            </tr>

            <tr>
              <td style="background:#f9f9ff; padding:20px; text-align:center; font-size:13px; color:#777;">
                © ${new Date().getFullYear()} InternHub. All rights reserved.
                <br/>
                If you did not request this email, please ignore it.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (email, firstName) => {
  const content = `
    <h2 style="margin-top:0; color:#111; font-size:22px;">
      Welcome to InternHub, ${firstName} 👋
    </h2>

    <p style="font-size:15px; line-height:1.6; color:#444;">
      We're excited to have you join our platform. InternHub connects students,
      supervisors, and administrators in one streamlined experience.
    </p>

    <p style="font-size:15px; line-height:1.6; color:#444;">
      You can now log in and start exploring opportunities.
    </p>

    <div style="margin:30px 0; text-align:center;">
      <a href="${process.env.FRONTEND_URL}/login"
         style="background:#5c60f8;
                color:#ffffff;
                padding:12px 28px;
                text-decoration:none;
                border-radius:8px;
                font-weight:600;
                display:inline-block;">
        Go to Dashboard
      </a>
    </div>

    <p style="font-size:14px; color:#777;">
      If you have any questions, our support team is always ready to help.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to InternHub!",
    html: baseTemplate(content),
  });
};

export const sendOTPEmail = async (email, otp, type = "verification") => {
  const subject =
    type === "verification"
      ? "Verify Your Email - InternHub"
      : "Password Reset OTP - InternHub";

  const message =
    type === "verification"
      ? "Use the code below to verify your email address."
      : "Use the code below to reset your password.";

  const content = `
    <h2 style="margin-top:0; color:#111; font-size:22px;">
      Secure Verification
    </h2>

    <p style="font-size:15px; line-height:1.6; color:#444;">
      ${message}
    </p>

    <div style="
        background:#f4f6ff;
        padding:25px;
        text-align:center;
        margin:30px 0;
        border-radius:10px;
        border:1px solid #e4e6ff;">
      <span style="
        font-size:32px;
        letter-spacing:8px;
        font-weight:700;
        color:#5c60f8;">
        ${otp}
      </span>
    </div>

    <p style="font-size:14px; color:#777;">
      This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
    </p>
  `;

  await sendEmail({
    to: email,
    subject,
    html: baseTemplate(content),
  });
};

export const sendSupervisorOnboardingEmail = async (
  email,
  firstName,
  onboardingLink,
) => {
  const content = `
    <h2 style="margin-top:0; color:#111;">
      Complete Your Account Setup
    </h2>

    <p style="font-size:15px; line-height:1.6; color:#444;">
      Hi ${firstName},
      <br/><br/>
      An administrator has created a supervisor account for you.
      Please set your password to activate your account.
    </p>

    <div style="margin:35px 0; text-align:center;">
      <a href="${onboardingLink}"
         style="background:#5c60f8;
                color:#ffffff;
                padding:14px 30px;
                text-decoration:none;
                border-radius:8px;
                font-weight:600;
                display:inline-block;">
        Set Your Password
      </a>
    </div>

    <p style="font-size:14px; color:#777;">
      This link will expire in 24 hours.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: "Complete Your InternHub Account Setup",
    html: baseTemplate(content),
  });
};

export const sendPasswordResetSuccessEmail = async (email, firstName) => {
  const content = `
    <h2 style="margin-top:0; color:#111;">
      Password Successfully Reset
    </h2>

    <p style="font-size:15px; line-height:1.6; color:#444;">
      Hi ${firstName},
      <br/><br/>
      Your password has been successfully updated.
      If you did not perform this action, contact support immediately.
    </p>

    <div style="margin-top:30px;">
      <p style="font-size:14px; color:#777;">
        Your account security is important to us.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset Successful - InternHub",
    html: baseTemplate(content),
  });
};