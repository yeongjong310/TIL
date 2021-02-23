# ch2 `this` All Makes Sense Now!

## 1. Call-site

우선 this가 어떻게 binding되는지 알기 위해서는 call-site를 이해해야한다.
call-site는 함수가 실행되는 위치의 scope라고 생각하면 된다.
```
function baz() {
    // call-stack is: `baz`
    // so, our call-site is in the global scope

    console.log( "baz" );
    bar(); // <-- call-site for `bar`
}

function bar() {
    // call-stack is: `baz` -> `bar`
    // so, our call-site is in `baz`

    console.log( "bar" );
    foo(); // <-- call-site for `foo`
}

function foo() {
    // call-stack is: `baz` -> `bar` -> `foo`
    // so, our call-site is in `bar`

    console.log( "foo" );
}

baz(); // <-- call-site for `baz`
```

## Nothing But Rules
call site가 어떻게 this를 바인인하는지 알아보자.

### 1.1. Default Binding
함수가 딸랑 그대로 실행되는 경우가 Default 이다. 만약 어떤 다른 규칙이 적용되지 않으면 항상 Default를 유지한다고 생각하자.
```
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```
foo()가 혼자서 실행됐을 때 foo가 실행되는 동안의 this는 전역 객체인 global을 바라본다.

**note:**
1. 전역에서 변수를 정의하는 것은 global 객체의 속성으로 선언하는 것과 똑같다.
2. foo()가 실행된 call-site는 전역에 있다.

따라서 foo가 실행된 시점의 this는 global 객체를 바라본다.

하지만 `strick mode`에서는 this가 global을 자동으로 binding 하지 않는다.
```
function foo() {
	"use strict";

	console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```
### 1.2. Implicit Binding
call-site 지점에서 object context를 통해 함수가 불려지는가?
```
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```
위 예제는 foo가 obj의 외부에서 정의되었고, 나중에 obj의 속성으로 할당되었다. 하지만 정의된 시점과 상관없이
foo가 실행되는 call-site을 확인해야한다. foo가 obj의 context를 통해 실행되고 있고, obj가 foo의 앞에 있다면,
this는 obj를 가리킨다.

** Implicitly Lost **
`this`가 의도와 다르게 unbinding 되는 경우가 있다.
```
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

var a = "oops, global"; // `a` also property on global object

setTimeout( obj.foo, 100 ); // "oops, global"
```
callback 함수로 넘겨주는 경우 해당 함수의 지역변수로 할당된다. 이때는 binding이 풀린다.
```
localValue = obj.foo;
localValue();
```

**note:**
하지만 Event Handler와 같이 callback 함수를 DOM으로 강제 binding하는 함수들이 있다.
이때는 예상했던 this를 개발자의 의도대로 조절하는 것이 매우 힘들어진다.

### 1.3. Explicit Binding
apply, call, bind를 사용하면 강제로 this를 원하는 object로 binding할 수 있다.
```
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}

var obj = {
	a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```
**API Call :"Contexts"**
callback함수를 argument로 받는 정말 많은 API와 함수들이 있다. 그리고 어떤 함수는 argument로 binding할 객체를 받을 수 있게
설계된 경우도 있다.
```
function foo(el) {
	console.log( el, this.id );
}

var obj = {
	id: "awesome"
};

// use `obj` as `this` for `foo(..)` calls
[1, 2, 3].forEach( foo, obj ); // 1 awesome  2 awesome  3 awesome
```

### 1.4. `new` Binding
마지막으로 new에 대해 알아보자.

일반적으로 constructors class에 붙어있는 매우 특별한 method로 취급된다. new에 의해 class가 실행되면 정의된 
constructor도 함께 불려진다.

Js도 `new` operator를 가지고있다. 그리고 이 `new`는 마치 우리가 알고 있는 new와 비슷해 보인다.
하지만 Js에서 new는 function과 연관이있다.

Js에서 constructor는 `new`에 의해 실행되는 일반적인 function이다. 
예를들어 `Number(..)` function이 어떻게 실행되는지 살펴보자.
> 15.7.2 The Number Constructor
> When Number is called as part of a new expression it is a constructor: it initialises the newly created object.

Number가 new에 의해 실행되었을 때, Number는 constructor이며, 새로운 object를 생성한다고 한다.
즉 new가 function앞에 붙으면  function을 대신해 constructor를 실행시킨다는 말이다.

constructor가 실행될 때 프로세스는 다음과 같다.

1. 새로운 오브젝트가 생성된다.
2. prototype과 연결된다.
3. constructor에 작성한 this가 생성되는 object와 binding된다. (실행되며 속성으로 저장됨.)
4. fucntion이 object를 반환하지 않는다면, constructor가 만든 오프젝트를 반환한다.

```
function foo(a) {
  this.a = a;
}

var bar = new foo(2);
console.log(bar.a) //2 => this가 생성되는 object에 binding되었기 때문

function foo(a) {
  this.a = a;
  return {a: 10}
}
var bar = new foo(2);
console.log(bar.a) //10 => 함수가 객체를 반환하면 constructor가 생성한 객체는 무시된다.
```
