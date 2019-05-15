const util = require('util')
var enc = new util.TextEncoder(); // always utf-8
var dec = new util.TextDecoder("utf-8");

/**
 * Encrypt and decrypt data by XOR
 * @param {*} data 
 * @param {*} key 
 */
function cryptoraphy(data, key) {
    var dataLength = data.byteLength
    let result = new Uint8Array(dataLength)
    for (var i = 0; i < dataLength; i++) {
        result[i] = data.values()[i] ^ key[i % key.byteLength]
    }
    return result
}


/**
 * Convert string to hex
 * @param {*} str 
 */
function str2hex(str) {
    let hex = ""
    try {
        hex = unescape(encodeURIComponent(str))
            .split('').map(function (v) {
                return v.charCodeAt(0).toString(16)
            }).join('')
    }
    catch (e) {
        hex = str
        console.log('invalid text input: ' + str)
    }
    return hex
}


/**
 * Convert buffer array to hex
 * @param {*} buffer 
 */
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function encrypt(msg, id) {
    key = enc.encode(id);
    var typedArray = new Uint8Array(str2hex(JSON.stringify(msg)).match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))

    return new Uint8Array(cryptoraphy(typedArray, key))
}

module.exports.decrypt = function(msg, id) {
    key = enc.encode(id);
    return dec.decode(cryptoraphy(msg, key))
}

module.exports.sendTo = function (connection, id, message) {
    connection.send(encrypt(message, id));
}

