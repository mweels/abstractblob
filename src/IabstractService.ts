/// <reference path="../typings/main.d.ts" />
import * as stream from 'stream';
import fs = require("fs");

export class Property {
    key: string;
    contentType: string;
    length: number;
    encoding: string;
    extended : any;
    
    constructor(key: string, contentType: string, length : number, encoding: string,extended: any){
        this.key = key;
        this.contentType = contentType;
        this.length = length;
        this.encoding = encoding;
        this.extended = extended;    
    }    
}
export class Result {
    property: Property;
    stream : stream.Readable;
    constructor(property: Property, stream : fs.ReadStream) {
        this.property = property;
        this.stream = stream;
    }    
}

export interface IabstractService{    
    get(key: string, resultCallback: (result: Result) => void): void;
    set(property: Property, stream: fs.ReadStream, callback: () => void) : void;
}
