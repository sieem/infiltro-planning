import { Response } from 'express';
import { Request } from '../models/request';
import MailTemplate from '../models/mailTemplate';
import Project from '../models/project';
import mailService from '../services/mailService';
import { IProject } from '../interfaces/project.interface';

export const sendProjectMail = async (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        const mailForm = req.body;
        const htmlMailBody = mailForm.body.replace(/\n/g, "<br>");
        const foundProject = await Project.findById(mailForm._id).exec() as IProject | null;

        if (!foundProject) {
          throw Error(`No project found, tried id:'${mailForm._id}'`);
        }

        const mailDetails: any = {
            david: {
                name: "David Lasseel",
                email: "david@infiltro.be"
            },
            roel: {
                name: "Roel Berghman",
                email: "roel@infiltro.be"
            },
            default: {
                name: "Infiltro",
                email: "info@infiltro.be"
            }
        };

        let replyTo = '';

        try {
            replyTo = `"${mailDetails[foundProject.executor].name}" <${mailDetails[foundProject.executor].email}>`
        } catch (error: any) {
            replyTo = `"${mailDetails['default'].name}" <${mailDetails['default'].email}>`
        }

        //send mail
        const mail = new mailService({
            from: '"Infiltro" <planning@infiltro.be>',
            replyTo,
            bcc: 'info@infiltro.be',
            to: mailForm.receiver,
            cc: mailForm.cc,
            subject: mailForm.subject,
            text: mailForm.body,
            html: htmlMailBody,
            personalSignature: true,
            user: foundProject.executor
        })
        await mail.send()

        const mailObject = {
            sender: req.user?._id,
            receiver: mailForm.receiver,
            cc: mailForm.cc,
            subject: mailForm.subject,
            dateSent: new Date(),
            body: mail.getHtml()
        }

        // save mail intro database
        try {
            await Project.updateOne({ _id: mailForm._id }, {
                $push: { mails: mailObject as never }
            }).exec();
            return res.json({});
        } catch (error: any) {
            console.error(error)
            return res.status(400).json(error.message)
        }
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

export const getMailTemplates = (req: Request, res: Response) => {
    if (req.user?.role !== 'admin') {
        return res.status(401).send('Unauthorized request');
    }

    MailTemplate.find({}, (err: any, mailTemplates) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }
        else res.status(200).json(mailTemplates)
    })
}


export const saveMailTemplate = async (req: Request, res: Response) => {
    if (req.user?.role !== 'admin') {
        return res.status(401).send('Unauthorized request');
    }

    if (!req.body._id && await MailTemplate.findOne({ name: req.body.name }).exec()) {
        return res.status(400).json('Template already found with this name');
    }

    const mailTemplate = new MailTemplate(req.body);

    try {
        const responseBody = await MailTemplate.findByIdAndUpdate(mailTemplate._id, mailTemplate, { upsert: true }).exec();
        res.status(200).json(responseBody);
    } catch (error: any) {
        console.error(error);
        return res.status(400).json(error.message);
    }

}

export const removeMailTemplate = async (req: Request, res: Response) => {
    if (req.user?.role !== 'admin') {
        return res.status(401).send('Unauthorized request');
    }
    try {
        MailTemplate.deleteOne({ _id: req.params.templateId }).exec();
        return res.json({ status: 'ok' });
    } catch (error: any) {
        console.error(error)
        return res.status(400).json(error.message)
    }
}
