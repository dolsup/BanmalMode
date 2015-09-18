var mecab = require('mecab-ffi');
//var async = require('async');

// 복합형
// 해요	XSV+EF,*,F,해요,Inflect,XSV,EF,하/XSV+아요/EF,* -> 해
// VCP+EF,*,F,지요,Inflect,VCP,EF,이/VCP+지요/EF,* -> 지
// VCP+EF,*,F,예요,Inflect,VCP,EF,이/VCP+ㅔ요/EF,* -> 야
// VCP+EF,*,F,군요,Inflect,VCP,EF,이/VCP+군요/EF,* -> 군
// 세요	EP+EF,*,F,세요,Inflect,EP,EF,시/EP+어요/EF,* -> 어

// VV ㅗ + EF/EC ㅏ -> ㅘ
/*

CANNOT BE SHORTEN, UNCOMBINED [ [ '붙이', 'VV' ], [ '어', 'EF' ] ]
CANNOT BE SHORTEN, UNCOMBINED [ [ '부탁드리', 'VV' ], [ '어', 'EF' ] ]

2음절 이상 어간은 이중모음화만 가능한 경우가 많음
어간의 마지막 음절이 모음으로 시작하면 이중모음화 필수



*/





var si = ['시', 'EP'];

var replace = {
    "yo2hae": {
        "Inflect": {
            "해요/XSV+EF": ["해", "XSV+EF"],
            "해요/VV+EF": ["해", "VV+EF"],
            "해요/XSV+EC": ["해", "XSV+EC"],
            "해요/VV+EC": ["해", "VV+EC"],
            "지요/VCP+EF": ["지", "VCP+EF"],
            "예요/VCP+EF": ["야", "VCP+EF"],
            //"세요/VCP+EF": ["어", "VCP+EF"],
            "군요/VCP+EF": ["군", "VCP+EF"],
            "한대요/VX+EF": ["한대", "VX+EF"],
            "그래요/VV+EF": ["그래", "VV+EF"],
            "그래요/VA+EC": ["그래", "VA+EC"]
        },
        "어요/EF": ["어", "EF"],
        "아요/EF": ["아", "EF"],
        "지요/EF": ["지", "EF"],
        "죠/EF": ["지", "EF"],
        "에요/EF": ["야", "EF"],
        "군요/EF": ["군", "EF"],
        "요/EF": ["", ""],
        "요/JX": ["야", 'EF'],
        "ᆫ대요/EF": ["ㄴ대", "EF"],
        "ㄴ대요/EC": ["ㄴ대", "EC"],
        "는데요/EF": ["는데", "EF"]
    },
    "nida2hae": {
        
    }
}

var shorten = {
    "vowel": {
        "ㅗ+ㅏ": "ㅘ",
        "ㅜ+ㅓ": "ㅝ",
        "ㅣ+ㅓ": "ㅕ"
    },
    "하/VV+아/EF": "해",
    "하/VV+어/EF": "해",
    "하/VX+아/EF": "해",
    "하/VX+어/EF": "해",
    "하/VV+ㄴ대/EF": "한대",
    "하/XSV+아/EF": "해",
    "하/XSV+어/EF": "해",
    "되/VV+어/EF": "돼"
}



var config = {
    "si": false
}

var input = "해요체는 말끝에 '-요'를 붙여요. 이뿐이에요. 하지만 친근한 느낌을 주고, 요새 격식이 많이 허물어져서 그런지 사회에서는 사용이 많이 늘어나고 있어요. 특히 구어체에서 주로 사용하죠. 경우에 따라 정중도를 높이기 위해 중간중간 합쇼체를 섞어 쓰기도 해요. 어떤 말이 합쇼체로 바뀌는 지 아시는 분은 추가 부탁드려요. 만화나 애니메이션의 여자들 중 상대 불문하고 존댓말을 사용하는 경우는 대개 해요체를 쓰는데, 해요체도 격식은 없지만 엄연한 존댓말이니 유의하시기 바라요. 왠지 남녀탐구생활이 떠오르는 말투지만 신경쓰지 않도록 해요. 신경쓰면 지는 거예요. 이 문장을 보기전까지는 그냥 평범하게 읽고 있었는데 갑자기 남녀탐구생활 나레이션목소리로 자동재생되는건 그냥 기분 탓이에요.강원도 사투리로 말할 때 '-요'를 붙이기도 한대요.대한민국 국군에서는 상급자에게 해요체를 쓰면 안되고 꼭 다나까체로 써야 한다고 알려져 있어요. 하지만 군대에 해요체가 아예 없다고 하는건 옳지 않아요. 장교가 나이차가 많은 연장자 부사관에게 해요체를 쓰기도 하기 때문이지요. 그리고 병 계급끼리라도 아저씨끼리는 해요체를 써도 돼요. 참고로 요즘 되요라고 많이 쓰는데요, 돼요라고 해야 맞는 거예요. 왜냐하면 돼요는 '되어요'를 축약해서 쓰는거라 그래요. 이 내용에 대해 더 알고 싶거나 헷갈리면 되와 돼의 구분을 참고해 주세요.되요 해도 되요? 안 돼요! 돼요라고 해야 돼요. 사족으로 어떤 회사의 실험실에 있는 터릿이 이 말투를 사용해서 굉장히 귀엽다고 해요. 당연히 영어에선 해요체가 없으니 번역팀의 의도겠지요? 마지막으로 이 문서는 해요체로 작성되어 있다고 해요. 이는 나무 위키의 암묵의 룰이라고 해요. 충분히 알아 볼 수 있으니 굳이 해설을 따로 쓸 필요는 없어요.";
var output = "";


function yo2hae(parsedString) {
    var parsed = parsedString;
    var originlen;
    var originpos;
    var extra = 0;
    var positions = [];
    var lastpos = 0;
    
    // console.log(parsed)
    for(var i = 0; i < parsed.length; i++) {
        //원본 문자열에서 각 형태소의 위치 저장
        positions.push(lastpos = input.indexOf(parsed[i][0], lastpos));
        // console.log("P", parsed[i][0], input.indexOf(parsed[i][0], lastpos), positions[i]);
        
        originlen = parsed[i][0].length;
        originpos = positions[i] + extra;
        // console.log("op", originpos, positions[i], extra)
        
        //활용형의 분리
        var bricks = false;
        if(isInflect(parsed[i])) {
            var newstr;
            var flag = false;
            
            // 교체
            if(isSame(parsed[i], replace.yo2hae.Inflect)) {
                newstr = replace.yo2hae.Inflect[styMor(parsed[i])][0];
                flag = true; // 치환 가능
            } else {
                bricks = breakInflect(parsed[i]);
                for(var b = 0; b < bricks.length; b++) {
                    if(!config.si && bricks[b].toString() === si.toString()) bricks = bricks.splice(b-1, 1);
                    if(isSame(bricks[b], replace.yo2hae)) {
                        bricks[b] = replace.yo2hae[styMor(bricks[b])];
                        flag = true; // 치환 가능
                    }
                }
            }
            
            
            if(flag) {
                // 음운 축약
                if(bricks) {
                    if(shorten[normalizeMorphemes(bricks)])
                        newstr = shorten[normalizeMorphemes(bricks)];
                    else {
                        // 분해, 치환되었지만 축약이 정의되지 않은
                        bricks.length>1 && console.log("CANNOT BE SHORTEN, UNCOMBINED", bricks);
                        
                        // 어간 마지막 음절이 모음으로 시작하고 어미도 모음으로 시작하면 모음축약
                        if(bricks[0][0].length > 1 && bricks[0][1] === "VV") {
                            var vvjaso = jaso(bricks[0][0].slice(-1));
                            console.log("ASD", vvjaso);
                            if(true||vvjaso[0] === 'ㅇ' && vvjaso[2] === '' && bricks[1][1][0] === 'E') {
                                var ejaso = jaso(bricks[1][0]);
                                console.log("QWE", ejaso);
                                if(ejaso[0] === 'ㅇ') {
                                    var newvowel = shorten.vowel[vvjaso[1]+'+'+ejaso[1]];
                                    console.log("ZXC", vvjaso+'+'+ejaso[1], newvowel)
                                    if(newvowel) {
                                        newstr = bricks[0][0].slice(0, -1) + glue(vvjaso[0], newvowel, ejaso[2]) + bricks[1][0].substring(1);
                                        console.log("NEW", newstr)
                                    } else newstr = assembly(bricks);
                                } else newstr = assembly(bricks);
                            } else newstr = assembly(bricks);
                        } else newstr = assembly(bricks);
                        // 여기 너무 더러워!!!
                    }
                }
                output = output.slice(0, originpos) + newstr + output.slice(originpos + originlen);
                extra += newstr.length - originlen;
                // console.log("ASD", originpos)
                
            }
            
            // bricks 
            
            
            // for(var k = 0; k < bricks.length; k++) {
            //     console.log('check', bricks[k])
            //     if(!config.si && bricks[k] !== si) {
            //         //working.splice(i+k, 0, bricks[k]);
            //     }
            // }
        }
        
        if(!config.si && parsed[i].toString() === si.toString()) {
            output = output.slice(0, originpos) + output.slice(originpos+originlen);
            extra -= originlen;
        }
        if(isSame(parsed[i], replace.yo2hae)) {
            output = output.slice(0, originpos) + replace.yo2hae[styMor(parsed[i])][0] + output.slice(originpos+originlen);
            extra += replace.yo2hae[styMor(parsed[i])][0].length - originlen;
        }
        
        // 현위치 앞뒤로 음운 축약
        // var shorter;
        //     // console.log("SSSS", parsed[i], parsed.slice(i-1, i+1), shorter);
        //     // console.log("FFFF", parsed[i], parsed.slice(i, i+2), shorter);
        // if(shorten[normalizeMorphemes(parsed.slice(i-1, i+1))]) {
        //     shorter = shorten[normalizeMorphemes(parsed.slice(i-1, i+1))];
        // 
        // }
        // else if(shorten[normalizeMorphemes(parsed.slice(i, i+2))])
        //     shorter = shorten[normalizeMorphemes(parsed.slice(i, i+2))];
        // if(shorter) {
        //     output = output.slice(0, originpos) + newstr + output.slice(originpos + originlen);
        //     extra += newstr.length - originlen;
        //     // console.log("SHORTER", shorter)
        // }
        
    }
    //console.log("POS", positions);
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
    // console.log("inf", inflect)
    var uncombined = inflect[8].split('+');
    var results = [];
    for(var i = 0; i < uncombined.length; i++) {
        results.push(uncombined[i].split('/'));
    }
    // console.log("RES", results);
    return results;
}

//stringify morpheme
function styMor(mor) {
    return mor[0]+'/'+mor[1];
}

// 텍스트와 품사를 비교
function isSame(mor, lib) {
    if(lib[styMor(mor)]) return true;
    else return false;
}

function assembly(morphemes) {
    var string = "";
    for(var i = 0; i < morphemes.length; i++) {
        string += morphemes[i][0];
    }
    return string;
}

function normalizeMorphemes(mor) {
    var string = [];
    for(var i = 0; i < mor.length; i++) {
        string.push(styMor(mor[i]));
    }
    return string.join('+');
}

var Chos = [ "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ" ];
var Jungs = [ "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ" ];
var Jongs = [ "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ" ];
function jaso(hangul) {
   var code = hangul.charCodeAt(0) - 0xAC00;
   var jong = code%28;
   var jung = ((code-jong)/28)%21;
   var cho = (((code-jong)/28)-jung)/21;
   return [Chos[cho], Jungs[jung], Jongs[jong]];
}
function glue(cho, jung, jong) {
    return String.fromCharCode(0xAC00 + ((Chos.indexOf(cho)*21)+Jungs.indexOf(jung))*28+Jongs.indexOf(jong));
}


output = input;
yo2hae(parse(input));
console.log("OUT", output);