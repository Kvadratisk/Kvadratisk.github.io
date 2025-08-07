function removeLeading(str) {
    let o = "";
    for (let i = 0; i < str.length; i++) {
        if ((str[i]=="\n")||(str[i]=="\r")||(str[i]=="\x20")||(str[i]=="\t")) continue;
        o=str.substring(i);
        break;
    }
    return o;
}
function xmlToStr(root) {
    let str = "";
    for (let i = 0; i < root.childNodes.length; i++) {
        let mode = root.childNodes[i].mode;
        let name = root.childNodes[i].name;
        str+="<"+(mode==1?"?":"")+name;
        root.childNodes[i].tags.forEach((x,y)=>{
            str+=" "+y+"="+x;
        });
        str+=(mode==1)?"?>\n":((mode==2)?"/>\n":">\n");
        str+=removeLeading(root.childNodes[i].textContent);
        str+=xmlToStr(root.childNodes[i]);
        if (mode==0) {
            str+="</"+name+">\n";
        }
    }
    return str;
}
function parseXML(str) {
    let curStr = "";
    let nodes = [];
    let parsingNode = null;
    function resetNode() {
        parsingNode = {
            name : "",
            mode : 0,
            tags : new Map(),
            textContent : "",
            childNodes : [],
            open : true
        };
    }
    function lastOpen(name=null) {
        if (name!=null) {
            for (let i = nodes.length-1; i>=0; i--) {
                if (nodes[i].open && nodes[i].name==name) return i;
            }
        } else {
            for (let i = nodes.length-1; i>=0; i--) {
                if (nodes[i].open) return i;
            }
        }
        return -1;
    }
    resetNode();
    parsingNode.name="root";
    parsingNode.open=true;
    nodes.push(parsingNode);
    resetNode();
    for (let i = 0; i < str.length; i++) {
        if (str[i]=="<") {
            curStr+=str[i];
            if (str[i+1]=="/") {
                curStr+=str[i+1];
                for (i+=2;i<str.length;i++) {
                    curStr+=str[i];
                    if (str[i]==">") break;
                }
                let id = lastOpen(curStr.slice(2,curStr.length-1));
                if (id!=-1) {
                    nodes[id].open=false;
                }
                curStr="";
                continue;
            }
            if (str[i+1]=="?") {
                curStr+=str[i+1];
                for (i+=2;i<str.length;i++) {
                    curStr+=str[i];
                    if (str[i]==">") break;
                }
                curStr=curStr.slice(2,curStr.length-2);
                let c = curStr.split(" ");
                parsingNode.name=c[0];
                for (let l = 1; l < c.length; l++) {
                    let parts = c[l].split("=");
                    parsingNode.tags.set(parts[0],parts[1]);
                }
                parsingNode.open=false;
                parsingNode.mode=1;
                let id = lastOpen();
                if (id!=-1) {
                    nodes[id].childNodes.push(parsingNode);
                }
                nodes.push(parsingNode);
                resetNode();
                curStr="";
                continue;
            }
            for (i++;i<str.length;i++) {
                curStr+=str[i];
                if (str[i]==">") {
                    let id = lastOpen();
                    if (id!=-1) {
                        nodes[id].childNodes.push(parsingNode);
                    }
                    nodes.push(parsingNode);
                    let o = 1;
                    if (str[i-1]=="/") {
                        o++;
                        parsingNode.open=false;
                        parsingNode.mode=2;
                    }
                    curStr=curStr.slice(1,curStr.length-o);
                    let p = curStr.split(" ");
                    parsingNode.name=p[0];
                    for (let l = 1; l < p.length; l++) {
                        let parts = p[l].split("=");
                        parsingNode.tags.set(parts[0],parts[1]);
                    }
                    resetNode();
                    curStr="";
                    break;
                }
            }
        } else {
            let id = lastOpen();
            if (id!=-1) {
                nodes[id].textContent+=str[i];
            }
        }
    }
    return nodes[0];
}