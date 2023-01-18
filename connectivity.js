async function xhr(method="get",url=null,responseType=null,async=true) {
    if (url==null || typeof url != "string") return;
    let fail = false;
    let response = null;
    let xml = new XMLHttpRequest();
    if (responseType!=null) {
        xml.responseType=responseType;
    }
    xml.onreadystatechange=function() {
        if (xml.readyState==4) {
            if (xml.status==200) {
                response = xml.response;
            } else {
                fail=true;
            }
        }
    }
    xml.open(method,url,async);
    xml.send();
    return new Promise(resolve => async function() {
        while (xml.readyState!=4) {
            await delay(15);
        }
        if (fail) resolve();
        resolve(response);
    }());
}

async function fetchAsyncReader(url) {
    if (typeof url != "string") return null;
    let tmp = await xhr("get",url,"arraybuffer");
    return tmp;
}

async function download(data=null,name="New File") {
    if (data==null) return;
    let img = document.createElement("a");
    img.href = URL.createObjectURL(new Blob([data],{type:"raw/binary"}));
    img.download = name;
    img.click();
    URL.revokeObjectURL(img.href);
}

async function toArrayBuffer(input=null) {
    if (!((input instanceof Blob) || (input instanceof File))) return;
    let reader = new FileReader();
    let fail = false;
    let resultArray = [];
    reader.onload=function() {
        resultArray = reader.result;
    }
    reader.onerror = function() {
        fail = true;
    }
    reader.readAsArrayBuffer(input);
    return new Promise(resolve => async function() {
        while (reader.readyState!=2) {
            await delay(15);
        }
        if (fail) resolve();
        resolve(resultArray);
    }());
}

function playSoundFile(data=null) {
    if (data==null) return;
    let audio = new Audio(URL.createObjectURL(data));
    audio.captureStream();
    audio.play();
}