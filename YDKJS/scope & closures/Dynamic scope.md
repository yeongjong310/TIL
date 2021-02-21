# Appendix A: Dynamic Scope
js는 lexical scope를 사용하며 author-time에 scope를 결정된다. 반면 dynamic scipe는 run-time에 결정된다.
마치 this 처럼 말이다.

```
function foo() {
    console.log( a ); // 2
}

function bar() {
    var a = 3;
    foo();
}

var a = 2;

bar();
```
lexcical scope에서 위 코드의 foo를 실행하면 a는 2를 bar() 내부에서 사용되었을 지라도 2를 출력한다.
하지만 dynamic scipe인 경우는 3을 출력한다.

```
function foo() {
    console.log( a ); // 3
}

function bar() {
    var a = 3;
    foo();
}

var a = 2;

bar();
```

그 이유는 bar의 내부에서 foo를 실행하기 때문이다. this를 살펴보자. 엄격모드에서는 기본적으로 this는 undefined이다.
그래서 f2()를 실행하면 undefined를 출력한다. 하지만 window 객체를 통해 접근하면 this가 window를 가리킨다.
```
function f2() {
    'use strict';
    return this;
}

f2() === undefined; // true
window.f2() === undefined // false
```
this가 실행되는 곳에 따라 결과가 달라진 것 처럼 Dynamic scope에서도 function이 어디서 실행되는지에 따라 변수가 가리키는 scope는 달라진다.

