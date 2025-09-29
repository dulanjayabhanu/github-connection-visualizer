export class FileUploadResultDTO{
    #fileName;
    #message;

    constructor(fileName, message){
        this.#fileName = fileName;
        this.#message = message;
    }

    getFileName(){
        return this.#fileName;
    }

    setFileName(fileName){
        this.#fileName = fileName;
    }

    getMessage(){
        return this.#message;
    }

    setMessage(message){
        this.#message = message;
    }
}