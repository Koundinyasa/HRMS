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

  async sendWelcomeEmail(
    email: string,
    candidateName: string,
    position: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `Welcome to ${position}`,
      text: [
        `Dear ${candidateName},`,
        '',
        `Welcome to ${position}! We are excited to have you join us.`,
        '',
        'Please contact the HR team if you have any questions before your joining date.',
        '',
        'Regards,',
        'HR Team',
      ].join('\n'),
    });
  }

  async sendJoiningEmail(
    email: string,
    candidateName: string,
    position: string,
    joiningDate: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `Joining Details - ${position}`,
      text: [
        `Dear ${candidateName},`,
        '',
        `We are pleased to confirm your joining for ${position} on ${joiningDate}.`,
        '',
        'Please contact the HR team if you have any questions before your joining date.',
        '',
        'Regards,',
        'HR Team',
      ].join('\n'),
    });
  }

  async sendOfferLetter(
    email: string,
    candidateName: string,
    position: string,
    offerReference: string,
    offerLetter: Buffer,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `Offer of Employment - ${position}`,
      text: [
        `Dear ${candidateName},`,
        '',
        `Please find your offer letter attached. Your offer reference is ${offerReference}.`,
        '',
        'Regards,',
        'HR Team',
      ].join('\n'),
      attachments: [
        {
          filename: `${offerReference}.pdf`,
          content: offerLetter,
          contentType: 'application/pdf',
        },
      ],
    });
  }

  async sendInterviewInvitation(
    email: string,
    candidateName: string,
    position: string,
    interviewerName: string,
    scheduledDate: string,
    scheduledTime: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `Interview Invitation - ${position}`,
      text: [
        `Dear ${candidateName},`,
        '',
        `We would like to invite you to interview for the ${position} position.`,
        `Date: ${scheduledDate}`,
        `Time: ${scheduledTime}`,
        `Interviewer: ${interviewerName}`,
        '',
        'Please reply to this email if you have any questions.',
        '',
        'Regards,',
        'HR Team',
      ].join('\n'),
    });
  }

  async sendTeamAssignmentEmail(
    email: string,
    employeeName: string,
    department: string,
    team: string,
    manager: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `Your Team Assignment - ${team}`,
      text: [
        `Dear ${employeeName},`,
        '',
        `You have been assigned to the ${team} team in the ${department} department.`,
        `Your reporting manager is ${manager}.`,
        '',
        'Please contact the HR team if you have any questions.',
        '',
        'Regards,',
        'HR Team',
      ].join('\n'),
    });
  }

 async sendTempPassword(
    email: string,
    tempPassword: string,
    applicationUrl: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: 'Your HRMS Login Credentials',
 
      html: `
<!DOCTYPE html>
<html lang="en">
 
<head>
 
  <meta charset="UTF-8">
 
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
 
  <meta
    name="x-apple-disable-message-reformatting"
  >
 
  <title>HRMS Login Credentials</title>
 
  <style>
 
    /* ==============================
       RESET
    ============================== */
 
    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background: #eef6ff;
    }
 
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
 
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
 
    td {
      padding: 0;
    }
 
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
      max-width: 100%;
    }
 
    a {
      text-decoration: none;
    }
 
 
    /* ==============================
       DESKTOP
    ============================== */
 
    .email-wrapper {
      width: 100%;
      padding: 30px 15px;
    }
 
    .email-container {
      width: 100%;
      max-width: 970px;
      margin: 0 auto;
    }
 
    .header-logo {
      font-size: 46px;
      line-height: 1.1;
    }
 
    .header-tagline {
      font-size: 19px;
      line-height: 1.4;
    }
 
    .hero-title {
      font-size: 42px;
      line-height: 1.2;
    }
 
    .hero-description {
      font-size: 23px;
      line-height: 1.5;
    }
 
    .hello {
      font-size: 32px;
    }
 
    .intro-text {
      font-size: 21px;
      line-height: 1.7;
    }
 
    .credential-label {
      font-size: 17px;
    }
 
    .credential-value {
      font-size: 32px;
    }
 
    .password-value {
      font-size: 38px;
      letter-spacing: 8px;
    }
 
    .application-url {
      font-size: 25px;
      line-height: 1.4;
      word-break: break-word;
      overflow-wrap: anywhere;
    }
 
    .important-title {
      font-size: 28px;
    }
 
    .important-text {
      font-size: 20px;
      line-height: 1.9;
    }
 
 
    /* ==============================
       MOBILE
    ============================== */
 
    @media only screen and (max-width: 600px) {
 
      .email-wrapper {
        padding: 10px 6px !important;
      }
 
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 10px !important;
      }
 
 
      /* ============================
         HEADER
      ============================ */
 
      .header {
        padding: 22px 18px !important;
      }
 
      .header-table {
        width: 100% !important;
      }
 
      .header-logo-cell {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
      }
 
      .header-logo {
        font-size: 36px !important;
        line-height: 1.2 !important;
      }
 
      .header-tagline-cell {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding-top: 8px !important;
      }
 
      .header-tagline {
        font-size: 14px !important;
        line-height: 1.4 !important;
      }
 
 
      /* ============================
         HERO
      ============================ */
 
      .hero-wrapper {
        padding: 12px !important;
      }
 
      .hero-table {
        width: 100% !important;
      }
 
      .hero-content {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 28px 15px 30px 15px !important;
        box-sizing: border-box !important;
      }
 
      .hero-icon {
        width: 90px !important;
        height: 70px !important;
        line-height: 70px !important;
        font-size: 34px !important;
        margin: 0 auto 20px auto !important;
      }
 
      .hero-title {
        font-size: 28px !important;
        line-height: 1.25 !important;
        text-align: center !important;
      }
 
      .hero-description {
        font-size: 17px !important;
        line-height: 1.5 !important;
        margin-top: 12px !important;
        text-align: center !important;
      }
 
 
      /* ============================
         INTRO
      ============================ */
 
      .intro-wrapper {
        padding: 20px !important;
      }
 
      .hello {
        font-size: 26px !important;
        line-height: 1.2 !important;
      }
 
      .intro-text {
        font-size: 16px !important;
        line-height: 1.65 !important;
      }
 
 
      /* ============================
         CREDENTIAL SECTIONS
      ============================ */
 
      .credential-wrapper {
        padding: 16px 20px 0 20px !important;
      }
 
      .credential-table {
        width: 100% !important;
      }
 
      .credential-icon-cell {
        width: 78px !important;
        min-width: 78px !important;
        padding: 18px 8px !important;
      }
 
      .credential-icon {
        width: 55px !important;
        height: 55px !important;
        line-height: 55px !important;
        font-size: 25px !important;
      }
 
      .credential-content {
        padding: 16px 14px !important;
      }
 
      .credential-label {
        font-size: 11px !important;
        line-height: 1.3 !important;
        letter-spacing: 0.7px !important;
        margin-bottom: 6px !important;
      }
 
      .credential-value {
        font-size: 17px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
      }
 
      .password-value {
        font-size: 22px !important;
        line-height: 1.4 !important;
        letter-spacing: 4px !important;
        word-break: break-word !important;
      }
 
      .application-url {
        font-size: 15px !important;
        line-height: 1.5 !important;
        word-break: break-all !important;
        overflow-wrap: anywhere !important;
      }
 
 
      /* ============================
         IMPORTANT
      ============================ */
 
      .important-wrapper {
        padding: 28px 20px 22px 20px !important;
      }
 
      .important-title {
        font-size: 23px !important;
        line-height: 1.3 !important;
      }
 
      .important-text {
        font-size: 15px !important;
        line-height: 1.75 !important;
      }
 
 
      /* ============================
         FOOTER
      ============================ */
 
      .footer {
        padding: 25px 18px !important;
      }
 
      .footer-text {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
 
      .copyright {
        font-size: 12px !important;
        line-height: 1.5 !important;
      }
 
    }
 
  </style>
 
</head>
 
 
<body>
 
  <!-- =====================================
       OUTER BACKGROUND
  ====================================== -->
 
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      background:#eef6ff;
    "
  >
 
    <tr>
 
      <td
        align="center"
        class="email-wrapper"
      >
 
 
        <!-- =================================
             MAIN CONTAINER
        ================================== -->
 
        <table
          width="970"
          cellpadding="0"
          cellspacing="0"
          border="0"
          class="email-container"
          style="
            width:100%;
            max-width:970px;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 4px 18px rgba(30,80,140,0.12);
          "
        >
 
 
          <!-- =================================
               HEADER
          ================================== -->
 
          <tr>
 
            <td
              class="header"
              style="
                padding:28px 36px;
                border-bottom:1px solid #edf2f7;
              "
            >
 
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="header-table"
              >
 
                <tr>
 
                  <!-- LOGO -->
 
                  <td
                    class="header-logo-cell"
                    style="
                      width:60%;
                      vertical-align:middle;
                    "
                  >
 
                    <div
                      class="header-logo"
                      style="
                        font-weight:700;
                        color:#103f78;
                        letter-spacing:-1px;
                      "
                    >
 
                      <span
                        style="
                          color:#0877c9;
                          font-size:52px;
                          font-weight:800;
                          vertical-align:middle;
                        "
                      >
                        ◆
                      </span>
 
                      <span
                        style="
                          vertical-align:middle;
                        "
                      >
                        HRMS
                      </span>
 
                    </div>
 
                    <div
                      style="
                        font-size:18px;
                        font-weight:400;
                        color:#557399;
                        margin-left:72px;
                        margin-top:-5px;
                      "
                    >
                      People · Process · Progress
                    </div>
 
                  </td>
 
 
                  <!-- TAGLINE -->
 
                  <td
                    class="header-tagline-cell"
                    align="right"
                    valign="middle"
                    style="
                      width:40%;
                    "
                  >
 
                    <div class="header-tagline">
                      Simplifying HR. Empowering People.
                    </div>
 
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               HERO
          ================================== -->
 
          <tr>
 
            <td
              class="hero-wrapper"
              style="
                padding:24px 22px 10px 22px;
              "
            >
 
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="hero-table"
                style="
                  background:#edf7ff;
                  border-radius:14px;
                "
              >
 
                <tr>
 
                  <td
                    class="hero-content"
                    align="center"
                    valign="middle"
                    style="
                      padding:30px 20px 34px 20px;
                      text-align:center;
                    "
                  >
 
                    <!-- HERO ICON -->
 
                    <div
                      class="hero-icon"
                      style="
                        width:90px;
                        height:70px;
                        background:#287fd8;
                        border-radius:12px;
                        color:#ffffff;
                        font-size:34px;
                        line-height:70px;
                        text-align:center;
                        margin:0 auto 22px auto;
                      "
                    >
                      ✉
                    </div>
 
 
                    <!-- HERO TITLE -->
 
                    <div
                      class="hero-title"
                      style="
                        font-weight:700;
                        color:#123f78;
                        text-align:center;
                      "
                    >
                      🔒 HRMS Login Credentials
                    </div>
 
 
                    <!-- HERO DESCRIPTION -->
 
                    <div
                      class="hero-description"
                      style="
                        margin-top:12px;
                        color:#405b7d;
                        text-align:center;
                      "
                    >
                      Your HRMS account has been successfully created.
                    </div>
 
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               INTRO
          ================================== -->
 
          <tr>
 
            <td
              class="intro-wrapper"
              style="
                padding:20px 44px 10px 44px;
              "
            >
 
              <div
                class="hello"
                style="
                  font-weight:700;
                  color:#123f78;
                  margin-bottom:16px;
                "
              >
                Hello,
              </div>
 
              <div
                class="intro-text"
                style="
                  color:#405b7d;
                "
              >
                Please use the credentials below to log in to the HRMS system.
                <br>
                You will be required to change your password after your first login.
              </div>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               LOGIN EMAIL
          ================================== -->
 
          <tr>
 
            <td
              class="credential-wrapper"
              style="
                padding:20px 44px 0 44px;
              "
            >
 
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="credential-table"
                style="
                  background:#edf7ff;
                  border-radius:12px;
                "
              >
 
                <tr>
 
                  <!-- ICON -->
 
                  <td
                    width="150"
                    class="credential-icon-cell"
                    align="center"
                    valign="middle"
                    style="
                      width:150px;
                      min-width:150px;
                    "
                  >
 
                    <div
                      class="credential-icon"
                      style="
                        width:82px;
                        height:82px;
                        border-radius:50%;
                        background:#2c83db;
                        color:#ffffff;
                        font-size:38px;
                        line-height:82px;
                        text-align:center;
                      "
                    >
                      ✉
                    </div>
 
                  </td>
 
 
                  <!-- CONTENT -->
 
                  <td
                    class="credential-content"
                    valign="middle"
                    style="
                      border-left:2px solid #c7dff5;
                      padding:20px 35px;
                      vertical-align:middle;
                    "
                  >
 
                    <div
                      class="credential-label"
                      style="
                        font-weight:700;
                        letter-spacing:1px;
                        color:#58708f;
                        margin-bottom:10px;
                      "
                    >
                      LOGIN EMAIL / USER ID
                    </div>
 
                    <div
                      class="credential-value"
                      style="
                        font-weight:700;
                        color:#123f78;
                      "
                    >
                      ${email}
                    </div>
 
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               TEMPORARY PASSWORD
          ================================== -->
 
          <tr>
 
            <td
              class="credential-wrapper"
              style="
                padding:24px 44px 0 44px;
              "
            >
 
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="credential-table"
                style="
                  background:#fff1f1;
                  border-radius:12px;
                "
              >
 
                <tr>
 
                  <!-- ICON -->
 
                  <td
                    width="150"
                    class="credential-icon-cell"
                    align="center"
                    valign="middle"
                    style="
                      width:150px;
                      min-width:150px;
                    "
                  >
 
                    <div
                      class="credential-icon"
                      style="
                        width:82px;
                        height:82px;
                        border-radius:50%;
                        background:#ff4444;
                        color:#ffffff;
                        font-size:38px;
                        line-height:82px;
                        text-align:center;
                      "
                    >
                      🔒
                    </div>
 
                  </td>
 
 
                  <!-- PASSWORD -->
 
                  <td
                    class="credential-content"
                    valign="middle"
                    style="
                      border-left:2px solid #f4cccc;
                      padding:20px 35px;
                      vertical-align:middle;
                    "
                  >
 
                    <div
                      class="credential-label"
                      style="
                        font-weight:700;
                        letter-spacing:1px;
                        color:#58708f;
                        margin-bottom:10px;
                      "
                    >
                      TEMPORARY PASSWORD
                    </div>
 
                    <div
                      class="credential-value password-value"
                      style="
                        font-weight:700;
                        color:#e6382c;
                        word-break:break-word;
                      "
                    >
                      ${tempPassword}
                    </div>
 
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               APPLICATION URL
          ================================== -->
 
          <tr>
 
            <td
              class="credential-wrapper"
              style="
                padding:24px 44px 0 44px;
              "
            >
 
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="credential-table"
                style="
                  background:#edf7ff;
                  border-radius:12px;
                "
              >
 
                <tr>
 
                  <!-- ICON -->
 
                  <td
                    width="150"
                    class="credential-icon-cell"
                    align="center"
                    valign="middle"
                    style="
                      width:150px;
                      min-width:150px;
                    "
                  >
 
                    <div
                      class="credential-icon"
                      style="
                        width:82px;
                        height:82px;
                        border-radius:50%;
                        background:#287fd8;
                        color:#ffffff;
                        font-size:38px;
                        line-height:82px;
                        text-align:center;
                      "
                    >
                      🌐
                    </div>
 
                  </td>
 
 
                  <!-- URL -->
 
                  <td
                    class="credential-content"
                    valign="middle"
                    style="
                      border-left:2px solid #c7dff5;
                      padding:20px 35px;
                      vertical-align:middle;
                    "
                  >
 
                    <div
                      class="credential-label"
                      style="
                        font-weight:700;
                        letter-spacing:1px;
                        color:#58708f;
                        margin-bottom:10px;
                      "
                    >
                      APPLICATION URL
                    </div>
 
                    <div
                      class="application-url"
                      style="
                        font-weight:600;
                        color:#123f78;
                        text-align:left;
                      "
                    >
 
                      <a
                        href="${applicationUrl}"
                        target="_blank"
                        style="
                          color:#287fd8;
                          text-decoration:none;
                          word-break:break-word;
                          overflow-wrap:anywhere;
                        "
                      >
                        ${applicationUrl}
                      </a>
 
                    </div>
 
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               IMPORTANT
          ================================== -->
 
          <tr>
 
            <td
              class="important-wrapper"
              style="
                padding:38px 44px 25px 44px;
              "
            >
 
              <div
                class="important-title"
                style="
                  font-weight:700;
                  color:#f47b20;
                  margin-bottom:16px;
                "
              >
                ⚠ Important:
              </div>
 
 
              <table
                cellpadding="0"
                cellspacing="0"
                width="100%"
                border="0"
              >
 
                <tr>
 
                  <td
                    class="important-text"
                    style="
                      color:#405b7d;
                    "
                  >
                    • &nbsp; This is a temporary password
                  </td>
 
                </tr>
 
                <tr>
 
                  <td
                    class="important-text"
                    style="
                      color:#405b7d;
                    "
                  >
                    • &nbsp; Use it for your first login
                  </td>
 
                </tr>
 
                <tr>
 
                  <td
                    class="important-text"
                    style="
                      color:#405b7d;
                    "
                  >
                    • &nbsp; Do not share your password with anyone
                  </td>
 
                </tr>
 
                <tr>
 
                  <td
                    class="important-text"
                    style="
                      color:#405b7d;
                    "
                  >
                    • &nbsp; You must change your password after first login
                  </td>
 
                </tr>
 
              </table>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               DIVIDER
          ================================== -->
 
          <tr>
 
            <td
              style="
                padding:0 44px;
              "
            >
 
              <div
                style="
                  height:1px;
                  background:#d9e5f1;
                "
              ></div>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               FOOTER
          ================================== -->
 
          <tr>
 
            <td
              align="center"
              class="footer"
              style="
                padding:30px;
              "
            >
 
              <div
                class="footer-text"
                style="
                  color:#587399;
                  margin-bottom:20px;
                "
              >
                If you have any issues, please contact the HR team.
              </div>
 
              <div
                class="footer-text"
                style="
                  color:#587399;
                "
              >
                Best Regards,
              </div>
 
              <div
                style="
                  font-size:19px;
                  font-weight:700;
                  color:#29466f;
                  margin-top:6px;
                "
              >
                HRMS Team
              </div>
 
            </td>
 
          </tr>
 
 
          <!-- =================================
               COPYRIGHT
          ================================== -->
 
          <tr>
 
            <td
              align="center"
              class="copyright"
              style="
                background:#edf7ff;
                padding:22px;
                color:#7791af;
              "
            >
              © HRMS System &nbsp;|&nbsp; Secure Authentication
            </td>
 
          </tr>
 
 
        </table>
 
      </td>
 
    </tr>
 
  </table>
 
</body>
</html>
`,
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
 
  async sendWish(
    email: string,
    eventType: 'BIRTHDAY' | 'WORK_ANNIVERSARY',
    message: string,
    senderName: string,
  ): Promise<void> {
    const eventLabel =
      eventType === 'BIRTHDAY' ? 'birthday' : 'work anniversary';
 
    await this.transporter.sendMail({
      from: `"HRMS System" <${this.fromAddress}>`,
      to: email,
      subject: `A ${eventLabel} wish from your colleague`,
      text: `${senderName} sent you a ${eventLabel} wish:\n\n${message}`,
    });
  }
}
 
 