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
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #f4f4f5; padding: 24px; border-radius: 8px;">
            <h2 style="margin: 0 0 16px; color: #18181b;">New Contact Form Submission</h2>
            <div style="background: white; padding: 20px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="margin: 24px 0 0; font-size: 12px; color: #71717a; text-align: center;">
              Sent from Portfolio Contact Form
            </p>
          </div>
        </div>
      `,
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
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="margin: 0 0 16px; color: #18181b;">Hi ${name},</h2>
            <p style="line-height: 1.6; margin: 0 0 24px; color: #3f3f46;">
              Thanks for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
              <p style="margin: 0 0 4px; font-weight: 600;">Best regards,</p>
              <p style="margin: 0; color: #71717a;">Daham Dissanayake</p>
            </div>
          </div>
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
