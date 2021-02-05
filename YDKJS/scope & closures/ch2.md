# Lexical Scope

Scope는 동작하는 방법에 따라 2가지로 나뉜다.

1. **Lexical Scope**: js에서 택한 Scope 동작 원리
2. Dymamic Scope: 다른 언어에서 사용됨(ex. Bash, Perl...)

이번 챕터에서는 js가 사용하는 Lexical Scope에 대해 자세히 알아본다.

## 1. Lex-time
이전 챕터에서 잠깐 살펴본 바와 같이 lexing process는 나눠진 token에 의미를 부여한다.
사실상 lexical scope는 개발자가 코드를 작성할 동안, function과 blocks를 어떻게 작성했고, valuable을 어디서 사용했는지에 따라 정의된다. 그리고 실제로 프로그램이 실행될 때의 scope는 개발자가 작성한 코드를 lexer가 해석해고 lexical scope 확정한다. 이로인해 프로그램이 실행되면 engine은 이미 정의된 scope 내에서 원하는  빠르게 찾을 수 있다.

### 1.1. Look-ups
`foo.bar.baz` 와 같이 객체를 통해 프로펄티를 불러오는 경우에는 맨 앞의 식별자만 look up한다.
그리고 bar와 baz는 object의 규칙을 따른다.

## 2. Cheating Lexical
만약에 lexcical scope가 function이 선언될 때 정의된다면, run-time동안 이미 정의된 lexical scope를 수정할 수 있을까?
javascript는 두개의 메카니즘을 제공한다. 하지만 lexical scope를 수정하는 두 메카니즘 모두 개발자들 사이에서 좋지않은 방법이라고 알려져있다. 
cheating lexical scope는 성능을 떨어뜨리기 때문이다. 운선 성능에 대에 살펴보지 전, 두 메카니즘에 대해 알아보자.

### 2.1. `eval`
`eval`은 string을 argument로 받는다. 그리고 마치 그 string을 개발자가 작성한 코드처럼 다룬다. 
다시말하면, 우리는 이미 작성된 코드 안에 계획적으로 코드를 생성할 수 있다. 그리고 그 생성된 코드가 마치 이미 있었던 것 처럼 수행시킬 수 있다.

`eval(...)`이 실행된 이후의 코드에서, engine은 더 이상 바뀌기 전의 코드를 신경쓰지 않는다. 따라서 engine은 항상 했던것 처럼 lexical scope를 조회한다.

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
function foo(obj) {
	with (obj) {
		var a = 2;
	}
  console.log(a);
}
foo({}) // 2;
```

### 2.3. Performance
js는 engine은 compile하는 동안 프로그램을 최적화 시키기 위한 많은 일들을 수행한다. 코드를 분석하고, 변수와 함수들을 미리 선언한 덕분에 engine은 적은 노력으로 빠르게 프로그램을 실행한다.

하지만, eval과 with로 인해 lexical scope를 수정하는 행위는 이런 수고들을 파괴하는 행위로 최적된 코드를 모두 망쳐버린다.

## 3. Review(TL;DR)

lexical scope는 author-time(코드가 작성될 때) 정의된다. lexing 과정은 선언되는 모든 식별자를 어떻게 어디에 정의할지 파악하고,
실행될 때 이 식별자들이 어떻게 검색될지 예측할 수 있다. 즉 lexical scope가 결정된다.

eval은 lexical scope를 수정하고, with는 새로운 lexical scope를 생성한다. 이런 행위는 scope를 빠르게 찾기 위한 compile과정을
무색하게 한다.

