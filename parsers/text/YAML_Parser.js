function parseYML(str) {
    let o = [];
    let indentation = 0;
    let curStr = "";
    let curObject = null;
    function reset() {
        curObject={
            name:"",
            value: [],
            childNodes:[]
        };
    }
    reset();
    let activeObjects = [];
    for (let i = 0; i < str.length; i++) {
        if (str[i]=="\n" || str[i]=="\r" || i+1==str.length) {
            if (i+1==str.length) curStr+=str[i];
            let parent = null;
            for (let l = 0; l < indentation; l++) {
                parent = activeObjects[l];
                if (activeObjects[l]==null) {
                    console.log("Malformatted YML");
                    return;
                }
            }
            activeObjects=activeObjects.slice(0,indentation);
            if (curStr.startsWith("-")) {
                curObject.value.push(curStr.substring(1));
            } else {
                reset();
                let parts = curStr.split(":");
                curObject.name=parts[0];
                if (parts[1]!=null && parts[1].length>0) curObject.value=parts[1];
            }
            if (parent!=null) {
                parent.childNodes.push(curObject);
            }
            if (indentation==0) o.push(curObject);
            activeObjects[indentation]=curObject;
            curStr="";
            indentation=0;
            continue;
        }
        if (curStr.length==0 && (str[i]=="\x20" || str[i]=="\t")) {
            indentation++;
            continue;
        }
        curStr+=str[i];
    }
    return o;
}