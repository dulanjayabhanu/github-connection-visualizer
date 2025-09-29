import { User } from "../model/entity/User.js";
import { UserSession } from "../model/entity/UserSession.js";
import { Filtertype } from "../model/enum/FilterType.js";
import { MessageType } from "../model/enum/MessageType.js";
import { ComponentRenderer } from "../ui/ComponentRenderer.js";
import { NotificationManager } from "../ui/NotificationManager.js";
import { UserManageService } from "./UserManageService.js";

export class RunTimeSortingClusteringService {
    static #singleton;

    #fanUserPool = new Map();
    #unfollowedUserPool = new Map();
    #settledUserPool = new Map();

    constructor() {
        if (RunTimeSortingClusteringService.#singleton) {
            throw new Error("RunTimeSortingClustering has a private constructor");
        }
    }

    static getInstance() {
        if (!RunTimeSortingClusteringService.#singleton) {
            RunTimeSortingClusteringService.#singleton = new RunTimeSortingClusteringService();
        }

        return RunTimeSortingClusteringService.#singleton;
    }

    addFan(user) {
        if (user instanceof User) {
            this.#fanUserPool.set(user.getUsername(), user);

        } else {
            throw new Error("Unmatch Parameter Type");
        }
    }

    getFanByUsername(githubUsername) {
        return this.#fanUserPool.get(githubUsername);
    }

    getAllFans() {
        return Array.from(this.#fanUserPool.values());
    }

    flushAllFanUsers(){
        this.#fanUserPool.clear();
    }

    addUnfollowedUser(user) {
        if (user instanceof User) {
            this.#unfollowedUserPool.set(user.getUsername(), user);

        } else {
            throw new Error("Unmatch Parameter Type");
        }
    }

    getUnfollowedUserByUsername(githubUsername) {
        return this.#unfollowedUserPool.get(githubUsername);
    }

    getAllUnfollowedUsers() {
        return Array.from(this.#unfollowedUserPool.values());
    }

    flushAllUnfollowedUsers(){
        this.#unfollowedUserPool.clear();
    }

    addSettledUser(user) {
        if (user instanceof User) {
            this.#settledUserPool.set(user.getUsername(), user);

        } else {
            throw new Error("Unmatch Parameter Type");
        }
    }

    getSettledUserByUsername(githubUsername) {
        return this.#settledUserPool.get(githubUsername);
    }

    getAllSettledUsers() {
        return Array.from(this.#settledUserPool.values());
    }

    flushAllSettledUsers(){
        this.#settledUserPool.clear();
    }

    constructDataClusters(userSession) {
        if (userSession instanceof UserSession) {
            // get the UserManageService object
            const userManageService = UserManageService.getInstance();

            // get the total following user count
            const totalFollowingCount = parseInt(userSession.getFollowingCount());
            // get the total follower user count
            const totalFollowerCount = parseInt(userSession.getFollowerCount());

            let dataCheckingPool;
            let dataComparingPool;

            let isDataComparingUserHasFollowersPerspective;

            // identify the data checking pool and data comparing pool and data comparing user perspective 
            if(totalFollowingCount > totalFollowerCount){
                // follower count is less than the following count and get the clone of all the current followers
                dataCheckingPool = userManageService.getAllFollowersClone();
                // get the clone of all the followings
                dataComparingPool = userManageService.getAllFollowingUsersClone();
                // set the data comparing users has Followers perspective or not
                isDataComparingUserHasFollowersPerspective = false;
                
            }else if(totalFollowerCount > totalFollowingCount){
                // following count is less than the follower count and get the clone of all the current followings
                dataCheckingPool = userManageService.getAllFollowingUsersClone();
                // get the clone of all the followers
                dataComparingPool = userManageService.getAllFollowersClone();
                // set the data comparing users has Followers perspective or not
                isDataComparingUserHasFollowersPerspective = true;
                
            }else{
                // following count and follower count are equals and get the clone of all the current followers
                dataCheckingPool = userManageService.getAllFollowersClone();
                // get the clone of all the followings
                dataComparingPool = userManageService.getAllFollowingUsersClone();
                // set the data comparing users has Followers perspective or not
                isDataComparingUserHasFollowersPerspective = false;
            }

            for(const comparingUser of Array.from(dataComparingPool.values())){
                let foundUser = null;

                // check if the comparing user match to the checking user
                if(dataCheckingPool.has(comparingUser.getUsername())){
                    // comparing user math to the checking user
                    foundUser = comparingUser;
                    
                    // remove the checking user form the dataCheckingPool
                    dataCheckingPool.delete(comparingUser.getUsername());
                }

                // check if the comparing user matched or not
                if(foundUser != null){
                    // comparing user matched and the users destination is the SettledUserPool
                    this.addSettledUser(comparingUser);
                    
                }else{
                    // comparing user not matched and check what is the data comparing users perspective 
                    if(isDataComparingUserHasFollowersPerspective){
                        // data comparing users perspective is Follower and the users destination is the FanUserPool
                        this.addFan(comparingUser);

                    }else{
                        // data comparing users perspective is Following and the users destination is the UnFollowedUserPool
                        this.addUnfollowedUser(comparingUser);
                    }
                }
            }

            for (const remaningDataCheckingUser of Array.from(dataCheckingPool.values())) {
                // check what is the remaning data checking users perspective
                if (isDataComparingUserHasFollowersPerspective) {
                    // remaning data checking users perspective is Follower and the users destination is the UnFollowedUserPool
                    this.addUnfollowedUser(remaningDataCheckingUser);

                } else {
                    // remaning data checking users perspective is Following and users destination is the FanUserPool
                    this.addFan(remaningDataCheckingUser);
                }
            }

        } else {
            throw new Error("Unmatch Parameter Type");
        }
    }

    dataClustersAccessByFilterType(filterType) {
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();

        // get the UserSession object
        const userSession = userManageService.getUserSession();
    
        // check if the UserSession available or not
        if (userSession) {
            // UserSession available and construct the selected FilterType
            let selectedFilterType = null;
    
            for (const iteratedFilterType of Filtertype.values()) {
                // check if the selected FilterType in the main FilterTypes
                if (filterType.value.toLowerCase() === iteratedFilterType.name().toLowerCase()) {
                    // FilterType matched
                    selectedFilterType = iteratedFilterType;
                    break;
                }
            }
    
            // check if the selected FilterType valid or not
            if (selectedFilterType == null) {
                // selected FilterType not valid and set the default Filtertype
                selectedFilterType = Filtertype.UNFOLLOWERS_ONLY;
            }
    
            switch (selectedFilterType.name()) {
                case Filtertype.UNFOLLOWERS_ONLY.name(): {
                    // UnFollowersPool creation process trigger and get all the unfollowed users
                    const filtratedUsers = this.getAllUnfollowedUsers();
    
                    // render the unfollowed users result 
                    componentRenderer.renderFiltratedUserResults(filtratedUsers, Filtertype.UNFOLLOWERS_ONLY, false);
    
                    break;
                }
    
                case Filtertype.FANS_ONLY.name(): {
                    // FansPool creation process trigger and get all the fans
                    const filtratedUsers = this.getAllFans();
    
                    // render the fans result
                    componentRenderer.renderFiltratedUserResults(filtratedUsers, Filtertype.FANS_ONLY, false);
    
                    break;
                }
    
                case Filtertype.MIXED_RESULT.name(): {
                    // UnFollowersPool and FansPool creation process trigger and get all the fans
                    const filtratedUsersAsFans = this.getAllFans();
                    // get all the unfollowed users
                    const filtratedUsersAsUnfollowedUsers = this.getAllUnfollowedUsers();
    
                    // render the fans result
                    componentRenderer.renderFiltratedUserResults(filtratedUsersAsFans, Filtertype.FANS_ONLY, false);
                    // render the unfollowed users result and Override the previous content removing proces for get a Mix Result behavior
                    componentRenderer.renderFiltratedUserResults(filtratedUsersAsUnfollowedUsers, Filtertype.UNFOLLOWERS_ONLY, true);
    
                    break;
                }
    
                case Filtertype.SETTLED_RESULT.name(): {
                    // SetlledPool creation process trigger and get all the settled users
                    const filtratedUsers = this.getAllSettledUsers();
    
                    // render the settled users result
                    componentRenderer.renderFiltratedUserResults(filtratedUsers, Filtertype.SETTLED_RESULT, false);
    
                    break;
                }
            }
    
        }else{
            // UserSession not available
            NotificationManager.showMessageDialog(MessageType.INFO, "Provide Your Username");
        }
    }
}