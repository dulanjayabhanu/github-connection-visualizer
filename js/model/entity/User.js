export class User{
    #id;
    #username;
    #avatarURL;
    #url;
    #type;

    constructor(id, username, avatarURL, url, type){
        this.#id = id;
        this.#username = username;
        this.#avatarURL = avatarURL;
        this.#url = url;
        this.#type = type;
    }

    getId(){
        return this.#id;
    }

    getUsername(){
        return this.#username;
    }

    getAvatarURL(){
        return this.#avatarURL;
    }

    getURL(){
        return this.#url;
    }

    getType(){
        return this.#type;
    }

    toJson(){
        // construct the user json object
        const userJson = {
            id: this.#id,
            username: this.#username,
            avatarURL: this.#avatarURL,
            url: this.#url,
            type: this.#type
        };

        return userJson;
    }

    fromJson(userJson){
        // construct the User object
        const user = new User(
            userJson.id,
            userJson.username,
            userJson.avatarURL,
            userJson.url,
            userJson.type
        );

        return user;
    }
}