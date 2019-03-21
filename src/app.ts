import "reflect-metadata";
import express from 'express';
import cron from 'node-cron';
import crawler from "./crawlers/index";
import cors from 'cors';
import nezam from './nezam';

const axios = require("axios");

// Create a new express application instance
const app = express();

let regions: any[] = [];

app.use(cors());
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


    crawler(regions).then(async tempRegions => {

        const nezamArray = nezam();

        regions = tempRegions.map((region: any) => {
            const accordLine = nezamArray.find((row: any) => row.uzemi_txt === region.addr.address.city);

            if(!accordLine)
                return region;

            return {
                ...region,
                unemployedCount: accordLine.hodnota
            }
        });


    });


    console.log('Example app listening on port 3000!');
});
