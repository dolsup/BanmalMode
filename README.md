# 반말모드(BanmalMode)
![반말모드](https://raw.githubusercontent.com/dolsup/BanmalMode/gh-pages/logotype.png)
## <반말모드>는
형태소 분석을 이용한 한국어 존비어, 친소어, 문체 변환 소프트웨어야. 모 지역 개발자 커뮤니티에는 존댓말을 사용할 수 없다는 특이한 조항이 있는데(모 유머 사이트가 아님), 이를 기술적으로 실현하기 위한 계획을 별도의 프로젝트로 가져온 거지. 다음은 와동개발자협동조합 레포지토리의 리드미 문서 중 일부야.

>우리는 친목질이 커뮤니티를 폐쇄적으로 만들어 지속가능성을 해치는 폐악이라는 것에 동의했고 특히 한국어에서 반말과 존댓말의 구별이 그 폐쇄의 간극을 더욱 심화시킨다고 생각하여 친하지도 않은 데 반말하는 것을 금지하는 걸 금지하기로 했습니다. 네가 존댓말을 해도 와데콘의 NLP 엔진이 자동으로 반말로 바꿀 것이고 너는 업보가 쌓이게 됩니다!

존댓말과 반말의 경계는 사람들 사이의 (실제로는 연속적인) 친밀도를 가시적으로 구분하기 때문에 문제가 된다고 생각해. 언어적 교류를 하면 할수록, 발화의 내용 만큼이나 발화의 형식이 관계를 규정해버리는 거지. 그 경계에 따라 회원간의 관계망이 응집성을 갖게 되고 결국 커뮤니티는 외부로부터 새로운 참여를 얻어내지 못하고 고여서 썩어버려.
그리고 반말은 경제적이야. 모바일 환경에서는 특히 길게 타이핑하기가 불편한데, 존중과 합의가 서로간에 전제된 상태에서 반말을 쓰면 편해. 물론 그런 문화를 만들기가 쉽지 않아. 피상적으로는 이해하고 있더라도 무의식적으로는 반말을 쓰는 게 경박하고 아니꼬워 보일 수 있지. 하지만 선택지가 반말밖에 없게 되면 뭐라 할 수 없는 변명거리가 돼!


## 진행상황과 추후 계획
- 기본적인 국어 체계 조사 *(하는 중)*
- 미리 선언해둔 특수한 형태소 집합들과 비교해보고 치환하는 것 *(완료)*
- 패턴에 따른 일반적인 음운 결합 *(하는 중)*
- 특수한 높임 언어들 변환
- 여러 문체 확보(음슴체 등)
- NPM에 배포하기
- 터미널 인터페이스로 만들어서 범용성 확보하기
- 소개 페이지 만들기
- 등등등. 대략 이정도.

지금은 해요체 -> 해체를 기본으로 하고 있지만, 나중에는 여러 문체들이 중간 문체(아마도 해체가 될 듯)를 거쳐서 모두 상호 변환이 가능하도록 할 예정이지.

## 지금 버전의 변환 샘플

```
해요체는 말끝에 '-요'를 붙여요. 이뿐이에요. 하지만 친근한 느낌을 주고, 요새 격식이 많이 허물어져서 그런지 사회에서는 사용이 많이 늘어나고 있어요. 특히 구어체에서 주로 사용하죠. 경우에 따라 정중도를 높이기 위해 중간중간 합쇼체를 섞어 쓰기도 해요. 어떤 말이 합쇼체로 바뀌는 지 아시는 분은 추가 부탁드려요. 만화나 애니메이션의 여자들 중 상대 불문하고 존댓말을 사용하는 경우는 대개 해요체를 쓰는데, 해요체도 격식은 없지만 엄연한 존댓말이니 유의하시기 바라요. 왠지 남녀탐구생활이 떠오르는 말투지만 신경쓰지 않도록 해요. 신경쓰면 지는 거예요. 이 문장을 보기전까지는 그냥 평범하게 읽고 있었는데 갑자기 남녀탐구생활 나레이션목소리로 자동재생되는건 그냥 기분 탓이에요.강원도 사투리로 말할 때 '-요'를 붙이기도 한대요.대한민국 국군에서는 상급자에게 해요체를 쓰면 안되고 꼭 다나까체로 써야 한다고 알려져 있어요. 하지만 군대에 해요체가 아예 없다고 하는건 옳지 않아요. 장교가 나이차가 많은 연장자 부사관에게 해요체를 쓰기도 하기 때문이지요. 그리고 병 계급끼리라도 아저씨끼리는 해요체를 써도 돼요. 참고로 요즘 되요라고 많이 쓰는데요, 돼요라고 해야 맞는 거예요. 왜냐하면 돼요는 '되어요'를 축약해서 쓰는거라 그래요. 이 내용에 대해 더 알고 싶거나 헷갈리면 되와 돼의 구분을 참고해 주세요.되요 해도 되요? 안 돼요! 돼요라고 해야 돼요. 사족으로 어떤 회사의 실험실에 있는 터릿이 이 말투를 사용해서 굉장히 귀엽다고 해요. 당연히 영어에선 해요체가 없으니 번역팀의 의도겠지요? 마지막으로 이 문서는 해요체로 작성되어 있다고 해요. 이는 나무 위키의 암묵의 룰이라고 해요. 충분히 알아 볼 수 있으니 굳이 해설을 따로 쓸 필요는 없어요.
```
나무위키 '해요체' 항목, 해요체 => 해체
```
해요체는 말끝에 '-야'를 붙여. 이뿐이야. 하지만 친근한 느낌을 주고, 요새 격식이 많이 허물어져서 그런지 사회에서는 사용이 많이 늘어나고 있어. 특히 구어체에서 주로 사용하지. 경우에 따라 정중도를 높이기 위해 중간중간 합쇼체를 섞어 쓰기도 해. 어떤 말이 합쇼체로 바뀌는 지 아시는 분은 추가 부탁드려. 만화나 애니메이션의 여자들 중 상대 불문하고 존댓말을 사용하는 경우는 대개 해요체를 쓰는데, 해요체도 격식은 없지만 엄연한 존댓말이니 유의하시기 바라. 왠지 남녀탐구생활이 떠오르는 말투지만 신경쓰지 않도록 해. 신경쓰면 지는 거야. 이 문장을 보기전까지는 그냥 평범하게 읽고 있었는데 갑자기 남녀탐구생활 나레이션목소리로 자동재생되는건 그냥 기분 탓이야.강원도 사투리로 말할 때 '-야'를 붙이기도 한대.대한민국 국군에서는 상급자에게 해요체를 쓰면 안되고 꼭 다나까체로 써야 한다고 알려져 있어. 하지만 군대에 해요체가 아예 없다고 하는건 옳지 않아. 장교가 나이차가 많은 연장자 부사관에게 해요체를 쓰기도 하기 때문이지. 그리고 병 계급끼리라도 아저씨끼리는 해요체를 써도 돼. 참고로 요즘 되라고 많이 쓰는데, 돼라고 해야 맞는 거야. 왜냐하면 돼는 '되어'를 축약해서 쓰는거라 그래. 이 내용에 대해 더 알고 싶거나 헷갈리면 되와 돼의 구분을 참고해 주어.되요 해도 되? 안 돼! 돼라고 해야 돼. 사족으로 어떤 회사의 실험실에 있는 터릿이 이 말투를 사용해서 굉장히 귀엽다고 해. 당연히 영어에선 해요체가 없으니 번역팀의 의도겠지? 마지막으로 이 문서는 해요체로 작성되어 있다고 해. 이는 나무 위키의 암묵의 룰이라고 해. 충분히 알아 볼 수 있으니 굳이 해설을 따로 쓸 필요는 없어.
```
이 글만 보면 완벽하지만, 아직 정의된 패턴이 부족해서 추가해야 돼.
