// Compiled using ts2gas 1.6.0 (TypeScript 3.3.3)
var exports = exports || {};
var module = module || { exports: exports };
// NOTE: As of 4/19, the total amount allowed to be stored
// per value in the UserProperties was 9kB. We're lowering that
// slightly here in order to avoid the app crashing when storing
// large values
var PER_VALUE_STORAGE_LIMIT = 8500;
var MULTI_PART_STORAGE_VALUE = 'MULTI_PART_STORAGE_ENABLED';
var StorageService = /** @class */ (function () {
    function StorageService() {
    }
    StorageService.get = function (key) {
        var value = PropertiesService.getUserProperties().getProperty(this.generatePrefixedKey(key));
        if (value === MULTI_PART_STORAGE_VALUE) {
            return this.getMultiPartValue(key);
        }
        return value;
    };
    StorageService.store = function (key, value) {
        if (value.length >= PER_VALUE_STORAGE_LIMIT) {
            this.storeMultiPartValue(key, value);
        }
        else {
            PropertiesService.getUserProperties().setProperty(this.generatePrefixedKey(key), value);
        }
    };
    StorageService["delete"] = function (key) {
        PropertiesService.getUserProperties().deleteProperty(this.generatePrefixedKey(key));
    };
    StorageService.deleteAll = function () {
        PropertiesService.getUserProperties().deleteAllProperties();
    };
    StorageService.generatePrefixedKey = function (key) {
        return "@@APP_STORAGE_SERVICE_" + key;
    };
    StorageService.storeMultiPartValue = function (key, value) {
        var properties = PropertiesService.getUserProperties();
        var prefixedKey = this.generatePrefixedKey(key);
        properties.setProperty(prefixedKey, MULTI_PART_STORAGE_VALUE);
        var chunkNumber = 1;
        for (var i = 0; i < value.length; i += PER_VALUE_STORAGE_LIMIT) {
            var chunk = value.substring(i, i + PER_VALUE_STORAGE_LIMIT);
            properties.setProperty("" + prefixedKey + chunkNumber, chunk);
            chunkNumber += 1;
        }
    };
    StorageService.getMultiPartValue = function (key) {
        var properties = PropertiesService.getUserProperties();
        var prefixedKey = this.generatePrefixedKey(key);
        var value = [];
        var chunkNumber = 1;
        var newChunk = properties.getProperty("" + prefixedKey + chunkNumber);
        while (newChunk != null) {
            value.push(newChunk);
            chunkNumber += 1;
            newChunk = properties.getProperty("" + prefixedKey + chunkNumber);
        }
        return value.join('');
    };
    return StorageService;
}());
