import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_SMTP_USERNAME'),
        pass: this.configService.get<string>('MAIL_SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: any[],
  ) {
    try {
      const mailOptions = {
        from: `Moneystitch ${this.configService.get<string>('MAIL_SMTP_FROM')}`,
        to,
        subject,
        text,
        html,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully', result.messageId);
      return result;
    } catch (error) {
      console.log('Error sending email', error);
      throw error;
    }
  }

  // VERIFICATION EMAIL
  async sendVerificationEmail(user: User, token: string) {
    // Get user's first name or fallback to full name or email
    const userName = user.firstname || user.email.split('@')[0];

    const subject = `🤗 Welcome ${userName}  - Please Verify Your Email`;

    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${token}`;

    const text = `
Hello ${userName},

Welcome to Moneystitch! 

To complete your registration and secure your account, please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 24 hours for security reasons.

If you didn't create an account with us, please ignore this email.

Best regards,
The Moneystitch Team

---
Need help? Contact us at support@themoneystitch.com
    `.trim();

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Moneystitch</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName}! 👋</h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        Thank you for joining Moneystitch! To get started and secure your account, we need to verify your email address.
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: #ffffff; padding: 16px 32px; text-decoration: none; 
                                  border-radius: 8px; font-weight: 600; font-size: 16px; 
                                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                                  transition: all 0.3s ease;">
                            ✉️ Verify My Email Address
                        </a>
                    </div>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                            <strong>⏰ Important:</strong> This verification link will expire in <strong>24 hours</strong> for security reasons.
                        </p>
                    </div>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                        If the button above doesn't work, you can copy and paste this link into your browser:
                    </p>
                    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; word-break: break-all; font-size: 14px; color: #666666; margin: 10px 0 0 0;">
                        ${verificationUrl}
                    </p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 14px; margin: 0 0 15px 0;">
                        If you didn't create an account with Moneystitch, you can safely ignore this email.
                    </p>
                    <p style="color: #999999; font-size: 14px; margin: 0;">
                        Need help? Contact us at <a href="mailto:support@themoneystitch.com" style="color: #667eea; text-decoration: none;">support@themoneystitch.com</a>
                    </p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="color: #cccccc; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} Moneystitch. All rights reserved.
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // OVERRIDE THE DEFAULT SEND MAIL
    const customMailOptions = {
      from: `Moneystitch Accounts ${this.configService.get<string>('MAIL_SMTP_FROM_ACCOUNTS')}`,
      to: user.email,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(customMailOptions);
  }

  // PASSWORD RESET EMAIL
  async sendPasswordResetEmail(user: User, resetToken: string) {
    const subject = '🔐 Password Reset Request';

    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    // Get user's first name or fallback to full name or email
    const userName = user.firstname || user.email.split('@')[0];

    const text = `
Hello ${userName},

We received a request to reset your password for your account.

To reset your password, please click the link below:

${resetUrl}

This password reset link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

For security reasons, if you continue to receive these emails without requesting them, please contact our support team immediately.

Best regards,
The Moneystitch Security Team

---
Need help? Contact us at support@themoneystitch.com
    `.trim();

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request - Moneystitch</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName}! 👋</h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        We received a request to reset your password for your Moneystitch account. No worries, it happens to the best of us!
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); 
                                  color: #ffffff; padding: 16px 32px; text-decoration: none; 
                                  border-radius: 8px; font-weight: 600; font-size: 16px; 
                                  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
                                  transition: all 0.3s ease;">
                            🔑 Reset My Password
                        </a>
                    </div>
                    
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                            <strong>⏰ Important:</strong> This password reset link will expire in <strong>1 hour</strong> for security reasons.
                        </p>
                    </div>
                    
                    <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #721c24; font-size: 14px;">
                            <strong>🛡️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                        </p>
                    </div>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                        If the button above doesn't work, you can copy and paste this link into your browser:
                    </p>
                    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; word-break: break-all; font-size: 14px; color: #666666; margin: 10px 0 0 0;">
                        ${resetUrl}
                    </p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 14px; margin: 0 0 15px 0;">
                        If you continue to receive password reset emails without requesting them, please contact our support team immediately for security assistance.
                    </p>
                    <p style="color: #999999; font-size: 14px; margin: 0;">
                        Need help? Contact us at <a href="mailto:support@themoneystitch.com" style="color: #e74c3c; text-decoration: none;">support@themoneystitch.com</a>
                    </p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="color: #cccccc; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} Moneystitch. All rights reserved.
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const customMailOptions = {
      from: `Moneystitch Security <${this.configService.get<string>('MAIL_SMTP_FROM_SECURITY')}>`,
      to: user.email,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(customMailOptions);
  }

  // PASSWORD RESET SUCCESS CONFIRMATION EMAIL
  async sendPasswordResetSuccessConfirmationEmail(user: User) {
    const subject = '✅ Password Successfully Updated - Moneystitch';
    // Get user's first name or fallback to full name or email
    const userName = user.firstname || user.email.split('@')[0];

    const text = `
Hello ${userName},

Your Moneystitch account password has been successfully updated!

This email confirms that your password was changed on ${new Date().toLocaleString(
      'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      },
    )}.

SECURITY ALERT: If you did NOT make this change, your account may be compromised. Please contact our security team immediately:

- Email: support@themoneystitch.com

For your account security, we recommend:
- Use a strong, unique password
- Never share your password with anyone
- Always log out from public or shared devices
- Regularly review your account activity

You can now log in to your account using your new password.

Best regards,
The Moneystitch Security Team

---
This is an automated security notification. For assistance, contact support@themoneystitch.com
  `.trim();
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Successfully Updated - Moneystitch</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
              <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName}! 👋</h2>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                      Great news! Your account password has been successfully updated and your account is now secure.
                  </p>
                  
                  <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #155724; font-size: 14px;">
                          <strong>🕐 Password Changed:</strong> ${new Date().toLocaleString(
                            'en-US',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            },
                          )}
                      </p>
                  </div>
                  
                  <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #721c24; font-size: 16px; font-weight: 600;">🚨 Security Alert</h3>
                      <p style="margin: 0 0 15px 0; color: #721c24; font-size: 14px; line-height: 1.5;">
                          <strong>If you did NOT make this change, your account may be compromised.</strong> Please contact our security team immediately:
                      </p>
                      <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                          <p style="margin: 0 0 8px 0; color: #721c24; font-size: 14px;">
                              <strong>📧 Email:</strong> <a href="mailto:support@themoneystitch.com" style="color: #dc3545; text-decoration: none;">support@themoneystitch.com</a>
                          </p>
                      </div>
                  </div>
                  
                  <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0d47a1; font-size: 16px; font-weight: 600;">🛡️ Security Best Practices</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #1565c0; font-size: 14px; line-height: 1.6;">
                          <li style="margin-bottom: 8px;"><strong>Use a strong, unique password</strong> - Combine letters, numbers, and symbols</li>
                          <li style="margin-bottom: 8px;"><strong>Never share your password</strong> - Keep your credentials private</li>
                          <li style="margin-bottom: 8px;"><strong>Log out from shared devices</strong> - Always sign out on public computers</li>
                          <li style="margin-bottom: 0;"><strong>Monitor account activity</strong> - Regularly check for suspicious activity</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 35px 0;">
                      <a href="${this.configService.get<string>('FRONTEND_URL')}/login" 
                         style="display: inline-block; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); 
                                color: #ffffff; padding: 16px 32px; text-decoration: none; 
                                border-radius: 8px; font-weight: 600; font-size: 16px; 
                                box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
                                transition: all 0.3s ease;">
                          🔐 Login to Your Account
                      </a>
                  </div>
                  
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      You can now securely access your Moneystitch account using your new password.
                  </p>
              </td>
          </tr>
          <tr>
              <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #999999; font-size: 14px; margin: 0 0 15px 0;">
                      This is an automated security notification to keep your account safe.
                  </p>
                  <p style="color: #999999; font-size: 14px; margin: 0;">
                      Questions or concerns? Contact us at <a href="mailto:support@themoneystitch.com" style="color: #27ae60; text-decoration: none;">support@themoneystitch.com</a>
                  </p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                      <p style="color: #cccccc; font-size: 12px; margin: 0;">
                          © ${new Date().getFullYear()} Moneystitch. All rights reserved.
                      </p>
                  </div>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
    const customMailOptions = {
      from: `Moneystitch Security <${this.configService.get<string>('MAIL_SMTP_FROM_SECURITY')}>`,
      to: user.email,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(customMailOptions);
  }

  // SEND DATA EXPORT FILE EMAIL
  async sendDataExport(user: User, attachments: any[]) {
    const subject = '💰 Your MoneyStitch Data Export is Ready';
    const userName = user.firstname || user.email.split('@')[0];
    const exportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const currentYear = new Date().getFullYear();

    // Plain text version (fallback for email clients that don't support HTML)
    const text = `
Hi ${userName},

Your MoneyStitch data export has been successfully generated and is attached to this email.

Export Details:
- Export Date: ${exportDate}
- Format: Excel Spreadsheet
- File Size: ${attachments[0]?.content ? (attachments[0].content.length / 1024).toFixed(2) : 'N/A'} KB

The attached file contains your profile information in an easy-to-read format.

Important: This file contains sensitive personal information. Please keep it secure and delete it after reviewing if you no longer need it.

If you have any questions or didn't request this export, please contact our support team immediately at support@moneystitch.com.

Best regards,
The MoneyStitch Team

© ${currentYear} MoneyStitch. All rights reserved.
    `.trim();

    // HTML version (beautiful formatted email)
    const html = this.getDataExportEmailTemplate(
      userName,
      exportDate,
      currentYear,
    );

    const customMailOptions = {
      from: `MoneyStitch Accounts <${this.configService.get<string>('MAIL_SMTP_FROM_ACCOUNTS')}>`,
      to: user.email,
      subject,
      text,
      html,
      attachments,
    };

    return this.transporter.sendMail(customMailOptions);
  }

  // Email HTML Template
  private getDataExportEmailTemplate(
    userName: string,
    exportDate: string,
    currentYear: number,
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Export Ready</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2ECC71 0%, #27ae60 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      color: #ffffff;
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #333333;
      margin: 0 0 20px;
    }
    .message {
      font-size: 14px;
      color: #666666;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #2ECC71;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box-title {
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      margin: 0 0 10px;
    }
    .info-box-content {
      font-size: 13px;
      color: #666666;
      line-height: 1.6;
      margin: 0;
    }
    .warning-box {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box p {
      margin: 0;
      font-size: 13px;
      color: #856404;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 0 0 10px;
      color: #999999;
      font-size: 12px;
    }
    .footer a {
      color: #2ECC71;
      text-decoration: none;
    }
    .attachment-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-color: #2ECC71;
      border-radius: 8px;
      text-align: center;
      line-height: 40px;
      margin-right: 10px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>💰 MoneyStitch</h1>
              <p>Your Data Export is Ready</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              <p class="greeting">Hi ${userName},</p>
              
              <p class="message">
                Your MoneyStitch data export has been successfully generated and is attached to this email.
              </p>

              <div class="info-box">
                <p class="info-box-title">📦 Export Details</p>
                <p class="info-box-content">
                  <strong>Export Date:</strong> ${exportDate}<br>
                  <strong>Format:</strong> Excel Spreadsheet (.xlsx)<br>
                  <strong>Contents:</strong> Profile Information
                </p>
              </div>

              <p class="message">
                The attached file contains all your personal data in an easy-to-read Excel format. You can open it with Microsoft Excel, Google Sheets, or any compatible spreadsheet application.
              </p>

              <div class="warning-box">
                <p>
                  <strong>⚠️ Important:</strong> This file contains sensitive personal information. Please keep it secure and delete it after reviewing if you no longer need it.
                </p>
              </div>

              <p class="message">
                If you have any questions or didn't request this export, please contact our support team immediately.
              </p>

              <p class="message" style="margin-top: 30px;">
                Best regards,<br>
                <strong>The MoneyStitch Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>© ${currentYear} MoneyStitch. All rights reserved.</p>
              <p>
                Need help? Contact us at 
                <a href="mailto:support@moneystitch.com">support@moneystitch.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
