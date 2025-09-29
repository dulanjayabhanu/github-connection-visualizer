import { Filtertype } from "../model/enum/FilterType.js";

export class CredentialsValidateService{
    validateGithubUsername(githubUsernameComponent){
        let isUsernameValid = false;

        // validate the github username
        if(githubUsernameComponent.value){
            if(githubUsernameComponent.value.length > 0){
                isUsernameValid = true;
            }
        }

        return isUsernameValid;
    }

    validateFilterType(filterTypeComponent) {
        let isFilterTypeValid = false;

        if(filterTypeComponent.value){
            for(const iteratedFilterType of Filtertype.values()){
                // check if the selected FilterType in the main FilterTypes
                if (filterTypeComponent.value.toLowerCase() === iteratedFilterType.name().toLowerCase()) {
                    // FilterType matched
                    isFilterTypeValid = true;
                    break;
                }
            }
        }

        return isFilterTypeValid;
    }

    validatePassphrase(passphrase){
        // create the standard regex for validate passphrase
        const validateRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{}|;:,.<>?]).{24,}$/;

        return validateRegex.test(passphrase);
    }
}