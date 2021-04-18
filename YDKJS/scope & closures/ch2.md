# Lexical Scope

Lexical은 `어휘` 라는 뜻의 영어단어 입니다. 어휘란 한 단어가 가질 수 있는 여러 개의 뜻을 말하는데 동일한 단어 일지라도 문맥에 따라서 단어의 뜻이 바뀌게 됩니다. 예를 들어 저 배 정말 맛있겠다. 라는 문장을 읽었을 때 배는 과일을 뜻합니다. 하지만 저 커다란 배가 50년이 넘었다네! 라는 문장에서 배의 뜻은 ship과 같은 선박을 뜻하게 됩니다. 한 단어는 여러 개의 뜻을 가지고 있는데 문맥에 따라서 적절한 뜻을 파악할 수 있는 사람에게 `어휘력이 좋다` 라고 합니다. 왜 갑자기 어휘의 뜻을 설명하냐고요? 

이유느 프로그래밍 언어도 하나의 언어기 때문에 문맥이 존재하고, 문맥에 따라서 같은 이름의 변수가 사용됐을 지라도 그 의미가 마치 어휘처럼 바뀌기 때문입니다. 이렇게 문맥에 따라서 변수를 찾는 Scope를 Lexical Scope라고 합니다. 그 외에 Dynamic Scope가 존재하는데, 이 둘의 차이점을 간단하게 알아보고 Js에서 선택하고 있는 Lexical Scope에 대해 깊숙히 알아봅시다.

Scope의 종류:

1. **Lexical Scope**: js에서 택한 Scope 동작 원리
2. Dymamic Scope: 다른 언어에서 사용됨(ex. Bash, Perl...)

## 1. Lex-time

이전 챕터에서 살펴본 내용을 상기시켜보자. 
컴파일 과정의 1단계인 lexing process는 작성된 코드를 조사하고 각 문자에 의미를 부여한다.
그리고 이 단계는 각 변수들이 Scope에 귀속되는 과정도 포함한다.
다른 말로하면 Scope는 개발자가 작성한 코드를 기반으로 생성된다는 의미이며, 이말은 코드를 어떻게 작성하느냐에 따라 Scope가 결정된다는 의미가 된다.
그래서 프로그램이 실행될 때는 엔진이 변수를 조회할 때 이미 정의된 Scope 내에서 찾기 때문에 Scope가 없을 때 보다 빠르고 변수 관리에도 용이하다.

예를들어 개발자가 작성한 다음 코드는 실행전 컴파일러에 의해 중첩된 3개의 scope가 생성될 것이다. 그 단위를 버블로 표현할 수 있다.

![image](https://user-images.githubusercontent.com/39623897/115118342-adf47500-9fdd-11eb-9082-44fe6db72c35.png)

Bubble 1은 global scope로 식별자 foo를 포함한다.

Bubble 2는 foo scope로 식별자 a, b, bar를 포함한다.

Bubble 3는 bar scope로 식별자 c를 포함한다.

위 3개의 스코프 버블은 스코프를 생성하는 함수가 어디서 작성되었는지에 따라 정의되었다.

### 1.1. Look-ups
그렇다면 예를들어 동일한 이름의 a라는 식별자가 여러 Scope에 포함되어있다면 엔진이 원하는 식별자 a를 어떻게 구별하여 찾을 수 있을까?

버블구조가 바로 위의 문제를 해결한다. 예를들어 bar 내부에서 식별자 a를 찾고자 한다면, 우선 가장 내부에있는 bar scope에서 a를 검색한다. 만약 a가 없다면 foo scope로 올라가서 찾아본다. 이렇게 안쪽 scope부터 가장 외부 scope인 global 까지 순차적으로 검색하는 방법을 사용한다. 요약하면 다음과 같다.

> 식별자가 사용된 위치를 기준으로 가장 안쪽 scope부터 탐색한다. 이 말은 같은 이름의 식별자가 여러 scope에 분포해 있다면 가장 가까운 scope에 속한 식별자가 검색된다.

`foo.bar.baz` 와 같이 객체를 통해 프로펄티를 불러오는 경우에는 맨 앞의 식별자만 look up한다.
그리고 bar와 baz는 object의 규칙을 따른다.

## 2. Cheating Lexical
lexcical scope가 function이 선언될 때 정의된다는 것을 학습했다. 그렇다면 run-time 동안 이미 정의된 lexical scope를 수정할 수 있을까?
javascript는 수정할 수 있는 두개의 메카니즘을 제공한다. 하지만 lexical scope를 수정하는 두 메카니즘 모두 권장하지 않는 방법이다. 
그 이유는 컴파일 단계에서 scope를 미리 생성해 두는 의미가 퇴색되기 때문이다. 간단하게 말하면 기존 scope 안에서 식별자를 바로 찾지 않고 새로운 scope를 생성하는 과정을 포함하기 때문에 성능이 떨어지게 된다. 성능에 대에 살펴보기 전, 두 메카니즘에 대해 알아보자.

### 2.1. `eval`
`eval`은 string을 argument로 받는다. 그리고 마치 그 string을 개발자가 작성한 코드처럼 다룰 수 있다. 
다시말하면, string을 js 문법으로 작성하고 parameter로 넘겨주면 eval은 그 코드를 string이 아닌 마치 우리가 작성한 코드처럼 실행한다.

`eval(...)`이 실행된 이후에는, engine이 더 이상 기존 코드를 신경쓰지 않는다. 따라서 engine은 항상 했던것 처럼 lexical scope를 조회한다.

다음 코드를 보자.
```
function foo(str, a) {
  eval( str ); // cheating!
  console.log( a, b );
}

var b = 2;

foo( "var b = 3;", 1 ); // 1 3
```
eval이 실행될 때 `"var b = 3"`은 마치 원래부터 있던 것 처럼 여겨진다. 
왜냐하면 이 코드가 새로운 변수 b를 선언하고, 기존에 있던 lexical scope인 foo를 수정하기 때문이다.
그리고 foo scope안의 b가 global b를 shadow하기 때문에 console.log(a ,b)가 실행될 때 1과 3이 출력된다.


### 2.2. `with`
```
var obj = {
  a: 1,
  b: 2,
  c: 3
}

// more "tredious" to repeat "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;

// "easier" short-hand
with (obj) {
  a = 3;
  b = 4; 
  c = 5;
}
```
with는 보통 속성에 접근하기 위해 객체인 obj를 생략하고 바로 사용할 수 있는 편리함 때문에 사용한다.

그러나 다음 예시를 살펴보자
```
function foo(obj) {
  with (obj) {
    a = 2;
  }
}

var o1 = {
  a: 3
};

var o2 = {
  b: 3
};

foo( o1 );
console.log( o1.a ); //2

foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2 -- !! global에 생성되었다..
```
o1은 a를 가지고 있지만, o2는 가지고 있지 않다. with는 입력받은 object를 완전히 새로운 lexical scope로 여긴다. 
따라서 a에 2를 입력하면 a를 look-up 한다. 하지만 해당 scope에는 a가 없기 때문에, 상위 scope인 global을 찾게되고, global에도
없을 경우 a를 새로 생성해서 2를 할당한다.

**note:** with 내부가 lexical scope로 여겨지기 때문에 이 내부에서 var 혹은 let을 선언하면 그 블록 내에 변수가 할당되어야 한다.
하지만 with 내에서 생성된 변수는 해당 scope에 정의되지 않고, 외부 lexical scope로 이동한다.
```
with("test") {
	var a = 4;
}
console.log(a); // 4
```

### 2.3. Performance
js는 engine은 compile하는 동안 프로그램을 최적화 시키기 위한 많은 일들을 수행한다. 코드를 분석하고, 변수와 함수들을 미리 선언한 덕분에 engine은 적은 노력으로 빠르게 프로그램을 실행한다.

하지만, eval과 with로 인해 lexical scope를 수정하는 행위는 이런 수고들을 파괴하는 행위로 최적된 코드를 모두 망쳐버린다.

## 3. Review(TL;DR)

lexical scope는 author-time(코드가 작성될 때) 정의된다. lexing 과정은 선언되는 모든 식별자를 어떻게 어디에 정의할지 파악하고,
실행될 때 이 식별자들이 어떻게 검색될지 예측할 수 있다. 즉 lexical scope가 결정된다.

eval은 lexical scope를 수정하고, with는 새로운 lexical scope를 생성한다. 이런 행위는 scope를 빠르게 찾기 위한 compile과정을
무색하게 한다.

