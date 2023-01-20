class mz {
    constructor(raw=null,name="Test") {
        if (raw==null) return;
        this.loadRaw(raw);
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
    loadRaw(data=null) {
        if (data==null || data.length<64) return;
        // field                        offset (in hex)
        this.magic = readByte(2,false);     //00
        this.cblp = readByte(2);            //02
        this.cp = readByte(2);              //04
        this.crlc = readByte(2);            //06
        this.cparhdr = readByte(2);         //08
        this.minalloc = readByte(2);        //0A
        this.maxalloc = readByte(2);        //0C
        this.ss = readByte(2);              //0E
        this.sp = readByte(2);              //10
        this.csum = readByte(2);            //12
        this.ip = readByte(2);              //14
        this.cs = readByte(2);              //16
        this.lfarlc = readByte(2);          //18
        this.ovno = readByte(2);            //1A
        this.res = readList(8);             //1C
        this.oemid = readByte(2);           //23
        this.oeminfo = readByte(2);         //25
        this.res2 = readList(20);           //27
        this.lfanew = readByte(4);     //3C
        this.data = readList(this.lfanew,1);//40
    }

    toRaw() {
        let tmp = [];
        array = tmp;
        readIndex = 0;
        bitOffset = 0;
        littleEndian = true;
        writeByte(this.magic,2);
        writeByte(this.cblp,2);
        writeByte(this.cp,2);
        writeByte(this.crlc,2);
        writeByte(this.cparhdr,2);
        writeByte(this.minalloc,2);
        writeByte(this.maxalloc,2);
        writeByte(this.ss,2);
        writeByte(this.csum,2);
        writeByte(this.ip,2);
        writeByte(this.cs,2);
        writeByte(this.lfarlc,2);
        writeByte(this.ovno,2);
        writeList(this.res);
        writeByte(this.oemid,2);
        writeByte(this.oeminfo,2);
        writeList(this.res2);
        writeByte(this.lfanew,4);
        writeList(this.data);
        tmp = array;
        return new Uint8Array(tmp);
    }

    decompile(rawData) {
        return [];
    }
}

class PortableExecutable {
    constructor(raw=null,name="Test.dll") {
        this.stub = null;
        this.name=name;
        if (raw==null) return;
        this.loadRaw(raw,name);
    }

    loadRaw(data=null,name="Test.dll") {
        if (data==null) return;
        this.name=name;
        array = data;
        littleEndian = true;
        let warnings = [];
        let dosHeader = new mz(data);
        if (dosHeader.magic != enums.magicNumbers.mz) {
            warnings.push("Magic Number is not consitent with PE/MZ files!");
        }
        if (dosHeader.lfanew<readIndex) {
            warnings.push("Pointer to PE header lies inside the dos header region!");
        }
        if (data.length<(readIndex+24)) {
            console.log("Not enough space for coff header!");
            return;
        }
        this.stub = dosHeader;
        let isImage = readByte(4,false)==0x50450000;
        if (!isImage) readIndex-=4;
        this.isImage = isImage;
        let coffHeader = {
            Machine : readByte(2),          //extract with enums.machinetypes
            NumberOfSections : readByte(2),
            TimeDateStamp : readByte(4),
            PointerToSymbolTable : readByte(4),
            NumberOfSymbols : readByte(4),
            SizeOfOptionalHeader : readByte(2),
            Characteristics  : readByte(2)
        };
        console.log(enums.machineTypes[coffHeader.Machine]);
        this.coffHeader = coffHeader;
        let optionalHeader = null;
        if (isImage) {
            optionalHeader = {
                MagicNumber : readByte(2),
                MajorLinkerVersion : readByte(),
                MinorLinkerVersion : readByte(),
                SizeOfCode : readByte(4),
                SizeOfInitializedData : readByte(4),
                SizeOfUninitializedData : readByte(4),
                AddressOfEntryPoint : readByte(4),
                BaseOfCode : readByte(4)
            };
            if (!(optionalHeader.MagicNumber == 0x10b || optionalHeader.MagicNumber == 0x20b)) {
                console.error("Unkown optional header signature!");
                return;
            }
            let size = 8;
            if (optionalHeader.MagicNumber == 0x10b) {
                optionalHeader.BaseOfData = readByte(4);
                size = 4;
            }
            optionalHeader.windowsSpecific = {
                ImageBase : readByte(size),
                SectionAlignment : readByte(4),
                FileAlignment : readByte(4),
                MajorOperatingSystemVersion : readByte(2),
                MinorOperatingSystemVersion : readByte(2),
                MajorImageVersion : readByte(2),
                MinorImageVersion : readByte(2),
                MajorSubsystemVersion : readByte(2),
                MinorSubsystemVersion : readByte(2),
                Win32VersionValue : readByte(4),
                SizeOfImage : readByte(4),
                SizeOfHeaders : readByte(4),
                CheckSum : readByte(4),
                Subsystem : readByte(2),
                DLLCharacteristics : readByte(2),
                SizeOfStackReserve : readByte(size),
                SizeOfStackCommit : readByte(size),
                SizeOfHeapReserve : readByte(size),
                SizeOfHeapCommit : readByte(size),
                LoaderFlags : readByte(4),
                NumberOfRvaAndSizes : readByte(4)
            };

        }
        function getDataDirectory() {
            return {
                VirtualAddress : readByte(4),
                Size : readByte(4)
            };
        }
        let textDecoder = new TextDecoder("UTF-8");
        function getSectionHeader() {
            return {
                Name : textDecoder.decode(readList(8)),
                VirtualSize : readByte(4),
                VirtualAddress : readByte(4),
                SizeOfRawData : readByte(4),
                PointerToRawData : readByte(4),
                PointerToRelocations : readByte(4),
                PointerToLineNumbers : readByte(4),
                NumberOfRelocations : readByte(2),
                NumberOfLineNumbers : readByte(2),
                Characteristics : readByte(4)
            };
        }
        let dataDirectories = [];
        for (let i = 0; i < optionalHeader.windowsSpecific.NumberOfRvaAndSizes; i++) {
            dataDirectories[i] = getDataDirectory();
        }
        optionalHeader.dataDirectories = {
            ExportTable : dataDirectories[0],
            ImportTable : dataDirectories[1],
            ResourceTable : dataDirectories[2],
            ExceptionTable : dataDirectories[3],
            CertificateTable : dataDirectories[4],
            BaseRelocationTable : dataDirectories[5],
            Debug : dataDirectories[6],
            Architecture : dataDirectories[7],
            GlobalPtr : dataDirectories[8],
            TLSTable : dataDirectories[9],
            LoadConfigTable : dataDirectories[10],
            BoundImport : dataDirectories[11],
            IAT : dataDirectories[12],
            DelayImportDescriptor : dataDirectories[13],
            CLRRuntimeHeader : dataDirectories[14],
            Reserved : dataDirectories[15]
        };
        this.optionalHeader = optionalHeader;
        let sections = [];
        let totalSizeEstimate = 0;
        for (let i = 0; i < coffHeader.NumberOfSections; i++) {
            sections[i] = getSectionHeader();
            totalSizeEstimate += sections[i].VirtualSize;
        }
        this.sections = sections;
        let edata = null;
        console.log(optionalHeader.dataDirectories);
        if (isImage && optionalHeader.dataDirectories.ExportTable.Size>0) {
            edata = {
                ExportDirectoryTable : {
                    ExportFlags : readByte(4),
                    TimeDateStamp : readByte(4),
                    MajorVersion : readByte(4),
                    MinorVersion : readByte(4),
                    NameRVA : readByte(4),
                    OrdinalBase : readByte(4),
                    AddressTableEntries : readByte(4),
                    NumberOfNamePointers : readByte(4),
                    ExportAddressTableRVA : readByte(4),
                    NamePointerRVA : readByte(4),
                    OrdinalTableRVA : readByte(4)
                },
                ExportAddressTable : {

                },
                ExportNamePointerTable : {

                },
                ExportOrdialTable : {

                }
            };
        }
        let vas = new VirtualAddressSpace(totalSizeEstimate*2);
        console.log(totalSizeEstimate);
        for (let i = 0; i < sections.length; i++) {
            let tmpAddr = sections[i].VirtualAddress;
            readIndex = sections[i].PointerToRawData;
            for (let l = 0; l < sections[i].VirtualSize; l++) {
                if (l>sections[i].SizeOfRawData) {
                    vas.setValueAt(0,tmpAddr++);
                    continue;
                }
                vas.setValueAt(readByte(),tmpAddr++);
            }
            console.log("VA: "+sections[i].VirtualAddress+", VS: "+sections[i].VirtualSize+", Ending VA: "+tmpAddr);
        }
        console.log(vas);
        this.edata = edata;
        if (warnings.length>0) {
            console.error(warnings);
        }
    }

    toRaw() {
        let tmp = [];
        let res = this.stub.toRaw();
        array = tmp;
        readIndex = 0;
        bitOffset = 0;
        littleEndian = true;
        let coffHeader = this.coffHeader;
        let optionalHeader = this.optionalHeader;
        writeList(res);
        if (this.isImage) writeByte(0x50450000,4,false);
        writeByte(coffHeader.Machine,2);
        writeByte(coffHeader.NumberOfSections,2);
        writeByte(coffHeader.TimeDateStamp,2);
        writeByte(coffHeader.PointerToSymbolTable,2);
        writeByte(coffHeader.NumberOfSymbols,2);
        writeByte(coffHeader.SizeOfOptionalHeader,2);
        writeByte(coffHeader.Characteristics,2);
        writeByte(optionalHeader.MagicNumber,2);
        writeByte(optionalHeader.MajorLinkerVersion);
        writeByte(optionalHeader.MinorLinkerVersion);
        writeByte(optionalHeader.SizeOfCode,4);
        writeByte(optionalHeader.SizeOfInitializedData,4);
        writeByte(optionalHeader.SizeOfUninitializedData,4);
        writeByte(optionalHeader.AddressOfEntryPoint,4);
        writeByte(optionalHeader.BaseOfCode,4);
        if (!(optionalHeader.MagicNumber == 0x10b || optionalHeader.MagicNumber == 0x20b)) {
            console.error("Unkown optional header signature!");
            return;
        }
        let size = 8;
        if (optionalHeader.MagicNumber == 0x10b) {
            writeByte(optionalHeader.BaseOfData,4);
            size = 4;
        }
        writeByte(optionalHeader.windowsSpecific.ImageBase,size);
        writeByte(optionalHeader.windowsSpecific.SectionAlignment,4);
        writeByte(optionalHeader.windowsSpecific.FileAlignment,4);
        writeByte(optionalHeader.windowsSpecific.MajorOperatingSystemVersion,2);
        writeByte(optionalHeader.windowsSpecific.MinorOperatingSystemVersion,2);
        writeByte(optionalHeader.windowsSpecific.MajorImageVersion,2);
        writeByte(optionalHeader.windowsSpecific.MinorImageVersion,2);
        writeByte(optionalHeader.windowsSpecific.MajorSubSystemVersion,2);
        writeByte(optionalHeader.windowsSpecific.MinorSubSystemVersion,2);
        writeByte(optionalHeader.windowsSpecific.Win32VersionValue,4);
        writeByte(optionalHeader.windowsSpecific.SizeOfImage,4);
        writeByte(optionalHeader.windowsSpecific.SizeOfHeaders,4);
        writeByte(optionalHeader.windowsSpecific.CheckSum,4);
        writeByte(optionalHeader.windowsSpecific.SubSystem,2);
        writeByte(optionalHeader.windowsSpecific.DLLCharacteristics,2);
        writeByte(optionalHeader.windowsSpecific.SizeOfStackReserve,size);
        writeByte(optionalHeader.windowsSpecific.SizeOfStackCommit,size);
        writeByte(optionalHeader.windowsSpecific.SizeOfHeapReserve,size);
        writeByte(optionalHeader.windowsSpecific.SizeOfHeapCommit,size);
        writeByte(optionalHeader.windowsSpecific.LoaderFlags,4);
        writeByte(optionalHeader.windowsSpecific.NumberOfRvaAndSizes,4);
        let dataDirectories = [optionalHeader.dataDirectories.ExportTable, optionalHeader.dataDirectories.ImportTable, optionalHeader.dataDirectories.ResourceTable, optionalHeader.dataDirectories.ExceptionTable, optionalHeader.dataDirectories.CertificateTable, optionalHeader.dataDirectories.BaseRelocationTable, optionalHeader.dataDirectories.Debug, optionalHeader.dataDirectories.Architecture, optionalHeader.dataDirectories.GlobalPtr, optionalHeader.dataDirectories.TLSTable, optionalHeader.dataDirectories.LoadConfigTable, optionalHeader.dataDirectories.BoundImport, optionalHeader.dataDirectories.IAT, optionalHeader.dataDirectories.DelayImportDescriptor, optionalHeader.dataDirectories.CLRRuntimeHeader, optionalHeader.dataDirectories.Reserved];
        for (let i = 0; i < optionalHeader.windowsSpecific.NumberOfRvaAndSizes; i++) {
            writeByte(dataDirectories[i].VirtualAddress,4);
            writeByte(dataDirectories[i].Size,4);
        }
        let textEncoder = new TextEncoder("UTF-8");
        function writeSectionHeader(x) {
                writeList(textEncoder.encode(x.Name));
                writeByte(x.VirtualSize,4);
                writeByte(x.VirtualAddress,4);
                writeByte(x.SizeOfRawData,4);
                writeByte(x.PointerToRawData,4);
                writeByte(x.PointerToRelocations,4);
                writeByte(x.PointerToLineNumbers,4);
                writeByte(x.NumberOfRelocations,2);
                writeByte(x.NumberOfLineNumbers,2);
                writeByte(x.Characteristics,4);
        }
        for (let i = 0; i < coffHeader.NumberOfSections; i++) {
            writeSectionHeader(this.sections[i]);
        }
        console.log(tmp.length-this.stub.lfanew);
        tmp = array;
        return new Uint8Array(tmp);
    }
}
let peFiles = [];

function processFiles() {
    for (let i = 0; i < globalFilesQueue.length; i++) {
        if (!(globalFilesQueue[i].name.endsWith(".dll") || globalFilesQueue[i].name.endsWith(".exe"))) continue;
        readIndex = 0;
        bitOffset = 0;
        let pe = new PortableExecutable(globalFilesQueue[i].data,globalFilesQueue[i].name);
        console.log(pe);
        peFiles[peFiles.length]=pe;
    }
    if (peFiles.length<1) return;
    let inT = document.getElementById("action");
    let inTe = document.getElementById("stripFlag");
    inTe.style="display:inline-block;";
    inT.value="Publicize";
    inT.type="button";
}

let buttonState = 0;

function publicize() {
    if (buttonState>1 || buttonState<0) buttonState=0;
    let inT = document.getElementById("action");
    let inTe = document.getElementById("stripFlag");
    switch (buttonState) {
        case 0:
            for (let i = 0; i < peFiles.length; i++) {
                console.log(peFiles[i].toRaw());
            }
            inTe.style="";
            inT.value = "Download";
        break;
        case 1:
            inT.type = "hidden";
            for (let i = 0; i < peFiles.length; i++) {
                download(peFiles[i].toRaw(),peFiles[i].name);
            }
        break;
    }
    buttonState++;
}

/*

String.fromCharCode
String.charCodeAt

btoa, string chars 0-255 turned into a base64 string
atob, base64 string to string chars 0-255

*/
