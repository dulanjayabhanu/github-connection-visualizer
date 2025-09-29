import { GitHubRestApiManager } from "../api/GitHubRestApiManager.js";
import { DataFetchOptmizeResultDTO } from "../model/dto/DataFetchOptmizeResultDTO.js";
import { ScanDataMonitorAnalizeResultDTO } from "../model/dto/ScanDataMonitorAnalizeResultDTO.js";
import { UserSession } from "../model/entity/UserSession.js";
import { ValueFormatService } from "../util/ValueFormatService.js";
import { UserManageService } from "./UserManageService.js";

export class ApplicationClientManageService{

    #firstScanedTime = null;

    static #singleton;

    constructor(){
        if(ApplicationClientManageService.#singleton){
            throw new Error("ApplicationClientManageService has a private constructor");
        }
    }

    static getInstance(){
        if(!ApplicationClientManageService.#singleton){
            ApplicationClientManageService.#singleton = new ApplicationClientManageService();
        }

        return ApplicationClientManageService.#singleton;
    }

    getFirstScanedTime(){
        return this.#firstScanedTime;
    }

    setFirstScanedTime(scanedTime){
        this.#firstScanedTime = scanedTime;
    }

    dataFetchingProcessAndScanAttemptAvailabilityOptmize(userSession){
        if(userSession instanceof UserSession){

            // get the GitHubRestApiManager object
            const githubRestApiManager = GitHubRestApiManager.getInstance();
            // get the UserManageService object
            const userManageService = UserManageService.getInstance();

            // get the current followings count
            const currentFollowingCount = parseInt(userManageService.getFollowingCount());
            // get the current followers count
            const currentFollowerCount = parseInt(userManageService.getFollowerCount());

            // get the total following users count
            const totalFollowingCount = parseInt(userSession.getFollowingCount());
            // get the total followers count
            const totalFollowersCount = parseInt(userSession.getFollowerCount());
            
            // get the current following scan attempt remaining counts 
            const followingScanAttemptsRemainingCount = githubRestApiManager.getFollowingScanAttemptRemainingCount();
            // get the current follower scan attempt remaining counts 
            const followerScanAttemptRemainingCount = githubRestApiManager.getFollowerScanAttemptRemainingCount();

            // create the DataFetchOptmizeResultDTO object
            let dataFetchOptmizeResultDTO = new DataFetchOptmizeResultDTO();

            // optmize data fetching process and scan attempt availability 
            if(totalFollowingCount > currentFollowingCount && totalFollowersCount > currentFollowerCount){
                // followings and followers data fetching process required
                dataFetchOptmizeResultDTO.setFollowerDataFetchingRequired(true);
                dataFetchOptmizeResultDTO.setFollowingDataFetchingRequired(true);
                
                // check if the scan attempts are available or not
                if(followingScanAttemptsRemainingCount > 0 && followerScanAttemptRemainingCount > 0){
                    // scan attempts remaining
                    dataFetchOptmizeResultDTO.setFollowingScanAttemptRemaining(true);
                    dataFetchOptmizeResultDTO.setFollowerScanAttemptRemaining(true);
                }
                
            }else if(totalFollowingCount > currentFollowingCount && totalFollowersCount <= currentFollowerCount){
                // followers data fetching process is complete and followings data fetching process is remaning
                dataFetchOptmizeResultDTO.setFollowingDataFetchingRequired(true);
                
                // check if the followings scan attempts are available or not
                if(followingScanAttemptsRemainingCount > 0){
                    // followings scan attempts remaining
                    dataFetchOptmizeResultDTO.setFollowingScanAttemptRemaining(true);   
                }
                
            }else if(totalFollowingCount <= currentFollowingCount && totalFollowersCount > currentFollowerCount){
                // followings data fetching process is complete and followers data fetching process is remaning 
                dataFetchOptmizeResultDTO.setFollowerDataFetchingRequired(true);
                
                // check if the followers scan attempts are available or not
                if(followerScanAttemptRemainingCount > 0){
                    // followers scan attempts remaining
                    dataFetchOptmizeResultDTO.setFollowerScanAttemptRemaining(true);   
                }
                
            }else{
                // no any data fetching process is remaning
                dataFetchOptmizeResultDTO = null;
            }

            return dataFetchOptmizeResultDTO;

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }

    analizeFollowingAndFollowerPoolData(userSession){
        // get the GitHubRestApiManager object
        const githubRestApiManager = GitHubRestApiManager.getInstance();
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();

        // get the current followings count
        const currentFollowingCount = parseInt(userManageService.getFollowingCount());
        // get the current followers count
        const currentFollowerCount = parseInt(userManageService.getFollowerCount());

        // get the total following users count
        const totalFollowingCount = parseInt(userSession.getFollowingCount());
        // get the total followers count
        const totalFollowerCount = parseInt(userSession.getFollowerCount());

        // cretae the ValueFormatService object
        const valueFormatService = new ValueFormatService();

        // get the current following scan attempt remaining counts
        const followingScanAttemptsRemainingCount = githubRestApiManager.getFollowingScanAttemptRemainingCount();
        const formattedFollowinScanAttemptRemaningCount = valueFormatService.formatNumber(followingScanAttemptsRemainingCount);
        
        // get the current follower scan attempt remaining counts 
        const followerScanAttemptRemainingCount = githubRestApiManager.getFollowerScanAttemptRemainingCount();
        const formattedFollowerScanAttemptRemaningcount = valueFormatService.formatNumber(followerScanAttemptRemainingCount);

        // calculate the current presentage of the following data pool
        const followingPresentage = (currentFollowingCount / totalFollowingCount) * 100;
        const formattedFollowingPresentage = valueFormatService.formatNumber(followingPresentage) + "%";
        
        // calculate the current presentage of the follower data pool
        const followerPresentage = (currentFollowerCount / totalFollowerCount) * 100;
        const formattedFollowerPresentage = valueFormatService.formatNumber(followerPresentage) + "%";

        // construct the ScanDataMonitorAnalizeResultDTO object
        const scanDataMonitorAnalizeResultDTO = new ScanDataMonitorAnalizeResultDTO(
            formattedFollowingPresentage,
            formattedFollowerPresentage,
            formattedFollowinScanAttemptRemaningCount,
            formattedFollowerScanAttemptRemaningcount
        );

        return scanDataMonitorAnalizeResultDTO;
    }
}