import { CONFIG } from "../config.js";

export class ScreenFilterationManager{
    static #singleton;

    #appWrapper;
    #screenFilterationWrapper;

    constructor(){
        if(ScreenFilterationManager.#singleton){
            throw new Error("ScreenFilterationManager has a private constructor");
        }
    }

    static getInstance(){
        if(!ScreenFilterationManager.#singleton){
            // create the ScreenFilterationManager object
            const screenFilterationManager = new ScreenFilterationManager();
            // assign the app wrapper component
            screenFilterationManager.#appWrapper = document.querySelector(".app-wrapper");
            // assign the screen filteration wrapper component
            screenFilterationManager.#screenFilterationWrapper = document.querySelector(".screen-filteration-wrapper");
            
            ScreenFilterationManager.#singleton = screenFilterationManager;
        }

        return ScreenFilterationManager.#singleton;
    }

    syncScreenFilterationWithDynamicResolution(){
        // check if the current window width pass the screen filteration threshold
        if(window.innerWidth < CONFIG.screenFilterationThresholdInPixels){
            // current window width pass the screen filteration threshold and display the screen fileration wrapper
            this.#screenFilterationWrapper.style.display = "flex";
            // hide the main app content
            this.#appWrapper.style.display = "none";
            
        }else{
            // current window width not pass the screen filteration threshold and hide the screen fileration wrapper
            this.#screenFilterationWrapper.style.display = "none";
            // display the main app content
            this.#appWrapper.style.display = "block";
        }
    }
}