import { GitHubRestApiManager } from "../api/GitHubRestApiManager.js";
import { User } from "../model/entity/User.js";
import { UserSession } from "../model/entity/UserSession.js";
import { ComponentRenderer } from "../ui/ComponentRenderer.js";
import { CredentialsValidateService } from "../util/CredentialsValidateService.js";
import { ApplicationClientManageService } from "./ApplicationClientManageService.js";
import { ImportExportGateManageService } from "./ImportExportGateManageService.js";
import { RunTimeSortingClusteringService } from "./RunTimeSortingClusteringService.js";
import { UserManageService } from "./UserManageService.js";

export class UserRepositoryManageService {

    static #singleton;

    #githubRestApiManager;
    #userManageService;
    #applicationClientManageService;
    #runTimeSortingClusteringService;
    #componentRenderer;

    constructor(){
        // check if the UserRepositoryManageService object is already instantiated or not
        if(UserRepositoryManageService.#singleton){
            // UserRepositoryManageService object is already instantiated
            throw new Error("UserRepositoryManageService has a private constructor");
            
        }else{
            // UserRepositoryManageService object is not instantiated
            this.#githubRestApiManager = GitHubRestApiManager.getInstance();
            this.#userManageService = UserManageService.getInstance();
            this.#applicationClientManageService = ApplicationClientManageService.getInstance();
            this.#runTimeSortingClusteringService = RunTimeSortingClusteringService.getInstance();
            this.#componentRenderer = ComponentRenderer.getInstance();
        }
    }

    static getInstance(){
        if(!UserRepositoryManageService.#singleton){
            UserRepositoryManageService.#singleton = new UserRepositoryManageService();            
        }

        return UserRepositoryManageService.#singleton;
    }

    async constructFollowingAndFollowerDataRepository(githubUsername, filterType) {
        let message = null;

        // check if the client first scaned time recorded or not
        if (this.#applicationClientManageService.getFirstScanedTime() == null) {
            // client first scaned time not recorded
            this.#applicationClientManageService.setFirstScanedTime(new Date());
        }

        // create the ImportExportGateService object
        const importExportGateManageService = new ImportExportGateManageService();
        // reset all the file import related data and UI
        importExportGateManageService.resetAllFileImportRelatedDataAndUi();

        // created the CredentialsValidateService object
        const credentialsValidateService = new CredentialsValidateService();

        // check if the github username and fiter type are valid or not
        if (credentialsValidateService.validateGithubUsername(githubUsername) && credentialsValidateService.validateFilterType(filterType)) {
            // github username and filter type valid and get the current UserSession object

            let userSession = this.#userManageService.getUserSession();

            // check if the UserSession already available or not
            if(!userSession){
                // UserSession not available and get the UserSummary object for spesific user
                const userSummary = await this.#githubRestApiManager.getUserSummary(githubUsername.value);
                
                // check if the userSummary available or not
                if (userSummary != null) {
                    // userSummary available and construct the UserSession object
                    userSession = new UserSession(
                        userSummary.login,
                        userSummary.followers,
                        userSummary.following,
                        userSummary.public_repos,
                        userSummary.avatar_url,
                        new Date(userSummary.created_at));

                    // add new UserSession to the UserManageService
                    this.#userManageService.addUserSession(userSession);

                    // render the user session related details
                    this.#componentRenderer.renderUserSessionDetails(userSession);
                }
            }

            // check if the UserSession object construting process success or not
            if(userSession){
                // UserSession object construting process success and optmize the data fetching process and scan attempt availability
                const dataFetchOptmizeResultDTO = this.#applicationClientManageService.dataFetchingProcessAndScanAttemptAvailabilityOptmize(userSession);

                // define the data fetching flow controll
                if (dataFetchOptmizeResultDTO != null) {
                    // display the placeholder banner
                    this.#componentRenderer.displayPlaceholderBanner();

                    // check if the followings data fetching process available or not
                    if (dataFetchOptmizeResultDTO.getFollowingDataFetchingRequired() && dataFetchOptmizeResultDTO.getFollowingScanAttemptRemaining()) {
                        // followings data fetching process available and get all the github users that follow the spesific user
                        const followingUsers = await this.#githubRestApiManager.getFollowings(userSession.getUsername(), this.#githubRestApiManager.getFollowingPageNumber());

                        // check if the followings fetching process is success or not
                        if (followingUsers != null) {
                            // followings fetching process is success and increment the followingPageNumber
                            this.#githubRestApiManager.setFollowingPageNumber(this.#githubRestApiManager.getFollowingPageNumber() + 1);

                            for (const nativeFollowingUser of followingUsers) {
                                // construct the User object
                                const user = new User(
                                    nativeFollowingUser.id,
                                    nativeFollowingUser.login,
                                    nativeFollowingUser.avatar_url,
                                    nativeFollowingUser.html_url,
                                    nativeFollowingUser.type
                                );

                                // add the FollowingUser object to FollowingsRepository
                                this.#userManageService.addFollowingUser(user);
                            }
                        }
                    }

                    // check if the followers data fetching process available or not
                    if (dataFetchOptmizeResultDTO.getFollowerDataFetchingRequired() && dataFetchOptmizeResultDTO.getFollowerScanAttemptRemaining()) {
                        // followers data fetching process available and get all the github users that followed by specific user
                        const followers = await this.#githubRestApiManager.getFollowers(userSession.getUsername(), this.#githubRestApiManager.getFollowerPageNumber());

                        // check if the followers data fetching process is success or not
                        if (followers != null) {
                            // followers fetching process is success and increment the followerPageNumber
                            this.#githubRestApiManager.setFollowerPageNumber(this.#githubRestApiManager.getFollowerPageNumber() + 1);

                            // followers data fetching process is success
                            for (const nativeFollower of followers) {
                                // construct the User object
                                const user = new User(
                                    nativeFollower.id,
                                    nativeFollower.login,
                                    nativeFollower.avatar_url,
                                    nativeFollower.html_url,
                                    nativeFollower.type
                                );

                                // add the Follower object to FollowersRepository
                                this.#userManageService.addFollower(user);
                            }

                        } else {
                            // followers data fetching process is not success
                            message = "Invalid Username";
                        }
                    }

                    // initialize the data clusters constructing process and render the main user results and data scanning monitor
                    this.#initializeDataClusterConstructingAndRenderDataRelatedUi(userSession, filterType); 

                } else {
                    // no any data fetching process is remaning
                    message = "Data Pools Are Already Scaned";
                }

            } else {
                // UserSession object construting process not success
                message = "Invalid Username";
            }

        } else {
            message = "Invalid Username";
        }

        return message;
    }

    #initializeDataClusterConstructingAndRenderDataRelatedUi(userSession, filterType){
        // analize the newest folowing and follower pool data
        const scanDataMonitorAnalizeResultDTO = this.#applicationClientManageService.analizeFollowingAndFollowerPoolData(userSession);
        // render the updated Data Scanning Monitor
        this.#componentRenderer.renderDataScanningMonitor(scanDataMonitorAnalizeResultDTO);

        // construct the main runtime data clusters
        this.#runTimeSortingClusteringService.constructDataClusters(userSession);

        // access the necessary data clusters for selected filter type and render the user results
        this.#runTimeSortingClusteringService.dataClustersAccessByFilterType(filterType);
    }

    checkPermissionOfPayloadExportingProcess(){
        let message = null;
        
        // get the UserSession object
        const userSession = this.#userManageService.getUserSession();

        // check if the UserSession already available or not
        if(userSession != null){
            // UserSession already available and get the folowings and followers repository sizes
            const followingCount = parseInt(this.#userManageService.getFollowingCount());
            const followerCount = parseInt(this.#userManageService.getFollowerCount());
            
            // check if the user has the valid followings or followers
            if(followingCount > 0 || followerCount > 0){
                // user has the valid followings or followers
                message = "Permission Granted";
                
            }else{
                // user does not have the valid followings or followers
                message = "Your Do Not Have Valid Following Or Folowers To Export";
            }
            
        }else{
            // UserSession not available
            message = "Provide Your Username";
        }

        return message;
    }

    reConstructDataRepositoriesAndRunTimeClusters(serializablePayloadDTO, userSession, filterType){
        // flush all the main data repositories and runtime data clusters
        this.flushRepositoriesAndDataClusters();
        
        // get the GitHubRestApiManager object
        const gitHubRestApiManager = GitHubRestApiManager.getInstance();
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();

        // convert all the followingJson object to User object
        for(const followingJson of serializablePayloadDTO.getFollowings()){
            const following = new User().fromJson(followingJson);

            // add the foolowing to the following repository
            userManageService.addFollowingUser(following);
        }

        // convert all the followerJson object to User object
        for(const followerJson of serializablePayloadDTO.getFollowers()){
            const follower = new User().fromJson(followerJson);

            // add the foolower to the follower repository
            userManageService.addFollower(follower);
        }

        // update the current following page number
        gitHubRestApiManager.setFollowingPageNumber(serializablePayloadDTO.getCurrentFollowingPageNumber());
        gitHubRestApiManager.setFollowerPageNumber(serializablePayloadDTO.getCurrentFollowerPageNumber());

        // initialize the data clusters constructing process and render the main user results and data scanning monitor
        this.#initializeDataClusterConstructingAndRenderDataRelatedUi(userSession, filterType);
    }

    flushAllUserRelatedRepositoriesAndDataClusters(){
        // remove the current UserSession object
        this.flushUserSession();
        // remove all the following and follower repositories and runtime data clusters
        this.flushRepositoriesAndDataClusters();
    }

    flushRepositoriesAndDataClusters(){
        // remove all the constructed runtime clusters
        this.flushRunTimeClusters();
        // remove all the following and follower data repository
        this.flushFollowingAndFollowerRepository();

        // reset the data fetching page numbers
        this.#githubRestApiManager.setFollowingPageNumber(1);
        this.#githubRestApiManager.setFollowerPageNumber(1);
    }

    flushFollowingAndFollowerRepository(){
        this.#userManageService.flushAllFollowingUsers();
        this.#userManageService.flushAllFollowers();
    }

    flushRunTimeClusters(){
        this.#runTimeSortingClusteringService.flushAllFanUsers();
        this.#runTimeSortingClusteringService.flushAllUnfollowedUsers();
        this.#runTimeSortingClusteringService.flushAllSettledUsers();
    }

    flushUserSession(){
        this.#userManageService.flushUserSession();
    }
}