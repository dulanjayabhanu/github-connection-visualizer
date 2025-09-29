export class UserSummary{
    #id;
    #username;
    #followersCount;
    #followingCount;
    #createdDate;

    constructor(id, username, followersCount, followingCount, createdDate){
        this.#id = id;
        this.#username = username;
        this.#followersCount = followersCount;
        this.#followingCount = followingCount;
        this.#createdDate = createdDate;
    }

    getId(){
        return this.#id;
    }

    getUsername(){
        return this.#username;
    }

    getFollowersCount(){
        return this.#followersCount;
    }

    getFollowingCount(){
        return this.#followingCount;
    }

    getCreatedDate(){
        return this.#createdDate;
    }
}