

function firstCharToUpperCase(string:string){
    const firstChar= string.charAt(0).toUpperCase();
    const result = firstChar+ string.slice(1)
    return result;
}

export default firstCharToUpperCase;