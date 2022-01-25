import Archive from '../models/archive';
import { ObjectId } from 'mongoose';
import { IProject } from '../interfaces/project.interface';

export const saveProjectArchive = (project: IProject, userId: ObjectId | null) => {
    const projectToArchive = {
        user: userId,
        projectId: project,
        savedDateTime: new Date(),
        projectData: project,
    };

    new Archive(projectToArchive).save();
}