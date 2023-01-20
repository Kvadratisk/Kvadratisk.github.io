let readIndex = 0;
let bitOffset = 0;
let array = null;
let littleEndian = false;

class VirtualAddressSpace {
    constructor(size=1,imageBase = 0) {
        this.ram = new Uint8Array(size);
        this.baseAddress = imageBase;
    }
    getValueAt(address=0) {
        if (address-this.baseAddress>this.ram.length) console.log("End of VAS");
        return this.ram[Math.max(0,Math.min(this.ram.length,address-this.baseAddress))];
    }
    setValueAt(value=0,address=0) {
        if (address-this.baseAddress>this.ram.length) console.log("End of VAS");
        this.ram[Math.max(0,Math.min(this.ram.length,address-this.baseAddress))]=value;
    }
}

function fileBrowser() {

}

const virtualFile = {
    name:"New File",
    path:"",
    size:0,
    data:[],
    time:0,
    type:0
}

const virtualDirectory = {
    name:"New Directory",
    path:"",
    files:[],
    size:0,
    time:0,
    type:0
}

function writeList(list=null) {
    if (list==null) return;
    for (let i = 0; i < list.length; i++) {
        array[readIndex++] = list[i];
    }
}

function readString() {
    let tmp = [];
    let i = 1;
    while (i!=0) {
        tmp[tmp.length] = i = readByte();
    }
    return new Uint8Array(tmp);
}

function writeByte(data=0,length=1,endian=littleEndian) {
    data = BigInt(data);
    for (let i = 0; i < length; i++) {
        array[readIndex++] = Number.parseInt(data>>(endian?BigInt(8*i):BigInt(8*((length-1)-i)))&0xffn);
    }
}

function readList(count=1,mode=0) {
    if (mode!=0) {
        count = count - readIndex;
    }
    let tmp = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
        tmp[i] = array[readIndex++];
    }
    return tmp;
}

function readByte(count=1,endian=littleEndian) {
    let tmp = 0n;
    for (let i = 0; i < count; i++) {
        tmp = (tmp<<(endian?0n:8n)) | BigInt(array[readIndex++])<<(endian?BigInt(i*8):0n);
    }
    if (tmp<Number.MAX_SAFE_INTEGER) tmp = Number.parseInt(tmp);
    return tmp;
}

function readBit(count=8,reverse=false) {
    readByte(false);
}
