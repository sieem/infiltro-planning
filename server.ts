import { config } from 'dotenv';
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { router } from './routes';
import { AddressInfo } from 'node:net';
import { createReadStream, readFileSync } from 'fs';
import { extname } from 'path';
import { createServer } from 'http';
import { createServer as createServerSecure } from 'https';

config();

const app = express();
const db = process.env.NODE_ENV === 'development'
    ? `mongodb://localhost/${process.env.MONGODB_DB}`
    : `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`;
const staticRoot = '../infiltro-planning/dist/'

connect(db, (err) => err ? console.log(err) : console.log('connected to mongodb'));

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(compression())
app.use('/api', router);
app.use((req, res, next) => {
    //if the request is not html then move along
    // if the request has a '.' assume that it's for a file, move along
    if (req.accepts('html', 'json', 'xml') !== 'html' || extname(req.path) !== '') {
        return next();
    }

    createReadStream(staticRoot + 'index.html').pipe(res);
});
app.use(express.static(staticRoot, { dotfiles: 'allow' } ));

//starting up the server
if (process.env.NODE_ENV == "production") {
    // Certificate
    const privateKey = readFileSync('/etc/letsencrypt/live/planning.infiltro.be/privkey.pem', 'utf8');
    const certificate = readFileSync('/etc/letsencrypt/live/planning.infiltro.be/cert.pem', 'utf8');
    const ca = readFileSync('/etc/letsencrypt/live/planning.infiltro.be/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const httpsServer = createServerSecure(credentials, app);
    try {
        httpsServer.listen(process.env.PORT, () => {
            const addressInfo = httpsServer.address() as AddressInfo;
            console.log(`App listening on port ${addressInfo.port} SSL`);
        });
    } catch (error: any) {
        console.error(error);
    }

    // setting redirect for non http traffic
    createServer((req, res) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(80);
}
else if (process.env.NODE_ENV == "development") {
    const httpServer = createServer(app);
    try {
        httpServer.listen(process.env.PORT || 3000, () => {
            const addressInfo = httpServer.address() as AddressInfo;
            console.log(`App listening on port ${addressInfo.port} Non-SSL`);
        });
    } catch (error: any) {
        console.error(error);
    }
}
else {
    throw new Error("No NODE_ENV defined, perhaps run npm start of npm run dev?");
}