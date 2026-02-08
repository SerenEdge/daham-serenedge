"use server";

import { Resend } from "resend";

// Initialize Resend with API Key (Needs env variable)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Basic Validation
  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  try {
    // 1. Send Notification Email to Admin
    const adminEmail = await resend.emails.send({
      from: "Portfolio Contact <portfolio@serenedge.com>",
      to: "dahamdissanayake05@gmail.com",
      subject: `New Portfolio Message from ${name}`,
      text: `You got a new messege from Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    if (adminEmail.error) {
      console.error("Admin Email Error:", adminEmail.error);
      const isDomainError = adminEmail.error.message.includes("domain");
      if (isDomainError) {
        return {
          error: `Domain not verified. You must verify 'serenedge.com' in Resend or use 'onboarding@resend.dev'.`,
        };
      }
      return { error: adminEmail.error.message };
    }

    // 2. Send Auto-Reply Email to User
    const userEmail = await resend.emails.send({
      from: "Daham Dissanayake <daham@serenedge.com>",
      to: email,
      subject: "I've received your message!",
      html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Hi ${name},</h2>
                <p>Thanks for reaching out! I've received your message and will get back to you as soon as possible.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>Daham Dissanayake</strong></p>
            </div>
        `,
    });

    if (userEmail.error) {
      console.error("Auto-Reply Error:", userEmail.error);
      // We don't fail the whole request if auto-reply fails, just log it.
    }

    return { success: "Message sent! I'll get back to you soon." };
  } catch (error) {
    console.error("Server Error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
