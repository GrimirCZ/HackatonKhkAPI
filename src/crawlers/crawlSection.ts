import { Browser, ElementHandle, Page } from "puppeteer";
import { Property } from "../interfaces/property";

export default async (page: Page, county: string, section: string): Promise<Property[]> => {

    //<editor-fold desc="HELPERS">
    const hasNextButton = async (page: Page) => !!(await page.$("a.paging__next"));
    const getTextContent = async (element: ElementHandle): Promise<string> => (await (await element.getProperty('innerText')).jsonValue());
    //</editor-fold>

    //<editor-fold desc="GLOBAL VARIABLES">
    let property: Property[] = [];
    //</editor-fold>

    //<editor-fold desc="CODE">

    await page.goto(`http://reality.arkcr.cz/prodej-domu-${county}-okres/${section}`, {
        waitUntil: 'networkidle2',
        timeout: 0
    });

    // Fetch all info
    const names = await page.$$("div.vypis_zakazka_seznam > strong > a"),
        prices = await page.$$("div.vypis_zakazka_seznam > p.vypis_cena");

    let infos = await page.$$("div.vypis_zakazka_seznam > p.popis > span");

    let addresses = [];

    for(let i = 0; i < infos.length; i += 4) {
        let countyLabel = infos[i];

        const countyTextNode = await page.evaluateHandle(el => el.nextSibling, countyLabel);

        const countyText = await (await countyTextNode.getProperty('nodeValue')).jsonValue();

        let stateLabel = infos[i + 1];

        const stateTextNode = await page.evaluateHandle(el => el.nextSibling, stateLabel);

        const stateText = await (await stateTextNode.getProperty('nodeValue')).jsonValue();

        if(countyText.length > 1)
            addresses.push(`${countyText}, ${stateText}`.substring(1))
        else
            addresses.push(`${stateText}`.substring(1))
    }

    for(let i = 0; i < names.length; i++) {
        const name = await (await names[i].getProperty('textContent')).jsonValue(),
            address = addresses[i],
            price = await (await prices[i].getProperty('textContent')).jsonValue();

        property.push({name, address, price})
    }
    // @ts-ignore
    /*const link = await page.$eval("a.paging__next", (element: HTMLLinkElement) => element.href);

    await page.goto(link);*/
    //} while(await hasNextButton(page));

    return property;
    //</editor-fold>
}
