const assert = require('assert');
const japaneseIpaMap = require("ipa-dict/ja.js");

describe('commonjs import', function () {
    it('Correctly imported a map instance', function () {
        assert(japaneseIpaMap instanceof Map)
    });
});
