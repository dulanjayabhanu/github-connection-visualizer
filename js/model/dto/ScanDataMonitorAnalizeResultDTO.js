export class ScanDataMonitorAnalizeResultDTO{
    #followingPresentage;
    #followerPresentage;
    #followingRemaningScanAttempts;
    #followerRemaningScanAttempts;

    constructor(followingPresentage, followerPresentage, followingRemaningScanAttempts, followerRemaningScanAttempts){
        this.#followingPresentage = followingPresentage;
        this.#followerPresentage = followerPresentage;
        this.#followingRemaningScanAttempts = followingRemaningScanAttempts;
        this.#followerRemaningScanAttempts = followerRemaningScanAttempts;
    }

    getFollowingPresentage(){
        return this.#followingPresentage;
    }

    setFollowingPresentage(followingPresentage){
        this.#followingPresentage = followingPresentage;
    }

    getFollowerPresentage(){
        return this.#followerPresentage;
    }

    setFollowerPresentage(followerPresentage){
        this.#followerPresentage = followerPresentage;
    }

    getFollowingRemaningScanAttempts(){
        return this.#followingRemaningScanAttempts;
    }

    setFollowingRemaningScanAttempts(followingRemaningScanAttempts){
        this.#followingRemaningScanAttempts = followingRemaningScanAttempts;
    }

    getFollowerRemaningScanAttempts(){
        return this.#followerRemaningScanAttempts;
    }

    setFollowerRemaningScanAttempts(followerRemaningScanAttempts){
        this.#followerRemaningScanAttempts = followerRemaningScanAttempts;
    }
}