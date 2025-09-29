import { GitHubRestApiManager } from "../api/GitHubRestApiManager.js";
import { SerializablePayloadDTO } from "../model/dto/SerializablePayloadDTO.js";
import { UserSession } from "../model/entity/UserSession.js";
import { ComponentRenderer } from "../ui/ComponentRenderer.js";
import { ManifestDataLoader } from "../util/ManifestDataLoader.js";
import { EncryptDataManageService } from "./EncryptDataManageService.js";
import { ImportExportFileManageService } from "./ImportExportFileManageService.js";
import { UserManageService } from "./UserManageService.js";
import { UserRepositoryManageService } from "./UserRepositoryManageService.js";

export class ImportExportGateManageService {

    async getLatestSerializablePayload() {
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();
        // get the GitHubRestApiManager object
        const gitHubRestApiManager = GitHubRestApiManager.getInstance();

        // get the UserSession as a json object
        const userSession = userManageService.getUserSessionJson();
        // get all the following users as a json array
        const followings = userManageService.getAllFollowingUsersJson();
        // get all the follower users as a json array
        const followers = userManageService.getAllFollowersJson();
        // get the current following page number
        const currentFollowingPageNumber = gitHubRestApiManager.getFollowingPageNumber();
        // get the current follower page number
        const currentFollowerPageNumber = gitHubRestApiManager.getFollowerPageNumber();

        // get the ManifestDataLoader object
        const manifestDataLoader = ManifestDataLoader.getInstance();
        // get the ManifestData object
        const manifestData = await manifestDataLoader.loadManifestData();

        // construct the SerializablePayloadDTO object
        const serializablePayloadDTO = new SerializablePayloadDTO(
            new Date(),
            userSession,
            followings,
            followers,
            currentFollowingPageNumber,
            currentFollowerPageNumber
        );

        // check if the ManifestData object access process success or not
        if (manifestData != null) {
            // ManifestData object access process success and set the app version
            serializablePayloadDTO.setVersion(manifestData.getVersion());
            // set the app name
            serializablePayloadDTO.setAppName(manifestData.getAppName());
        }

        return serializablePayloadDTO;
    }

    async exportFile(passphrase, targetObject, finalFileName) {
        // get the EncryptDataManageService object
        const encryptDataManageService = EncryptDataManageService.getInstance(passphrase);
        // encrypt the target payload data object
        const encryptedPayload = await encryptDataManageService.encryptData(targetObject);

        // invoke the file downloading process
        ImportExportFileManageService.downloadFile(encryptedPayload, finalFileName);
    }

    async importFile(passphrase, targetFile, filterType) {
        // get the EncryptDataManageService object
        const encryptDataManageService = EncryptDataManageService.getInstance(passphrase);

        // get the deserialized and encrypted payload content
        const deserializedPayloadContent = await ImportExportFileManageService.getDeserializedPayload(targetFile);
        
        // decrypt the deserialized payload content
        const decryptedPayload = await encryptDataManageService.decryptData(deserializedPayloadContent);

        let message;

        // check if the decryption process successfull or not
        if (decryptedPayload != null) {
            // decryption process successfull and convert the decrypted payload content in to the SerializablePayloadDTO object
            const serializablePayloadDTO = new SerializablePayloadDTO()
                .fromJson(decryptedPayload);

            // get the UserSession json object from imported SerializablePayloadDTO object
            const importUserSessionJson = serializablePayloadDTO.getUserSession();

            // construct the import UserSession object
            const importUserSession = new UserSession()
            .fromJson(importUserSessionJson);

            // get the UserManageService object
            const userManageService = UserManageService.getInstance();
            // get the UserSession object
            const userSession = userManageService.getUserSession();

            // check if the imported backup file is belongs to the target user
            if (importUserSession.getUsername() === userSession.getUsername()) {
                // imported backup file is belongs to the target user
                message = "Decryption Process Successful";

                // get the UserRepositoryManageService
                const userRepositoryManageService = UserRepositoryManageService.getInstance();
                // re-consturct all the main data repositories and runtime clusters
                userRepositoryManageService.reConstructDataRepositoriesAndRunTimeClusters(serializablePayloadDTO, userSession, filterType);

            } else {
                // imported backup file is not belongs to the target user
                message = "Backup File Does Not Belong to This GitHub Account";
            }

        } else {
            // decryption process not successfull
            message = "Decryption Process Failed";
        }

        return message;
    }

    resetAllFileImportRelatedDataAndUi(){
        // remove the currently saved user data backup file
        ImportExportFileManageService.setUploadFile(null);

        // get the componentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();

        // reset the upload file name indicator to default state
        componentRenderer.renderUploadFileName(null);
        // reset the decrypted payload indicator to default state
        componentRenderer.renderDecryptPayloadIndicator(null);

        // generate new passphrase
        componentRenderer.renderGeneratedPassphrase();
    }
}