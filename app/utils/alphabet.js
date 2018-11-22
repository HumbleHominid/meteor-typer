export default function() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz',
        len = alphabet.length;
    return alphabet.charAt(Math.floor(Math.random() * len));
}
