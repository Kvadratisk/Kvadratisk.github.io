let readIndex = 0;
let bitOffset = 0;
let array = null;

const virtualFile = {
    name:"New File",
    path:"",
    size:0,
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

function readByte(count=1,littleEndian=false) {
    let tmp = 0n;
    for (let i = 0; i < count; i++) {
        tmp = (tmp<<(littleEndian?0n:8n))>>(littleEndian?0n:8n)|BigInt(array[readIndex++]);
    }
    return Number.parseInt(tmp);
}

function readBit(count=8,littleEndian=false,reverse=false) {
    readByte(false);
}