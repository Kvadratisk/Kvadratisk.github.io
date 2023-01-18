const defaultPath = "A:/";
const enums = {
    magicNumbers : {
        mz : 0x4D5A,
        pe : 0,
        png : 0,
        gif : 0,
        jpg : 0,
        jpeg : 0
    },
    fileTypes : {
        mz : 0
    }
};
Object.freeze(enums);
Object.freeze(enums.magicNumbers);

const globalFilesQueue = [];

async function queueFiles(tmp=null) {
    for (let i = 0; i < tmp.length; i++) {
        if (!tmp[i]) continue;
        let tmpObj = {
            name : tmp[i].name,
            lastModified : tmp[i].lastModified,
            data : new Uint8Array(await toArrayBuffer(tmp[i])),
            path : defaultPath
        };
        if (tmp[i].customPath) {
            tmpObj.path = tmp[i].customPath;
        }
        if (globalFilesQueue.includes(tmpObj)) continue;
        globalFilesQueue[globalFilesQueue.length] = tmpObj;
    }
    console.log(globalFilesQueue);
}
/*
function fastGetFileType(raw) {

}

function getFileType(raw) {

}

const musicList = [];
const vFiles = [];
const path = "A:/";
*/
function delay(x) {
    return new Promise(resolve => setTimeout(resolve,x));
}
