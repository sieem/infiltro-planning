import nodemailer from 'nodemailer';
import { IExecutors } from '../interfaces/executors.interface';

interface Signature {
    text: String,
    html: String,
}

interface PersonalSignatures {
    david: Signature,
    roel: Signature,
    default: Signature,
}

interface MailData {
    text: string,
    html: string,
    subject: string,
    from: string,
    to: string,
    cc?: string;
    bcc?: string;
    replyTo?: string,
    user?: IExecutors['type'] | '',
    personalSignature?: boolean,
};


export default class Mail {
    private mailData: MailData;
    private personalSignatures: PersonalSignatures
    private transporter: nodemailer.Transporter | null = null;

    constructor(mailData: MailData) {
        this.mailData = mailData
        
        this.personalSignatures = {
            david: {
                text: "\nDavid Lasseel\nM: +32 (0) 498 92 49 42\nwww.infiltro.be",
                html: `
                    <p>David Lasseel<br>
                    M: +32 (0) 498 92 49 42<br>
                    <img src="${process.env.BASE_URL}/assets/images/infiltro_mail.png" alt="infiltro logo" width="200" height="48" /><br>
                    <a href="https://www.infiltro.be">www.infiltro.be</a>
                    </p>
                `
            },
            roel: {
                text: "\nRoel Berghman\nM: +32 (0) 474 950 713\nwww.infiltro.be",
                html: `
                    <p>Roel Berghman<br>
                    M: +32 (0) 474 950 713<br>
                    <img src="${process.env.BASE_URL}/assets/images/infiltro_mail.png" alt="infiltro logo" width="200" height="48" /><br>
                    <a href="https://www.infiltro.be">www.infiltro.be</a>
                    </p>
                `
            },
            default: {
                text: "\nInfiltro\nM: +32 (0) 498 92 49 42\nwww.infiltro.be",
                html: `
                    <p>Infiltro<br>
                    M: +32 (0) 498 92 49 42<br>
                    <img src="${process.env.BASE_URL}/assets/images/infiltro_mail.png" alt="infiltro logo" width="200" height="48" /><br>
                    <a href="https://www.infiltro.be">www.infiltro.be</a>
                    </p>
                `
            }
        }
    }

    async init() {

        let mailConfig: any;
        if (process.env.NODE_ENV === 'production') {
            // all emails are delivered to destination
            mailConfig = {
                host: process.env.MAILSERVER_HOST,
                port: process.env.MAILSERVER_PORT,
                auth: {
                    user: process.env.MAILSERVER_USER,
                    pass: process.env.MAILSERVER_PASS
                },
                tls: {
                    secure: true,
                    rejectUnauthorized: false
                }
            }
        } else {
            // all emails are caught by ethereal.email
            let testAccount = await nodemailer.createTestAccount()

            mailConfig = {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            }
        }

        this.transporter = nodemailer.createTransport(mailConfig)
    }

    async send() {
        if(!this.transporter) {
            await this.init()
        }
        
        if (this.mailData.personalSignature) {
            switch (this.mailData.user) {
                case 'david':
                    this.mailData.text += this.personalSignatures.david.text;
                    this.mailData.html += this.personalSignatures.david.html;
                    break;
                case 'roel':
                    this.mailData.text += this.personalSignatures.roel.text;
                    this.mailData.html += this.personalSignatures.roel.html;
                    break;

                default:
                    this.mailData.text += this.personalSignatures.default.text;
                    this.mailData.html += this.personalSignatures.default.html;
                    break;
            }
        }

        let info = await this.transporter?.sendMail(this.mailData)
        console.log("Message sent: %s", info.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        return nodemailer.getTestMessageUrl(info)
    }

    getHtml() {
        return this.mailData.html
    }
}