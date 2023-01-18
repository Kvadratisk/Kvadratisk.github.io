class compressionStream {
    constructor(name="Stream") {

    }
    readNext(byteLen=1) {

    }
}
class folder {
    constructor(name="Blank") {
        this.name=name;
        this.files = [];
    }
    addFile(data=[],name="new file") {
        
    }
}

class Archive {
    constructor(name="Archive") {
        this.name = name;
        this.isCompressed = false;
        this.files = [];
    }
    loadRaw(arraybuffer=null) {
        if (typeof arraybuffer!="Uint8Array") return;
        console.log("Hello");
    }
}

/*
class file {
    constructor(x) {
        this.name=x;
    }
    compress(method=0) {

    }
    decompress(method=0) {

    }
    save(mode=0) {
        saveAs(this.name);
    }
    saveAs(name="New File",mode=0) {
    }
}
*/