import nodemailer from "nodemailer";
import type { Booking } from "@/app/components/types";

/**
 * Mailer utility for Hotel Grand Eagle.
 * Uses SMTP settings from environment variables.
 */

function getTransporter() {
  const port = Number(process.env.EMAIL_SERVER_PORT) || 587;
  const isSecure = port === 465;
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port,
    secure: isSecure,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface ContactEnquiryEmail {
  name: string;
  email: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  message: string;
  source?: string;
  createdAt?: string;
}

function hasEmailConfig() {
  return Boolean(
    process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorField(error: unknown, field: "code" | "command") {
  return typeof error === "object" && error !== null && field in error
    ? String((error as Record<string, unknown>)[field])
    : "";
}

export async function sendContactEnquiryNotification(enquiry: ContactEnquiryEmail) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER;
  const bccEmail = process.env.BCC_EMAIL;

  if (!hasEmailConfig()) {
    console.warn("[EmailService] Missing email configuration. Contact enquiry saved but email not sent.");
    return false;
  }

  if (!adminEmail || !fromEmail) {
    console.warn("[EmailService] Missing admin/from email. Contact enquiry saved but email not sent.");
    return false;
  }

  const safe = {
    name: escapeHtml(enquiry.name),
    email: escapeHtml(enquiry.email),
    phone: escapeHtml(enquiry.phone || "Not provided"),
    checkIn: escapeHtml(enquiry.checkIn || "Not provided"),
    checkOut: escapeHtml(enquiry.checkOut || "Not provided"),
    guests: escapeHtml(enquiry.guests || "Not provided"),
    message: escapeHtml(enquiry.message),
    source: escapeHtml(enquiry.source || "Website contact form"),
    createdAt: escapeHtml(enquiry.createdAt || new Date().toISOString()),
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #D4A857; margin: 0; font-size: 24px;">New Contact Enquiry</h1>
        <p style="color: #666; font-size: 14px;">Hotel Grand Eagle website enquiry</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #777; width: 140px;">Name:</td><td style="padding: 8px 0; font-weight: bold;">${safe.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Email:</td><td style="padding: 8px 0;">${safe.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Phone:</td><td style="padding: 8px 0;">${safe.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Check-in:</td><td style="padding: 8px 0;">${safe.checkIn}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Check-out:</td><td style="padding: 8px 0;">${safe.checkOut}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Guests:</td><td style="padding: 8px 0;">${safe.guests}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Source:</td><td style="padding: 8px 0;">${safe.source}</td></tr>
        </table>
      </div>
      <div style="margin-bottom: 24px;">
        <p style="color: #777; font-size: 13px; margin-bottom: 8px;">Message:</p>
        <p style="padding: 14px; background: #fff8eb; border-left: 3px solid #D4A857; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safe.message}</p>
      </div>
      <p style="font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 18px;">Received at ${safe.createdAt}</p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      ...(bccEmail ? { bcc: bccEmail } : {}),
      replyTo: enquiry.email,
      subject: `New enquiry from ${enquiry.name} - Hotel Grand Eagle`,
      html: htmlContent,
      text: `New contact enquiry\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone || "Not provided"}\nCheck-in: ${enquiry.checkIn || "Not provided"}\nCheck-out: ${enquiry.checkOut || "Not provided"}\nGuests: ${enquiry.guests || "Not provided"}\nMessage: ${enquiry.message}`,
    });
    console.log(`[EmailService] Contact enquiry email sent for ${enquiry.email}`);
    return true;
  } catch (error: unknown) {
    console.error("[EmailService] Failed to send contact enquiry email:", getErrorMessage(error));
    return false;
  }
}

export async function sendAdminBookingNotification(booking: Booking) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER;
  const bccEmail = process.env.BCC_EMAIL;

  // Verify core configuration
  const requiredEnv = [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD'
  ];

  const missing = requiredEnv.filter(k => !process.env[k]);

  if (missing.length > 0) {
    console.warn(`[EmailService] Missing required configuration: ${missing.join(', ')}. Skipping notification.`);
    return;
  }

  if (!adminEmail) {
    console.warn("[EmailService] No ADMIN_EMAIL or EMAIL_SERVER_USER configured. Skipping notification.");
    return;
  }

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D4A857; margin: 0; font-size: 24px;">New Booking Received</h1>
        <p style="color: #666; font-size: 14px;">Hotel Grand Eagle – Administration Alert</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0; color: #D4A857;">Booking Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #777; width: 150px;">Reference:</td>
            <td style="padding: 8px 0; font-weight: bold;">${booking.bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Guest Name:</td>
            <td style="padding: 8px 0;">${booking.guestName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Contact:</td>
            <td style="padding: 8px 0;">${booking.guestPhone} / ${booking.guestEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Dates:</td>
            <td style="padding: 8px 0;">${checkInDate} to <br/>${checkOutDate} (${booking.nights} nights)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Room:</td>
            <td style="padding: 8px 0;">${booking.roomTypeName} ${booking.roomNumber ? `(Room ${booking.roomNumber})` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 20px 0 8px; color: #777; font-size: 16px;">Total Amount:</td>
            <td style="padding: 20px 0 8px; font-size: 20px; font-weight: bold; color: #D4A857;">₹${booking.grandTotal?.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      ${booking.specialRequests ? `
      <div style="margin-bottom: 25px;">
        <p style="color: #777; font-size: 13px; margin-bottom: 5px;">Special Requests:</p>
        <p style="padding: 10px; background: #fff8eb; border-left: 3px solid #D4A857; font-style: italic; font-size: 14px; margin: 0;">"${booking.specialRequests}"</p>
      </div>
      ` : ""}

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">This is an automated notification from your property management system.</p>
      </div>
    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      ...(bccEmail ? { bcc: bccEmail } : {}),
      subject: `New Booking: ${booking.guestName} (${booking.bookingRef})`,
      html: htmlContent,
      text: `New booking received from ${booking.guestName}. Ref: ${booking.bookingRef}. Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}, Room: ${booking.roomTypeName}, Total: ₹${booking.grandTotal}.`,
    });
    console.log(`[EmailService] Notification sent for booking ${booking.bookingRef}`);
  } catch (error: unknown) {
    console.error(`[EmailService] Failed to send notification for ${booking.bookingRef}:`);
    console.error("Error details:", getErrorMessage(error));
    const code = getErrorField(error, "code");
    const command = getErrorField(error, "command");
    if (code) console.error("Error code:", code);
    if (command) console.error("SMTP Command:", command);
    // We don't throw the error, allowing the caller (API route) to stay successful
  }
}

/** Send a booking confirmation email to the guest who just booked. */
export async function sendGuestBookingConfirmation(booking: Booking) {
  const guestEmail = booking.guestEmail;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER;
  const bccEmail = process.env.BCC_EMAIL;

  if (!hasEmailConfig()) {
    console.warn("[EmailService] Missing email config. Skipping guest confirmation.");
    return false;
  }

  if (!guestEmail) {
    console.warn("[EmailService] No guest email found. Skipping guest confirmation.");
    return false;
  }

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 620px; margin: 0 auto; background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #D4A857; margin: 0; font-size: 28px; letter-spacing: 2px;">HOTEL GRAND EAGLE</h1>
        <p style="color: #aaa; margin: 8px 0 0; font-size: 13px; letter-spacing: 1px;">SITAPURA &middot; JAIPUR</p>
        <div style="margin-top: 20px;">
          <span style="background: #D4A857; color: #1a1a2e; font-weight: bold; padding: 6px 18px; border-radius: 20px; font-size: 13px;">&#10003; BOOKING CONFIRMED</span>
        </div>
      </div>

      <!-- Greeting -->
      <div style="padding: 30px 30px 10px;">
        <p style="font-size: 18px; color: #333; margin: 0;">Dear <strong>${escapeHtml(booking.guestName)}</strong>,</p>
        <p style="color: #666; font-size: 14px; line-height: 1.7; margin-top: 10px;">Thank you for choosing Hotel Grand Eagle! Your reservation has been confirmed. We look forward to welcoming you.</p>
      </div>

      <!-- Booking Details Box -->
      <div style="margin: 10px 30px 20px; background: #f9f5ee; border-left: 4px solid #D4A857; border-radius: 8px; padding: 20px 24px;">
        <h2 style="color: #D4A857; font-size: 15px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Booking Summary</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #888; width: 160px;">Booking Reference</td><td style="padding: 6px 0; font-weight: bold; color: #333;">${escapeHtml(String(booking.bookingRef))}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Room Type</td><td style="padding: 6px 0; color: #333;">${escapeHtml(booking.roomTypeName || "")}</td></tr>
          ${booking.roomNumber ? `<tr><td style="padding: 6px 0; color: #888;">Room Number</td><td style="padding: 6px 0; color: #333;">${escapeHtml(String(booking.roomNumber))}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #888;">Check-in</td><td style="padding: 6px 0; color: #333;">${checkInDate} <span style="color:#D4A857;">(from 3:00 PM)</span></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Check-out</td><td style="padding: 6px 0; color: #333;">${checkOutDate} <span style="color:#D4A857;">(by 12:00 PM)</span></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Duration</td><td style="padding: 6px 0; color: #333;">${booking.nights} Night${booking.nights > 1 ? "s" : ""}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Guests</td><td style="padding: 6px 0; color: #333;">${booking.adults} Adult${booking.adults > 1 ? "s" : ""}${booking.children ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}` : ""}</td></tr>
          <tr style="border-top: 1px solid #e0d5c5;"><td style="padding: 14px 0 6px; color: #888; font-size: 15px;">Total Amount</td><td style="padding: 14px 0 6px; font-size: 20px; font-weight: bold; color: #D4A857;">&#8377;${(booking.grandTotal || 0).toLocaleString("en-IN")}</td></tr>
        </table>
      </div>

      ${booking.specialRequests ? `
      <div style="margin: 0 30px 20px; padding: 14px 18px; background: #fff8eb; border-radius: 8px; font-size: 13px; color: #666; font-style: italic;">
        <strong style="color: #D4A857;">Your Special Request:</strong> "${escapeHtml(booking.specialRequests)}"
      </div>` : ""}

      <!-- Hotel Info -->
      <div style="margin: 0 30px 30px; padding: 18px; background: #f0f4ff; border-radius: 8px; font-size: 13px; color: #555;">
        <p style="margin: 0 0 8px; font-weight: bold; color: #333;">&#128205; Hotel Address</p>
        <p style="margin: 0 0 10px;">Commercial Complex, C-50, near JECC, Sanganer, Sitapura Industrial Area, Sitapura, Jaipur, Rajasthan 302022</p>
        <p style="margin: 0;"><strong>&#128222;</strong> 063678 50548 &nbsp;&nbsp; <strong>&#9993;</strong> grandeaglehotel@gmail.com</p>
      </div>

      <!-- Footer -->
      <div style="background: #1a1a2e; padding: 20px 30px; text-align: center;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">Need help? Reply to this email or call us anytime.</p>
        <p style="color: #666; font-size: 11px; margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Hotel Grand Eagle. All rights reserved.</p>
      </div>

    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: fromEmail,
      to: guestEmail,
      ...(bccEmail ? { bcc: bccEmail } : {}),
      subject: `Booking Confirmed ✓ – ${booking.bookingRef} | Hotel Grand Eagle`,
      html: htmlContent,
      text: `Dear ${booking.guestName},\n\nYour booking at Hotel Grand Eagle is confirmed!\n\nBooking Ref: ${booking.bookingRef}\nRoom: ${booking.roomTypeName}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nNights: ${booking.nights}\nTotal: Rs.${(booking.grandTotal || 0).toLocaleString("en-IN")}\n\nAddress: Commercial Complex, C-50, near JECC, Sitapura, Jaipur 302022\nPhone: 063678 50548\n\nThank you for choosing Hotel Grand Eagle!`,
    });
    console.log(`[EmailService] Guest confirmation sent to ${guestEmail} for ${booking.bookingRef}`);
    return true;
  } catch (error: unknown) {
    console.error(`[EmailService] Failed to send guest confirmation for ${booking.bookingRef}:`, getErrorMessage(error));
    return false;
  }
}
