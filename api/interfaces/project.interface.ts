import { IComment } from "./comments.interface";
import { IExecutors } from "./executors.interface";
import { IStatuses } from './statuses.interface';
import { ObjectId } from 'mongoose';
import { IProjectTypes } from "./project-type.interface";

export interface IProject {
    _id: ObjectId,
    company: string,
    dateCreated: Date,
    dateEdited: Date,
    projectType: IProjectTypes['type'] | '',
    houseAmount: string,
    projectName: string,
    client: string,
    street: string,
    city: string,
    postalCode: string,
    extraInfoAddress: string,
    lng: number,
    lat: number,
    name: string,
    tel: string,
    email: string,
    extraInfoContact: string,
    EpbReporter: string,
    ATest: string,
    v50Value: string,
    protectedVolume: string,
    EpbNumber: string,
    executor: IExecutors['type'] | '',
    datePlanned: Date,
    hourPlanned: string,
    status: IStatuses['type'] | '',
    comments: IComment[],
    mails: any[],
    calendarId: string,
    eventId: string,
    calendarLink: string,
    dateActive: Date | null,
}
