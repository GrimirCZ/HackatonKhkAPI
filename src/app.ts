import "reflect-metadata";
import express from 'express';
import cron from 'node-cron';
import puppeteer, { Browser } from 'puppeteer';
import crawler from "./crawlers/index";
import { Property } from "./interfaces/property";

// Create a new express application instance
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/property-for-sale', (req, res) => {
    if(global.regions)
        res.json({data: global.regions});
    else
        res.json({
            data: []
        });
});

const crawlerTask = cron.schedule("* 30 * * * *", crawler);

app.listen(3000, () => {

    //crawlerTask.start();

    crawler();

    console.log('Example app listening on port 3000!');
});
