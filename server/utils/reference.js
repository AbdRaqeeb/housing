/**
 *@returns {string}
 *@desc Generate Ref number
 **/
export function generateReference(num) {
    const year = new Date().getFullYear();
    const randomNumbers = Math.floor(Math.pow(10, num - 1 ) + Math.random() * 9 * Math.pow(10, num -1));
    return `H-${year}-${randomNumbers}`;
}
