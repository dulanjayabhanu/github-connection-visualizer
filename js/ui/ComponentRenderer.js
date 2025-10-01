import { CONFIG } from "../config.js";
import { ScanDataMonitorAnalizeResultDTO } from "../model/dto/ScanDataMonitorAnalizeResultDTO.js";
import { Filtertype } from "../model/enum/FilterType.js";
import { UserManageService } from "../service/UserManageService.js";
import { CryptoRelatedValueGenerator } from "../util/CryptoRelatedValueGenerator.js";
import { ValueFormatService } from "../util/ValueFormatService.js";
import { OutOfScopeUiComponentManager } from "./OutOFScopeUiComponentManager.js";

export class ComponentRenderer{
    static #singleton;

    #resultComponentParent = null;
    #resultComponent = null;

    #emptyResultBanner = null;
    #placeholderBanner = null;

    #userSessionImage = null;
    #userSessionUsername = null;
    #userSessionFollowingCount = null;
    #userSessionFollowersCount = null;
    #userSessionPublicRepoCount = null;
    #userSessionCreatedDate = null;

    #followingProgressWrapper = null;
    #followingProgressRepresenter = null;
    #followerProgressWrapper = null;
    #followerProgressRepresenter = null;
    #followingScanAttempt = null;
    #followerScanAttempt = null;
    #followingScanCompleteIndicator = null;
    #followerScanCompleteIndicator = null;

    #generatePassphrase = null;
    #copyPassphraseButton = null;
    #copyPassphraseIndicator = null;

    #userDataBackupImport = null;
    #uploadFileName = null;
    #uploadFileNameLable = null;
    
    #decryptPayloadIndicator = null;
    #decryptPayloadIndicatorIcon = null;
    #decryptPayloadIndicatorLable = null;
    #decryptPayloadIndicatorWarningLable = null;

    #passphraseImport = null;

    #collapsableButton = null;
    #collapsableEndButton = null;
    #collapsableButtonIcon = null;

    #copyrightYear = null;

    #appVersion = null;
    
    constructor(){
        if(ComponentRenderer.#singleton){
            throw new Error("ComponentRenderer has a private constructor");
        }
    }

    static getInstance(){
        if(!ComponentRenderer.#singleton){
            // create the ComponentRenderer object
            const componentRenderer = new ComponentRenderer();

            // extract the editable ui components form the DOM
            // result realted components  
            componentRenderer.#resultComponentParent = document.getElementById("result-component-parent");
            componentRenderer.#resultComponent = document.getElementById("result-component");
            componentRenderer.#emptyResultBanner = document.getElementById("empty-result-banner");
            componentRenderer.#placeholderBanner = document.getElementById("placeholder-banner");
            
            // user session related components
            componentRenderer.#userSessionImage = document.getElementById("user-session-image");
            componentRenderer.#userSessionUsername = document.getElementById("user-session-username");
            componentRenderer.#userSessionFollowersCount = document.getElementById("user-session-followers-count");
            componentRenderer.#userSessionFollowingCount = document.getElementById("user-session-following-count");
            componentRenderer.#userSessionPublicRepoCount = document.getElementById("user-session-public-repo-count");
            componentRenderer.#userSessionCreatedDate = document.getElementById("user-session-created-date");
            
            // data scanning monitor related components
            componentRenderer.#followingProgressWrapper = document.getElementById("following-progress-wrapper");
            componentRenderer.#followingProgressRepresenter = document.getElementById("following-progress-representer");
            componentRenderer.#followerProgressWrapper = document.getElementById("follower-progress-wrapper");
            componentRenderer.#followerProgressRepresenter = document.getElementById("follower-progress-representer");
            componentRenderer.#followingScanAttempt = document.getElementById("following-scan-attempts");
            componentRenderer.#followerScanAttempt = document.getElementById("follower-scan-attempts");
            componentRenderer.#followingScanCompleteIndicator = document.getElementById("following-scan-complete-indicator");
            componentRenderer.#followerScanCompleteIndicator = document.getElementById("follower-scan-complete-indicator");
            
            // generate passphrase related components
            componentRenderer.#generatePassphrase = document.getElementById("generate-passphrase");
            componentRenderer.#copyPassphraseButton = document.getElementById("copy-passphrase-button");
            componentRenderer.#copyPassphraseIndicator = document.getElementById("copy-passphrase-indicator");
            
            // upload user data backup import related components
            componentRenderer.#userDataBackupImport = document.getElementById("user-data-backup-import");
            componentRenderer.#uploadFileName = document.getElementById("upload-file-name");
            componentRenderer.#uploadFileNameLable = document.getElementById("upload-file-name-lable");

            // decrypt paylaod indicator related components
            componentRenderer.#decryptPayloadIndicator = document.getElementById("decrypt-payload-indicator");
            componentRenderer.#decryptPayloadIndicatorIcon = document.getElementById("decrypt-payload-indicator-icon");
            componentRenderer.#decryptPayloadIndicatorLable = document.getElementById("decrypt-payload-indicator-lable");
            componentRenderer.#decryptPayloadIndicatorWarningLable = document.getElementById("decrypt-payload-indicator-warning-lable");
            
            // passphrase import related components
            componentRenderer.#passphraseImport = document.getElementById("import-passphrase");
            
            // collapsable button related components
            componentRenderer.#collapsableButton = document.getElementById("collapsable-button");
            componentRenderer.#collapsableEndButton = document.getElementById("collapsable-end-button");
            componentRenderer.#collapsableButtonIcon = document.getElementById("collapsable-button-icon");
            
            // copyright related components
            componentRenderer.#copyrightYear = document.getElementById("copyright-year");
            
            // app version related components
            componentRenderer.#appVersion = document.getElementById("app-version");

            // assign the ComponentRenderer object
            ComponentRenderer.#singleton = componentRenderer;
        }

        return ComponentRenderer.#singleton;
    }
    
    async renderFiltratedUserResults(filtratedUsers, filteredType, isPreviousContentRemovingProcessOverride){
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();

        // check if the original components and userSession are available or not
        if(this.#resultComponentParent != null && this.#resultComponent != null && userManageService.getUserSession()){
            // original components and userSession are available and get the UserSession 
            const userSession = userManageService.getUserSession();
            
            // check if the previous content removing process override or not
            if (!isPreviousContentRemovingProcessOverride) {
                // previous content removing process not override (continue with normal procedure) and clear all the content inside the result component parent
                this.#resultComponentParent.innerHTML = "";
            }

            // check if the unfollowed users available or not
            if(filtratedUsers.length > 0){
                // unfollowed users available
                
                for (const filtratedUser of filtratedUsers) {
                    // clone the result component
                    const resultComponentClone = this.#resultComponent.cloneNode(true);
                    
                    // display the result component
                    resultComponentClone.style.display = "block";
                    // update the client profile image
                    resultComponentClone.querySelector("#client-profile-image").src = userSession.getAvatarURL();
                    // update the filtrated user profile image
                    resultComponentClone.querySelector("#user-profile-image").src = filtratedUser.getAvatarURL();
                    // update the username
                    resultComponentClone.querySelector("#username").innerHTML = filtratedUser.getUsername();
                    // update the user type
                    resultComponentClone.querySelector("#type").innerHTML = filtratedUser.getType();
                    // update the user profile opener
                    resultComponentClone.querySelector("#user-profile-opener").href = filtratedUser.getURL();
                    // update the user profile opener target
                    resultComponentClone.querySelector("#user-profile-opener").target = "_blank";

                    // construct the user repo uri
                    const repoURI = `https://github.com/${filtratedUser.getUsername()}?tab=repositories`;

                    // update the user repo opener
                    resultComponentClone.querySelector("#user-repo-opener").href = repoURI;
                    // update the user repo opener target
                    resultComponentClone.querySelector("#user-repo-opener").target = "_blank";

                    // get the connection indicator icon class name for FilterType
                    let connectionIndicatorIconClassName;

                    switch(filteredType.name()){
                        case Filtertype.UNFOLLOWERS_ONLY.name():
                            connectionIndicatorIconClassName = "bi-heartbreak-fill";
                            break;

                        case Filtertype.FANS_ONLY.name():
                            connectionIndicatorIconClassName = "bi-star-fill";
                            break;

                        case Filtertype.SETTLED_RESULT.name():
                            connectionIndicatorIconClassName = "bi-shield-lock-fill";
                            break;
                    }

                    // update the connection indicator icon class name
                    resultComponentClone.querySelector("#connection-indicator-icon").className = `bi ${connectionIndicatorIconClassName} text-color fs-4`;
                    
                    // add the result component clone to the result component parent
                    this.#resultComponentParent.appendChild(resultComponentClone);
                }
                
            }else{
                // unfollowed users not available and check if the previous content removing process override or not
                if(!isPreviousContentRemovingProcessOverride){
                    // previous content removing process not override and continue the normal procedure
                    this.#displayEmptyResultBanner();
                }
            }
        }
    }

    renderUserSessionDetails(userSession){
        // created the ValueFormattedService object
        const valueFormatService = new ValueFormatService();

        // UserSession available and update the user session profile image
        this.#userSessionImage.src = userSession.getAvatarURL();
        // update the user session username
        this.#userSessionUsername.innerHTML = userSession.getUsername();
        // update the user session followers count
        this.#userSessionFollowersCount.innerHTML = valueFormatService.formatNumber(userSession.getFollowerCount());
        // update the user session following count
        this.#userSessionFollowingCount.innerHTML = valueFormatService.formatNumber(userSession.getFollowingCount());
        // update the user session public repo count
        this.#userSessionPublicRepoCount.innerHTML = valueFormatService.formatNumber(userSession.getPublicRepoCount());
        // update the user session created date
        this.#userSessionCreatedDate.innerHTML = valueFormatService.formatDate(userSession.getCreatedDate());
    }

    renderDataScanningMonitor(scanDataMonitorAnalizeResultDTO){
        if(scanDataMonitorAnalizeResultDTO instanceof ScanDataMonitorAnalizeResultDTO){
            // update the current value of the following progress wrapper
            this.#followingProgressWrapper.setAttribute("aria-valuenow", scanDataMonitorAnalizeResultDTO.getFollowingPresentage().replace("%", ""));
            // update the inner content of the following progress wrapper
            this.#followingProgressRepresenter.innerHTML = scanDataMonitorAnalizeResultDTO.getFollowingPresentage();
            // update the width of the following progress bar
            this.#followingProgressRepresenter.style.width = scanDataMonitorAnalizeResultDTO.getFollowingPresentage();
            // update the current value of the follower progress wrapper
            this.#followerProgressWrapper.setAttribute("aria-valuenow", scanDataMonitorAnalizeResultDTO.getFollowerPresentage().replace("%", ""));
            
            // construct the following presentage 
            const followingPresentage = parseInt(scanDataMonitorAnalizeResultDTO.getFollowingPresentage().replace("%", ""));
            // construct the follower presentage
            const followerPresentage = parseInt(scanDataMonitorAnalizeResultDTO.getFollowerPresentage().replace("%", ""));

            // check if the following scan process complete or not
            if(followingPresentage >= 100){
                // following scan process complete
                this.#followingScanCompleteIndicator.innerHTML = "Completed";
                // remove the following scan complete indicator progressbar animation bahavior to stable 
                this.#followingProgressRepresenter.className = "progress-bar progress-bar-striped";
                
            }else{
                // following scan process not complete and still have to scan user data
                this.#followingScanCompleteIndicator.innerHTML = "Remaning User Data...";
                // implement the following scan complete indicator progressbar animation bahavior 
                this.#followingProgressRepresenter.className = "progress-bar progress-bar-striped progress-bar-animated";
            }
            
            // check if the follower scan process complete or not
            if(followerPresentage >= 100){
                // follower scan process complete
                this.#followerScanCompleteIndicator.innerHTML = "Completed";
                // remove the follower scan complete indicator progressbar animation bahavior to stable 
                this.#followerProgressRepresenter.className = "progress-bar progress-bar-striped";
                
            }else{
                // follower scan process not complete and still have to scan user data
                this.#followerScanCompleteIndicator.innerHTML = "Remaning User Data...";
                // implement the follower scan complete indicator progressbar animation bahavior 
                this.#followerProgressRepresenter.className = "progress-bar progress-bar-striped progress-bar-animated";
            }

            // update the inner content of the follower progress wrapper
            this.#followerProgressRepresenter.innerHTML = scanDataMonitorAnalizeResultDTO.getFollowerPresentage();
            // update the width of the follower progress bar
            this.#followerProgressRepresenter.style.width = scanDataMonitorAnalizeResultDTO.getFollowerPresentage();
            // update the remaning following scan attempts
            this.#followingScanAttempt.innerHTML = scanDataMonitorAnalizeResultDTO.getFollowingRemaningScanAttempts();
            // update the remaning follower scan attempts
            this.#followerScanAttempt.innerHTML = scanDataMonitorAnalizeResultDTO.getFollowerRemaningScanAttempts();

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }

    renderGeneratedPassphrase(){
        // check if the generate passphrase component is available or not
        if(this.#generatePassphrase != null){
            // generate passphrase component is available and generate the random passphrase
            const generatedPassphrase = CryptoRelatedValueGenerator.generatePassphrase(CONFIG.passphraseLength);

            // add the generated passphrase to generate passphrase component
            this.#generatePassphrase.value = generatedPassphrase;
        }
    }

    renderResetablePassphraseCopiedState(){
        // check if the copy passphrase button and indicator is available or not
        if(this.#copyPassphraseButton != null && this.#copyPassphraseIndicator != null){
            // copy passphrase button and indicator available and remove all the content inside the copy passphrase button
            this.#copyPassphraseButton.innerHTML = "";
            
            // clone the copy passphrase indicator element
            const copyPassphraseIndicatorClone = this.#copyPassphraseIndicator.cloneNode(true);
            // update the copy passphrase indicator element class list
            copyPassphraseIndicatorClone.className = "bi bi-check2 text-color";
            
            // create the span elemnt for copy passphrase button label 
            const copyButtonSpanElement = document.createElement("span");
            // update the span element inner content 
            copyButtonSpanElement.innerHTML = "&nbsp;&nbsp;Copied";
            
            // add the updated copy indicator icon element to the copy passphrase button
            this.#copyPassphraseButton.appendChild(copyPassphraseIndicatorClone);
            // add the span element to the copy passphrase button as a label 
            this.#copyPassphraseButton.appendChild(copyButtonSpanElement);

            // add a delayed timeout to rest the copy indicator
            setTimeout(() => {
                // remove all the content inside the copy passphrase button
                this.#copyPassphraseButton.innerHTML = "";
                // add the previous copy indicator icon element to the indicator button
                this.#copyPassphraseButton.appendChild(this.#copyPassphraseIndicator);
                // add the default copy label content to the lebel element
                copyButtonSpanElement.innerHTML = "&nbsp;&nbsp;Copy";
                // add the default copy label element to the indicator button
                this.#copyPassphraseButton.appendChild(copyButtonSpanElement);

            }, CONFIG.copyIndicatorRestDelayInSeconds);
        }
    }

    renderUploadFileName(targetFileName){
        // check if the upload file name and user dtaa backup import elements available or not
        if(this.#uploadFileName != null && this.#userDataBackupImport != null){
            // upload file name and user dtaa backup import elements available and reset the passphrase for import user data backup file
            this.#userDataBackupImport.value = "";

            // check if the targetFileName available or not
            if(targetFileName != null){
                // targetFileName available and display the upload file name element 
                this.#uploadFileName.style.display = "block";
                // update the file name 
                this.#uploadFileName.querySelector("#upload-file-name-lable").innerHTML = targetFileName;
                
            }else{
                // targetFileName not available and rest the value in the file upload input element
                this.#userDataBackupImport.value = "";

                // reset the upload file name element to default state 
                this.#uploadFileName.style.display = "none";
                this.#uploadFileName.querySelector("#upload-file-name-lable").innerHTML = "";
            }
        }
    }

    renderDecryptPayloadIndicator(targetMessage){
        // check if the decrypt payload indicator and lable available or not
        if(this.#decryptPayloadIndicator != null && this.#decryptPayloadIndicatorLable != null){
            // check if the target message available or not
            if (targetMessage != null) {
                // target message available
                //  decrypt payload indicator and lable available and check if the payload decryption process success or not
                if (targetMessage === "Decryption Process Successful") {
                    // payload decryption process success and display the decrypt indicator message
                    this.#decryptPayloadIndicator.style.display = "block";
                    // update the decrypt payload indicator icon
                    this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-icon").className = "bi bi-check2-circle text-color";
                    // update the decrypt indicator lable
                    this.#decryptPayloadIndicatorLable.innerHTML = targetMessage;
                    // hide the decrypt payload indicator warning lable
                    this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").style.display = "none";

                } else {
                    // payload decryption process not success and reset decrypt payload indicator
                    this.#decryptPayloadIndicator.style.display = "block";
                    // update the decrypt payload indicator icon
                    this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-icon").className = "bi bi-exclamation-triangle text-color";
                    // update the decrypt payload indicator lable
                    this.#decryptPayloadIndicatorLable.innerHTML = targetMessage;
                    // display the decrypt payload indicator warning lable
                    this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").style.display = "block";

                    // reset the decrypt paylod indicator warning lable
                    this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").innerHTML = "";

                    switch (targetMessage) {
                        case "Decryption Process Failed": {
                            // create the span element
                            const spanElement1 = document.createElement("span");
                            // update the first pharagraph classes and content
                            spanElement1.className = "muted-text-color pt-3";
                            spanElement1.innerHTML = "The backup file could not be decrypted. This may happen for one or more of the following reasons:";
                            
                            // create the br element
                            const brElement = document.createElement("br");
                            
                            // create the ul element
                            const ulElement = document.createElement("ul");
                            ulElement.setAttribute("type", "bullet");
                            ulElement.className = "text-start pt-3";
                            
                            // create the li element
                            const liElement = document.createElement("li");
                            liElement.className = "muted-text-color";
                            
                            // create the main warning messages array
                            const warningMessageArray = [
                                "The passphrase is incorrect.",
                                "The file has been edited, damaged, or corrupted.",
                                "The file name was changed after it was downloaded."
                            ];
                            
                            // construct the warning messages as li elements 
                            for(const warningMessage of warningMessageArray){
                                // clone the li elements using based li element 
                                const liElementClone = liElement.cloneNode(true);
                                // add spesific warning message to the li element 
                                liElementClone.innerHTML = warningMessage;
                                
                                // add the li element to the ul element 
                                ulElement.appendChild(liElementClone);
                            }

                            // create the span element
                            const spanElement2 = document.createElement("span");
                            // update the second pharagraph classes and content
                            spanElement2.className = "muted-text-color";
                            spanElement2.innerHTML = "Please check the passphrase and make sure the original backup file is used without any modifications. If the issue continues, try restoring from another valid backup if available.";
                            
                            // add the main pharagraphs and warning message list to decrypt payload indicator lable
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(spanElement1);
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(brElement);
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(ulElement);
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(spanElement2);

                            break;
                        }
                        case "Backup File Does Not Belong to This GitHub Account": {
                            // create the first span element
                            const spanElement1 = document.createElement("span");
                            // update the first pharagraph classes and content
                            spanElement1.className = "muted-text-color pt-3";
                            spanElement1.innerHTML = "This backup file cannot be decrypted because it was created for a different GitHub account. Each backup is securely encrypted and linked to the account it was generated from.";
                            
                            // create the br element
                            const brElement = document.createElement("br");

                            // create the second span element
                            const spanElement2 = document.createElement("span");
                            spanElement2.className = "muted-text-color";
                            spanElement2.innerHTML = "Please upload the correct backup file that matches the current GitHub username you are using.";
                            
                            // add the main pharagraphs to decrypt payload indicator lable
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(spanElement1);
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(brElement);
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(brElement.cloneNode(true));
                            this.#decryptPayloadIndicator.querySelector("#decrypt-payload-indicator-warning-lable").appendChild(spanElement2);

                            break;
                        }
                    }
                }

            }else{
                // target message not available and reset the import passphrase
                this.#passphraseImport.value = "";

                // reset the decrypt payload indicator to default state
                this.#decryptPayloadIndicator.style.display = "none";
                this.#decryptPayloadIndicatorLable.innerHTML = "";
            }
        }
    }

    renderCollapsableButtonIconSwitch(){
        // check if the collapsable button and collapsable button icon available or not
        if(this.#collapsableButton != null && this.#collapsableButtonIcon != null){
            // the collapsable button and collapsable button icon available and get the content area expand status
            const isAreaExpaned = this.#collapsableButton.getAttribute("aria-expanded");

            // check if the content area expanded or not
            if(isAreaExpaned === "true"){
                // content area expanded and update the collapsable button icon to up
                this.#collapsableButton.querySelector("#collapsable-button-icon").className = "bi bi-chevron-up text-color";
                
            }else if(isAreaExpaned === "false"){
                // content area not expanded and update the collapsable button icon to down
                this.#collapsableButton.querySelector("#collapsable-button-icon").className = "bi bi-chevron-down text-color";
            }
        }
    }

    renderContinuousDateRelatedComponents(){
        // check if the original copyright year and usersession created date components available or not
        if(this.#copyrightYear != null && this.#userSessionCreatedDate != null){
            // original copyright year and usersession created date components available and get the current year
            const currentYear = new Date().getFullYear();
            // get the current date
            const currentDate = new Date().toDateString();

            // update the copyright year
            this.#copyrightYear.innerHTML = currentYear;
            // update the default user session created date
            this.#userSessionCreatedDate.innerHTML = currentDate;
        }
    }

    renderAppVersion(){
        // check if the app version component available or not
        if(this.#appVersion != null){
            // app version component available and update the app version
            this.#appVersion.innerHTML = "v" + CONFIG.appVersion;
        }
    }

    renderOutOfScopeContinuousDateRelatedComponents(){
        // check if the original copyright year component available or not
        if(this.#copyrightYear != null){
            // original copyright year component available and get the current year
            const currentYear = new Date().getFullYear();

            // update the copyright year
            this.#copyrightYear.innerHTML = currentYear;
        }
    }

    renderOutOfScopeUpdatedAndEffectiveDates(){
        // check if the last updated date and the effective date components available or not in all the out of scope DOMs
        if(OutOfScopeUiComponentManager.Policy.lastUpdatedDate != null &&
            OutOfScopeUiComponentManager.Policy.effectiveDate != null &&
            OutOfScopeUiComponentManager.TermsOfUse.lastUpdatedDate != null &&
            OutOfScopeUiComponentManager.TermsOfUse.effectiveDate != null){
            // last updated date and the effective date components available in all the out of scope DOMs
                
            // create the ValueFormatService object
            const valueFormatService = new ValueFormatService();
            // format the last updated date for privacy policy
            const formattedPrivacyPolicyLastUpdateDate = valueFormatService.formatNumericDate(CONFIG.privacyPolicyLastUpdateDate);

            // format the effective date for privacy policy
            const formattedPrivacyPolicyEffectiveDate = valueFormatService.formatNumericDate(CONFIG.privacyPolicyEffectiveDate);
            
            // format the last updated date for terms of use
            const formattedTermsOfUseLastUpdateDate = valueFormatService.formatNumericDate(CONFIG.termsOfUseLastUpdateDate);
            // format the effective date for terms of use
            const formattedTermsOfUseEffectiveDate = valueFormatService.formatNumericDate(CONFIG.termsOfUseEffectiveDate);

            // update the last update and effective dates in privacy policy DOM
            OutOfScopeUiComponentManager.Policy.lastUpdatedDate.innerHTML = formattedPrivacyPolicyLastUpdateDate;
            OutOfScopeUiComponentManager.Policy.effectiveDate.innerHTML = formattedPrivacyPolicyEffectiveDate;
            
            // update the last update and effective dates in terms of use DOM
            OutOfScopeUiComponentManager.TermsOfUse.lastUpdatedDate.innerHTML = formattedTermsOfUseLastUpdateDate;
            OutOfScopeUiComponentManager.TermsOfUse.effectiveDate.innerHTML = formattedTermsOfUseEffectiveDate;
        }
    }

    #displayEmptyResultBanner(){
        // check if the original empty result banner component available or not
        if(this.#emptyResultBanner != null){
            // original empty result banner component available
            const emptyResultBannerClone = this.#emptyResultBanner.cloneNode(true);
            emptyResultBannerClone.style.display = "block";

            // remove the all remaning content in side the parent result component 
            this.#resultComponentParent.innerHTML = "";
            // add the empty result banner clone to the result component parent
            this.#resultComponentParent.appendChild(emptyResultBannerClone);
        }
    }

    displayPlaceholderBanner(){
        // check if the placeholder banner component available or not
        if(this.#placeholderBanner != null){
            // original placeholder banner component available
            const placeholderBannerClone = this.#placeholderBanner.cloneNode(true);
            placeholderBannerClone.style.display = "block";
            
            // remove the all remaning content in side the parent result component 
            this.#resultComponentParent.innerHTML = "";
            // add the empty result banner clone to the result component parent
            this.#resultComponentParent.appendChild(placeholderBannerClone);
        }
    }

}