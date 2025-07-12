function limitString({string,charCount}:{string:string,charCount:number}){
    const length = string.length;
    if(length===0){
        return "";
    }

    if(length<=charCount){
        return string;
    }
    return string.slice(0,charCount)+"...";
}

export default limitString;