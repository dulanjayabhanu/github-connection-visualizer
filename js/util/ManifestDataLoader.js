import { ManifestData } from "../model/entity/ManifestData.js";

export class ManifestDataLoader{

    static #singleton;

    #manifestData;

    constructor(){
        if(ManifestDataLoader.#singleton){
            throw new Error("ManifestDataLoader has a private constructor");
        }
    }

    static getInstance(){
        if(!ManifestDataLoader.#singleton){
            ManifestDataLoader.#singleton = new ManifestDataLoader();
        }

        return ManifestDataLoader.#singleton;
    }

    async loadManifestData(){
        // check if the ManifestData object already created or not
        if(!this.#manifestData){
            // ManifestData object not available
            try {
                const response = await fetch("/manifest.json");

                // check if the fetching process is completed or not
                if (response.ok) {
                    // fetching process success and convert the response string to json object
                    const responseObject = await response.json();

                    // construct the ManifestData object
                    this.#manifestData = new ManifestData(
                        responseObject.name,
                        responseObject.version,
                        responseObject.description,
                        responseObject.author);

                } else {
                    // fetching process not success
                    console.log("Error occured");
                }

            } catch (Error) {
                console.log("Error occured");
            }
        }
        
        return this.#manifestData;
    }
}