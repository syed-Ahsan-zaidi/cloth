import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, subject, message } = await req.json();

  if (!firstName || !email || !message) {
    return NextResponse.json({ error: "Fields missing" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"ClothHaus Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `[ClothHaus] ${subject} — ${firstName} ${lastName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e11d48;">New Contact Message</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding:8px 0; color:#6b7280; width:120px;">Name</td><td style="padding:8px 0; font-weight:600;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0; color:#6b7280;">Email</td><td style="padding:8px 0;">${email}</td></tr>
          <tr><td style="padding:8px 0; color:#6b7280;">Phone</td><td style="padding:8px 0;">${phone || "—"}</td></tr>
          <tr><td style="padding:8px 0; color:#6b7280;">Subject</td><td style="padding:8px 0;">${subject}</td></tr>
        </table>
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:16px 0;" />
        <p style="color:#374151; white-space: pre-line;">${message}</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
