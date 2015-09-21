var mecab = require('mecab-ffi');
var fs = require('fs');

var si = ['시', 'EP'];

var replace = {
    "hae": {
        "Inflect": {
            //// 해요체
            "해요/XSV+EF": ["해", "XSV+EF"],
            "해요/VV+EF": ["해", "VV+EF"],
            "해요/XSV+EC": ["해", "XSV+EC"],
            "해요/VV+EC": ["해", "VV+EC"],
            "지요/VCP+EF": ["지", "VCP+EF"],
            "예요/VCP+EF": ["야", "VCP+EF"],
            "네요/VCP+EF": ["네", "VCP+EF"],
            "세요/EP+EF": ["어", "EF"],
            "군요/VCP+EF": ["군", "VCP+EF"],
            "한대요/VX+EF": ["한대", "VX+EF"],
            "그래요/VV+EF": ["그래", "VV+EF"],
            "그래요/VA+EC": ["그래", "VA+EC"],
            //// ㅂ니다체
            "합니다/XSV+EF": ["해", "XSV+EF"],
            "합니다/XSA+EF": ["해", "XSA+EF"],
            "합니다/VV+EF": ["해", "VV+EF"],
            "합니다/VX+EF": ["해", "VX+EF"],
            "합니다만/VX+EF": ["하는데", "VX+EF"],
            "입니다/VCP+EF": ["이다", "VCP+EF"],
            "됩니다/XSV+EF": ["돼", "XSV+EF"],
            "겁니다/NNB+VCP+EF": ["거야", "NNB+VCP+EF"],
            
            "십시오/EP+EF": ["어", "EF"],
            
            "으신/EP+ETM": ["은", "ETM"],
            "저/NP": ["나", "NP"]
        },
        "어요/EF": ["어", "EF"],
        "ㅓ요/EF": ["어", "EF"],
        "아요/EF": ["아", "EF"],
        "ㅏ요/EF": ["아", "EF"],
        "지요/EF": ["지", "EF"],
        "죠/EF": ["지", "EF"],
        "에요/EF": ["야", "EF"],
        "군요/EF": ["군", "EF"],
        "네요/EF": ["네", "EF"],
        "더군요/EF": ["더군", "EF"],
        "요/EF": ["", ""],
        "요/JX": ["야", 'EF'],
        "ᆫ대요/EF": ["ㄴ대", "EF"],
        "는지요/EF": ["는지", "EF"],
        "거든요/EF": ["거든", "EF"],
        "다지요/EF": ["다지", "EF"],
        "ᆫ대요/EC": ["ㄴ대", "EC"],
        "는데요/EF": ["는데", "EF"],
        "ᆯ까요/EF": ["ㄹ까", "EF"],
        // EF 끝이 요로 끝나면 제거.
        
        "습니다/EF": ["다", "EF"],
        //"입니다/EF": ["이다", "EF"], // 앞 음절의 받침여부 따져서 다-이다 분화
        "ᄇ니다/EF": ["ㄴ다", "EF"],
        "ㅂ니다/EF": ["ㄴ다", "EF"],
        "ᄇ시다/EF": ["자", "EF"],
        "답니다/EF": ["단다", "EF"],
        "ᆫ답니다/EF": ["ㄴ단다", "EF"],
        "는답니다/EF": ["는단다", "EF"],
        
        "ᄇ시오/EF": ["어", "EF"],
        
        "드리/VX": ["주", "VX"],
        //"계시/VX": ["있", "VX"], 계신다, 계십니다 등 처리리
        "제/NP": ["내", "NP"],
        "저희/NP": ["우리", "NP"]
    }
}
// 요로 끝나는 EF는 코드로 처리 가능.


var shorten = {
    "vowel": {
        "ㅗ+ㅏ": "ㅘ",
        "ㅜ+ㅓ": "ㅝ",
        "ㅣ+ㅓ": "ㅕ"
    },
    "하/VV+아/EF": "해",
    "하/VV+었/EP": "했",
    "하/VV+어/EF": "해",
    "하/VX+아/EF": "해",
    "하/VX+어/EF": "해",
    "주/VX+어/EF": "줘",
    "보/VX+어/EF": "봐",
    "지/VX+어/EF": "져",
    "하/VV+ㄴ대/EF": "한대",
    "하/XSV+아/EF": "해",
    "하/XSV+어/EF": "해",
    "하/XSA+아/EF": "해",
    "하/XSA+어/EF": "해",
    "되/VV+어/EF": "돼",
    "되/XSV+어/EF": "돼"
}

// var input = "해요체는 말끝에 '-요'를 붙여요. 이뿐이에요. 하지만 친근한 느낌을 주고, 요새 격식이 많이 허물어져서 그런지 사회에서는 사용이 많이 늘어나고 있어요. 특히 구어체에서 주로 사용하죠. 경우에 따라 정중도를 높이기 위해 중간중간 합쇼체를 섞어 쓰기도 해요. 어떤 말이 합쇼체로 바뀌는 지 아시는 분은 추가 부탁드려요. 만화나 애니메이션의 여자들 중 상대 불문하고 존댓말을 사용하는 경우는 대개 해요체를 쓰는데, 해요체도 격식은 없지만 엄연한 존댓말이니 유의하시기 바라요. 왠지 남녀탐구생활이 떠오르는 말투지만 신경쓰지 않도록 해요. 신경쓰면 지는 거예요. 이 문장을 보기전까지는 그냥 평범하게 읽고 있었는데 갑자기 남녀탐구생활 나레이션목소리로 자동재생되는건 그냥 기분 탓이에요.강원도 사투리로 말할 때 '-요'를 붙이기도 한대요.대한민국 국군에서는 상급자에게 해요체를 쓰면 안되고 꼭 다나까체로 써야 한다고 알려져 있어요. 하지만 군대에 해요체가 아예 없다고 하는건 옳지 않아요. 장교가 나이차가 많은 연장자 부사관에게 해요체를 쓰기도 하기 때문이지요. 그리고 병 계급끼리라도 아저씨끼리는 해요체를 써도 돼요. 참고로 요즘 되요라고 많이 쓰는데요, 돼요라고 해야 맞는 거예요. 왜냐하면 돼요는 '되어요'를 축약해서 쓰는거라 그래요. 이 내용에 대해 더 알고 싶거나 헷갈리면 되와 돼의 구분을 참고해 주세요.되요 해도 되요? 안 돼요! 돼요라고 해야 돼요. 사족으로 어떤 회사의 실험실에 있는 터릿이 이 말투를 사용해서 굉장히 귀엽다고 해요. 당연히 영어에선 해요체가 없으니 번역팀의 의도겠지요? 마지막으로 이 문서는 해요체로 작성되어 있다고 해요. 이는 나무 위키의 암묵의 룰이라고 해요. 충분히 알아 볼 수 있으니 굳이 해설을 따로 쓸 필요는 없어요.";
var input = fs.readFileSync("./input.txt").toString();

var output = "";


function haeche(parsedString) {
    var parsed = parsedString; //입력 문장의 형태소 배열
    var originlen; // 교체 대상 형태소의 길이
    var originpos; // 교체 대상 형태소의 원래 입력 문장에서의 위치
    var extra = 0; // 교체함으로써 늘어난 글자 수
    var positions = []; // 각 형태소의 원래 문장에서의 위치들이 순서대로 담긴 배열
    var lastpos = 0; // positions[]를 순서대로 채우기 위한 임시 변수
    
    for(var i = 0; i < parsed.length; i++) {
        //원본 문장에서 각 형태소의 위치 저장
        positions.push(lastpos = input.indexOf(parsed[i][0], lastpos));
        
        originlen = parsed[i][0].length;
        originpos = positions[i] + extra;
        
        ////활용형의 분리
        var bricks = false; // 활용형을 분해했을 때는 배열로 사용됨.
        if(isInflect(parsed[i])) { // 활용형 여부
            var newstr; // 새로 교체된 문자열
            var newmor; // 새로 교체된 형태소
            var flag = false; // 교체되었는지 여부를 나타내는 플래그 변수
            
            //// 조건 검사
            if(isSame(parsed[i], replace.hae.Inflect)) { // 활용형 자체가 사전에 정의되었나
                newstr = replace.hae.Inflect[styMor(parsed[i])][0];
                newmor = replace.hae.Inflect[styMor(parsed[i])];
                flag = true; // 교체됨
            } else { // 정의되지 않았다면 활용형을 분해해서 각 형태소를 조건 검사
                bricks = breakInflect(parsed[i]);
                for(var b = 0; b < bricks.length; b++) {
                    if(bricks[b].toString() === si.toString()) bricks = bricks.splice(b-1, 1); // 선어말어미 -시-의 삭제
                    if(isSame(bricks[b], replace.hae)) { // 분해된 각 형태소를 사전 정의된 패턴으로 검사
                        bricks[b] = replace.hae[styMor(bricks[b])];
                        flag = true; // 교체 가능
                    }
                }
            }
            
            //// 음운 축약
            if(flag) { // 교체가 일어났을 때
                if(bricks) { // 활용형을 분해했을 때
                    if(shorten[normalizeMorphemes(bricks)]) // 정규화된 형태소 조각들의 축약 패턴이 정의되어 있다면
                        newstr = shorten[normalizeMorphemes(bricks)]; // 축약된 형태로 교체
                    else if (bricks.length === 1 && shorten[normalizeMorphemes(bricks.unshift(parsed[i-1]))]) { // 앞 형태소를 합쳐서 보기
                        if (shorten[ normalizeMorphemes([parsed[i-1], newmor ]) ] ) { // 앞 형태소를 합쳐서 보기
                            newstr = shorten[ normalizeMorphemes([parsed[i-1], newmor ]) ];
                            originpos -= parsed[i-1][0].length;
                            originlen += parsed[i-1][0].length;
                        } else console.log([parsed[i-1], newmor]);
                    } else { // 분해, 치환되었지만 축약이 정의되지 않은 상태 : 특수 조건들
                        var shortflag = false; // 축약 여부 플래그 변수
                        console.log(bricks)
                        var apjaso = jaso(bricks[0][0].slice(-1)); // 동사 어간의 마지막 음절을 자소 분해
                        if(apjaso[2] === '' && bricks[1][1][0] === 'E') { // 동사 어간 마지막 음절의 받침이 없고 어미가 뒤에 붙음
                            //// ㄴ다, ㅂ니다 등 축약
                            if(Jongs.indexOf(bricks[1][0][0]) !== -1) { // 어미 첫자가 그냥 자음일 때
                                newstr = bricks[0][0].slice(0, -1) + glue(apjaso[0], apjaso[1], bricks[1][0][0]) + bricks[1][0].substring(1);
                                shortflag = true;
                            } else if(/*bricks[0][0].length > 1 && */bricks[0][1][0] === 'V') { // 동사 어간이 -2음절- 이상
                                //// 모음 축약 : 어간 마지막 음절에 받침이 없고 어미가 모음으로 시작하면 모음축약
                                var ejaso = jaso(bricks[1][0][0]); // 어미 첫자의 자소 분해
                                if(ejaso[0] === 'ㅇ') { // 어미가 모음으로 시작
                                    var newvowel = shorten.vowel[apjaso[1]+'+'+ejaso[1]]; // 새로 축약된 모음
                                    if(newvowel) {
                                        newstr = bricks[0][0].slice(0, -1) + glue(apjaso[0], newvowel, ejaso[2]) + bricks[1][0].substring(1); // 새 이중모음을 넣어 교체
                                        shortflag = true;
                                    }
                                }
                            }        
                        }
                        
                        if(!shortflag) newstr = assembly(bricks); // 어떤 경우에도 해당되지 않으면 그냥 강제로 붙임. (예외)
                    }
                } else {
                    //// 활용형을 분해하지 않았음
                    if (shorten[ normalizeMorphemes([parsed[i-1], newmor ]) ] ) { // 앞 형태소를 합쳐서 보기
                        newstr = shorten[ normalizeMorphemes([parsed[i-1], newmor ]) ];
                        originpos -= parsed[i-1][0].length;
                        originlen += parsed[i-1][0].length;
                    } else console.log([parsed[i-1], newmor])
                }
                
                //// 전체 문장에서 바뀐 문자열로 교체함.
                output = output.slice(0, originpos) + newstr + output.slice(originpos + originlen);
                extra += newstr.length - originlen;
            }
        }
        //// 활용형
        
        //// 활용형이 아님
        if(parsed[i].toString() === si.toString()) { // 선어말어미 -시- 제거
            output = output.slice(0, originpos) + output.slice(originpos+originlen);
            extra -= originlen;
        }
        if(isSame(parsed[i], replace.hae)) { // 해요체 => 해체
            output = output.slice(0, originpos) + replace.hae[styMor(parsed[i])][0] + output.slice(originpos+originlen);
            extra += replace.hae[styMor(parsed[i])][0].length - originlen;
        }
        //// 활용형이 아님
    }
}

function parse(string) { // mecab 형태소 분석
    return mecab.parseSync(input);
};

function plains(parsed) { // 형태소 배열에서 표현형만 남겨 배열로 반환
    var plains = [];
    for(var i = 0; i < parsed.length; i++) {
        plains.push(parsed[i][0]);
    }
    return plains;
}

function isInflect(morpheme) { // 활용형인지 검사
    if(morpheme[5] === "Inflect") return true;
    else false;
}

function breakInflect(inflect) { // 활용형 해체
    var uncombined = inflect[8].split('+');
    var results = [];
    for(var i = 0; i < uncombined.length; i++) {
        results.push(uncombined[i].split('/'));
    }
    return results;
}

//STringifY MORpheme. 표현형/품사 꼴로 반환.
function styMor(mor) {
    return mor[0]+'/'+mor[1];
}

// 표현형과 품사를 정의된 패턴 목록에서 비교
function isSame(mor, lib) {
    if(lib[styMor(mor)]) return true;
    else return false;
}

// 형태소의 표현형만 붙여서 반환
function assembly(morphemes) {
    var string = "";
    for(var i = 0; i < morphemes.length; i++) {
        string += morphemes[i][0];
    }
    return string;
}

// '표현형/품사' 꼴로 만들고 +로 붙여 반환
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

function jaso(hangul) { // 자소 분해
   var code = hangul.charCodeAt(0) - 0xAC00;
   var jong = code%28;
   var jung = ((code-jong)/28)%21;
   var cho = (((code-jong)/28)-jung)/21;
   return [Chos[cho], Jungs[jung], Jongs[jong]];
}

function glue(cho, jung, jong) { // 자소 합체
    return String.fromCharCode(0xAC00 + ((Chos.indexOf(cho)*21)+Jungs.indexOf(jung))*28+Jongs.indexOf(jong));
}

output = input;
haeche(parse(input));
console.log("OUT", output);