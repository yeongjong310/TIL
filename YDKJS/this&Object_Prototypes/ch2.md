# ch2 `this` All Makes Sense Now!

## 1. Call-site

우선 this가 어떻게 binding되는지 알기 위해서는 call-site를 이해해야한다.
`call-site`는 함수가 실행된 위치라고 생각하면 된다. 그리고 `call-site`는 항상 현재 실행되고 있는 함수보다 이전에 실행(변경)된다.
```
function baz() {
    // 2. call-stack is: `baz`
    // so, our call-site is in the `global` scope

    console.log( "baz" );
    bar(); // <-- 3. call-site for `bar` in `baz`
}

function bar() {
    // 4. call-stack is: `baz` -> `bar`
    // so, our call-site is in `baz`

    console.log( "bar" );
    foo(); // <-- 5. call-site for `foo` in `bar`
}

function foo() {
    // 6. call-stack is: `baz` -> `bar` -> `foo`
    // so, our call-site is in `bar`

    console.log( "foo" );
}

baz(); // <-- 1. call-site for `baz` in `global`
```

## 2. Nothing But Rules
이제 본격적으로 this가 바인딩되는 규칙을 알아보자. + (call site와의 연관성)

### 2.1. Default Binding
우선 call-site 개념을 잠깐 지워버리자. 그리고
함수가 딸랑 그대로 실행되는 경우에 this는 global을 가리키는데 이게 Default 규칙이다. 
만약 어떠한 다른 규칙도 생성적용되지 않았다면 항상 Default가 적용된다고 생각하자.
```
function foo() {
	console.log( this.a );
	function bar() {
		console.log( this.a );
	}
	bar();
}

var a = 2;

foo(); 
// 2 <- this.a in foo
// 2 <- this.a in bar
```
foo()와 bar()은 call-site가 다를까? 위에서 살펴본 바로는 다르게 인식할 수 있다. 하지만 this를 생각할 때는 조금 다른 시선으로 call-site를 조사해야한다.
그게 바로 foo()와 bar() 모두 global context에서 실행됐다는 점이다.
두 함수가 딸랑 혼자서 실행되고 있는데(unlike obj.bar()) 이는 모두 global에서 불러온 함수들이다.
```
global = {
	foo: foo,
	bar: bar,
	}
```
즉 위와 같은 구조를 통해 foo와 bar가 실제적으로 global scope 내에서 실행되고 이것이 call-site이며, this를 결정짓게 된다.

**note:** 하지만 `strick mode`에서는 this가 global을 자동으로 binding 하지 않는다. 

```
function foo() {
	"use strict";

	console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```

**주의할점:** strict mode와 not-strict mode가 섞여있는 경우에도 항상 `this`가 실행되는 scope가 어떤 mode인지에 따라 결정된다.
```
function foo() {
	console.log( this.a );
}

var a = 2;

(function(){
	"use strict";
	foo(); // 2
})();
```

### 2.2. Implicit Binding
Implicit Binding 규칙은 함수가 global 외에 다른 object의 context에서 불려지는가를 고려한 규칙이다.
예를 들어 `obj.foo()`가 그러하다.
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
foo가 실행되는 call-site을 확인해야한다. foo는 obj를 통해 실행되었기 때문에(obj가 foo의 앞에 있다면)
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
이때는 this를 개발자의 의도대로 설정하는 것이 매우 힘들다.
아래 예제는 모두 자기자신 element를 참조한다. 2, 3번은 bind를 통해 window로 변경할 수 있다.

1. direct
```
<button onlick="console.log(this)"> Show this </button>  <!-- <button onclick="..."></button> -->
```
2. addEventListener
```
<button id='btn1'> Show this </button>
document.getElementById('btn1').addEventListener('click', printThis)
function printThis() {
	console.log(this)
}
```
3. event handler property
```
<button id='btn1'> Show this </button>
document.getElementById('btn1').onclick = printThis
function printThis() {
	console.log(this);
}
```

### 2.3. Explicit Binding
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
callback함수를 argument로 입력받도록 설계된 API와 함수가 있다. 그 중 어떤 함수는 argument로 binding할 객체를 받을 수 있게
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

### 2.4. `new` Binding
마지막으로 new에 대해 알아보자.

일반적인 `new`는 class의 constructor를 실행시켜 object를 만들어주는 특별한 method 이다.

Js도 이 `new` 키워드를 가지고 있는데 우리가 알고 있는 new와는 조금 다르다.

Js에서 `new`는 class가 아닌 function과 함께 등장한다. 왜냐하면 funtion은 모두 constructor를 가지고 있기 때문이다.

![image](https://user-images.githubusercontent.com/39623897/109107604-60921f00-7775-11eb-9047-25e09825e456.png)

예를들어 `Number(..)` function이 어떻게 실행되는지 살펴보자.
> 15.7.2 The Number Constructor
> When Number is called as part of a new expression it is a constructor: it initialises the newly created object.

Number가 new에 의해 실행되었을 때, Number는 constructor이며, 새로운 object를 생성한다고 한다.
즉 new가 function앞에 붙으면  function을 대신해 constructor를 실행시킨다는 말이다.

constructor가 실행될 때 프로세스는 다음과 같다.

1. 새로운 오브젝트가 생성된다.
2. prototype과 연결된다.
3. constructor 내부에 작성한 this는 1번의 오브젝트와 binding된다. 그리고 이제 this를 통해 속성을 할당한다.
4. function이 특정한 오브젝트를 반환하지 않는다면, constructor가 만든 오프젝트를 반환한다.

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

## 3. Everything In order
this를 binding하는 3가지 규칙을 살펴보았다.
1. new
2. explicit binding
3. implicit binding

그렇다면 이 세 가지 규칙을 같이 사용할 경우 Js가 어떤 규칙을 적용할까? 우선순위를 살펴보자.

결론은 `new > explicit > implicit` 순으로 적용된다.

new는 일반함수를 실행하는게 아니라 constructor를 실행시켜 object를 생성하기 때문에 bind, apply, call 메소드와 함께 오더라도 함수가 특정한 오브젝트를 반환하지 않는다면 위에서 살펴본 것 처럼 새로운 값을 반환한다.

explicit < new
bind, call, apply 메소드는 new는 함께 사용할 수 없다. 따라서 bind를 먼저 적용하고 그 다음 new를 실행시켰다.
```
obj = {"a":0}
function foo(something) {
	this.a = something;
}
bound_foo = foo.bind(obj)
new bound_foo("1")
// foo {a: "1"} => 새로운 객체 생성(new)
console.log(obj) // {a:0} 변화 x bind 무시됨
```

implicit < new 
```
function foo(something) {
	this.a = somethingl;
}

var obj1 = {};

var bar = foo.bind( obj1 ); // bar가 실행될 때의 this는 obj1을 가리킨다.
bar( 2 );
console.log( obj1.a ); //2

var baz = new bar( 3 ); // new로 새로운 객체가 baz에 할당된다. 따라서 bar가 실행될때 묶여있는 obj1 객체의 속성은 변화가 없다.
console.log( obj1.a ); //2
console.log( baz.a ); // baz에 객체가 할당됐다.!
```

implicit < explicit

```
var obj1 = {
	a: 0
	foo: function(v) {
		this.a = v
	}
}
obj1.foo(3);
console.log(obj1.a) // 3

var obj2 = {
	a: 0
}
obj1.foo.call(obj2, 5); // this는 obj2를 가리킨다.

console.log(obj1.a) //3
console.log(obj2.a) //5
```

### 3.1. return에 따른 결과값 확인해 보기.**

**함수가 객체를 반환할 때**

new 키워드를 무시하고 지정된 객체를 반환한다.
``` 
function test(a){
	this.a = a
	return {"not":"constructor"}
}
console.log(new test()); // {"not":"constructor"}
```
**함수가 일반 값을 반환할 때 or 반환하지 않을 때**

construct가 만든 오브젝트를 반환한다.
```
function test(a){
	this.a = a
	return "123"
}
console.log(new test("constructor")); // {"a":"constructor"}
```


아래함수는 ES5 버전 이하에서 bind를 polyfilling 하기위한 방법중 하나이다.
이 bind 함수는 두가지 입력값을 받는다.(1. 함수 2. obj)
그리고 입력받은 함수의 this를 obj로 binding하는 함수를 반환한다. 
```
function bind(fn, obj) {
	return function() {
		fn.apply( obj, arguments );
	};
}
obj = {} 
// bind 함수 자체에 new를 사용하나 안하나 return은 function(object)로 동일하다.
boundF = new bind(function(v){
	this.v = v
	}, obj); 
boundF("123");
console.log(obj); // {v: "123"}
obj2 = new boundF("234"); // 반환된 함수에 new를 사용해도 내부 코드는 동작하기 때문에 fn.apply(..)가 실행된다.
console.log(obj); // {v: "234")
console.log(obj2); // {}
```
**주의:**
만약 아래처럼 this.v = v를 같이 작성한다면 new를 통해 함수가 실행되었을 때 apply도 실행되고 생성자도 실행된다.
하지만 new를 사용하지 않고 일반적으로 함수를 실행할 경우 v가 전역으로 빠지게 된다.
```
function bind(fn, obj) {
	return function(v) {
		if(v) this.v = v;
		fn.apply( obj, arguments );
	};
}
obj = {};
boundF = new bind(function(v){
	this.v = v
	}, obj);
obj2 = new boundF("234");
console.log(obj2); // {v: "234"}
console.log(obj); // {v: "234"}
obj1 = boundF("123");
console.log(obj);
console.log(obj1);

```

정리:
1. bind 함수를 apply 메소드를 wrappng한 함수를 반환하는 방법으로 구현할 수 있다.
2. 위의 함수로 bound된 함수는 new를 통해 override 할 수 없다.


ES6의 bind는 new에 의해 override되는데 bind와 완전히 똑같이 동작하는 함수를 구현할 방법이 전혀 없을까?
ES5이하 버전에서 bind를 polyfilling 하는 방법을 살펴보면 해답이 존재한다.

### 3.1. polyfill bind method

bind를 polyfill하는 방법은 두가지가 있다. 
1. new가 bind를 overide하지 못하는 방법 => 퍼포먼스가 비교적 뛰어나다.(old brower에서는 퍼포먼스가 상당히 중요하다.)
2. new가 bind를 overide할 수 있는 방법 => 퍼포먼스가 비교적 느리다.

보통 bind된 함수를 new로 실행하는 경우는 거의 없다. 따라서 첫번째 방법을 권장하지만 두 번째 방법이 쓰일 때도 있기 때문에  두 가지를 모두 살펴보자.
#### 3.1.0. 먼저 알고가기
new는 보통 다음처럼 함수실행문 앞에 놓인다. 그러면 함수대신 constructor가 실행되는 구조가 된다.
```
new org_f();
```
하지만 new와 bind를 동시에 사용할 수 없기 때문에 여기서는 `new()`를 실행시킬 것이다.
이때 new 내부로 실행문이 아닌 함수 자체를 넣어주어야 한다. 
```
function org_f(){
	
new(org_f()); // TypeError: org_f(...) is not a constructor
new(org_f); // {} it works! new는 기본적으로 객체를 반환한다.
```

#### 3.1.1. 1번 `new` doesn't work after bind

```
if (!Function.prototype.bind) (function(){
  var slice = Array.prototype.slice; 
  Function.prototype.bind = function() {
    // 함수의 메소드로 실행된 경우에 this는 Function이 된다. ex). test.bind(..) => 함수도 객체이기 때문
    // thatArg는 bind가 실행되며 입력받은 obj를 뜻한다.
    // slice는 [1,2,3].slice(1) => [2,3] 처럼 실행하는 Array가 필요하다. 내부적으로 this가 가리킬 대상이 필요하기 때문이다.
    // 하지만 Array.prototype.slice.call(arr, num);는 arr(array)를 입력받아 slice함수를 실행할 수 있다.
    // arguments는 객체이지만 iterator하게 작성되었기 때문에 slice에 입력할 수 있다.
    // typeof arguments[Symbol.iterator] === 'function' // true
    var thatFunc = this, thatArg = arguments[0];
    var args = slice.call(arguments, 1); // obj외 arguments들로, 새로 생성될 function의 arguments로 입력되어야 한다.
    
    // bind 메소드를 function이 아닌 다른 obj가 실행한 경우 혹은 단일 함수로 실행되는 경우 type은 'fucntion'이 아니다.
    // new 키워드의 경우 this는 새로 생성될 객체가 된다. 따라서 thatFunc 타입이 'object'가 되기 때문에 오류 발생
    if (typeof thatFunc !== 'function') {
      throw new TypeError('Function.prototype.bind - ' +
                          'what is trying to be bound is not callable');
    }
    return function(){
        // bind는 새로운 함수를 반환한다.
        // 따라서 새로운 함수에 입력한 arguments와 bind에 입력한 arguments를 결합해 반환한다.
        var funcArgs = args.concat(slice.call(arguments)) // bind(obj, 1)(2,3) 인 경우 => funcArgs는 [1,2,3]
        return thatFunc.apply(thatArg, funcArgs) // thatArg는 입력받은 obj, funcArgs는 argumenst
    }
  }
})();
```
실험해보기
```
var obj = {};
var org_f = function(v) {
	this.v = v
}
// boundObj_f = new org_f.bind(obj); => new를 사용하면 type확인 과정에서 오류를 발생시킨다.
boundObj_f = org_f.bind(obj);
boundObj_f("3");
console.log(obj); // {v:"3"}
// boundObj_f는 Obj에 bound 되었다.

// new가 override할 수 있는 구조가 아니다. 반환된 함수에 this는 존재하지 않기 때문이다
// 단지 입력받은 함수에 오브젝트를 apply하여 실행하고 그 결과를 반환할 뿐이다. 
// 함수는 기본적으로 어떤 값을 반환할 수도 있고 아닐 수도 있는데, 이때 return이 있어야 apply가 반환한 값을 외부 함수가 받아서 사용자에게 도달할 수 있다.
new boundObj_f("4"); //{} 반환값이 primitive value or undefined인 경우(not object)에 생성자가 실행되며 {}가 반환된다. 이때 apply 함수는 이미 실행된 상태이다.
console.log(obj); // {v:"4"} // obj의 값이 변경되었기 때문에 의도한데로 bind된 함수가 정상적으로 동작했다.
new(boundObj_f); //{} 위와 같은 이유다. 
console.log(obj); {v: undefined} obj의 v가 undefiend로 변경되었다. bind된 함수 정장적으로 동작!
```

**point 정리**:
1. 반환 값
- 함수가 apply를 반환해야지만 기존 함수가 값을 반환하는 경우 그 값이 외부로 전달된다.
2. new 키워드
- new 키워드를 사용하면 {} 빈 오브젝트가 생성된다. bind 함수가 반환하는 함수의 생성자에 의해 새로운 오브잭트를 반환하기 때문이다.
3. 의도한 bind 실행여부
- new(func), new func() 모두 bind된 함수가 실행된다. => 주석 참고(apply는 항상실행되기 때문에)

**알고가기**
1. 입력받은 obj를 apply 해서 반환하는 새로운 함수를 생성한다. => 실행될 때 마다 입력받은 obj를 closure에 의해 계속 참조하는 형태가 된다.
```
return function(){ ... 
	return thatFunc.apply(thatArg, funcArgs)
}
```
2. iterable한 객체도 slice할 수 있다.
```

--- function 내부에서
// arguments는 iterable한 객체
console.log(Array.isArray(argumenst)) //false
console.log(arguments[Symbol.iterator]) // ƒ values() { [native code] }
----
var args = slice.call(arguments, 1);
```
3. bind의 argument와 새로 생성된 함수의 argument를 concat하여 apply 하면 bind의 argument를 생성된 함수의 인자로 넘겨줄 수 있다.
```
var funcArgs = args.concat(slice.call(arguments))
```
4. 1번의 함수가 bind된 새로운 함수다. 이 함수가 실행되는 순간 먼저 apply함수가 실행되며 new와 함께 사용했을 때는 새로운 함수 내부에 this가 존재하지 않기 때문에 '{}' 빈 객체를 반환해야 하지만, 코드의 윗부분을 살펴보면 new와 함께 실행되는 순간 bind 함수 내부에 this가 새로 생성될 object를 가리킬 것이기 때문에 function이 아닌 관계로 에러가 발생한다.

#### 3.1.2. 2번 `new` works after bind
```
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind) (function(){
  var ArrayPrototypeSlice = Array.prototype.slice;
  Function.prototype.bind = function(otherThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var baseArgs= ArrayPrototypeSlice.call(arguments, 1),
        baseArgsLength = baseArgs.length, // arguments 길이
        fToBind = this,
        fNOP = function() {}, 
        fBound  = function() {
          baseArgs.length = baseArgsLength;
          baseArgs.push.apply(baseArgs, arguments);
          return fToBind.apply(
                 fNOP.prototype.isPrototypeOf(this) ? this : otherThis, baseArgs
          );
        };
    if (this.prototype) { 
		// prototype은 함수만 가지고 있기 때문에 bind를 호출하는 대상이 object이면 실행하지 않는다.
      fNOP.prototype = this.prototype;
    }
    
    fBound.prototype = new fNOP();

    return fBound;
  };
})();

function test(){};
test1 = test.bind({"a":1}); // fNOP의 prototype에 test의 prototype을 할당한다. fBound의 prototype은 fNOP이 생성하는 객체가된다.
new test1("123"); // fBound가 생성하는 object는 fNOP과 같다. 이 object가 this이다.

```

#### 3.1.2.1 핵심 코드만 정리:

##### 3.1.2.1.1. 일반 bind 함수
```
function bind (){
    slice = Array.prototype.slice
    obj = arguments[0]
    fArgs = slice.call(arguments, 1)
    baseFunc = this
    fBound = function(){
        args = fArgs.concat(slice.call(arguments))
        return baseFunc.apply(obj, args)
    }
    return fBound
}
obj = {"a":1};
tFunc = function(){
	this.a = 7;
}
boundTFunc = tFunc.bind(obj);
// boundTFunc() // obj의 "a"가 7로 변경됨
// new boundTFunc() // fbound의 생성자가 실행되며 빈 객체를 반환한다. 또한 apply함수도 실행되어 obj의 a도 4로 변경된다.
```
##### 3.1.2.1.2. new가 가능한 bind 함수
```
Function.prototype.bind = function() {
    slice = Array.prototype.slice
    obj = arguments[0]
    fArgs = slice.call(arguments, 1)
    baseFunc = this
	
    fNOP = function(){}
    
    fBound = function(){
        args = fArgs.concat(slice.call(arguments))
        return baseFunc.apply(
            fNOP.prototype.isPrototypeOf(this) ? this : obj, args)
    }
	
    fNOP.prototype = this.prototype; //1
    fBound.prototype = new fNOP();
    return fBound
}

obj = {"a":1};
tFunc = function(){
	this.a = 7;
}
boundTFunc = tFunc.bind(obj);
// boundTFunc() // obj의 "a"가 7로 변경됨
// new boundTFunc() // fbound의 생성자가 실행된다 이때 이미 fbound의 property는 fNOP의 객체이며 fNOP은 기존함수의 생성자를 가지고 있어서 tFunc가 생성한 객체
```

##### es6의 bind
일반적으로 bound된 함수를 통해 객체를 생성하면 bound 되기전의 함수를 리턴한다.

![image](https://user-images.githubusercontent.com/39623897/109912735-030b4e80-7cf0-11eb-950e-9c88d7e9fa2b.png)

boundTfunc를 보면 일반적인 tFunc 함수이며, 단지 this만 변경되었을 뿐이다.

![image](https://user-images.githubusercontent.com/39623897/109913850-10c1d380-7cf2-11eb-8cee-6e93708b59e7.png)

es6의 new를 통해 생성된 객체는 `__proto__` 속성을 가지고 있다. 그리고 이 `__proto__`는 본인을 생성한 함수의 prototype을 가리킨다. 이 prototype에는 위와 같이 constructor가 존재한다.

##### es5에서 bind를 대체할 때

하지만 우리가 살펴본 코드는 조금 다르다. 우선 bind 함수를 통해 반환되는 fBound가 tFunc가 아니기 때문에, fBound가 생성한
객체가 tFunc를 상속받도록 할 것이다.

**고려할 사항:(new 관점)**
1. fBound가 생성할 객체는 tFunc를 상속받은 빈 함수(fNOP)가 생성한 객체를 상속받는다. => tFunc와 연결하기 위함
2. tFunc가 생성하는 객체를 반환하기 위해 tFunc.apply(this, args)를 사용한다. this는 fBound가 생성할 객체이다.

**고려할 사항:(함수 실행 관점)**
1. tFunc.apply(obj, args)를 실행한다. => bound될 obj를 apply로 실행  

**상세 설명**
1. fBound 함수가 실행될 때 tFunc의 apply 메소드를 실행한다.
2. fBound 함수는 tFunc가 아니기 때문에 구조적으로 tFunc와 연결시켜야 한다.
3. 상속 개념을 생각해 볼 수 있다.
4. fBound의 prototype을 tFunc가 생성한 객체로 바로 지정하면 fBound에 의해 생성될 객체의
__proto__는 fBound의 prototype을 바라보기 때문에 tFunc가 생성한 객체 자체가 `__proto__`에 할당되게 된다.

즉, 만약 tFuc가 생성한 객체에 속성이 들어있다면 fBound가 생성할 객체의 `__proto__`에도 그 속성이 존재하기 때문에
주의해야한다.
5. 4번의 문제를 회피하기 위해 빈 함수 fNOP을 만들어 fNOP의 prototype을 tFunc의 prototype으로 설정한다. 그 다음 
fBound의 prototype을 fNOP이 생성한 객체로 지정하면 

fBound가 생성하는 객체의 `__proto__`가 fNOP의 객체를 바라보며 fNOP의 객체의 `__proto__`는 다시 tFunc의 prototype을 바라보는 구조가
된다.

6. 이제 fBound가 생성하는 객체의 속성은 비어있는 상태다. 따라서  fFunc가 생성할 객체의 속성과 같이 할당해야한다.
7. new를 통해 fBound가 실행되면 그 내부의 this는 새롭게 생성되는 객체가 된다.
8. 따라서 tFunc.apply(this, args) 를 하게되면 tFunc 내부의 this는 생성되는 객체를 바라보기 대문에 생성될 객체의 속성은 tFunc 객체 구조와 같아진다.
9. fBound가 어떤 객체를 반환하면 그 객체가 fBound가 된다. 하지만 어떠한 상속도 없는 그 객체 자체가 생성되기 때문에 옳바른 방법이 될 수 없다.
하지만 tFunc.apply을 반환하는 구조가 되는 이유는 
tFunc가 어떤 객체를 반환하는 경우에 fBound가 이 객체를 받아 다시 반환하여 tFunc가 반환한 객체를 생성하기 위함이다. 

**왜 new가 bind를 overriding 할 수 있어야 할까?**
bind의 argument는 기존 함수의 매개변수를 앞에서 부터 차례대로 고정시킨다.
```
function foo(p1,p2) {
	this.val = p1 + p2;
}

// using `null` here because we don't care about
// the `this` hard-binding in this scenario, and
// it will be overridden by the `new` call anyway!
var bar = foo.bind( null, "p1" );

var baz = new bar( "p2" );

baz.val; // p1p2
```
따라서 고정된 매개변수가 있다면 bind를 사용하면 편리하다.

## 4. Binding Exceptions

### 4.1. Ignored `this`
null 혹은 undefined가 call, bind, apply 메소드의 argument로 넘어오면 default 룰이 적용된다.
```
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b );
}

// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

null과 undefined를 의도적으로 입력하면, argument를 preset 할 수 있다.
```
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b );
}

// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

### 4.2. Indirection

this를 사용한 함수는 실행되는 context에 따라 가리키는 대상이 변하기 때문에, implicit binding을 이용하면 필요에 따라 가리키는 대상을 변경할 수 있다.

```
function foo() {
	console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2 <- p.foo = o.foo를 수행하면 foo를 반환하기 때문에 일반 global 객체의 a인 2를 반환
```

Reminder: strict 모드에서의 default 규칙은 언제나 undefined임을 명심하자.

### 4.3. Softening Binding
default 의 this가 global을 가리키지 않고 다른 context를 가리키게 할 수 있는 방법이 있다.
이 방법은 explicit, implicit binding도 모두 적용되기 때문에 bind함수와 차별되는 방법이다.
위에서 살펴본 [`new` doesn't work after bind](#311-1번-new-doesnt-work-after-bind)의 방법과 비슷하다.

3.1.1 번에서 bind함수는 apply메소드를 사용하고 있는데, softbind 함수의 경우 this가 어떤 값인지에 따라 apply에 입력해줄 obj를 변경하기만 하면 된다.

따라서 일반 bind 함수는 1번 사용되면 더이상 this를 변경하지 못하지만, 아래 함수는 변경 가능하다.

```
// func.softBind(obj) 라면 this는 func를 가리키고 obj는 입력된 obj를 가리킨다.
// 1. this가 false이거나(!this), 2. window(global)이 "undefined" 가 아닌 경우에 this가 window(global)을 가리키면
// obj를 apply의 argument로 입력. 즉 1번 경우거나 2번은 default 바인딩 인경우에만 입력받은 obj가 바인딩됨 => 함수가 혼자서 실행되는 경우
// 위의 경우가 아니라면 `ex) obj.test();` this(obj)가 apply의 argument로 입력된다. => implicit binding 
if (!Function.prototype.softBind) {
	Function.prototype.softBind = function(obj) {
		var fn = this,
			curried = [].slice.call( arguments, 1 ),
			bound = function bound() {
				return fn.apply(
					(!this ||
						(typeof window !== "undefined" && // window가 undefined가 아니어야함
							this === window) || // this === 가 window 이면(default binding)
						(typeof global !== "undefined" &&
							this === global)
					) ? obj : this,
					curried.concat.apply( curried, arguments )
				);
			};
		bound.prototype = Object.create( fn.prototype );
		return bound;
	};
}
```

**핵심 코드**:
1. this가 window 인 경우는, softbind 함수가 실행되고 반환된 함수가 독자적으로 실행되었을 때이다. 이때는 입력받은 obj가 binding 된다.
2. 1번이 아닌경우는 obj의 메소드로 실행되는 경우이며 이때는 this(실행한 obj)가 binding 된다.
```
(
	(typeof window !== "undefined" && 
		this === window) ||
	(typeof global !== "undefined" &&
		this === global)
) ? obj : this,
```

## 5. Lexical `this`
arrow 함수의 경우 this를 사용하는 함수가 정의된 시점에 위치한 context의 this를 따른다.
this가 정의되는 시점은 foo가 실행될 때 이다.
따라서 아래 `bar = foo.call( obj1 );` 코드에서 이미 foo의 this는 obj1로 결정되었다.
```
function foo() {
	// return an arrow function
	return (a) => {
		// `this` here is lexically adopted from `foo()`
		console.log( this.a );
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, not 3!
```

### 5.1. 사용처

#### 5.1.1. 콜백 메소드

**arrow functions**
```
function foo() {
	setTimeout(() => {
		// `this` here is lexically adopted from `foo()`
		console.log( this.a );
	},100);
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```
foo가 실행되는 시점에 this를 obj로 고정하면(foo.call( obj )) setTimeout 메소드 내부에서 this는 변동되지 않는다.

**normal functions**
```
function foo() {
	var self = this; // lexical capture of `this`
	setTimeout( function(){
		console.log( self.a );
	}, 100 );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```
self에 this를 저장해 두고 setTimeout에 self를 넘겨주면 self가 closure에 의해 정상적으로 this를 가리킨다.



