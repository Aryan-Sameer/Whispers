export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function getLetters(name) {
    let arr = name.split(" ")
    if (arr.length > 1) {
        return `${arr[0][0].toUpperCase()}${arr[1][0].toUpperCase()}`
    }
    return `${arr[0][0].toUpperCase()}${arr[0][1].toUpperCase()}`
}