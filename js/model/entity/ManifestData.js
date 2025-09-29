export class ManifestData{
    #appName;
    #version;
    #description;
    #author;

    constructor(appName, version, description, author){
        this.#appName = appName;
        this.#version = version;
        this.#description = description;
        this.#author = author;
    }

    getAppName(){
        return this.#appName;
    }

    setAppName(appName){
        this.#appName = appName;
    }

    getVersion(){
        return this.#version;
    }

    setVersion(version){
        this.#version = version;
    }

    getDescription(){
        return this.#description;
    }

    setDescription(description){
        this.#description = description;
    }

    getAuthor(){
        return this.#author;
    }

    setAuthor(author){
        this.#author = author;
    }
}