import { Response } from 'express';
import { Request } from 'models/request';
import { Types } from 'mongoose';
import Project from '../models/project';
import { saveProject as saveProjectInService } from '../services/projectService';

export const generateProjectId = (req: Request, res: Response) => {
    return res.status(200).send(new Types.ObjectId())
}

export const saveProject = async (req: Request, res: Response) => {
    try {
        const project = await saveProjectInService(req.body, req.user);
        res.status(200).json(project);
    }
     catch (error: any) {
        return res.status(error.status).send(error.message);
    }
}

export const getProjects = (req: Request, res: Response) => {
    let findParameters = (req.user?.role === 'admin') ? {} : { company: req.user?.company }
    if(req.user?.role === 'admin') {
        findParameters = {}
    }
    Project.find(findParameters, (err: any, projects) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }
        else {
            return res.status(200).json(projects)
        }
    })
    
}

export const getProject = (req: Request, res: Response) => {
    Project.findById(req.params.projectId, (err: any, project: any) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }
        if (!project) {
            return res.status(404).send('Project not found')
        }
        if (project.status === 'deleted' && req.user?.role !== 'admin') {
            return res.status(401).send('Unauthorized request');
        }
        if (project.company === req.user?.company || req.user?.role === 'admin') {
            return res.status(200).json(project)
        }

        return res.status(401).send('Unauthorized request')
    })
}

export const removeProject = async (req: Request, res: Response) => {
    const foundProject: any = await Project.findById(req.params.projectId).exec();
    foundProject.status = 'deleted';
    req.body = foundProject;

    try {
        await saveProjectInService(req.body, req.user);
        return res.json({ status: 'success' });
    }
    catch (error: any) {
        return res.status(error.status).send(error.message);
    }
}

export const duplicateProject = async (req: Request, res: Response) => {
    try {
        const foundProject: any = await Project.findById(req.body.projectId).exec();
        foundProject._id = new Types.ObjectId();
        foundProject.projectName = foundProject.projectName + ' (kopie)';
        foundProject.eventId = '';
        foundProject.calendarId = '';
        foundProject.calendarLink = '';
        foundProject.status = 'toPlan';
        foundProject.datePlanned = '';
        foundProject.hourPlanned = '';
        foundProject.dateCreated = new Date();
        foundProject.dateActive = null;

        try {
            await saveProjectInService(foundProject, req.user);
            return res.json({ projectId: foundProject._id })
        }
        catch (error: any) {
            return res.status(error.status).send(error.message);
        }
    } catch (error: any) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export const batchProjects = async (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        const statusToChange = req.body.status
        const projectsToChange = req.body.projects

        for (const projectToChange of projectsToChange) {
            try {
                const foundProject: any = await Project.findById(projectToChange._id).exec();
                foundProject.status = statusToChange;
                await saveProjectInService(foundProject, req.user);
                
            }
            catch (error: any) {
                return res.status(error.status).send(error.message);
            }
        }
        return res.json({ status: 'success' });
    } else {
        return res.status(401).send('Unauthorized request')
    }
}