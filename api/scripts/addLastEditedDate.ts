import { config } from 'dotenv';
import { connect } from 'mongoose';
import Project from '../models/project';
import Archive from '../models/archive';
import { IProject } from 'interfaces/project.interface';

(async () => {
    config();
    let projects

    const db = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`
    connect(db, (err) => err ? console.log(err) : console.log('connected to mongodb'));

    try {
        projects = await Project.find({}) as unknown as IProject[]
    } catch (error: any) {
        console.error(error)
        return
    }

    console.log('start converting', new Date)

    for (const project of projects) {
        try {
            const { savedDateTime } = await Archive.findOne({ projectId: project._id }).sort({ savedDateTime: -1 }) as any;
            project.dateEdited = savedDateTime;
            console.log('modified', project._id, project.dateEdited);
            new Project(project).save();
        }
         catch (error: any) {
            console.log(error);
        }

    }

    console.log("done converting", new Date)
})()
