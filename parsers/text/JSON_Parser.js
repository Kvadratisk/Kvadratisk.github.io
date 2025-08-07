function toJSON(object,level=0,skipfirst=false,last=true) {
    if (level>16) return "Ö";
    let str = "";
    let comma = last?"":",";
    if (object==null) {
        str+="null\n";
        return str;
    }
    if (object===false || object===true) {
        str+=object+"\n";
        return str;
    }
    let indent = "";
    for (let i = 0; i < level; i++) {
        indent+=" ";
    }
    if (Array.isArray(object)) {
        if (object.length==0) {
            str+=(skipfirst?"":indent)+"[]"+comma+"\n";
        } else {
            str+=(skipfirst?"":indent)+"[\n";
            for (let i = 0; i < object.length; i++) {
                str+=toJSON(object[i],level+1,false,object.length==i+1);
            }
            str+=indent+"]"+comma+"\n";
        }
    } else if (typeof object=="string") {
        str+=(skipfirst?"":indent)+"\""+object+"\""+comma+"\n";
    } else if (typeof object=="number") {
        str+=(skipfirst?"":indent)+object+comma+"\n";
    } else {
        let entries = Object.entries(object);
        str+=(skipfirst?"":indent)+"{\n";
        for (let i = 0; i < entries.length; i++) {
            str+=indent+"\""+entries[i][0]+"\"";
            str+=" : "+toJSON(entries[i][1],level+1,true,entries.length==i+1);
        }
        str+=indent+"}\n";
    } 
    if (level==0) console.log(str);
    return str;
}