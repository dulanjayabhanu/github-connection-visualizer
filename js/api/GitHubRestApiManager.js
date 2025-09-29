import { CONFIG } from "../config.js";

export class GitHubRestApiManager{
    #followingPageNumber = 1;
    #followerPageNumber = 1;

    #followingScanAttemptRemainingCount = CONFIG.scanAttemptRemainingcount;
    #followerScanAttemptRemainingCount = CONFIG.scanAttemptRemainingcount;
    
    static #singleton;

    constructor(){
        if(GitHubRestApiManager.#singleton){
            throw new Error("GitHubRestApiManager has a private constructor");
        }
    }

    static getInstance(){
        if(!GitHubRestApiManager.#singleton){
            this.#singleton = new GitHubRestApiManager();
        }

        return GitHubRestApiManager.#singleton;
    }

    getFollowingPageNumber(){
        return this.#followingPageNumber;
    }

    setFollowingPageNumber(followingPageNumber){
        this.#followingPageNumber = followingPageNumber;
    }

    getFollowerPageNumber(){
        return this.#followerPageNumber;
    }

    setFollowerPageNumber(followerPageNumber){
        this.#followerPageNumber = followerPageNumber;
    }

    getFollowingScanAttemptRemainingCount(){
        return this.#followingScanAttemptRemainingCount;
    }

    setFollowingScanAttemptRemainingCount(followingScanAttemptRemainingCount){
        this.#followingScanAttemptRemainingCount = followingScanAttemptRemainingCount;
    }

    getFollowerScanAttemptRemainingCount(){
        return this.#followerScanAttemptRemainingCount;
    }

    setFollowerScanAttemptRemainingCount(followerScanAttemptRemainingCount){
        this.#followerScanAttemptRemainingCount = followerScanAttemptRemainingCount;
    }

    async getFollowings(githubUsername, followingPageNumber){
        try{
            // construct the uri path
            const uriPath = `https://api.github.com/users/${githubUsername}/following?per_page=${CONFIG.itemPerPage}&page=${followingPageNumber}`;

            const response = await fetch(uriPath);

            // record the scanAttemptRemainingCount
            this.#followingScanAttemptRemainingCount = response.headers.get("X-RateLimit-Remaining");

            // check if the fetching process is completed or not
            if (response.ok) {
                // fetching process success and convert the response string to the js array
                const responseArray = await response.json();
                return responseArray;

            } else {
                // fetching process is not success
                console.log("Error occured");
                return null;
            }
            
        }catch(error){
            console.log("Error occured");
            return null;
        }
    }

    async getFollowers(githubUsername, followersPageNumber){
        try{
            // construct the uri path
            const uriPath = `https://api.github.com/users/${githubUsername}/followers?per_page=${CONFIG.itemPerPage}&page=${followersPageNumber}`;
            
            const response = await fetch(uriPath);
            
            // record the scanAttemptRemainingCount
            this.#followerScanAttemptRemainingCount = response.headers.get("X-RateLimit-Remaining");

            // check if the data fetching process success or not 
            if(response.ok){
                // data fetching process is success and convert the reponse string to the js array
                const responseArray = await response.json();
                return responseArray;
                
            }else{
                // data fetching process is not success
                console.log("Error occured");
                return null;
            }
        }catch(Error){
            console.log("Error Occured");
            return null;
        }
    }
    
    async getUserSummary(githubUsername){
        try{
            // construct the uri path
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            
            // check if the fetching process is completed or not
            if(response.ok){
                // fetching process success and convert the response string to json array
                const responseObject = await response.json();
                return responseObject;

            }else{
                // fetching process not success
                console.log("Error occured");
                return null;
            }

        }catch(Error){
            console.log("Error occured");
            return null;
        }
    }
}