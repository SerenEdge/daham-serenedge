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
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Default Resend testing email
      to: "daham.dissanayake@gmail.com", // Replace with user's actual email if known, or use env var
      subject: `New Message from ${name} (Portfolio)`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { error: "Failed to send message. Please try again." };
    }

    return { success: "Message sent! I'll get back to you soon." };
  } catch (error) {
    console.error("Server Error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
