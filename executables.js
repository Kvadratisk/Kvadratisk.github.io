class mz {
    constructor(raw=null) {
        if (raw==null) return;
        this.loadRaw(raw);
    }

    loadRaw(data=null) {
        if (data==null || data.length<64) return;
        this.magic = readByte(2);
        this.cblp = readByte(2);
        this.cp = readByte(2);
        this.crlc = readByte(2);
        this.cparhdr = readByte(2);
        this.minalloc = readByte(2);
        this.maxalloc = readByte(2);
        this.ss = readByte(2);
        this.sp = readByte(2);
        this.csum = readByte(2);
        this.ip = readByte(2);
        this.cs = readByte(2);
        this.lfarlc = readByte(2);
        this.ovno = readByte(2);
        this.res = readList(8);
        this.oemid = readByte(2);
        this.oeminfo = readByte(2);
        this.res2 = readList(20);
        this.lfanew = readByte(4);
        this.data = readList(this.lfanew,1);
    }
}

class PortableExecutable {
    constructor(raw=null) {
        if (raw==null) return;
        this.loadRaw(raw);
    }

    loadRaw(data=null) {
        array = data;
        let warnings = [];
        let dosHeader = new mz(data);
        if (dosHeader.magic != enums.magicNumbers.mz) {
            warnings.push("Magic Number is not consitent with PE/MZ files!");
        }
        if (dosHeader.lfanew<readIndex) {
            console.log("Pointer to PE header lies inside the dos header region!");
            return;
        }
        
    }
}

/*
typedef struct _IMAGE_DOS_HEADER {      // DOS .EXE header
    WORD   e_magic;                     // Magic number
    WORD   e_cblp;                      // Bytes on last page of file
    WORD   e_cp;                        // Pages in file
    WORD   e_crlc;                      // Relocations
    WORD   e_cparhdr;                   // Size of header in paragraphs
    WORD   e_minalloc;                  // Minimum extra paragraphs needed
    WORD   e_maxalloc;                  // Maximum extra paragraphs needed
    WORD   e_ss;                        // Initial (relative) SS value
    WORD   e_sp;                        // Initial SP value
    WORD   e_csum;                      // Checksum
    WORD   e_ip;                        // Initial IP value
    WORD   e_cs;                        // Initial (relative) CS value
    WORD   e_lfarlc;                    // File address of relocation table
    WORD   e_ovno;                      // Overlay number
    WORD   e_res[4];                    // Reserved words
    WORD   e_oemid;                     // OEM identifier (for e_oeminfo)
    WORD   e_oeminfo;                   // OEM information; e_oemid specific
    WORD   e_res2[10];                  // Reserved words
    LONG   e_lfanew;                    // File address of new exe header
  }
*/