import { UiEstablisher } from "./ui/UiEstablisher.js";
import { RunTimeSortingClusteringService } from "./service/RunTimeSortingClusteringService.js";
import { NotificationManager } from "./ui/NotificationManager.js";
import { MessageType } from "./model/enum/MessageType.js";
import { UserRepositoryManageService } from "./service/UserRepositoryManageService.js";
import { CONFIG } from "./config.js";
import { ImportExportGateManageService } from "./service/ImportExportGateManageService.js";
import { ComponentRenderer } from "./ui/ComponentRenderer.js";
import { CopyPasteManager } from "./ui/CopyPasteManager.js";
import { CredentialsValidateService } from "./util/CredentialsValidateService.js";
import { ImportExportFileManageService } from "./service/ImportExportFileManageService.js";
import { FileUploadResultDTO } from "./model/dto/FileUploadResultDTO.js";
import { ScreenFilterationManager } from "./ui/ScreenFilterationManager.js";

const screenFilterationManager = ScreenFilterationManager.getInstance();
const runTimeSortingClusteringService = RunTimeSortingClusteringService.getInstance();

const uiEstablisher = new UiEstablisher();

// establish the popover component behaviour
uiEstablisher.establishPopover();
// configure the custom notification object
uiEstablisher.establishToastr();
// establish all the pre-processed values
uiEstablisher.establishPreProccessedValues();
// establish all the continous date related components
uiEstablisher.establishContinuousDateRelatedComponents();

// add resize listener to window
window.addEventListener("resize", event => {
    // sync the screen filteration with dynamic resolution
    screenFilterationManager.syncScreenFilterationWithDynamicResolution();
});

// add load listener to window
window.addEventListener("load", event => {
    // sync the screen filteration with dynamic resolution
    screenFilterationManager.syncScreenFilterationWithDynamicResolution();
});

// add DOMContentListener to our full Document
document.addEventListener("DOMContentLoaded", async () => {
    // initialize the CONFIG class
    await CONFIG.initialize();

    // establish the app version 
    uiEstablisher.establishAppVersion();

    // add the contentmenu listener to disable the right-click event
    document.addEventListener("contextmenu", event => {
        // prevent the right click event
        event.preventDefault();

        // display the necessary notification message
        NotificationManager.showMessageDialog(MessageType.WARNING, "Right Click Is Disabled On This App")
    });
});

// add click event listener to search button
document.getElementById("search-button").addEventListener("click", async event =>{
    const githubUsername = document.getElementById("github-username");
    const filterType = document.querySelector('input[name="filter-type"]:checked');
    
    // get the UserRepositoryManageService object
    const userRepositoryManageService = UserRepositoryManageService.getInstance();
    
    // remove all the user related UserSession, runtime clusters and following and follower repository
    userRepositoryManageService.flushAllUserRelatedRepositoriesAndDataClusters();
    
    // construct UserSession, Following and Follower repositories and run-time data clusters
    const message = await userRepositoryManageService.constructFollowingAndFollowerDataRepository(githubUsername, filterType);
    
    if(message != null){
        NotificationManager.showMessageDialog(MessageType.INFO, message);
    }
});

// add change event listener to the each FilterType radio input element
document.querySelectorAll('input[name="filter-type"]').forEach(selectedFilterType => {
    selectedFilterType.addEventListener("change", event => {
        // access the necessary data clusters for selected filter type and render the user results
        runTimeSortingClusteringService.dataClustersAccessByFilterType(selectedFilterType);
    });
});

// add click event listener to the user result scan button
document.getElementById("user-result-scan-button").addEventListener("click", async event => {
    const githubUsername = document.getElementById("github-username");
    const filterType = document.querySelector('input[name="filter-type"]:checked');
    
    // get the UserRepositoryManageService object
    const userRepositoryManageService = UserRepositoryManageService.getInstance();
    
    // construct UserSession, Following and Follower repositories and run-time data clusters
    const message = await userRepositoryManageService.constructFollowingAndFollowerDataRepository(githubUsername, filterType);
    
    if(message != null){
        NotificationManager.showMessageDialog(MessageType.INFO, message);
    }
});

// add the click event listener to the generate passphrase button
document.getElementById("generate-passphrase-button").addEventListener("click", event => {
    // get the ComponentRenderer object
    const componentRenderer = ComponentRenderer.getInstance();
    // set the generated passphrase to the specsific component
    componentRenderer.renderGeneratedPassphrase();
});

// add the click event listener to the copy passphrase button
document.getElementById("copy-passphrase-button").addEventListener("click", async event => {
    // get the current passphrase component
    const generatePassphrase = document.getElementById("generate-passphrase");

    // get the CopyPasteManager object
    const copyPasteManager = CopyPasteManager.getInstance();
    // initialize the generated passphrase value coping process
    const message = await copyPasteManager.copy(generatePassphrase.value);

    // check if the genearted passphrase coping process success or not
    if(message === "Copied"){
        // generated passphrase coping process success and get the componentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // update the resetable copy process success state
        componentRenderer.renderResetablePassphraseCopiedState();
        
    }else{
        // genearted passphrase coping process not success
        NotificationManager.showMessageDialog(MessageType.INFO, message);
    }
});

// add click event listener to the user data backup export button
document.getElementById("user-data-backup-export-button").addEventListener("click", async event => {
    // get the UserRepositoryManageSerive object
    const userRepositoryManageService = UserRepositoryManageService.getInstance();
    // get the current permission state of the Payload exporting process
    const permissionStatus = userRepositoryManageService.checkPermissionOfPayloadExportingProcess();

    // check if the permission granded or not
    if(permissionStatus === "Permission Granted"){
        // permission granded and get the generate passphrase element
        const generatePassphrase = document.getElementById("generate-passphrase");

        // create the CredentialsValidateService object
        const credentialsValidateService = new CredentialsValidateService();

        // check if the target passphrase is valid or not
        if (credentialsValidateService.validatePassphrase(generatePassphrase.value)) {
            // target passphrase is valid and get the ImportExportGateManageService object
            const importExportGateManageService = new ImportExportGateManageService();

            // construct the latest SerializablePayloadDTO object
            const serializablePayloadDTO = await importExportGateManageService.getLatestSerializablePayload();

            // check if the SerializablePayloadDTO constructing process success or not
            if (serializablePayloadDTO != null) {
                // SerializablePayloadDTO constructing process success
                await importExportGateManageService.exportFile(generatePassphrase.value, serializablePayloadDTO.toJson(), CONFIG.exportFinalFileName);

                // get the ComponentRenderer object
                const componentRenderer = ComponentRenderer.getInstance();
                // reset and the render the generate passphrase value
                componentRenderer.renderGeneratedPassphrase();
            }

        } else {
            // target passphrase is invalid
            NotificationManager.showMessageDialog(MessageType.INFO, "Invalid Passphrase");
        }

    }else{
        // permission rejected
        NotificationManager.showMessageDialog(MessageType.INFO, permissionStatus);
    }
});

// add change event to the user data backup importing input field
document.getElementById("user-data-backup-import").addEventListener("change", async event => {
    // save the upload user data backup file
    const fileUploadResultDTO = ImportExportFileManageService.saveUploadFile(event);

    // check if the upload file saving process success or not 
    if(fileUploadResultDTO instanceof FileUploadResultDTO){
        // upload file saving process success and get the componentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // render the upload file name
        componentRenderer.renderUploadFileName(fileUploadResultDTO.getFileName());

        // check if the FileUploadResultDTO has any warning message
        if(fileUploadResultDTO.getMessage() != null){
            // FileUploadResultDTO has a warning message
            NotificationManager.showMessageDialog(MessageType.INFO, fileUploadResultDTO.getMessage());
        }
    }
});

// add the click event listener to the decrypt payload data button
document.getElementById("decrypt-payload-button").addEventListener("click", async event => {
    // get the selected filer type
    const selectedFilterType = document.querySelector('input[name="filter-type"]:checked');
    // get CredentialsValidateService object
    const credentialsValidateService = new CredentialsValidateService();

    let message = null;

    // check if the selected FilterType valid or not
    if(credentialsValidateService.validateFilterType(selectedFilterType)){
        // selected FilterType valid and get the permission status of the UserSession and check the uplaod file availability
        const permissionStatus = ImportExportFileManageService.checkPermissionOfPayloadImportingProcess();

        // check if the permission granted or not
        if (permissionStatus === "Permission Granted") {
            // permission granted and get the provided import passphrase
            const importPassphrase = document.getElementById("import-passphrase");

            // check if the imported passphrase valid or not
            if (credentialsValidateService.validatePassphrase(importPassphrase.value)) {
                // import passphrase is valid and get the saved upload file
                const uploadFile = ImportExportFileManageService.getUploadFile();

                // get the ImportExportGateManageService object
                const importExportGateManageService = new ImportExportGateManageService();
                // deserialize the payload content and decrypted payload content as json object
                message = await importExportGateManageService.importFile(importPassphrase.value, uploadFile, selectedFilterType);

                // get the ComponentRenderer object
                const componentRenderer = ComponentRenderer.getInstance();
                // render the decrypt payload indicator
                componentRenderer.renderDecryptPayloadIndicator(message);

            } else {
                // import passphrase not valid
                message = "Invalid Passphrase";
            }

        } else {
            // permission denied
            message = permissionStatus;
        }

    }else{
        // selected FilterType invalid
        message = "Invalid Filter Type";
    }

    if(message != null){
        NotificationManager.showMessageDialog(MessageType.INFO, message);
    }
});

// add the click event listener to collapsable button
document.getElementById("collapsable-button").addEventListener("click", event => {
    // get the ComponentRenderer object
    const componentRenderer = ComponentRenderer.getInstance();
    // render the collapsable button icon switch indicate
    componentRenderer.renderCollapsableButtonIconSwitch();
});

// add the click event listener to collapsable button
document.getElementById("collapsable-end-button").addEventListener("click", event => {
    // get the ComponentRenderer object
    const componentRenderer = ComponentRenderer.getInstance();
    // render the collapsable button icon switch indicate
    componentRenderer.renderCollapsableButtonIconSwitch();
});