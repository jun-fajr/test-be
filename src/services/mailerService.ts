import { MailerSend, EmailParams } from "mailersend";

export interface EmailPayload {
  recipient: {
    name: string;
    email: string;
  };
  subject: string;
  htmlContent: string;
}

export interface EmailService {
  sendEmail(payload: EmailPayload): Promise<void>;
}

export class MailerSendService implements EmailService {
  constructor(
    private readonly mailer: MailerSend,
    private readonly senderName: string,
    private readonly senderEmail: string
  ) {}

  async sendEmail(payload: EmailPayload): Promise<void> {
    try {
      const { recipient, subject, htmlContent } = payload;
      const emailParams = new EmailParams()
        .setFrom({
          email: this.senderEmail,
          name: this.senderName,
        })
        .setTo([
          {
            email: recipient.email,
            name: recipient.name,
          },
        ])
        .setSubject(subject)
        .setHtml(htmlContent);

      await this.mailer.email.send(emailParams);
    } catch (error) {
      console.error("Email sending error:", error);
    }
  }
}
