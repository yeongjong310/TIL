ch3. Function vs Block scope


# 1. Scope From Functions
js 는 기본적으로 Function에 의해 scope가 생성된다.

scope가 생성되기 때문에, 각 scope마다 고유의 식별자를 가지고 있을 수 있다.

예를들어
```
function foo(a) {
	var b = 2;

	// some code

	function bar() {
		// ...
	}

	// more code

	var c = 3;
}
```
global은 foo를, foo에는 `a,b,c`, `bar`를, bar에는 bar만의 식별자를 가지게된다.

이렇게 scpoe를 나누면 좋은 점을 소개한다.

# 1. hiding in plain scope

```
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

다음과 같은경우 b와 doSomethingElse는 global부터 모든 scope에서 사용할 수 있다.
하지만 실질적으로 b와 doSomethingElse는 doSomething에서만 사용하고 있기 때문에, 굳이 global에서 까지 사용할 필요가 없다.
추후에 어떤 일이 발생할지 모르기 때문에 필요한 곳에서만 변수를 사용할 수 있게 해야한다.

```
function doSomething(a) {
	function doSomethingElse(a) {
		return a - 1;
	}

	var b;

	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

doSomething( 2 ); // 15
```
위와 같이 코드를 수정하면 doSomething 안에서만 변수와 함수를 사용하도록 제한할 수 있다.

# 2.Hiding In Plain Scope
# 2.1 collision Avoidance
충돌을 방지하는데도 효과적이다.
```
function foo() {
	function bar(a) {
		i = 3; // changing the `i` in the enclosing scope's for-loop
		console.log( a + i );
	}

	for (var i=0; i<10; i++) {
		bar( i * 2 ); // oops, infinite loop ahead!
	}
}

foo();
```
예시가 조금 억지스럽지만, for문 내에서 정의한 i는 foo의 scope에 속하게 된다.

foo 내부에서 `i = 3`을 실행할 때, i는 LHS로 for에서 정의한 i를 참조한다. 즉 foo 내부에서 사용하는 i는 모두 하나의 i를 가리킨다.
function 내부의 `i = 3;`을 `var i = 3;`으로 변경하면 문제가 해결된다.

## 2.1.1 Global "Namespaces"
library 같은 경우 많은 함수, 변수를 포함하고 있다. 따라서 다수의 library를 동시에 import하는 경우 의도치 않게 중복되는 identifier가
생길 것이다. 이때 사용하는 방법은 object와 같은 다양한 값들을 global scope의 변수인 Namespace에 할당하는 것이다.
```
var MyReallyCoolLibrary = {
	awesome: "stuff",
	doSomething: function() {
		// ...
	},
	doAnotherThing: function() {
		// ...
	}
};
```
위 예제는 MyReallyCoolibarary 안에 object를 삽입함으로써 MyReallyCoolibarary를 통해서만 접근할 수 있다.

# 3. Functions As Scopes
지금까지 함수를 선언해서 변수의 접근을 제한했다. 
```
var a = 2;

function foo() { // <-- insert this

	var a = 3;
	console.log( a ); // 3

} // <-- and this
foo(); // <-- and this

console.log( a ); // 2
```
이처럼 말이다. 위와 같이 함수를 선언하고 실행하는 목적은 선언한 함수를 재사용하기 위해서다. 하지만 재사용 할 필요가 없다면, global에 선언 foo는 scope 영역을 교란시킬 뿐이다. 이를 해결하기 위한 아주 좋은 방법이 있다.

```
var a = 2;

(function foo(){ // <-- insert this

	var a = 3;
	console.log( a ); // 3

})(); // <-- and this

console.log( a ); // 2
```

이렇게 함수 선언문을 `()`로 감싸고 끝에 함수를 실행하는 `()`를 붙이면 foo는 global에 노출지 않고, foo를 선언함과 동시에 실행된다.
이렇게 바로 실행하는 함수를 IIFE(Immediately Invoked Function Expression) 라고하며 함수 표현식의 일종이다.
함수 표현식의 특징중 하나는 function의 이름이 해당 scope의 identifier(식별자)로 사용되지 않는다는 점이다. 앞서 말한것 처럼 IIFE로 선언한 함수의 이름도 scope의 identifier로 등로되지 않는다.

**note:** 표현식과 선언문을 구분하는 쉬운 방법은 라인의 시작이 function인지 아닌지 확인하는 것이다.

```
var a = function b() {}
```
일반적인 표현식을 보면 function의 이름은 `b` 이지만 scope에 등록되는 identifier는 `a`이다.

## 3.1. Anonymous vs. Named
함수 표현식은 이름없이 사용할 수 있고, 함수 선언문은 불가능하다. 그리고 이름없는(Anonymous) 함수는 일반적으로 이름있는 함수보다 빠르고
작성하기도 쉽다. 하지만 이름없는 함수를 사용하기전에 몇 가지는 고려해야 필요가 있다.

1. Anonymous functions는 이름이 없다. 따라서 디버깅 때 어디서 오류가 났는지 확인하기 힘들다.
2. 이름이 없기 때문에 재귀함수와 같이 function 내부에서 자신을 부르는 구조로 사용하기 힘들어진다. 이름 없는 함수를 재귀로 사용하려면
이제는 잘 사용하지 않는 arguments.callee를 사용해야 한다.
3. 이름이 없기 때문에 함수가 어떤 기능을 하는지 유추하기 어렵다.

### 3.1.1. Immediately Invoked Function Expression.
IIEF를 사용할 수 있는 방법은 style 적으로 두가지 방법이 있다.
1. `(function foo(){})();` 실행문() 이 바깥에 있다.
```
var a = 2;

(function foo(){

	var a = 3;
	console.log( a ); // 3

})();

console.log( a ); // 2
```
2. `(function foo(){}());` 실행문() 이 안쪽에 있다.
```
var a = 2;

(function (){

	var a = 3;
	console.log( a ); // 3

}());

console.log( a ); // 2
```
이 둘의 기능은 동일하다.
#### 3.1.1.1 IIFE 활용하기
1. IIFE에 argument를 넣어줄 수 도 있다.
```
var a= 2;
(function IIFE( global ) {
  var a = 3;
  console.log( a ); // 3
  console.log( global.a ); // 2
})( window );

console.log( a ); // 2
```
2. parameter 이름을 undefined로 지정하면 argument가 넘어오지 않았음을 확인 할 수 있다.
```
undefined = true; // setting a land-mine for other code! avoid!

(function IIFE( undefined ){

	var a;
	if (a === undefined) {
		console.log( "Undefined is safe here!" );
	}

})();
```
function scope에서는 undefined가 overwrite될 수 있다. 이런 상황을 방지하기 위해 undefined를 파라미터로 입력하면
위와 같이 undefined의 의미를 보존할 수 있다.

3. callback 함수

```
var a = 2;

(function IIFE( def ){
	def( window );
})(function def( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

});
```
위와 같이 callback으로 사용할 수도 있다.

# 4. Blocks As Scopes



