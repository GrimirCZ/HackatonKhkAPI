import "reflect-metadata";
import express from 'express';
import cron from 'node-cron';
import crawler from "./crawlers/index";
import cors from 'cors';
import nezam from './nezam';
import obyv from './obyv';

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

app.listen(3000, () => {

    //crawlerTask.start();


    crawler(regions).then(async tempRegions => {

        const nezamArray = nezam();

        const popInCzechRepublic: any = obyv();

        regions = tempRegions.map((region: any) => {
            const accordLine = nezamArray.find((row: any) => row.uzemi_txt === region.addr.address.city);

            if(!accordLine)
                return region;

            return {
                ...region,
                unemployedCount: accordLine.hodnota,
                population: popInCzechRepublic[region.addr.address.city] || -1
            }
        });


    });


    console.log('Example app listening on port 3000!');
});
