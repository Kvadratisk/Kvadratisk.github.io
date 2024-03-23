<?php
$time = (int)floor(microtime(true)/60);
$tmpfile = fopen("track.txt","r");
$passCount = 0;
$lastTime = intval(fread($tmpfile,16),16);
if ($lastTime==$time) {
    $passCount=fread($tmpfile,1);
}
fclose($tmpfile);
if (is_null($_POST["Data"]) || strlen($_POST["Data"])==0 || strlen($_POST["Data"])>10000 || $passCount>=4) {
    echo "Fail";
    exit(0);
}
$tmpfile = fopen("track.txt","w+");
$testStr = "";
$testVal = $time;
for ($i = 0; $i < 16; $i++) {
    switch ($testVal&0xF) {
        case 0:
            $testStr="0".$testStr;
            break;
        case 1:
            $testStr="1".$testStr;
            break;
        case 2:
            $testStr="2".$testStr;
            break;
        case 3:
            $testStr="3".$testStr;
            break;
        case 4:
            $testStr="4".$testStr;
            break;
        case 5:
            $testStr="5".$testStr;
            break;
        case 6:
            $testStr="6".$testStr;
            break;
        case 7:
            $testStr="7".$testStr;
            break;
        case 8:
            $testStr="8".$testStr;
            break;
        case 9:
            $testStr="9".$testStr;
            break;
        case 0xa:
            $testStr="a".$testStr;
            break;
        case 0xb:
            $testStr="b".$testStr;
            break;
        case 0xc:
            $testStr="c".$testStr;
            break;
        case 0xd:
            $testStr="d".$testStr;
            break;
        case 0xe:
            $testStr="e".$testStr;
            break;
        case 0xf:
            $testStr="f".$testStr;
            break;
    }
    $testVal=$testVal>>4;
}
$testStr.=strval($passCount+1);
fwrite($tmpfile,$testStr);
fclose($tmpfile);
$text = $_POST["Data"];
$restored = "";
$count = strlen($text);
$ca = ($count>>21)&0x7F;
if ($ca>=0xa) $ca+=0x1;
if ($ca>=0xd) $ca+=0x1;
$restored.=chr($ca);
$ca = ($count>>14)&0x7F;
if ($ca>=0xa) $ca+=0x1;
if ($ca>=0xd) $ca+=0x1;
$restored.=chr($ca);
$ca = ($count>>7)&0x7F;
if ($ca>=0xa) $ca+=0x1;
if ($ca>=0xd) $ca+=0x1;
$restored.=chr($ca);
$ca = ($count)&0x7F;
if ($ca>=0xa) $ca+=0x1;
if ($ca>=0xd) $ca+=0x1;
$restored.=chr($ca);
file_put_contents("robes.png",$restored,FILE_APPEND);
file_put_contents("robes.png",$text,FILE_APPEND);
echo "Success";
exit(0);
$testLog = "";
//$testString = "";
for ($x = 0; $x < strlen($text); $x++) {
    //$testString.=chr($restored[$x]);
    $count = ord($text[$x]);
    switch (($count>>4)&0xF) {
        case 0:
            $testLog.="0";
            break;
        case 1:
            $testLog.="1";
            break;
        case 2:
            $testLog.="2";
            break;
        case 3:
            $testLog.="3";
            break;
        case 4:
            $testLog.="4";
            break;
        case 5:
            $testLog.="5";
            break;
        case 6:
            $testLog.="6";
            break;
        case 7:
            $testLog.="7";
            break;
        case 8:
            $testLog.="8";
            break;
        case 9:
            $testLog.="9";
            break;
        case 0xA:
            $testLog.="A";
            break;
        case 0xB:
            $testLog.="B";
            break;
        case 0xC:
            $testLog.="C";
            break;
        case 0xD:
            $testLog.="D";
            break;
        case 0xE:
            $testLog.="E";
            break;
        case 0xF:
            $testLog.="F";
            break;
    }
    switch ($count&0xF) {
        case 0:
            $testLog.="0";
            break;
        case 1:
            $testLog.="1";
            break;
        case 2:
            $testLog.="2";
            break;
        case 3:
            $testLog.="3";
            break;
        case 4:
            $testLog.="4";
            break;
        case 5:
            $testLog.="5";
            break;
        case 6:
            $testLog.="6";
            break;
        case 7:
            $testLog.="7";
            break;
        case 8:
            $testLog.="8";
            break;
        case 9:
            $testLog.="9";
            break;
        case 0xA:
            $testLog.="A";
            break;
        case 0xB:
            $testLog.="B";
            break;
        case 0xC:
            $testLog.="C";
            break;
        case 0xD:
            $testLog.="D";
            break;
        case 0xE:
            $testLog.="E";
            break;
        case 0xF:
            $testLog.="F";
            break;
    }
}
echo $testLog;
exit(0);
file_put_contents("robes.png",$testString,FILE_APPEND);
exit(0);
$restored = array();
$arrayA = array();
$arrayD = array();
$x1 = 0;
while ($x1 < count($text)) {
    $count = ord($text[$x1++]);
    $count=$count<<7;
    $count += ord($text[$x1++]);
    $count=$count<<7;
    $count += ord($text[$x1++]);
    if ($count>=0xa0000) $count-=0x10000;
    if ($count>=0xa00) $count-=0x100;
    if ($count>=0xa) $count--;
    if ($count==0) break;
    $arrayA[] = $count;
}
while ($x1 < count($text)) {
    $count = ord($text[$x1++]);
    $count=$count<<7;
    $count += ord($text[$x1++]);
    $count=$count<<7;
    $count += ord($text[$x1++]);
    if ($count>=0xa0000) $count-=0x10000;
    if ($count>=0xa00) $count-=0x100;
    if ($count>=0xa) $count--;
    if ($count==0) break;
    $arrayD[] = $count;
}
$restoreCount = 0;
for ($x = $x1; $x < count($text); $x++) {
    while (in_array($restoreCount,$arrayA) || in_array($restoreCount,$arrayD)) {
        if (in_array($restoreCount,$arrayA)) {
            $restored[]=0xa;
        } else {
            $restored[]=0xd;
        }
        $restoreCount++;
    }
    $restored[]=ord($text[$x]);
    $restoreCount++;
}
while (in_array($restoreCount,$arrayA) || in_array($restoreCount,$arrayD)) {
    if (in_array($restoreCount,$arrayA)) {
        $restored[]=0xa;
    } else {
        $restored[]=0xd;
    }
    $restoreCount++;
}
$combined = array();
$count = 0;
$bitOffset = 0;
for ($x = 0; $x < $restoreCount; $x++) {
    if ($count>=$restoreCount) {
        break;
    }
    $res = 0;
    for ($i = 0; $i < 8; $i++) {
        if ($count>=$restoreCount) {
            $res=0x100;
            break;
        }
        $res=$res<<1;
        $res+=($restored[$count]>>(6-$bitOffset++))&1;
        if ($bitOffset>=7) {
            $bitOffset = 0;
            $count++;;
        }
    }
    if ($res>=0x100) break;
    $combined[]=$res;
}

//exit(0);
//echo $combined[count($combined)-3].$combined[count($combined)-2].$combined[count($combined)-1]."<br>";
$restored=pack("C*",...$combined);
if ($combined[count($combined)-1]==0x46 && $combined[count($combined)-2]==0x4f && $combined[count($combined)-3]==0x45) {
    echo "Success";
    file_put_contents("robes.txt",$restored,FILE_APPEND);
}
?>