# Hoisting

## 1. Chicken Or The Egg?

보통 Code는 line에 따라 위에서 아래로 실행된다. 하지만 이전에 배웠던 것처럼 Js는 실행전 compiling을 한다. 
lexir는 lexical scope를 생성하기 위해 모든 선언들을 미리 파악하는데, 이렇게 선언된 식별자를 미리 파악하는 과정때문에 일부 실행순서가 바뀌게 된다.

다음 1번 예시 코드를 보자.

```
// 1번
a = 2;

var a;

console.log( a );
```

console.log( a );는 어떤 값을 출력할까? 다른 언어에 익숙한 개발자라면

1. `a = 2` : a에 2를 할당
2. `var a;` : a를 다시 선언 및 undefined로 초기화

즉 `undefined`가 출력될 것이라 예측할 수 있다. 하지만 `2`를 출력한다.


또 다른 코드를 살펴보자.
```
// 2번
console.log( a );

var a = 2;
```
a에 어떤 값이 출력될까? 만약 ` 1번 처럼 `var a`가 호출보다 아래에 있을 때 `var a` 를 먼저 읽는다고 생각했다면, 아래 코드처럼 생각할 것이고,
2가 출력될 것이라 예측할 수 있다. 하지만 답은 `undefined`이다. 
```
var a = 2;
console.log( a );
```

## 2. The Compiler Strikes Again

위에 언급한 바와 같이, 컴파일과정에서 모든 선언을 파악하고 적절한 scope에 배치시킨다. 그리고 프로그램이 실행될 때, 이미 모든 식별자는 파악되었기 때문에,
마치 선언부가 먼저 작성된 것처럼 동작한다.

```
console.log( a );
var a = 2;
```
즉 위 명령문은 실질적으로 아래 두 파트로 나뉘게 되고,
```
// compile-time
var a;
```
```
// run-time
console.log( a );
a = 2;
```
개발자 입장에서는 아래와 동일한 코드인 샘이다.
```
var a;

console.log( a );
a = 2;
```

이렇게 개발자의 입장에서 코드가 실행되는 순서를 파악하는 습관이 `Hoisting` 이라는 이름으로 개념화되었다.

**Note:** 오직 선언부만이 hoisting된다. 할당 및 실행부는 그 자리에서 그대로 실행된다.

### 2.1. per-scope
한 가지 꼭 집고 넘어가야할 중요한 사실은, scope 단위로 hoisting이 일어난 다는 사실이다. 변수 a는 foo의 맨 윗줄로 hoisting 되었다.
```
foo();

function foo() {
  console.log( a ); // undefined;
  
  var a = 2;
}
console.log( a ); // a is not defined
```

### 2.2 only function declaration. 
함수를 정의하는 방법으로 크게 선언문, 표현식이 있다.
두 방법은에 따라 hoisting 결과가 달라지는데 아래 예시를 통해 살펴보자.
```
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	// ...
};
```
함수 표현식의 경우 변수 foo가 hoisting 된다. foo는 undefined이기 때문에 foo를 실행하면 TypeError가 발생한다.
```
var foo;

foo(); // TypeError
bar(); // ReferenceError

function bar() {};
```
또한 함수 표현식의 경우 compile 과정에서 function의 이름을 따로 파악하지 않기 때문에 ReferenceError가 발생하게 된다.
```
var foo;

foo(); // TypeError
bar(); // ReferenceError

foo = function () {
          var bar = ...self...
      };
```
실제로 개발자의 입장에서는 위코드와 동일하다.

## 3. Function First
그렇다면 compile-time에서 함수를 먼저 읽을까? 아니면 변수를 먼저 읽을까? 답은 **함수**다.

```
foo(); // 1

function foo() {
  console.log( 1 );
}

var foo = function() {
  console.log( 2 );
};
```
개발자의 입장에서는 아래 코드와 동일하다. foo가 중복되었다. Js에서는 한번 정의된 foo를 재선언하면 무시되며 기존 값을 유지한다.
```
function foo() {
  console.log( 1 );
}

var foo;

foo();

foo = function() {
  console.log( 2 );
};
```
```
var foo = 2;
var foo;

console.log(foo); //2
```

하지만 함수를 재선언하면 override된다.

- 일반 변수 재선언
```
foo(); // 1
function foo() {
	console.log( 1 );
}

var foo = function() {
	console.log( 2 );
};
```
- 함수 재선언
```
foo(); // 2
function foo() {
	console.log( 1 );
}

function foo() {
	console.log( 2 );
};
```

일반 블록 내에 함수를 선언하는 경우..? 어떻게 될까? Js 버전에 따라 변하는 듯 하다.
우선 구글 88.0.4324.146 버전에서 실험해본 결과 type에러가 발생했다.
즉 foo가 if block의 첫번째 줄에서 `var foo`를 선언하고 lexical scope가 적용되어 global에 선언되었거나, 단순히 block scope가
적용되지 않았거나 여러가지 경우로 추측해 볼 수 있다. 결론적으로 블록 내에서 function을 선언하는 것은 좋지 않다.
```
foo(); // Uncaught TypeError: foo is not a function

var a = true;
if (a) {
   function foo() { console.log( "a" ); }
}
else {
   function foo() { console.log( "b" ); }
}
```
