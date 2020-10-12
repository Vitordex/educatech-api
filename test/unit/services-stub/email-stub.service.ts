import { IEmailService } from '../../../src/email-service/email.service';

export class StubEmailService implements IEmailService {
    /* @ts-ignore */
    sendEmail(recipient: string, subject: string, emailBody: string) {
        throw new Error("Method not implemented.");
    }
}
