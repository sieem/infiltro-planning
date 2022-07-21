import User from '../models/user';
import * as moment from 'moment';
import { IComment } from '../interfaces/comments.interface';
import { IUser } from '../interfaces/user.interface';
import { IExecutors } from '@infiltro/shared';
import { ObjectId } from 'mongoose';

const usersCache: {id: ObjectId, name: string}[] = [];

const projectTypes = [
    {
        type: "house",
        name: "Woning"
    },
    {
        type: "stairs",
        name: "Traphal"
    },
    {
        type: "apartment",
        name: "Appartement"
    },
    {
        type: "mixed",
        name: "Gemengd"
    },
    {
        type: "other",
        name: "Andere"
    }
];

const executors = [
    {
        type: "roel",
        name: "Roel"
    },
    {
        type: "david",
        name: "David"
    },
    {
        type: "together",
        name: "Samen"
    }
];

export const commentsToString = async (comments: IComment[] = []) => {
    let returnString = '';

    for (const comment of comments) {
        returnString += `${await userIdToName(comment.user)} (${moment(comment.modifiedDateTime).format("YYYY-MM-DD HH:mm")}):${comment.content}\n`
    }

    return returnString;
}

export const userIdToName = async (userId: ObjectId) => {
    const foundUser = usersCache.find((user) => user.id === userId)
    if (foundUser) {
        return foundUser.name;
    }
    try {
        const user = await User.findById(userId).select({ name: 1 }).exec() as IUser | null;

        if (!user) {
          console.log('Gebruiker niet gevonden');
          return 'Gebruiker niet gevonden';
        }

        usersCache.push({
            id: userId,
            name: user.name,
        })
        return user.name;
    } catch (error: any) {
        console.error(error);
        return 'Gebruiker niet gevonden';
    }
}

export const projectTypeName = (type: string): string => {
    return projectTypes.find((projectType) => projectType.type === type)?.name ?? 'Onbekend';
};

export const executorName = (type: IExecutors['type']): string => {
    return executors.find((executor) => executor.type === type)?.name ?? 'Onbeslist';
};
