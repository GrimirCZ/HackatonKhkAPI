import { Property } from "./interfaces/property";

const axios = require("axios");


export default async (property: Property[]): Promise<string[]> => {
    let filteredPlaces: any[] = [];

    let i = 0;
    for(let building of property) {
        //console.log(encodeURI(`https://nominatim.openstreetmap.org/search?q=${building.address}&format=json&addressdetails=1`))
        const url = `https://nominatim.openstreetmap.org/search?q=${building.address}&format=json&addressdetails=1&polygon_geojson=1`;

        const firstResponse: object = await axios.get(encodeURI(url));

        // @ts-ignore
        const filtered: [] = (firstResponse.data.filter(
            (addr: any) =>
                !!(addr.class === "boundary" && addr.display_name.includes("Královéhradecký kraj"))
        ))[0];

        filteredPlaces = filteredPlaces.concat(filtered)

        console.log(`${i}/${property.length}`);

        i++;
    }

    //Clean of undefined and nulls
    filteredPlaces = filteredPlaces.filter(val => val);

    let temp: any[] = [];
    filteredPlaces.forEach(addr => {
        const same = (i: any) => i.addr.display_name === addr.display_name;

        if(temp.some(same)) {
            temp.find(same).count++;
        } else {
            temp.push({addr, count: 1});
        }
    });

    filteredPlaces = temp;

    filteredPlaces = filteredPlaces.map((val, index) => ({id: index, ...val}));

    console.log(`got ${filteredPlaces.length} places...`);

    return filteredPlaces;
}
