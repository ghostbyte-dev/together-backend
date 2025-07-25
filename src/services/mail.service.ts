import { injectable, singleton } from 'tsyringe';
import nodemailer, { type Transporter } from 'nodemailer';
import path from 'path';
import { promises as fs } from 'node:fs';

@injectable()
@singleton()
export class MailService {
  transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MY_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD_EMAIL,
      },
    });
  }

  async sendVerificationMail(email: string, url: string) {
    let body = await this.getTemplateFile('emailVerification');
    body = body.replace(/{{verificationUrl}}/g, url);
    await this.sendMail(email, 'Email verification', body);
    return;
  }

  private async getTemplateFile(name: string) {
    const templatePath = path.join(__dirname, '../templates', `${name}.template.html`);
    const content: string = await fs.readFile(templatePath, { encoding: 'utf-8' });
    return content;
  }

  private async sendMail(email: string, subject: string, body: string) {
    const info = await this.transporter.sendMail({
      from: `"Together" <${process.env.MY_EMAIL}>`,
      to: email,
      subject,
      html: body,
    });

    console.log('Message sent:', info.messageId);
    return;
  }
}
