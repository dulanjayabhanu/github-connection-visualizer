import { MessageType } from "../model/enum/MessageType.js";

export class NotificationManager{
    static showMessageDialog(messageType, message){
        if(messageType instanceof MessageType){
            switch(messageType.name()){
                case MessageType.INFO.name() : {
                    toastr.info(message);
                    break;
                }
                
                case MessageType.WARNING.name() : {
                    toastr.warning(message);
                    break;
                }
                
                case MessageType.SUCCESS.name() : {
                    toastr.success(message);
                    break;
                }
                
                case MessageType.ERROR.name() : {
                    toastr.error(message);
                    break;
                }
            }

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }
}