// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter;

//   constructor() {
//     this.createTransport();
//   }

//   private createTransport() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//   }

//   async sendTempPassword(
//     email: string,
//     tempPassword: string,
//   ) {
//     return this.transporter.sendMail({
//       from: `"HRMS System" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Your Temporary Password - HRMS Login',

//       html: `
//         <div style="
//           font-family: Arial, sans-serif;
//           background: #f4f6f9;
//           padding: 30px;
//         ">

//           <div style="
//             max-width: 500px;
//             margin: auto;
//             background: #ffffff;
//             border-radius: 10px;
//             padding: 25px;
//             box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           ">

//             <h2 style="
//               text-align: center;
//               color: #2c3e50;
//               margin-bottom: 10px;
//             ">
//               🔐 HRMS Security Alert
//             </h2>

//             <p style="text-align:center; color:#555;">
//               Your temporary login credentials have been generated.
//             </p>

//             <hr style="margin: 20px 0;" />

//             <p style="color:#333;">
//               Hello 👋,
//             </p>

//             <p style="color:#555; line-height:1.6;">
//               Use the temporary password below to log in to your HRMS account.
//               You will be required to change it after first login.
//             </p>

//             <div style="
//               text-align:center;
//               margin: 25px 0;
//               padding: 15px;
//               background: #f1f1f1;
//               border-radius: 8px;
//               border: 1px dashed #ccc;
//             ">
//               <p style="margin:0; color:#888;">
//                 Temporary Password
//               </p>

//               <h2 style="
//                 letter-spacing: 4px;
//                 color: #e74c3c;
//                 margin: 10px 0 0 0;
//               ">
//                 ${tempPassword}
//               </h2>
//             </div>

//             <p style="color:#e67e22; font-weight:bold;">
//               ⚠️ Important:
//             </p>

//             <ul style="color:#555; line-height:1.6;">
//               <li>This password is valid for first login only</li>
//               <li>Do not share this password with anyone</li>
//               <li>Change your password immediately after login</li>
//             </ul>

//             <div style="text-align:center; margin-top:25px;">
//               <p style="font-size:12px; color:#999;">
//                 © HRMS System | Secure Authentication
//               </p>
//             </div>

//           </div>
//         </div>
//       `,
//     });
//   }

//   async sendOtp(
//     email: string,
//     otp: string,
//   ) {
//     return this.transporter.sendMail({
//       from: `"HRMS System" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Forgot Password OTP',

//       html: `
//         <div style="
//           font-family: Arial, sans-serif;
//           background: #f4f6f9;
//           padding: 30px;
//         ">

//           <div style="
//             max-width: 500px;
//             margin: auto;
//             background: #ffffff;
//             border-radius: 10px;
//             padding: 25px;
//             box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           ">

//             <h2 style="
//               text-align:center;
//               color:#2c3e50;
//             ">
//               🔑 Password Reset OTP
//             </h2>

//             <p style="
//               text-align:center;
//               color:#555;
//             ">
//               Use the OTP below to reset your password.
//             </p>

//             <div style="
//               text-align:center;
//               margin:25px 0;
//               padding:15px;
//               background:#f1f1f1;
//               border-radius:8px;
//               border:1px dashed #ccc;
//             ">
//               <p style="margin:0;color:#888;">
//                 Your OTP
//               </p>

//               <h1 style="
//                 color:#e74c3c;
//                 letter-spacing:6px;
//                 margin:10px 0;
//               ">
//                 ${otp}
//               </h1>
//             </div>

//             <p style="
//               color:#e67e22;
//               font-weight:bold;
//             ">
//               ⚠️ This OTP expires in 3 minutes.
//             </p>

//             <p style="
//               color:#555;
//               line-height:1.6;
//             ">
//               If you did not request a password reset,
//               please ignore this email.
//             </p>

//             <div style="text-align:center; margin-top:25px;">
//               <p style="font-size:12px; color:#999;">
//                 © HRMS System | Secure Authentication
//               </p>
//             </div>

//           </div>
//         </div>
//       `,
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.password');
    this.fromAddress = user || '';

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  async sendTempPassword(email: string, tempPassword: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: 'Your Temporary Password - HRMS Login',
      html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;
                      padding:25px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
            <h2 style="text-align:center;color:#2c3e50;">🔐 HRMS Security Alert</h2>
            <p style="text-align:center;color:#555;">Your temporary login credentials have been generated.</p>
            <hr style="margin:20px 0;"/>
            <p style="color:#555;line-height:1.6;">
              Use the temporary password below to log in. You will be required to change it after first login.
            </p>
            <div style="text-align:center;margin:25px 0;padding:15px;background:#f1f1f1;
                        border-radius:8px;border:1px dashed #ccc;">
              <p style="margin:0;color:#888;">Temporary Password</p>
              <h2 style="letter-spacing:4px;color:#e74c3c;margin:10px 0 0 0;">${tempPassword}</h2>
            </div>
            <p style="color:#e67e22;font-weight:bold;">⚠️ Important:</p>
            <ul style="color:#555;line-height:1.6;">
              <li>This password is valid for first login only</li>
              <li>Do not share this password with anyone</li>
              <li>Change your password immediately after login</li>
            </ul>
            <div style="text-align:center;margin-top:25px;">
              <p style="font-size:12px;color:#999;">© HRMS System | Secure Authentication</p>
            </div>
          </div>
        </div>`,
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: 'Your Password Reset OTP - HRMS',
      html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;
                      padding:25px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
            <h2 style="text-align:center;color:#2c3e50;">🔑 Password Reset OTP</h2>
            <p style="text-align:center;color:#555;">Use the OTP below to reset your password.</p>
            <div style="text-align:center;margin:25px 0;padding:15px;background:#f1f1f1;
                        border-radius:8px;border:1px dashed #ccc;">
              <p style="margin:0;color:#888;">Your OTP</p>
              <h1 style="color:#e74c3c;letter-spacing:6px;margin:10px 0;">${otp}</h1>
            </div>
            <p style="color:#e67e22;font-weight:bold;">⚠️ This OTP expires in 3 minutes.</p>
            <p style="color:#555;line-height:1.6;">
              If you did not request a password reset, please ignore this email.
            </p>
            <div style="text-align:center;margin-top:25px;">
              <p style="font-size:12px;color:#999;">© HRMS System | Secure Authentication</p>
            </div>
          </div>
        </div>`,
    });
  }
}
