import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  citySlug: z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, citySlug, guestCount, message } = parsed.data;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RSVP_FROM_EMAIL;
    const toEmail = process.env.RSVP_TO_EMAIL;

    if (!resendApiKey || !fromEmail || !toEmail) {
      console.error("RSVP route missing Resend environment variables.");
      return NextResponse.json(
        { success: false, message: "Email service is not configured." },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New RSVP from ${name}${citySlug ? ` (${citySlug})` : ""}`,
      html: `
        <h1>New SwingRush RSVP</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${citySlug ? `<p><strong>City:</strong> ${citySlug}</p>` : ""}
        ${guestCount ? `<p><strong>Guests:</strong> ${guestCount}</p>` : ""}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send RSVP email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP route error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405 },
  );
}
