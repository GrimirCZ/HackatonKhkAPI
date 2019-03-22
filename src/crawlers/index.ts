import { Browser } from "puppeteer";
import puppeteer from "puppeteer";
import crawler from "./crawlSection";
import { Property } from "../interfaces/property";
import locationArea from "../locationArea";

export default async (regions: string[]) => {
    const browser: Browser = await puppeteer.launch(
        {
            args: ["--no-sandbox"],
            //headless: false,
        });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if(['image', 'stylesheet', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });

    console.log(`starting crawler...`)

    let property: Property[] = [];
    const sections = ["rodinny-dum", "byt-maly", "byt-stredni", "byt-velky", "5-1-nebo-vetsi"];
    const counties = ["hradec-kralove", "jicin", "nachod", "rychnov-nad-kneznou", "trutnov"];
    for(let section of sections) {
        console.log(`\t - getting property in category ${section}...`)

        let propertyInCategory: Property[] = [];

        for(let county of counties) {
            console.log(`\t\t - getting property in county ${county}...`)

            const propertyInCounty: Property[] = (await crawler(page, county, section));

            console.log(`\t\t\t - got ${propertyInCounty.length + 1} in county ${county}`)

            propertyInCategory = propertyInCategory.concat(propertyInCounty);
        }

        console.log(`\t\t - got ${propertyInCategory.length + 1} in category`)
        property = property.concat(propertyInCategory);
    }

    console.log(`got ${property.length + 1} in total`)

    await browser.close();

    console.log("getting geojsons...");

    regions.length = 0;
    (await locationArea([...property])).forEach(val => regions.push(val));

    console.log("finished");

    return regions;
}
