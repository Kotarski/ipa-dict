import assert from 'assert';
import japaneseIpaMap from "ipa-dict/ja.js";

describe('module import', function () {
    it('Correctly imported a map instance', function () {
        assert(japaneseIpaMap instanceof Map)
    });
});
