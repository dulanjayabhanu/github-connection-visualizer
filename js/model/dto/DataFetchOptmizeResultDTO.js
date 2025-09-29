export class DataFetchOptmizeResultDTO{
    #isFollowingDataFetchingRequired = false;
    #isFollowerDataFetchingRequired = false;
    #isFollowingScanAttemptRemaining = false;
    #isFollowerScanAttemptRemaining = false;

    constructor(isFollowingDataFetchingRequired, isFollowerDataFetchingRequired, isFollowingScanAttemptRemaining, isFollowerScanAttemptRemaining){
        this.#isFollowingDataFetchingRequired = isFollowingDataFetchingRequired;
        this.#isFollowerDataFetchingRequired = isFollowerDataFetchingRequired;
        this.#isFollowingScanAttemptRemaining = isFollowingScanAttemptRemaining;
        this.#isFollowerScanAttemptRemaining = isFollowerScanAttemptRemaining;
    }

    getFollowingDataFetchingRequired(){
        return this.#isFollowingDataFetchingRequired;
    }

    setFollowingDataFetchingRequired(isFollowingDataFetchingRequired){
        this.#isFollowingDataFetchingRequired = isFollowingDataFetchingRequired;
    }

    getFollowerDataFetchingRequired(){
        return this.#isFollowerDataFetchingRequired;
    }

    setFollowerDataFetchingRequired(isFollowerDataFetchingRequired){
        this.#isFollowerDataFetchingRequired = isFollowerDataFetchingRequired;
    }

    getFollowingScanAttemptRemaining(){
        return this.#isFollowingScanAttemptRemaining;
    }

    setFollowingScanAttemptRemaining(isFollowingScanAttemptRemaining){
        this.#isFollowingScanAttemptRemaining = isFollowingScanAttemptRemaining;
    }

    getFollowerScanAttemptRemaining(){
        return this.#isFollowerScanAttemptRemaining;
    }

    setFollowerScanAttemptRemaining(isFollowerScanAttemptRemaining){
        this.#isFollowerScanAttemptRemaining = isFollowerScanAttemptRemaining;
    }
}