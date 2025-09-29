import {User} from '../model/entity/User.js';
import { UserSession } from '../model/entity/UserSession.js';

export class UserManageService{
    static #singleton;

    #userSession;

    #FollowersRepository = new Map();
    #FollowingsRepository = new Map();

    constructor(){
        if(UserManageService.#singleton){
            throw new Error("USerManageService has a private constructor");
        }
    }

    static getInstance(){
        if(!UserManageService.#singleton){
            UserManageService.#singleton = new UserManageService();
        }

        return UserManageService.#singleton;
    }

    addUserSession(userSession){
        if(userSession instanceof UserSession){
            this.#userSession = userSession;

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }

    getUserSession(){
        return this.#userSession;
    }

    getUserSessionJson(){
        return this.#userSession.toJson();
    }

    flushUserSession(){
        this.#userSession = null;
    }

    addFollowingUser(user){
        if(user instanceof User){
            this.#FollowingsRepository.set(user.getUsername(), user);

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }

    getFollowingUserById(userId){
        return this.#FollowingsRepository.get(userId);
    }

    getAllFollowingUsers(){
        return Array.from(this.#FollowingsRepository.values());
    }

    getAllFollowingUsersClone(){
        return new Map(this.#FollowingsRepository);
    }

    getAllFollowingUsersJson(){
        // create the following users json array
        const followingJsonArray = [];
        
        // add al the followings as a json object
        for(const following of this.#FollowingsRepository.values()){
            followingJsonArray.push(following.toJson());
        }

        return followingJsonArray;
    }

    getFollowingCount(){
        return this.#FollowingsRepository.size;
    }

    flushAllFollowingUsers(){
        this.#FollowingsRepository.clear();
    }

    addFollower(user){
        if(user instanceof User){
            this.#FollowersRepository.set(user.getUsername(), user);

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }

    getFollowerById(userId){
        return this.#FollowersRepository.get(userId);
    }

    getAllFollowers(){
        return Array.from(this.#FollowersRepository.values());
    }

    getAllFollowersClone(){
        return new Map(this.#FollowersRepository);
    }

    getAllFollowersJson(){
        // create the followers json array
        const followerJsonArray = [];
        
        // add al the followers as a json object
        for(const follower of this.#FollowersRepository.values()){
            followerJsonArray.push(follower.toJson());
        }

        return followerJsonArray;
    }

    getFollowerCount(){
        return this.#FollowersRepository.size;
    }

    flushAllFollowers(){
        this.#FollowersRepository.clear();
    }
}