export class ValueFormatService{
    formatNumber(number){
        let formattedNumber;

        if(parseInt(number) < 10){
            formattedNumber = "0" + String(number);

        }else{
            formattedNumber = new Intl.NumberFormat('en-US').format(parseInt(number));
        }

        return formattedNumber;
    }

    formatDate(date){
        if (date instanceof Date) {
            return date.toDateString();

        } else {
            throw new Error("Unmatch Parameter Type");
        }
    }

    formatNumericDate(date){
        if(date instanceof Date){
            // get the year
            const year = date.getFullYear();
            // get the month
            const month = ((date.getMonth() + 1) < 10 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1));
            // get the day
            const day = (date.getDate() < 10 ? "0" + String(date.getDate()) : String(date.getDate()));

            // construct the numeric date
            const numericDate = `${year}-${month}-${day}`;
            return numericDate;

        }else{
            throw new Error("Unmatch Parameter Type");
        }
    }
}