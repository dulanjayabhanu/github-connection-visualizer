import { ComponentRenderer } from "./ComponentRenderer.js";

export class UiEstablisher{
    establishPopover(){
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        
        popoverTriggerList.forEach(popoverTriggerEl => {
            
            new bootstrap.Popover(
                popoverTriggerEl, 
                { 
                    html: true
                }
            )
        });
    }

    establishToastr(){
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';
        toastr.options.preventDuplicates = true;
        toastr.options.newestOnTop = true;
    }

    establishPreProccessedValues(){
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // add the generate passphrase value to generate passphrase component
        componentRenderer.renderGeneratedPassphrase();
    }

    establishContinuousDateRelatedComponents(){
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // render the continuos date related components
        componentRenderer.renderContinuousDateRelatedComponents();
    }

    establishAppVersion(){
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // render the continuos date related components
        componentRenderer.renderAppVersion();
    }

    establishOutOfScopeContinuousDateRelatedComponents(){
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // render the continuos date related components located at out of scope
        componentRenderer.renderOutOfScopeContinuousDateRelatedComponents();
    }

    establishOutOfScopeUpdatedAndEffectiveDates(){
        // get the ComponentRenderer object
        const componentRenderer = ComponentRenderer.getInstance();
        // render the last updated and effective dates at out of scope
        componentRenderer.renderOutOfScopeUpdatedAndEffectiveDates();
    }

}