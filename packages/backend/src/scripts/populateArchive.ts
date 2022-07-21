import { config } from 'dotenv';
import { connect } from 'mongoose';
import { IProject } from '../app/interfaces/project.interface';
import Project from '../app/models/project';
import { saveProjectArchive } from '../app/services/archiveService';

(async () => {
    config();

    let projects

    const db = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`
    connect(db, (err) => err ? console.log(err) : console.log('connected to mongodb'));

    try {
        projects = await Project.find({}) as unknown as IProject[];
    } catch (error: any) {
        console.error(error)
        return
    }

    console.log('start populating', new Date)

    for (const project of projects) {
        saveProjectArchive(project, null);
    }

    console.log("done populating", new Date)
})()
