import nodemailer from 'nodemailer';

// List of disposable/fake email domains to reject
const DISPOSABLE_DOMAINS = new Set([
  'fake.com', 'test.com', 'example.com', 'tempmail.com', 'mailinator.com',
  '10minutemail.com', 'dispostable.com', 'guerrillamail.com', 'trashmail.com',
  'yopmail.com', 'sharklasers.com', 'throwawaymail.com', 'fake.org', 'test.org',
  'asdf.com', 'qwerty.com', 'mail.com', 'disposable.com', 'getnada.com', 'temp-mail.org'
]);

// Valid TLD regex check
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates whether an email address is syntactically valid and not a fake/disposable address.
 */
export function validateRealEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email address is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  // 1. Regex Syntax Check
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, reason: 'Please enter a valid email format (e.g., name@gmail.com).' };
  }

  // 2. Extract domain
  const domain = trimmed.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return { valid: false, reason: 'Email domain is incomplete or invalid.' };
  }

  // 3. Disposable / Fake Domain Check
  if (DISPOSABLE_DOMAINS.has(domain) || domain.startsWith('fake') || domain.startsWith('test')) {
    return { valid: false, reason: `The domain "${domain}" is not accepted. Please use a real email provider (e.g. Gmail, Outlook, Yahoo, or your company email).` };
  }

  return { valid: true, email: trimmed };
}

// Nodemailer Transporter Initialization
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Use custom SMTP if configured via ENV, otherwise fallback to Ethereal Mail
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test Ethereal SMTP account automatically for real preview links
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`📧 Ethereal Test Email Account created: ${testAccount.user}`);
    } catch (err) {
      console.error("Failed to create Ethereal test mail account, using json transport", err);
      transporter = nodemailer.createTransport({ jsonTransport: true });
    }
  }

  return transporter;
}

/**
 * Sends a real registration confirmation email to the user.
 */
export async function sendWelcomeEmail(toEmail, username) {
  try {
    const mailTransporter = await getTransporter();

    const info = await mailTransporter.sendMail({
      from: '"SQL Play Platform" <no-reply@sqlplay.io>',
      to: toEmail,
      subject: '🎉 Welcome to SQL Play! Confirm Your Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf8fe; padding: 20px; border-radius: 16px; border: 1px solid #e9d5ff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e9d5ff;">
            <h1 style="color: #6d28d9; margin: 0;">SQL PLAY</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Interactive SQL Coding & Practice Platform</p>
          </div>

          <div style="padding: 20px 0; color: #1e1b4b;">
            <h2>Welcome aboard, ${username}! 👋</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">
              Thank you for joining <strong>SQL Play</strong>. Your registration with email <strong>${toEmail}</strong> has been successfully verified!
            </p>

            <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #ddd6fe; margin: 20px 0;">
              <h3 style="color: #7c3aed; margin-top: 0;">🚀 What you can do now:</h3>
              <ul style="color: #334155; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Solve <strong>300+ real-world SQLite database challenges</strong></li>
                <li>Track your daily <strong>Streak</strong> and earn <strong>XP</strong></li>
                <li>Climb the global <strong>Leaderboard</strong> and unlock achievements</li>
                <li>Learn JOINs, CTEs, Aggregations, and Window Functions</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #64748b;">
              Happy querying!<br/>
              <em>The SQL Play Team</em>
            </p>
          </div>
        </div>
      `
    });

    console.log(`✉️ Welcome email sent successfully to ${toEmail} (MessageId: ${info.messageId})`);
    
    let previewUrl = null;
    if (nodemailer.getTestMessageUrl(info)) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 Email Preview Link (Ethereal): ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("Failed to send welcome email:", err);
    return { success: false, error: err.message };
  }
}
