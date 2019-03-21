import { Property } from "./interfaces/property";

const axios = require("axios");


export default async (property: Property[]): Promise<string[]> => {
    let filteredPlaces: any[] = [];

    for(let building of property) {
        //console.log(encodeURI(`https://nominatim.openstreetmap.org/search?q=${building.address}&format=json&addressdetails=1`))

        const firstResponse: object = await axios.get(encodeURI(`https://nominatim.openstreetmap.org/search?q=${building.address}&format=json&addressdetails=1`));

        // @ts-ignore
        /*firstResponse.data.forEach((addr: any) =>
            console.log("class: ",addr.class," address: ", addr.address));*/

        const filtered: [] = (firstResponse.data.filter(
            (addr: any) =>
                !!(addr.class === "boundary" && addr.display_name.includes("Královéhradecký kraj"))))[0];

        filteredPlaces = filteredPlaces.concat(filtered)
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

    return filteredPlaces;
}
