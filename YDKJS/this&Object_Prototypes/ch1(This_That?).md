# ch1. this or That?

## 1. Why `this`?
왜 `this` 키워드를 사용할까?
```
function identify() {
    return this.name.toUpperCase();
}

function speak() {
    var greeting = "Hello, I'm " + identify.call(this);
    console.log( greeting );
}

var me = {
    name: "Kyle"
};

var you = {
    name: "Reader"
};

identify.call( me ); // KYLE
identify.call( call ); // READER

speak.call( me ); // Hello, I'm KYLE
speak.call( you ); // Hello, I'm READER
```
때로는 lexical scope의 규칙을 벗어나 다른 scope의 변수를 참조해야 할 때가 있다.
위의 예시에서 identify와 speak는 me, you(object)의 외부에서 실행됐음에도 me와 you를 직접적으로 언급하지 않고 각 객체를 참조하고 있다.
즉, 개발자가 해당 함수를 어떻게 실행하는지에 따라서 함수 내부에서 this가 가리키는 객체가 바뀌었고 매우 유연한 접근이 가능해졌다.

만약 this가 없다면 다음과 같이 매개변수로 object를 넘겨주어야만 한다.
```
function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify( context );
	console.log( greeting );
}

identify( you ); // READER
speak( me ); // Hello, I'm KYLE
```

## 2. Confusions + misconception

**1. itself**  

this는 실행되고 있는 function 자신을 가리키는 키워드가 아니다.
```
function foo(num) {
    console.log( "foo: " + num );
    
    // let's keep track of how many times `foo` will be called
    this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
    if (i > 5) {
        foo( i );
    }
}

// foo: 6
// foo: 7
// foo: 8
// foo: 9

console.log( foo.count ); // 0 -- WTF?
```
this가 foo를 가리킨다면 foo가 실행될 떄 마다. foo 속성인 count가 증가해야한다. 하지만 프로그램이 종료되기전 foo의 count는 0이다.

### 2.1. 해결방법

#### 2.1.1. 1번 lexical scope
lexical scope를 이용해보자. lexical scope에 때라 foo 내부에서 foo 자신을 호출하면 global에 선언된 foo를 실행할 수 있다.
```
function foo() {
    foo.count ++;
}
foo.count = 0;

for (i=0; i<10; i++) {
    if (i > 5) {
        foo( i );
    }
}
console.log(foo.count) // 4
```
문제점
```
setTimeout( function() {
    ...
}, 10 );
```
익명함수의 경우 arguments.callee를 사용해야 자신을 불러올 수 있다. 하지만 이 방법은 권장되지 않는다. 따라서 웬만해서 재귀함수를 사용해야할 때
named function을 사용하자.

#### 2.1.2. 1번 this의 call apply bind
```
function foo() {
    this.count ++;
}
foo.count = 0;

for (let i=0; i<10; i++) {
    if (i > 5) {
        foo.call( foo, i );
    }
}
console.log( foo.count ) // 4
```

**2. Its Scope**

this는 함수의 lexical scope를 가리킨다. 이말은 거짓이다. this가 특정 함수의 scope를 가리키는 것은 맞다. 하지만
this는 함수가 누구에 의해 실행됐는지 혹은 함수가 실행된 곳이 어딘지에 따라 가리키는 scope가 달라진다.

```
function foo() {
    var a = 2;
    this.bar();
}

function bar() {
    console.log( this.a );
}

foo(); // undefined
```
this를 통해 bar를 부르면 bar 내부의 a는 foo의 a를 가리킨다고 착각하기 쉽다. 하지만 어떤 함수 내부에서 this를 작성했는지가
this를 결정하지 않는다. 따라서 foo 내부의 this를 통해 bar를 불렀다고 할지라도 bar 내부의 this가 foo를 가리키는 
다리의 역할을 한다고  것은 엄청난 착각이다.
