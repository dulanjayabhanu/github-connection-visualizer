import { CONFIG } from "../config.js";
import { FileUploadResultDTO } from "../model/dto/FileUploadResultDTO.js";
import { UserManageService } from "./UserManageService.js";

export class ImportExportFileManageService{
    static #uploadFile = null;

    static getUploadFile(){
        return ImportExportFileManageService.#uploadFile;
    }

    static setUploadFile(uploadFile){
        ImportExportFileManageService.#uploadFile = uploadFile;
    }

    static downloadFile(targetContent, finalFileName){
        // create the Blob object
        const blob = new Blob(
            [JSON.stringify(targetContent, null, 2)],
            {
                type: "application/json"
            }
        );

        // create the target URL
        const targetURL = URL.createObjectURL(blob);
        // create the anchor element
        const anchorElement = document.createElement("a");
        // set the hyper reference
        anchorElement.href = targetURL;
        // set the downloading file name
        anchorElement.download = finalFileName;

        // add the anchor element to the main DOM
        document,document.body.appendChild(anchorElement);
        anchorElement.click();
        anchorElement.remove();

        // revoke the target URL after delay
        setTimeout(() => {
            URL.revokeObjectURL(targetURL)

        }, CONFIG.fileDownloadDelayInSeconds);
    }

    static async getDeserializedPayload(uploadFile){
        const promise = new Promise((resolve, reject) => {
            // create the FileReader object
            const fileReader = new FileReader();
            
            fileReader.onerror = () => {
                reject(new Error("File read failed"))
            };
            
            fileReader.onload = () =>{
                try{
                    const deserializedJsonObject = JSON.parse(fileReader.result);

                    resolve(deserializedJsonObject);
                    
                }catch(Error){
                    reject(new Error("Invalid JSON"));
                }
            };
            
            // start the file reading process as text
            fileReader.readAsText(uploadFile);

        });

        return promise;
    }

    static saveUploadFile(fileUploadEvent){
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();

        // get the UserSession object
        const userSession = userManageService.getUserSession();

        // reset the current upload file reference
        ImportExportFileManageService.#uploadFile = null;

        let message = null;
        let uploadFileName = null;

        // check if the UserSession available or not
        if(userSession != null){
            // UserSession available and get the upload file extension
            const uploadfileExtension = fileUploadEvent.target.files[0].name.split(".")[3].toLowerCase();
            // get the upload file MIME type
            const uploadfileMimeType = fileUploadEvent.target.files[0].type;
            
            // construct the accept mime type;
            const acceptMimetype = `application/${CONFIG.acceptImportFileExtension}`;
            
            // check if the upload file acceptable file or not
            if(uploadfileExtension === CONFIG.acceptImportFileExtension && uploadfileMimeType === acceptMimetype){
                // upload file is acceptable file and store the uploaded user data backup file
                ImportExportFileManageService.#uploadFile = fileUploadEvent.target.files[0];
                
                // get the the upload file name
                uploadFileName = fileUploadEvent.target.files[0].name;
                
            }else{
                // upload file is not acceptable file 
                message = "Invalid File Type";
            }
            
        }else{
            // UserSession not available
            message = "Invalid Username";
        }

        // create the FileUploadResultDTO object
        const fileUploadResultDTO = new FileUploadResultDTO(
            uploadFileName,
            message);

        return fileUploadResultDTO;
    }

    static checkPermissionOfPayloadImportingProcess(){
        // get the UserManageService object
        const userManageService = UserManageService.getInstance();
        
        // get the UserSession object
        const userSession = userManageService.getUserSession();
        
        let message = null;

        // check if the UserSession already available or not
        if(userSession != null){
            // UserSession already available and check if the uploadFile available or not
            if(ImportExportFileManageService.#uploadFile != null){
                // uploadFile available
                message = "Permission Granted";
                
            }else{
                // uploadFile not available
                message = "Upload Backup File";
            }
            
        }else{
            // UserSession not available
            message = "Provide Your Username";
        }

        return message;
    }
}