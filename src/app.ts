import "reflect-metadata";
import express from 'express';
import cron from 'node-cron';
import crawler from "./crawlers/index";
import cors from 'cors';

// Create a new express application instance
const app = express();

let regions: any[] = [];

app.use(cors);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/regions', (req, res) => {
    if(regions)
        res.json({data: regions});
    else
        res.json({
            data: []
        });
});

const crawlerTask = cron.schedule("* 30 * * * *", () => {
    crawler(regions)
});

app.listen(3000, () => {

    //crawlerTask.start();

    crawler(regions);

    console.log('Example app listening on port 3000!');
});
