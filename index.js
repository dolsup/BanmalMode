var mecab = require('mecab-ffi');
var async = require('async');

// 복합형
// 해요	XSV+EF,*,F,해요,Inflect,XSV,EF,하/XSV+아요/EF,* -> 해
// VCP+EF,*,F,지요,Inflect,VCP,EF,이/VCP+지요/EF,* -> 지
// VCP+EF,*,F,예요,Inflect,VCP,EF,이/VCP+ㅔ요/EF,* -> 야
// VCP+EF,*,F,군요,Inflect,VCP,EF,이/VCP+군요/EF,* -> 군
// 세요	EP+EF,*,F,세요,Inflect,EP,EF,시/EP+어요/EF,* -> 어

// 기본형
var yos = [
    ["어요","EF"],
    ["아요","EF"],
    ["지요","EF"],
    ["에요","EF"],
    ["군요","EF"],
    ["요","JX"]
]

var si = ['시', 'EP'];

var replace = {
    "yo2hae": {
        "어요": ["어", "EF"],
        "아요": ["아", "EF"],
        "지요": ["지", "EF"],
        "에요": ["야", "EF"],
        "군요": ["군", "EF"],
        "요": ["야", "EF"]
    }
}


var input = "안녕하세요. 테스트 해요체 문장을 해요.";
var working = [];
var output = "";


function yo2hae(parsedString) {
    var parsed = parsedString;
    console.log(parsed)
    for(var i = 0; i < parsed.length; i++) {
        //활용형의 분리
        if(isInflect(parsed[i])) {
            var elements = breakInflect(parsed[i]);
            parsed.splice(i, 1);
            for(var k = 0; k < elements.length; k++) {
                console.log('check', elements[k])
                if(elements[k] !== si)
                    parsed.splice(i+k, 0, elements[k]);
                
            }
        }
        for(var j = 0; j < yos.length; j++) {
            //console.log(parsed[i], yos[j])
            if(isSame(parsed[i], yos[j])) {
                console.log("SAME", replace.yo2hae[parsed[i][0]])
                working.push(replace.yo2hae[parsed[i][0]]);
                break;
            } else if(j === yos.length - 1) {
                working.push(parsed[i]);
            }
            
        }
    }
    console.log("WORKING", working);
}

function parse(string) {

    return mecab.parseSync(input);
};

function plains(parsed) {
    var plains = [];
    for(var i = 0; i < parsed.length; i++) {
        plains.push(parsed[i][0]);
    }
    return plains;
}

function isInflect(morpheme) {
    if(morpheme[5] === "Inflect") return true;
    else false;
}

function breakInflect(inflect) {
    console.log("inf", inflect)
    var uncombined = inflect[8].split('+');
    var results = [];
    for(var i = 0; i < uncombined.length; i++) {
        results.push(uncombined[i].split('/'));
    }
    console.log("RES", results);
    return results;
}

// 텍스트와 품사를 비교
function isSame(mor1, mor2) {
    if(mor1[0] === mor2[0] && mor1[1] === mor2[1]) return true;
    else false;
}

function assembly(morphemes) {
    var string = "";
    for(var i = 0; i < morphemes.length; i++) {
        //string += 
    }
}

output = input;
console.log(yo2hae(parse(input)));