/* Since javascript only has a built-in async version of sha256, I added a synchronous version. */
/* The following code is based on this resource: https://github.com/liangtengyu/wx_gzh_article/blob/master/How%20SHA-2%20Works%20Step-By-Step%20(SHA-256).md */

function hashDigest(textToHash) {
    let textAsBinary = convertToBinary(textToHash);
    textAsBinary = appendOne(textAsBinary);
    textAsBinary = addPadding(textAsBinary);
    textAsBinary = addLength(textAsBinary, textToHash);

    const blocks = convertToBlocks(textAsBinary);

    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    for (const block of blocks) {
        let words = convertToWords(block);
        words = modifyZeroWords(words);
        [h0, h1, h2, h3, h4, h5, h6, h7] = compressWords(words, h0, h1, h2, h3, h4, h5, h6, h7);
    }

    return combineDigestParts(h0, h1, h2, h3, h4, h5, h6, h7);
}

function convertToBinary(textToHash) {
    // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
    const encoder = new TextEncoder();
    // Text is encoded as UTF-8
    const bytes = encoder.encode(textToHash);

    return Array.from(bytes)
        .map(byte => byte.toString(2).padStart(8, "0"))
        .join("");
}

function appendOne(textAsBinary) {
    return textAsBinary + "1";
}

function addPadding(textAsBinary) {
    while ((textAsBinary.length + 64) % 512 !== 0) {
        textAsBinary += "0";
    }

    return textAsBinary;
}

function addLength(textAsBinary, originalText) {
    const encoder = new TextEncoder();
    // We have to encode this because not every character in a string is the same length in bytes
    const bitLength = encoder.encode(originalText).length * 8;

    const bitLengthBinary = bitLength.toString(2).padStart(64, '0');
    return textAsBinary + bitLengthBinary;
}

function convertToBlocks(textAsBinary) {
    const blockSize = 512;
    const blocks = [];

    for (let i = 0; i < textAsBinary.length; i += blockSize) {
        blocks.push(textAsBinary.slice(i, i + blockSize));
    }

    return blocks;
}

function convertToWords(block) {
    const wordLength = 32;
    const words = [];

    for (let i = 0; i < block.length; i += wordLength) {
        words.push(parseInt(block.slice(i, i + wordLength), 2));
    }

    return words;
}

function getS0(word) {
    const shift7 = 7;
    const shift18 = 18;
    const shift3 = 3;

    const rotateRight7 = rotateRight(word, shift7);
    const rotateRight18 = rotateRight(word, shift18);
    const shiftRight3 = word >>> shift3;

    return rotateRight7 ^ rotateRight18 ^ shiftRight3;
}

function getS1(word) {
    const shift17 = 17;
    const shift19 = 19;
    const shift10 = 10;

    const rotateRight17 = rotateRight(word, shift17);
    const rotateRight19 = rotateRight(word, shift19);
    const shiftRight10 = word >>> shift10;

    return rotateRight17 ^ rotateRight19 ^ shiftRight10;
}

function modifyZeroWords(words) {
    for (let i = 16; i < 64; i++) {
        const s0 = getS0(words[i - 15]);
        const s1 = getS1(words[i - 2]);

        words[i] = modifyZeroWord(words[i - 16], s0, words[i - 7], s1);
    }

    return words;
}

function modifyZeroWord(word16, s0, word7, s1) {
    return (word16 + s0 + word7 + s1) >>> 0;
}

function compressWords(words, h0, h1, h2, h3, h4, h5, h6, h7) {
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
        const s1 = getCompressionS1(e) >>> 0;
        const ch = getCompressionCh(e, f, g) >>> 0;
        const temp1 = getCompressionTemp1(h, s1, ch, k[i], words[i]) >>> 0;
        const s0 = getCompressionS0(a) >>> 0;
        const maj = getCompressionMaj(a, b, c) >>> 0;
        const temp2 = getCompressionTemp2(s0, maj) >>> 0;

        h = g;
        g = f;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
    }

    // >>> 0 correctly handles negative integers, and it is much faster than modulo 2**32
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;

    return [h0, h1, h2, h3, h4, h5, h6, h7];
}

function getCompressionS1(e) {
    const rotate6 = 6;
    const rotate11 = 11;
    const rotate25 = 25;
    return rotateRight(e, rotate6) ^ rotateRight(e, rotate11) ^ rotateRight(e, rotate25);
}

function getCompressionCh(e, f, g) {
    return (e & f) ^ (~e & g);
}

function getCompressionTemp1(h, s1, ch, k, w) {
    return h + s1 + ch + k + w;
}

function getCompressionS0(a) {
    const rotate2 = 2;
    const rotate13 = 13;
    const rotate22 = 22;
    return rotateRight(a, rotate2) ^ rotateRight(a, rotate13) ^ rotateRight(a, rotate22);
}

function getCompressionMaj(a, b, c) {
    return (a & b) ^ (a & c) ^ (b & c);
}

function getCompressionTemp2(s0, maj) {
    return s0 + maj;
}

function rotateRight(x, n) {
    const wordLength = 32;
    return (x >>> n) | (x << (wordLength - n)) >>> 0;
}

function combineDigestParts(h0, h1, h2, h3, h4, h5, h6, h7) {
    const base16 = 16;
    const hexLength = 8;

    return [h0, h1, h2, h3, h4, h5, h6, h7]
        .map(part => part.toString(base16).padStart(hexLength, '0'))
        .join('');
}

export { hashDigest };
