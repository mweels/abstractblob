/// <reference path="../typings/main.d.ts" />
"use strict";
var IabstractService_1 = require("./IabstractService");
var fs = require("fs");
var lengthStream = require('length-stream');
var sanitize = require("sanitize-filename");
var LocalBlob = (function () {
    function LocalBlob(rootDirectory) {
        this.rootDirectory = rootDirectory;
    }
    LocalBlob.prototype.getPropertyFile = function (key) {
        return this.rootDirectory + "/" + key + ".p";
    };
    LocalBlob.prototype.getDatFile = function (key) {
        return this.rootDirectory + "/" + key + ".dat";
    };
    LocalBlob.prototype.get = function (key, resultCallback) {
        var _this = this;
        key = sanitize(key).toLowerCase();
        var datFile = this.rootDirectory + "/" + key + ".dat";
        var r = fs.statSync(this.getPropertyFile(key));
        fs.readFile(this.getPropertyFile(key), "utf-8", function (err, data) {
            if (err)
                throw err;
            var property = JSON.parse(data);
            var readStream = fs.createReadStream(_this.getDatFile(key), { encoding: 'utf-8' });
            var result = new IabstractService_1.Result(property, readStream);
            resultCallback(result);
        });
    };
    LocalBlob.prototype.set = function (property, stream, callback) {
        var me = this;
        property.key = sanitize(property.key).toLowerCase();
        try {
            fs.unlinkSync(this.getPropertyFile(property.key));
            fs.unlinkSync(this.getDatFile(property.key));
        }
        catch (ex) { }
        ;
        var ll = function (length) {
            property.length = length;
            fs.writeFile(me.getPropertyFile(property.key), JSON.stringify(property), function (err) {
                if (err)
                    throw err;
            });
        };
        var lStream = lengthStream(ll);
        var ws = fs.createWriteStream(this.getDatFile(property.key));
        stream
            .pipe(lStream)
            .pipe(ws);
        ws.on("error", function (err) {
            throw err;
        });
        ws.on("close", function () {
            callback();
        });
    };
    return LocalBlob;
}());
exports.LocalBlob = LocalBlob;
