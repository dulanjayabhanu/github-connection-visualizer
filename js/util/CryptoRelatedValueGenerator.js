export class CryptoRelatedValueGenerator{
    
    static generateRandomBytes(targetLength){
        // created the unitArray
        const unitArray = new Uint8Array(targetLength);
        crypto.getRandomValues(unitArray);

        return unitArray;
    }

    static convertToBase64(bufferValue){
        // covert the ArrayBuffer into byte array
        const bytes = new Uint8Array(bufferValue);
        
        let binary = "";

        for(const byte of bytes){
            binary += String.fromCharCode(byte);
        }

        return btoa(binary);
    }

    static convertFromBase64(targetString){
        // decode the Base64 binary string
        const binary = atob(targetString);
        
        const bytes = new Uint8Array(binary.length);

        for(let i = 0; i < binary.length; i++){
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    static generatePassphrase(targetLength){
        if(targetLength < 24){
            targetLength = 24;
        }

        // create all the character collection
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        const randomValues = new Uint32Array(targetLength);
        crypto.getRandomValues(randomValues);

        let passphrase = "";

        for(let x = 0; x < targetLength; x++){
            passphrase += characters[randomValues[x] % characters.length];
        }

        return passphrase;
    }
}