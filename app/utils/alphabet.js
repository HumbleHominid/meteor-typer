import EmberObject from '@ember/object';

export default function() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz',
        len = alphabet.length;
    return alphabet.charAt(Math.floor(Math.random() * len));
}
