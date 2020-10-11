// import * as nodemailer from "nodemailer";

export class EmailService implements IEmailService {
    constructor(
        private accountUser: string, 
        private accountPassword: string,
        private accountHost: string,
        private accountPort: number,
        private accountSenderName: string) {}

    public sendEmail(recipient: string, subject: string, emailBody: string) {
        // let transporter = nodemailer.createTransport({
        //     host: this.accountHost,
        //     port: this.accountPort,
        //     secure: this.accountPort === 465,
        //     auth: {
        //         user: this.accountUser,
        //         pass: this.accountPassword,
        //     },
        // });

        // return transporter.sendMail({
        //     from: `${this.accountSenderName} <${this.accountUser}>`,
        //     to: recipient,
        //     subject: subject,
        //     html: emailBody
        // });

        return Promise.resolve(this.accountHost + this.accountSenderName + this.accountPort + this.accountUser + this.accountPassword);
    }
}

interface IEmailService {
    sendEmail(recipient: string, subject: string, emailBody: string): Promise<any>
}
