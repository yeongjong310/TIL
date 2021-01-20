# ch2. Into Javascript.

## 1. values & types
자바스크립트는 7가지의 타입이있다.-
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

a = Symbol();       // as of ES6
typeof a;           // "symbol"
```
**Warnng**: `typeof null`은 Js에서는 오래된 버그중 하나이다. null은 '값이 없다'를 명시하기 위해 쓰에는 데이터 타입이다.
하지만 타입을 체크해보면 `object`를 출려한다. 이는 Js의 오래된 버그로 이 버그를 수정하면 기존의 코드에서 오류가 날 수 있기 때문에 Js에서는 이 버그를 수정하지 않고 있다. 따라서 null을 체크하기 위해서는 `a === null`처럼 두 값과 타입을 비교하는 연산자를 써야한다.

또한 `undefined`는 변수가 사용할 메모리는 확보했지만, 아직 이 변수에 값이 할당되지 않았음을 의미한다. 즉 이 변수의 쓰임이 정의되지 않은 상태를 뜻하는데, `undefiend`를 변수에 할당하는 방법이 몇 가지 있다. 위의 `a = undefined`를 보면 `var a;`와 같은 undefined 상태가 된다. 이 외에도 void 연산자를 사용한 function은 undefiend를 리턴한다. 

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

거의 대부분의 개발자가 느슨한 비교시 추후 생길 혹시모를 불미스러운 일을 걱정할 것이고, 엄격한 비교를 사용하고 있을 것이다. 
본인도 지금까지 Javascript에서 값을 비교할 때 거의 항상 값과 타입을 모두 비교하는 엄격한 비교 연산자를 써왔는데, 이 책에서는 우리가 생각하는 불미스러운 일을 과대광고로 표현하며 느슨한 비교를 사용할 이유에 대해서도 설명한다. 그리고 느슨한 비교가 어떤 알고리즘으로 돌아가는지 파악하라는 저자의 말에 (http://www.ecma-international.org/ecma-262/5.1/)의 11.9.3 섹션을 살펴보기도 했다. 그리고 실제로 이 알고리즘을 제대로 알고 올바르게 사용하면 불필요한 코드를 줄이고 가독성을 개선하는데 도움이 될거라는 저잘의 말에도 동의한다. 하지만 마음속 한구석에서 여전히 불신하고있다. 느슨한 비교를 사용할 수 있는 척도를 이 책에서 소개하고 있는데 추후에 코드를 작성하면서 이 척도를 적용해본 후 천천히 나만의 기준을 만들어 보려고한다. 

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
스코프는 변수의 생애 주기를 조절해서 접근 범위를 제한하는 방법이다.
자바스크립트는 ES6 이전까지 함수 내부에서만 그 범위를 제한할 수 있었다.
```
var a = 10;
function foo() {
  var b = 10;
  
  console.log( b );     // 10
  console.log( a );     // 10
}

console.log( b ); // Uncaught ReferenceError: a is not defined
```
function foo의 내부에서 변수 a를 선언했기 때문에 그 밖에서 a를 접근했을 때 오류가 발생한다. 

하지만 함수 범위 밖에서 선언된 변수가 함수 범위 안에서는 실행가능하다. =>  a가 foo함수 내에서 접근가능한 이유
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
이전 예제중 함수내에 var의 선언 없이 바로 할당한 경우 자동으로 global 변수가 선언된다고 했는데, strict 모드에서는 참조에러가 발생한다.
```
function foo() {
  "use strict";
  a = 1;      // ReferenceError
}
```

## 4. Functions As Values
함수는 실질적으로는 변수이다. 변수에 값으로 저장될 수 있고, 함수에서 값으로 리턴되기도 하며, 함수의 파라미터로 입력되기도 한다.
```
var foo = function() {      // anonymous 익명인 함수가 변수 foo에 저장됨
	// ..
};

var x = function bar(){     // named 이름 bar로 생성된 함수가 x 변수에 저장된
	// ..
};
```
이 둘의 차이는 see the Scope & Closures에서 더 깊게 공부한다.
### 4.1. Immediately Invoked Function Expressions (IIFEs)

### 4.2. Closure

## 6. This Identifier

## 7. Prototypes

## 8. Old & new

## 8.1. PolyFilling

## 8.2. TransPiling

## 9. Non-JavaScript
