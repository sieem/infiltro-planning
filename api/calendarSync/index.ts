import { config } from 'dotenv';

import { connect } from 'mongoose';
import moment from 'moment';
import schedule from 'node-schedule';
import Project from '../models/project';
import CalendarService from '../services/calendarService';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { IProject } from '../../src/app/interfaces/project.interface';

(async () => {
    config();
    const calendarService = new CalendarService();
    let latestSyncTokens: any = {};
    try {
        latestSyncTokens = readJsonSync('./calendarSync/latestSyncTokens.json', { encoding: 'utf8' })
    } catch (e) {}

    const db = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`

    await connect(db)

    const calendars = [
        {
            id: process.env.CALENDAR_ROEL,
            name: 'roel',
        },
        {
            id: process.env.CALENDAR_DAVID,
            name: 'david',
        },
        {
            id: process.env.CALENDAR_TOGETHER,
            name: 'together',
        },
    ];

    schedule.scheduleJob('0 4 * * *', async (fireDate) => {
        console.log('Sync at', moment(fireDate).format("YYYY-MM-DD HH:mm"));

        const projects = (await Project.find({}).select({ eventId: 1 }).exec()) as unknown as IProject[];

        const projectEventIds = projects.reduce((acc: any, cur: any) => [...acc, cur.eventId], []);

        try {
            for (const calendar of calendars) {
                const newSyncToken = await processCalendar(calendar, projectEventIds, latestSyncTokens[calendar.name]);
                latestSyncTokens[calendar.name] = newSyncToken;
                writeJsonSync('./calendarSync/latestSyncTokens.json', latestSyncTokens, { encoding: 'utf8' });
            }
        } catch (error: any) {
            console.log(error);
        }


    });

    async function processCalendar(calendar: any, projectEventIds: any, latestSyncToken: any, nextPageToken = null): Promise<any> {
        let { data: calendarResult } = await calendarService.synchronizeCalendar(calendar.id, latestSyncToken, nextPageToken) as any;
        let { items, nextPageToken: newNextPageToken, nextSyncToken } = calendarResult;

        console.log(calendar.name, items.length, latestSyncToken == nextSyncToken);

        for (let item of items) {
            let { id, start, end } = item;

            if (!id || !start || !start.dateTime || !end || !end.dateTime) {
                continue;
            }

            if (projectEventIds.indexOf(id) === -1) {
                continue;
            }

            console.log('update', id);

            Project.updateOne(
                { eventId: id },
                { datePlanned: moment(start.dateTime).format("YYYY-MM-DD HH:mm"), hourPlanned: moment(start.dateTime).format("HH:mm") }
            ).exec();
        }

        return (newNextPageToken) ? await processCalendar(calendar, projectEventIds, latestSyncToken, newNextPageToken) : nextSyncToken;
    }
})()
