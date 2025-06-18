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