import * as fs from 'fs-extra';
import { google } from 'googleapis';
const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';

export default class Calendar {
    private oAuth2Client: any;
    init() {
        this.authorize(fs.readJSONSync(CREDENTIALS_PATH));
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials: any) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        this.oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        try {
            const token = fs.readJSONSync(TOKEN_PATH);
            this.oAuth2Client.setCredentials(token);
        } catch (error: any) {
            console.log('no token yet')
        }

    }

    findEvent(calendarId: string, eventId: string) {
        if (!this.oAuth2Client) {
            this.init();
        }
        return new Promise((resolve, reject) => {
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            calendar.events.get({
                auth: this.oAuth2Client,
                calendarId,
                eventId
            }, (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    return reject('There was an error contacting the Calendar service');
                }
                return resolve(res);
            });
        })
    }

    addEvent(executor: string , event: any): Promise<{eventId: string, calendarId: string, calendarLink: string}> {
        if (!this.oAuth2Client) {
            this.init();
        }
        return new Promise((resolve, reject) => {
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            calendar.events.insert({
                auth: this.oAuth2Client,
                calendarId: process.env['CALENDAR_' + executor.toUpperCase()],
                requestBody: event,
            }, (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    return reject('Couldn\'t insert event');
                }
                return resolve({ eventId: res.data.id, calendarId: process.env['CALENDAR_' + executor.toUpperCase()] ?? '', calendarLink: res.data.htmlLink});
            });
        })
    }

    updateEvent(calendarId: string, eventId: string, executor: string, event: any) {
        if (!this.oAuth2Client) {
            this.init();
        }
        return new Promise((resolve, reject) => {
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            if (calendarId == process.env['CALENDAR_' + executor.toUpperCase()]) {
                calendar.events.update({
                    auth: this.oAuth2Client,
                    requestBody: event,
                    eventId,
                    calendarId
                }, (err: any, res: any) => {
                    if (err) {
                        console.log(err);
                        return reject('Couldn\'t update event');
                    }
                    return resolve({ eventId: res.data.id, calendarId, calendarLink: res.data.htmlLink });
                });
            } else {
                calendar.events.delete({
                    auth: this.oAuth2Client,
                    eventId,
                    calendarId
                }, (err: any, res: any) => {
                    if (err) {
                        console.log(err);
                        return reject('Couldn\'t delete event');
                    }
                    calendar.events.insert({
                        auth: this.oAuth2Client,
                        calendarId: process.env['CALENDAR_' + executor.toUpperCase()],
                        requestBody: event,
                    }, (err: any, res: any) => {
                        if (err) {
                            console.log(err);
                            return reject('Couldn\'t insert event after deletion');
                        }
                        return resolve({ eventId: res.data.id, calendarId: process.env['CALENDAR_' + executor.toUpperCase()], calendarLink: res.data.htmlLink });
                    });
                });
            }

        })
    }

    deleteEvent(calendarId: string, eventId: string) {
        if (!this.oAuth2Client) {
            this.init();
        }
        return new Promise((resolve, reject) => {
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            calendar.events.delete({
                auth: this.oAuth2Client,
                eventId,
                calendarId
            }, (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    return reject('Couldn\'t delete event');
                }
                return resolve(res);
            });

        })
    }

    synchronizeCalendar(calendarId: string, latestSyncToken: string, nextPageToken: string | null) {
        if (!this.oAuth2Client) {
            this.init();
        }

        let params: any = { calendarId };

        if (latestSyncToken) {
            params = { ...params, latestSyncToken }
        }

        if (nextPageToken) {
            params = { ...params, pageToken: nextPageToken }
        }
        return new Promise((resolve, reject) => {
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            calendar.events.list(params, (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    return reject('There was an error contacting the Calendar service');
                }
                return resolve(res);
            });
        })
    }

    combineDateHour(date: Date, hour: string) {
        if (!hour || !date) {
            return date
        }
        const dateWithHours = new Date(date.setHours(+hour.split(':')[0]));
        const dateWithHoursAndMinutes = new Date(dateWithHours.setMinutes(+hour.split(':')[1]));
        return dateWithHoursAndMinutes
    }

    addHours(date: Date, time: string | undefined) {
        if (typeof time === 'string') {
            const hours: number = parseInt(time.split(':')[0]);
            const minutes: number = parseInt(time.split(':')[1]);
            return new Date(date.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000))
        } else {
            return new Date(date.getTime() + (time ?? ''))
        }
    }

}
