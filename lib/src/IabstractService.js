"use strict";
var Property = (function () {
    function Property(key, contentType, length, encoding, extended) {
        this.key = key;
        this.contentType = contentType;
        this.length = length;
        this.encoding = encoding;
        this.extended = extended;
    }
    return Property;
}());
exports.Property = Property;
var Result = (function () {
    function Result(property, stream) {
        this.property = property;
        this.stream = stream;
    }
    return Result;
}());
exports.Result = Result;
