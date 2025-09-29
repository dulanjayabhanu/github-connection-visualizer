import { ManifestDataLoader } from "./util/ManifestDataLoader.js";
import { ValueFormatService } from "./util/ValueFormatService.js";

export class CONFIG{

    static appVersion = null;

    static itemPerPage = 100;

    static scanAttemptRemainingcount = 60;
    static scanTimeDurationInMinutes = 60;

    static placeholderTimeoutDelayInSeconds = 1000 * 0.5;
    static fileDownloadDelayInSeconds = 1000 * 1;
    static copyIndicatorRestDelayInSeconds = 1000 * 1;

    static passphraseLength = 24;

    static acceptImportFileExtension = "json";
    static exportFinalFileName = null;

    static screenFilterationThresholdInPixels = 1024;

    static privacyPolicyLastUpdateDate = new Date("2025-09-29");
    static privacyPolicyEffectiveDate = new Date("2025-09-29");
    static termsOfUseLastUpdateDate = new Date("2025-09-29");
    static termsOfUseEffectiveDate = new Date("2025-09-29");

    static async initialize(){
        // get the ManifestDataLoader object
        const manifestDataLoader = ManifestDataLoader.getInstance();
        // load the ManifestData object
        const manifestData = await manifestDataLoader.loadManifestData();
        
        // check if the ManifestData object load process success or not
        if(manifestData){
            // ManifestData object load process success
            CONFIG.appVersion = manifestData.getVersion();

            // create the ValuFormatService object
            const valueFormatService = new ValueFormatService();
            const formattedDate = valueFormatService.formatNumericDate(new Date());
            
            // assign the final export file name
            CONFIG.exportFinalFileName = `github-connection-visualizer_v${CONFIG.appVersion}_backup_${formattedDate}.json`;
        }
    }

    constructor(){
        throw new Error("CONFIG has a private constructor");
    }
}