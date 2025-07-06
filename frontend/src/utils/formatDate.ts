// Utility to format a UTC date string to 'DD-MM-YY HH:mm' in local time
export function formatLocalDateTime(utcDateString: string): string {
    const dateObj = new Date(utcDateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}


export function getRelativeDayLabel(utcDateString:string,now:Date=new Date()):string{
    const inputDate = new Date(utcDateString);
    // Zero out the time for both dates to compare only the day
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const msPerDay = 1000 * 60 * 60 * 24;
    const dateDiff = Math.round((nowDate.getTime() - inputDay.getTime()) / msPerDay);

    if (dateDiff === 0) {
        return "today";
    } else if (dateDiff === 1) {
        return "yesterday";
    } else {
        return `${dateDiff} days ago`;
    }
}

export function DateToDay(date:string|Date,IncludeMonth:boolean=false,fullMonthName:boolean=false):string{
    const newDate = new Date (date);
    const month = newDate.getMonth();
    const day = newDate.getDate();
    let result;
    console.log(date);
    console.log(day);
    if(IncludeMonth){
        switch (month) {
            case 0:
                result = fullMonthName ? ("January " + day) : (day + " Jan");
                break;
            case 1:
                result = fullMonthName ? ("February " + day) : (day + " Feb");
                break;
            case 2:
                result = fullMonthName ? ("March " + day) : (day + " Mar");
                break;
            case 3:
                result = fullMonthName ? ("April " + day) : (day + " Apr");
                break;
            case 4:
                result = fullMonthName ? ("May " + day) : (day + " May");
                break;
            case 5:
                result = fullMonthName ? ("June " + day) : (day + " Jun");
                break;
            case 6:
                result = fullMonthName ? ("July " + day) : (day + " Jul");
                break;
            case 7:
                result = fullMonthName ? ("August " + day) : (day + " Aug");
                break;
            case 8:
                result = fullMonthName ? ("September " + day) : (day + " Sep");
                break;
            case 9:
                result = fullMonthName ? ("October " + day) : (day + " Oct");
                break;
            case 10:
                result = fullMonthName ? ("November " + day) : (day + " Nov");
                break;
            case 11:
                result = fullMonthName ? ("December " + day) : (day + " Dec");
                break;
            default:
                result = "";
        }
        return result;
    }else{
        return day.toString();
    }
}

export function DateToMonth(date:string|Date,fullMonthName:boolean=false):string{
    const newDate = new Date (date);
    const month = newDate.getMonth();
    let result;
    switch (month) {
        case 0:
            result = fullMonthName ? "January" : "Jan";
            break;
        case 1:
            result = fullMonthName ? "February" : "Feb";
            break;
        case 2:
            result = fullMonthName ? "March" : "Mar";
            break;
        case 3:
            result = fullMonthName ? "April" : "Apr";
            break;
        case 4:
            result = fullMonthName ? "May" : "May";
            break;
        case 5:
            result = fullMonthName ? "June" : "Jun";
            break;
        case 6:
            result = fullMonthName ? "July" : "Jul";
            break;
        case 7:
            result = fullMonthName ? "August" : "Aug";
            break;
        case 8:
            result = fullMonthName ? "September" : "Sep";
            break;
        case 9:
            result = fullMonthName ? "October" : "Oct";
            break;
        case 10:
            result = fullMonthName ? "November" : "Nov";
            break;
        case 11:
            result = fullMonthName ? "December" : "Dec";
            break;
        default:
            result = "";
    }
    return result;
}