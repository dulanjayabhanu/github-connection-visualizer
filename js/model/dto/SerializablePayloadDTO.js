export class SerializablePayloadDTO {
    #version;
    #appName;
    #createdDate;
    
    #userSession;
    #followings;
    #followers;

    #currentFollowerPageNumber;
    #currentFollowingPageNumber;

    constructor(createdDate, userSession, followings, followers, currentFollowingPageNumber, currentFollowerPageNumber) {
        this.#createdDate = createdDate;
        this.#userSession = userSession;
        this.#followings = followings;
        this.#followers = followers;
        this.#currentFollowingPageNumber = currentFollowingPageNumber;
        this.#currentFollowerPageNumber = currentFollowerPageNumber;
    }

    getVersion() {
        return this.#version;
    }

    setVersion(version) {
        this.#version = version;
    }

    getAppName() {
        return this.#appName;
    }

    setAppName(appName) {
        this.#appName = appName;
    }

    getCreatedDate() {
        return this.#createdDate;
    }

    setCreatedDate(createdDate) {
        this.#createdDate = createdDate;
    }

    getUserSession(){
        return this.#userSession;
    }

    setUserSession(userSession){
        this.#userSession = userSession;
    }

    getFollowings() {
        return this.#followings;
    }

    setFollowings(followings) {
        this.#followings = followings;
    }

    getFollowers() {
        return this.#followers;
    }

    setFollowers(followers) {
        this.#followers = followers;
    }

    getCurrentFollowingPageNumber(){
        return this.#currentFollowingPageNumber;
    }

    setCurrentFollowingPageNumber(currentFollowingPageNumber){
        this.#currentFollowingPageNumber = currentFollowingPageNumber;
    }

    getCurrentFollowerPageNumber(){
        return this.#currentFollowerPageNumber;
    }

    setCurrentFollowerPageNumber(currentFollowerPageNumber){
        this.#currentFollowerPageNumber = currentFollowerPageNumber;
    }

    toJson(){
        // construct the SerializablePayload json object
        const serializablePayloadJson = {
            version: this.#version,
            appName : this.#appName,
            createdDate: this.#createdDate,
            userSession: this.#userSession,
            followings: this.#followings,
            followers: this.#followers,
            currentFollowingPageNumber: this.#currentFollowingPageNumber,
            currentFollowerPageNumber: this.#currentFollowerPageNumber
        };

        return serializablePayloadJson;
    }

    fromJson(serializablePayloadJson){
        // construct the SerializablePayloadDTO object
        const serializablePayloadDTO = new SerializablePayloadDTO(
            new Date(serializablePayloadJson.createdDate),
            serializablePayloadJson.userSession,
            serializablePayloadJson.followings,
            serializablePayloadJson.followers,
            serializablePayloadJson.currentFollowingPageNumber,
            serializablePayloadJson.currentFollowerPageNumber
        );

        // add the additional version
        serializablePayloadDTO.setVersion(serializablePayloadJson.version); 
        // add the additional app name
        serializablePayloadDTO.setAppName(serializablePayloadJson.appName); 

        return serializablePayloadDTO;
    }
}