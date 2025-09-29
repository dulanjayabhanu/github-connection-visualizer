import { UiEstablisher } from "./ui/UiEstablisher.js";
import { CONFIG } from "./config.js";
import { ScreenFilterationManager } from "./ui/ScreenFilterationManager.js";
import { NotificationManager } from "./ui/NotificationManager.js";
import { MessageType } from "./model/enum/MessageType.js";

const screenFilterationManager = ScreenFilterationManager.getInstance();

const uiEstablisher = new UiEstablisher();

// establish the popover component behaviour
uiEstablisher.establishPopover();
// configure the custom notification object
uiEstablisher.establishToastr();
// establish all the continous date related components
uiEstablisher.establishOutOfScopeContinuousDateRelatedComponents();
// establish last updated and effective date components
uiEstablisher.establishOutOfScopeUpdatedAndEffectiveDates();

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

    // add the contentmenu listener to disable the right-click event
    document.addEventListener("contextmenu", event => {
        // prevent the right click event
        event.preventDefault();

        // display the necessary notification message
        NotificationManager.showMessageDialog(MessageType.WARNING, "Right Click Is Disabled On This App")
    });
});