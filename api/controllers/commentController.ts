import { Response } from 'express';
import { Request } from 'models/request';
import { Types } from 'mongoose';
import Project from '../models/project';
import { IComment } from '../interfaces/comments.interface';

export const getComments = (req: Request, res: Response) => {
    Project.findById(req.params.projectId, (err: any, project: any) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        if (project) return res.status(200).json(project.comments)
        return res.status(200).send([])
    })
}

export const saveComment = async (req: Request, res: Response) => {
    const commentForm = req.body
    let commentObject: IComment | null;

    if (!commentForm._id) {
        commentObject = {
            _id: new Types.ObjectId(),
            user: commentForm.user,
            createdDateTime: new Date,
            modifiedDateTime: new Date,
            content: commentForm.content,
        }

        try {
            await Project.updateOne({ _id: req.params.projectId }, { $push: { comments: commentObject } }).exec()
        } catch (error: any) {
            console.log(error)
        }

        try {
            const project: any = await Project.findById(req.params.projectId).exec()
            return res.json(project.comments)
        } catch (error: any) {
            console.log(error)
        }
    } else {
        if (req.user?.role !== 'admin' && req.user?._id != commentForm.user) {
            return res.status(401).send('Unauthorized request')
        }

        commentObject = {
            _id: commentForm._id,
            user: commentForm.user,
            createdDateTime: commentForm.createdDateTime,
            modifiedDateTime: new Date,
            content: commentForm.content,
        }

        const project:any = await Project.findById(req.params.projectId).exec()

        project.comments = updateElementInArray(project.comments, commentObject)
        await Project.findByIdAndUpdate(req.params.projectId, project, { upsert: true }).exec()
        return res.status(200).json(project.comments)
    }
}

export const removeComment = (req: Request, res: Response) => {
    Project.findById(req.params.projectId, async (err: any, project: any) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }
        if (req.user?.role !== 'admin' && getComment(project.comments, req.params.commentId)?.user !== req.user?._id) {
            return res.status(401).send('Unauthorized request');
        }
        project.comments = removeElementInArray(project.comments, req.params.commentId)
        await Project.findByIdAndUpdate(req.params.projectId, project, { upsert: true }).exec()
        return res.status(200).json(project.comments)
    })
}

function removeElementInArray(array: IComment[], commentId: string): IComment[] {
    return array.filter((comment) => comment._id != commentId)
}

function updateElementInArray(array: IComment[], newCommentData: IComment): IComment[] {
    const commentToEdit = array.find((comment) => comment._id == newCommentData._id);

    if (!commentToEdit) {
        throw Error(`Couldn't find comment, tried with '${newCommentData._id}'`)
    }

    commentToEdit.user = newCommentData.user;
    commentToEdit.createdDateTime = newCommentData.createdDateTime;
    commentToEdit.modifiedDateTime = newCommentData.modifiedDateTime;
    commentToEdit.content = newCommentData.content;

    return array;
}

function getComment(array: IComment[], commentId: string): IComment | undefined {
    return array.find((comment) => comment._id == commentId);
}