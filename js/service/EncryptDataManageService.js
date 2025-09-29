import { CryptoRelatedValueGenerator } from "../util/CryptoRelatedValueGenerator.js";
import { ManifestDataLoader } from "../util/ManifestDataLoader.js";

export class EncryptDataManageService{
    static #singleton;
    
    #passphrase;
    #encoder;
    #decoder;

    constructor(passphrase){
        // check if the EncryptDataManageService object already instantiate or not
        if(EncryptDataManageService.#singleton){
            // EncryptDataManageService object is already instantiated
            throw new Error("EncryptDataManageService has a private constructor");
            
        }else{
            // EncryptDataManageService object is not instantiated
            this.#passphrase = passphrase;
            this.#encoder = new TextEncoder();
            this.#decoder = new TextDecoder();
        }
    }

    static getInstance(passphrase){
        // check if the EncryptDataManageService already available or not
        if(!EncryptDataManageService.#singleton){
            // EncryptDataManageService not available and assign the new instance
            EncryptDataManageService.#singleton = new EncryptDataManageService(passphrase);
            
        }else{
            // EncryptDataManageService already available and update the new passphrase
            EncryptDataManageService.#singleton.passphrase = passphrase;
        }

        return EncryptDataManageService.#singleton;
    }

    async encryptData(serializablePayloadJsonObject){
        // convert the SerilizablePayloadDTO object json text
        const serializablePayloadJson = JSON.stringify(serializablePayloadJsonObject);
        // generate the salt value
        const salt = CryptoRelatedValueGenerator.generateRandomBytes(16);
        // generate the initialization vector value (iv = initialization vector)
        const iv = CryptoRelatedValueGenerator.generateRandomBytes(12);
        // generate the secrect key
        const key = await this.#generateDeriveKey(salt);

        // construct the cipherBuffer
        const cipherBuffer = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            this.#encoder.encode(serializablePayloadJson)
        );

        // get the ManifestDataLoader object
        const manifestDataLoader = ManifestDataLoader.getInstance();
        // get the ManifestData object
        const manifestData = await manifestDataLoader.loadManifestData();

        // construct the encrypted payload
        const encryptedPayload = {
            version: manifestData.getVersion(),
            salt: CryptoRelatedValueGenerator.convertToBase64(salt),
            iv: CryptoRelatedValueGenerator.convertToBase64(iv),
            cipher: CryptoRelatedValueGenerator.convertToBase64(cipherBuffer),
            meta: {
                createdDate: new Date().toISOString()
            }
        };

        return encryptedPayload;
    }

    async decryptData(encryptedPayload){
        // get the salt value
        const salt = CryptoRelatedValueGenerator.convertFromBase64(encryptedPayload.salt);
        // get the initialize vector value
        const iv = CryptoRelatedValueGenerator.convertFromBase64(encryptedPayload.iv);
        // get the data value
        const data = CryptoRelatedValueGenerator.convertFromBase64(encryptedPayload.cipher);
        // construct the key
        const key = await this.#generateDeriveKey(salt);

        let decodedAndDecryptedPayload = null;
        
        try{
            // construct the plainBuffer
            const plainBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv
                },
                key,
                data
            );

            // convert the decrypted and decoded payload in to the json object
            decodedAndDecryptedPayload = JSON.parse(this.#decoder.decode(plainBuffer));

        }catch(Error){
            console.log("Decryption failed");
        }

        return decodedAndDecryptedPayload;
    }

    async #generateDeriveKey(salt){

        // get the passphrase
        let accessiblePassphrase;

        // check if the passphrase already available in the singleton object
        if(EncryptDataManageService.#singleton.passphrase != null){
            // passphrase already available in the singleton object
            accessiblePassphrase = EncryptDataManageService.#singleton.passphrase;

        }else{
            // passphrase not available in the singleton object
            accessiblePassphrase = this.#passphrase;
        }

        // construct the passKey
        const passKey = await crypto.subtle.importKey(
            "raw",
            this.#encoder.encode(accessiblePassphrase),
            "PBKDF2",
            false,
            ["deriveKey"]
        );
        
        // construct the deriveKey
        const deriveKey = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations: 150000,
                hash: "SHA-256"
            },
            passKey,
            {
                name: "AES-GCM",
                length: 256
            },
            false,
            ["encrypt", "decrypt"]
        );

        return deriveKey;
    }
}