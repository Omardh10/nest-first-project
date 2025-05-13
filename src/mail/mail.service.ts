import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {

    constructor(private readonly mailservice: MailerService) { }

    public async sendingemail(email: string) {
        const today = new Date();
        await this.mailservice.sendMail({
            to: email,
            from: `<nestjs project app >`,
            subject: 'Log In',
            html: `<div> 
            <h2>Hi ${email}</h2>
            <p>you logged in to yuor account in ${today.toDateString()} at ${today.toLocaleTimeString()} </p>
            </div>`
        })
    }

    public async sendinverifyemail(email: string, link: string) {
        await this.mailservice.sendMail({
            to: email,
            from: `<nestjs project app >`,
            subject: 'verify-email',
            html: `<div> 
            <h2>Hi ${email}</h2>
            <h2>verify your email address</h2>
            <p>click on the link to verify you email</p>
            <a href='${link}'>click here</a>
            <h3>verify your account</h3>
            </div>`
        })
    }
}