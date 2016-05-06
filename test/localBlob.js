var LocalBlob = require("../lib/src/localBlob.js");
var Property = require("../lib/src/IabstractService.js").Property;
var fs = require("fs");
var should = require("should");
var expect = require("expect");

describe("local blob", function () {
  this.timeout(500000);
  it("should write a blob", function (done) {
    var localBlob = new LocalBlob.LocalBlob(__dirname);
    var property = new Property("test", "image/png", 0, "UTF-8", {});
    var rs = fs.createReadStream(__dirname + "/image.png")
    localBlob.set(property, rs,function() {
      should.exist(1);
      done();
    });
    
  });

  it("should get a blob", function (done) {
    var localBlob = new LocalBlob.LocalBlob(__dirname);
    var rs = fs.createReadStream(__dirname + "/image.png")
    localBlob.get("test", function (result) {
      result.stream.on("data", function (d) {        
        should.exists(d);
      })
      result.stream.on("end", function () {
        should.exists(1);
        done();
      })
      result.stream.on("error", function () {
        should.not.exists(1);
      })

    });
  })



      it("should break", function (done) {
        var localBlob = new LocalBlob.LocalBlob(__dirname);
        try{
        localBlob.get("zz2212",function() { should.equal(1,0);done()});
        } catch (ex){
          should.exist(ex);
          done();
        }
        
      });


  });
