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

Function 단위로만 스코프를 지정하는 것 보다 더 세부적으로 변수의 사용범위를 제한할 수 없을까? 
```
for (var i = 0; i < 10; i ++) {
    console.log( i );
}
console.log( i ); // 10
```
i는 for문 내에서만 사용하려고 했지만 의도와는 다르게 global 영역을 침범했다.

이때 우리는 block 단위로 scope를 지정할 수 있다. block scope란 {} 중괄호를 감싸는 블록이 하나의 scope가 되어 변수범위를 제한하는 것이다.

## 4.1. `with`
이전 ch2에서 배웠던 `with`를 다시 생각해보자. `with`는 새로운 scope를 생성한다. 그리고 그 scope 내에서 선언한 변수는 외부 scope로 빠져나가지 않았다. 그 이유는 with가 생성한 scope는 with {}(블록) 내부 적으로 변수의 사용을 제한하는 block scope 이기 때문이다.
```
var test = { a: 1 }
with(test){
    console.log(a); // 1
    var b = 10;
}

console.log( b ); // undefined
```

## 4.2. `try/catch`
ES3부터 지원하는 `try/catch`도 block scope를 지원한다.
```
try{
	var test = "test";
    undefined(); // undefined는 함수가 아니기 때문에 error 발생
} catch (err) {
	console.log( err );
}

console.log( err ); //ReferenceError: `err` not found
```

위와 같이 `catch`문은 block scope를 적용한다.
**note:** 어떤 linter(코드style을 분석해서 개발자에게 style적인 문제를 지적한다.)에서는 하나의 scope에 두 개의 try/catch 문을 사용하고 catch문에 똑같은 변수 이름을 사용하면 마치 식별자가 중복된 것 처럼 인식하는 문제가 있다. 이를 해결하기 위해 개발자들은 `err1, err2`와 같은
형태로 변수를 선언한다.

## 4.3. `let`
이제 본격적으로 block scope와 관련되 `let`을 살펴보자.
어떤 {} 블록이든 내부에서 let으로 변수를 선언하면 그 변수는 해당 block에서만 사용할 수 있게 된다.  

```
var foo = true;

if (foo) {
	let bar = foo * 2;
	bar = something( bar );
	console.log( bar) ;
}

console.log( bar ); // ReferenceError
```
### 4.3.1. Block을 조금 더 명확하게 사용하자. 
아래와 같이 {}을 명시하면 추후에 코드를 refactoring 하기도 쉽고 변수가 어디서 어디까지 쓰이는지 눈으로 확인하기도 쉽다.
```
var foo = true;

if (foo) {
	{ // <-- explicit block
		let bar = foo * 2;
		bar = something( bar );
		console.log( bar );
	}
}

console.log( bar ); // ReferenceError
```

**note:** let은 var와 달리 선언전에 실행할 수 없다.


### 4.3.2. let with loops
let은 for과 함께 사용하면 금상첨화다.
```
for (let i = 0; i < 10; i++) {
	console.log( i );
}

console.log( i ); // ReferenceError
```

**note:** for의 head부분에 let으로 변수를 정의하면 loop문이 반복될 때 마다 매번 let이 해당 scope에 새롭게 정의된다.
그 이유는 ch 5에서 자세히 살펴본다. 

## `const`
let과 더불어 const도 변수를 block-scope로 제한하는 keyword이다.
```
var foo = true;

if (foo) {
	var a = 2;
	const b = 3; // block-scoped to the containing `if`

	a = 3; // just fine!
	b = 4; // error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```
하지만, let과 다른점은 const는 한번 할당된 값을 수정하지 못한다.



## 4.4. Garbage Collection
block scope를 사용하는 또 다른 이유로, closure와 garbage collection이 있다. closure는 ch5에서 살펴보고 garbage colelction을 알아보자.
```
function process(data) {
	// do somehing interesting
}

var someReallyBigData = { .. };

process( someReallyBigData );

// process, someReallyBigData are no longer needed after this line. But these still will be alive. => garbage
var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked);
}, false );
```
someReallyBigData와 process는 process가 실행된 이후로는 필요하지 않다. 그 이후로는 메모리만 차지하고 있는 쓰레기 더미에 불과하다.
block scope를 사용하면 이런 문제를 해결할 수 있다.

```
function process(data) {
	// do something interesting
}

// anything declared inside this block can go away after!
{
	let someReallyBigData = { .. };

	process( someReallyBigData );
}

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked");
}, /*capturingPhase=*/false );
```


