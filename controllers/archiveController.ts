import { Response } from 'express';
import { Request } from 'models/request';
import Archive from '../models/archive';

export const getProjectArchive = (req: Request, res: Response) => {
    Archive.find({ projectId: req.params.projectId }, { projectId: 0 }).sort({ savedDateTime: -1}).exec( (err: any, archive) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        res.status(200).json(archive);
    });
}

