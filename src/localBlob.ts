/// <reference path="../typings/main.d.ts" />

import {IabstractService} from "./IabstractService";
import {Property} from "./IabstractService";
import {Result} from "./IabstractService";
import * as stream from 'stream';
import fs = require("fs");
var lengthStream = require('length-stream');
var sanitize = require("sanitize-filename");

export class LocalBlob implements IabstractService {

    rootDirectory: string;

    constructor(rootDirectory: string) {
        this.rootDirectory = rootDirectory;
    }

    getPropertyFile(key: string): string {
        return this.rootDirectory + "/" + key + ".p"
    }

    getDatFile(key: string): string {
        return this.rootDirectory + "/" + key + ".dat"
    }

    get(key: string, resultCallback: (result: Result) => void): void {

        key = sanitize(key).toLowerCase();


        let datFile = this.rootDirectory + "/" + key + ".dat";

        var r = fs.statSync(this.getPropertyFile(key));
 
        fs.readFile(this.getPropertyFile(key), "utf-8", (err, data) => {
            if (err)
                throw err;

            let property = <Property>JSON.parse(data);
            let readStream = fs.createReadStream(this.getDatFile(key), { encoding: 'utf-8' });
            let result = new Result(property, readStream);
            resultCallback(result);
        });

    }

    set(property: Property, stream: fs.ReadStream, callback: () => void): void {

        let me = this;

        property.key = sanitize(property.key).toLowerCase();


        try {
            fs.unlinkSync(this.getPropertyFile(property.key));
            fs.unlinkSync(this.getDatFile(property.key));
        } catch (ex) { };

        let ll = function (length: any) {
            property.length = length;
            fs.writeFile(me.getPropertyFile(property.key), JSON.stringify(property), (err) => {
                if (err)
                    throw err;

            });
        }

        var lStream = lengthStream(ll);
        var ws = fs.createWriteStream(this.getDatFile(property.key));
        stream
            .pipe(lStream)
            .pipe(ws);

        ws.on("error", function (err: any) {
            throw err;
        })

        ws.on("close", function () {            
            callback();
        })
    }




}