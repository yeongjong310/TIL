# ch2. Into Javascript.

## 1. values & types
자바스크립트는 7가지의 타입이있다.
- string
- number
- boolean
- null
- undefined
- object
- symbol
```
var a;
typeof a;           // "undefiend"

a = "hello world"
typeof a;           // "string"

a = 42;
typeof a;           // "number

a = true;
typeof a;           // "boolean"

a = null;
typeof a;           // "object" -- long-standing bug

a = undefined       
typeof a;           // "undefined"

a = { b: "c" };
typeof a;           // "object"

a = Symbol();       // as of ES
typeof a;           // "symbol"
```
**Warnng**: `typeof null`은 Js에서는 오래된 버그중 하나이다. null은 '값이 없다'를 명시하기 위해 변수에 저장된다.
하지만 null의 타입을 체크해보면 `object`를 출려한다. 이는 Js의 오래된 버그로 이 버그를 수정하면 기존의 코드에서 오류가 날 수 있기 때문에 Js에서는 이 버그를 수정하지 않고있다. 따라서 null인지 확인하기 위해서는  `a === null`처럼 값과 타입을 모두 비교하는 일치 연산자를 사용하면 된다.

반면 `undefined`는 변수가 선언되고 사용할 메모리를 확보했지만, 아직 이 변수에 값이 할당되지 않았음을 뜻 한다. 즉 이 변수의 쓰임이 정의되지 않은 상태를 뜻하는데, 변수를 `undefiend` 상태로 만드는 방법이 몇 가지 있다. 위의 `a = undefined`를 보면 `var a;`와 같은 undefined 상태가 된다. 이 외에도 void 연산자를 사용한 function은 undefined를 리턴한다. 

### 1.1. objects
여러 개의 값을 담을 수 있는 자료형.
```
var obj = {
  
}
```
### 1.2. Built-In Type Methods

### 1.3. Comparing Values
#### 1.3.1. Coercion
##### explicit coercion
```
var a = "42"

var b = Number( a );

a;      //"42"
b;      //42 -- the number!
```
##### implicit coercion
```
var a = "42";

var b = a * 1; // "42" implicitly coerced to number 42 here

a;      // "42"
b;      // 42 -- the number!
```
#### 1.3.2. Truthy & Falsy
##### 1.3.2.1. Falsy
- `""`(empty string)
- `0`, `-0`, `NaN`(invalid number)
- `null`, `undefined`
- `false`
#### 1.3.2.2. Truthy
- `"helloe"`(string)
- `42`(number)
- `true`(boolean)
- `[]`(arrays)
- `{}`(objects
- `function foo() { .. }` (functions)
#### 1.3.2.3. Equality
4개의 일치 연산자가 있다.

**느슨한 비교**
1. `==`: 값이 같음을 비교하는 연산.
2. `!=`: 값이 다름을 비교하는 연산.

**엄격한 비교**  
3. `===`: 값과 타입 모두 같음을 비교하는 연산.  
4. `!==`: 값과 타입의 다름을 비교하는 연산. => 값 혹은 타입 하나라도 다르면 `true`를 반환.  

거의 대부분의 개발자는 느슨한 비교에 대한 걱정을 가지고 있다. 타입을 비교하지 않기 때문에 추후 혹시모를 불미스러운 일을 우려하여 엄격한 비교를 사용하곤 한다. 
본인도 지금까지 값을 비교할 때는 항상 값과 타입을 모두 비교하는 엄격한 비교 연산자를 써왔다. 하지만 이 책에서는 우리가 생각하는 불미스러운 일을 과대광고로 표현하며 느슨한 비교를 사용할 이유에 대해서 설명한다. 그리고 느슨한 비교가 어떤 알고리즘으로 돌아가는지 파악하라는 저자의 말에 (http://www.ecma-international.org/ecma-262/5.1/) 의 11.9.3 섹션을 살펴보았다. 그리고 느슨한 알고리즘은 생각보다 일정한 패턴으로 특정한 조건이 맞아 떨어지면 한쪽의 값을 형변환한 후에 두 값을 비교했다. 그래서 이 알고리즘을 제대로 알고 올바르게 사용하면 불필요한 코드를 줄이고 가독성을 개선하는데 도움이 될거라는 저잘의 말에 동의한다. 저자는 느슨한 비교를 사용할 때를 이 책에서 소개하고 있는데 추후에 코드를 작성하면서 이 척도를 적용해본 후 천천히 나만의 기준을 만들어 보려고한다. 

**저자가 말하는 `==`을 사용할 때**
- 비교 값 중 하나라도 boolean 값이면 `===`를 사용해라.
- 비교 값 중 하나라도 (`0`, `""`, `[]`(empty array)이면 `===`를 사용해라
- 그 외의 경우는 `==`를 사용해도 된다.

##### non primitive values(참조값)의 비교..(array, function, object)
참조값의 비교는 단순히 각 변수가 참조하는 주소를 비교할 뿐이고 때로는 형변환도 일어나기 때문에 조심해야 한다.

```
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";

a == c;     // true;
b == c;     // true; => object는 string으로 형변환 된다.
a == b;     // false;
```

#### 1.3.2.4. Inequality
값이 크고 작은지를 비교하기 위한 다음 4가지 연산자가 있다. `<`, `>`, `<=`, `>=` 

- string도 비교가능 => 형변환
```
var a = 41;
var b = "42";
var c = "43";

a < b;		// true
b < c;		// true
```
- 숫자와 숫자화 될 수 없는 문자를 비교하면 항상 false
```
var a = 42;
var b = "foo";

a < b;		// false
a > b;		// false
a == b;		// false
```
- 문자의 알파벳 순서 비교
```
var a = "abc";
var b = "cba";

a > b;    /// false;
a < b;    /// true;
```

## 2. Variables

식별자를 만드는 규칙
- `a-z`, `A-Z`, `&`, `_`만이 변수 이름의 첫 문자가 될 수 있다.
-  두번째 문자 부터는 위의 문자들과 함께 `0-9` 숫자를 결합할 수 있다.

![image](https://user-images.githubusercontent.com/39623897/105149811-50b86700-5b47-11eb-8e0a-1fd3fedfe0f5.png)

### 2.1. Function Scopes
스코프는 변수의 생애 주기를 조절해서 변수에 접근 할 수 있는 범위를 제한하는 방법이다.
자바스크립트는 ES6 이전까지 함수 내부에서만 그 범위를 제한할 수 있었다.( 이후 let과 const가 생기며 블록 스코프도 사용가능 )
```
var a = 10;
function foo() {
  var b = 10;
  
  console.log( b );     // 10
  console.log( a );     // 10
}

console.log( b ); // Uncaught ReferenceError: a is not defined
```
function foo의 내부에서 변수 b를 선언했기 때문에 그 밖에서 b에 접근했을 때는 오류가 발생한다. 

하지만 함수 범위 밖에서 선언한 변수를 함수 범위 안에서는 실행가능하다. =>  a가 foo함수 내에서 접근가능한 이유
#### 2.1.1. Hoisting
호이스팅은 변수 혹은 함수가 속한 범위 내에서 가장 상단에 선언문이 작성되는 것이다.
자바스크립트는 프로그램이 실행되기 전 모든 변수 혹은 함수를 읽어 이들이 가능한 최상단에 배치된 것 처럼 코드를 수행한다. 
```
foo();

function foo(){
  a = 3;
  conosole.log( a );
  var a;
}
```
foo와 변수 a는 선언보다 할당과 실행이 먼저 수행되는데도 불구하고 오류없이 정상적으로 실행된다.

#### 주의할 점
```
function foo() {
	a = 1;	// `a` not formally declared
}

foo();
console.log( a );			// 1 -- oops, auto global variable :(
```
자바스크립트에서는 hoisting 덕분에 `var`를 생략해도 `var`가 명시된 것 처럼 수행되는데,
function 안에서 `var`를 생략하면 전역변수로 선언된다.

### 2.1. Block Scopes
es6버전에서 let과 const라는 새로운 키워드가 등장했다. 이 키워드들은 `{}` 안으로 범위가 지정된다.
```
function foo() {        // a만 접근가능
  var a = 1;
  
  if (a >= 1) {         // a,b 접근가능
    let b = 2;
    
    while (b < 5) {     // a,b,c 접근가능
      let c = b * 2;
      b++;
      console.log( a + c); 
    }
  }
}
foo(); // 5 7 9
```

## 3. Strict Mode
es5 부터 추가된 Strict 모드에서는 조금 더 엄격하게 문법을 검사한다. "use strict"를 작성해 함수단위, 파일단위로 사용할 수 있다.
```
function foo() {
  "use strict";
  // this code is strict mode;
  
  function bar() {
    //this code is strict mode;
  }
}
//this code is not strict mode
```
이전 예제중 함수내에 var의 선언 없이 변수에 값을 바로 할당할 경우 자동으로 global 변수가 선언된다고 했는데, strict 모드에서는 참조에러가 발생한다.
```
function foo() {
  "use strict";
  a = 1;      // ReferenceError
}
```

## 4. Functions As Values
함수는 실질적으로 값이다. 함수를 변수의 값으로 저장할 수도 있고, 함수 내에서 값으로 리턴되기도 하며, 함수의 파라미터로 입력되기도 한다.
```
var foo = function() {      // anonymous 익명인 함수가 변수 foo에 저장됨
	// ..
};

var x = function bar(){     // named 이름 bar로 생성된 함수가 x 변수에 저장
	// ..
};
```
이 둘의 차이는 see the Scope & Closures에서 더 깊게 공부한다.

### 4.1. Immediately Invoked Function Expressions (IIFEs)
함수를 선언과 동시에 즉시 호출하는 방법도 있다.
```
(function IIFFE(){
	console.log( "Hello" );
})();
// "Hello"
```
`()` 함수를 감싸는 소괄호는 함수는 IIFE가 일반 함수처럼 전역에 등록되는 것을 방지한다.
그리고 마지막에 사용된 `()` 소괄호가 그 함수를 실행한다.
IIFE의 장점은 함수를 즉시호출함과 동시에 그 함수가 전역에 등록되지 않기 때문에 한번 쓰고 버릴 수 있는 일회용 함수를 만들 때 꽤나 유용하게 쓰일 듯 하다.
```
var x = (function IIFFE(){
	return 10
})();
x; // 10
```
함수가 실행되고 반환한 10을 외부변수에 담을 수 도 있다.

```
(x = function IIFFE(){
	console.log( "Hello" );
})();
```
다음과 같이 함수를 변수 x에 할당하면 전역변수 x에 할당되어 지속적으로 사용할 수 있다. 하지만 예상대로 `let, var, const` 같은 키워드는 사용할 수 없는 것으로 보아 x가 전역으로 저장되는 이 방식은 의도된 문법은 아닌듯 하다. 또한 아무리 생각해봐도 쓸모 없다...

### 4.2. Closure
클로져는 함수가 결과를 반환하고 끝이난 이후에도 다시 그 함수 스코프에 접근하기 위한 방법이다.
```
function makeAdder(x) {
	function add(y) {
		return y + x;
	};
	return add;
}

var plusOne = makeAdder( 1 );
var plusTen = makeAdder( 10 );

plusOne( 3 );	// 4 	<-- 1+ 3
plusOne( 41 );	// 42 	<-- 1 + 41

plusTen( 13 );	// 23 	<-- 10 + 13
```
makeAdder 함수는 이미 add 함수를 반환했다. 반환 즉시 makeAdder 함수는 끝이났다는 이야기다. 이후에 plusOne( 3 )은 종료된 makeAdder 함수가 반환한 add( 3 )을 실행 시키고 add는 내부적으로 makeAdder의 x 변수에 접근한다.
```
add(3) {
	return 3 + x;
}
```
이렇게 종료된 함수의 지역변수(x)에 접근할 수 있는 이유가 `closure`가 있기 때문이다. 
`closure`는 외부 함수(makeAdder)가 이미 종료되었을 지라도 그 함수 스코프 내의 변수(x)를 기억하고 있다가 
반환된 내부함수(add)에서 지역변수(x)에 접근할 수 있게 해준다
그래서 위와 같이 `plusone( 3 )`은 4를 `plusTen( 13 )`은 23을 반환하는 것이다.

### 4.3 Modules
Closure는 모듈화에 자주 사용되는 방식이다.
```
function User(){
	var username, password;
	
	fucntion doLogin(user,pw) {
		username = user;
		password = pw;
	}
	
	var publickAPI = {
		login: doLogin
	};
	
	return publickAPI;
}
var fred = User();
fred.login( "fred", "12Battery34!" );
```
이 함수는 publickAPI라는 객체를 반환한다. 그리고 그 객체는 login 기능을 제공하는데 이 login은 doLogin 함수를 실행시키고 내부 변수 username과 password에 사용자로 부터 입력받은 값을 저장한다. doLogin과 username, password는 User 모듈을 통해서만 접근이 가능하다.
이 처럼 외부에 노출시키지 않고 변수와 함수를 이 모듈을 통해서만 접근이 가능하도록 코드를 작성하는 것은 사용하기에 따라 매우 큰 유용하게 쓰일 수 있다.
## 6. This Identifier
타언어와 달리 Js의 this는 마냥 자신을 가리키는게 아니다.
함수가 어디서 불려졌는지에 따라 this가 가리키는 객체가 바뀐다.
```
function foo() {
	console.log( this.bar );
}

var bar = "global";

var obj1 = {
	bar: "obj1",
	foo: foo
}

var obj2 = {
	bar: "obj2"
}

foo();			// "global" => 함수내에 this로 정의한 프로퍼티가 없다면, this는 전역을 바라본다. 하지만 엄격모드의 this는 무조건 자기 자신을 바라보기 때문에 해당 변수가 없는 경우 참조 에러가 발생한다.

obj1.foo();		// "obj1" => obj1의 메소드로 실행될 경우 실행된 메소드 foo안에서의 this는 객체를 바라본다.

foo.call( obj2 );	// "obj2" => call의 인자로받은 obj2가 foo의 this가 된다.

new foo();		// "undefined" 함수로 생성된 객체는 this가 자신을 바라본다.
```

## 7. Prototypes
객체끼리 상속하기 위한 방법.
```
var foo = {
	a:42
};

var bar = Object.create( foo );

bar.b = "hello world";

bar.b; // "hello world";
bar.a; // 42 <-- delegated to `foo`
```

## 8. Old & new
Js는 최글들어 많은 변화가 있었다. 특히 문법적으로 많이 바뀌었는데, 브라우저마다 고유의 Js 인터프리터를 가지고있고 각 인터프리터가 Js의 몇 버전까지 해석이 가능한지는 조금씩 다르다. 따라서 내가 작성한 코드를 온전히 실행할 수 있는지 여부가 브라우저에 의해 결정된다. 어떤 브라우저에서는 이 문법으로 짠 코드가 잘 실행되는 반면, 어떤 브라우저에서는 아닌 경우가 있다. 이런 문제를 해결하기 위한 두 가지 방법이 존재한다.
## 8.1. PolyFilling
PloyFilling은 신버전 문법을 사용할 수 없는 겨우 구버전 문법으로 이 문법을 대체하는 작업이다.
예를들어 Es6 버전부터 지원하는 Number.isNan(x)를 살펴보자. 이 메소드는 x의 타입이 Number이지만 값은 Number가 아닐 때 `true`를 반환한다.
```
Number.isNaN(0/0); // true
Number.isNaN("asd"); // false 문자는 type이 number아니기 때문에 false
```
구버전에서는 Numer.isNaN을 지원하지 않기 때문에 다음과 같이 if문을 사용해서 Number.isNaN을 지원하지 않는 브라우저는 구버전 코드가 실행되도록 만들어 줘야한다. 이런 과정을 Polyfilling이라고 한다.
```
if (!Number.isNaN) {
	Number.isNaN = function isNaN(x) {
		return x !== x;			// NaN은 자신을 비교했을 때 false를 반환하는 유일한 값이다. 
	};
}
```
위 코드는 매우 단순하지만 조금 더 복잡한 기능을 구현할 때는 작성한 코드에 오류가 없을지 매우 신중하게 검토해 봐야한다. 또한 이미 많은 개발자들이 구버전의 코드로 변환해두었기 때문에 이를 참고하는 것도 매우 좋은 방법이다.

## 8.2. TransPiling
새로운 문법을 지원하지 않는 브라우저에서 그 코드 자체를 지원 가능 문법으로 바꿔주는 도구가 등장했다.
Babel과 Traceur이 이러한 TransPiling을 지원하는 도구 중 하나이다.

예를들어 
```
function foo(a = 2) {
	console.log( a );
}

foo();		// 2
foo( 42 );	// 42
```
Js에서는 ES6 버전부터 매개변수에 디폴트 값을 설정할 수 있게 됐다. 이 코드가 ES6문법을 지원하지 않는 브라우저에서 실행되면
```
function foo() {
	var a = arguments[0] !== (void 0) ? arguments[0] : 2;
	console.log( a );
}
```
다음과 같이 코드가 변경된다.
