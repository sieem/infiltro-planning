import { Response } from 'express';
import { Request } from '../models/request';
import Company from '../models/company';
import { ICompany } from '@infiltro/shared';

export const getCompanies = async (req: Request, res: Response) => {
    let findParameters = (req.user?.role === 'admin') ? {}: { _id: req.user?.company };

    if (req.user?.role === 'client') {
        const company = (await Company.findOne({ _id: req.user?.company }).exec()) as ICompany;
        const parentCompany = (await Company.findOne({ _id: company.clientOf }).exec()) as ICompany;
        //@ts-expect-error Is different type as findParameters originally, so ts complains
        findParameters = { _id: { $in: [req.user?.company, parentCompany._id] } }
    };

    Company.find(findParameters, (err: any, companies) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }
        else res.status(200).json(companies)
    })
}

export const saveCompany = (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        const company = new Company(req.body)
        Company.findByIdAndUpdate(company._id, company, { upsert: true }, function (err: any, savedCompany) {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }
            else res.status(200).json(company)
        })
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

export const removeCompany = async (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        try {
            Company.deleteOne({ _id: req.params.companyId }).exec();
            return res.json({ status: 'ok' });
        } catch (error: any) {
            console.error(error)
            return res.status(400).json(error.message)
        }
    } else {
        return res.status(401).send('Unauthorized request')
    }
}
