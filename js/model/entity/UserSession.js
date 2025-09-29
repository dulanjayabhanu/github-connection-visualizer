export class UserSession{
    #username;
    #followerCount;
    #followingCount;
    #publicRepoCount;
    #avatarURL;
    #createdDate;

    constructor(username, followerCount, followingCount, publicRepoCount, avatarURL, createdDate){
        this.#username = username;
        this.#followerCount = followerCount;
        this.#followingCount = followingCount;
        this.#publicRepoCount = publicRepoCount;
        this.#avatarURL = avatarURL;
        this.#createdDate = createdDate;
    }

    getUsername(){
        return this.#username;
    }

    setUsername(username){
        this.#username = username;
    }

    getFollowerCount(){
        return this.#followerCount;
    }

    setFollowerCount(followerCount){
        this.#followerCount = followerCount;
    }

    getFollowingCount(){
        return this.#followingCount;
    }

    setFollowingCount(followingCount){
        this.#followingCount = followingCount;
    }

    getPublicRepoCount(){
        return this.#publicRepoCount;
    }

    setPublicRepoCount(publicRepoCount){
        this.#publicRepoCount = publicRepoCount;
    }

    getAvatarURL(){
        return this.#avatarURL;
    }

    setAvatarURL(avatarURL){
        this.#avatarURL = avatarURL;
    }

    getCreatedDate(){
        return this.#createdDate;
    }

    setCreatedDate(createdDate){
        this.#createdDate = createdDate;
    }

    toJson(){
        // construct the UserSession json object
        const userSessionJson = {
            username: this.#username,
            followerCount: this.#followerCount,
            followingCount: this.#followingCount,
            publicRepoCount: this.#publicRepoCount,
            avatarURL: this.#avatarURL,
            createdDate: this.#createdDate
        };

        return userSessionJson;
    }

    fromJson(userSessionJson){
        // construct the UserSession object
        const userSession = new UserSession(
            userSessionJson.username,
            userSessionJson.followerCount,
            userSessionJson.followingCount,
            userSessionJson.publicRepoCount,
            userSessionJson.avatarURL,
            new Date(userSessionJson.createdDate)
        );

        return userSession;
    }
}