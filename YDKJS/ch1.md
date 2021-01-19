# into JS Programming
## 1. code
컴퓨터에게 어떤 특정한 명령들을 수행하라고 말해주는 문장들의 집합이다.
### 1.1. Statements
프로그램은 프로그램의 목적을 수행하는 많은 Statement의 집합이다. Statment는 어떤 명령을 수행하는 문장이며 
즉 문자(Words)들, 숫자(Numbers)들, 연산자(Operators)들이 모여 하나의 명령문이 되고, 특정한 일을 수행한다. 아래가 그 예시이다.

```
a = b * 2 ;
```
a와 b는 변수(variables)이며 변수는 어떤 재료(문자,숫자 등)를 담는 공간이다.
반면에 숫자 2는 값이다. literal value라고도 불린다. 왜냐하면 2는 어느 공간에 저장되고 말고를 떠나서 그 자체로 문자 2의 의미를 가지기 때문이다.
&#61;와 &#42;는 연산자이다. 변수에 값을 할당하거나 곱하기 같은 수학적인 연산에 사용한다.

### 1.2. Expressions
일반적으로 Statement(명령문)은 Expressions(표현식)들이 모여 구성된다. 어떤 value 혹은 valuable을 참조하거나, operator(연산자)와 결합된 valuable와 value를 Expression(표현식)이라고 한다. 아래가 Statement이고 4개의 표현식으로 구성되었다.

```
a = b * 2;
```
- 2 는 literal value 표현식이다. 문자 그대로 값을 가진다.
- b 는 variable(변수) 표현식이다. 변수는 변수안에 담긴 값을 불러온다.
- b * 2 는 산술 표현식(곱셈)이다. 곱하기 후 결과를 반환한다.
- a = b * 2 는 할당 표현식이다. a에 값을 저장한다.

아래와 같이 혼자있는 일반적인 표현식(general expression)은 expression statement라고도 불리는데 프로그램에 어떠한 영향도 미치지 않는다.
```
b * 2;
```
그래서 흔히 쓰이는 expression statement는 call expression statement이며, 함수내에 statement들 전체를 불러오는 그 문장 자체를 뜻한다.
```
alert( a );
```
## 2. Try It Yourself
콘솔창으로 직접 javascript 문장을 실행해보자.
콘솔창에 대한 자료는 ("http://blog.teamtreehouse.com/mastering-developer-tools-console") 이곳 참고.

## 3. Operators
- Assignment: `a = 2` 에서 `=`.
- Math: `+`(더하기), `-`(빼기), `*`(곱하기), `/`(나누기)
- Compound Assignment: `+=`, `-=`, `*=`
- Increment/Decrement: `++`, `--`
- Object Property Access: `.` `[]` as in obj.a, obj["a"]
- Equality: `==`은 값을 비교한다. `2=='2'` true , `===`는 값과 타입까지 엄격하게 비교한다. `2==='2'` false
- Comparison: `<`, `>`, `<=`, `>=`
- Logical: `&&`(and), `||`(or)

## 4. values & types
```
a = prompt() // 사용자에게 2라는 입력값을 받음
a === 2 // false;
```
![typetest](https://user-images.githubusercontent.com/39623897/104904464-84b74f00-59c4-11eb-882f-8cdfe62105b2.gif)

왜 false 일까? 이유는 사용자에게 입력받은 값 2는 문자 타입으로 변수 a에 저장됐고, 비교하고자 하는 2는 숫자 2이기 때문이다.
이 처럼 내가 생각한 2와 누군가가 생각한 2는 다를 수 있고 결국 코드의 의도와는 다른 방향으로 흘러갈 것이다. 그래서 이 같은 상황들을 구분하기 위해 타입이 존재한다.
### 4.1. Primitive value
자바스크립트에서는 값이 정의 될 수 있는 가장 최소한의 형태를 5가지의 타입으로 나눴다. 그리고 그 5가지 타입에 속하는 값들을 Primitive value(원시값)이라고 정의했다. 아래가 그 원시값의 예시이다.
```
"I am a string"; // 문자열(String)
42; // 숫자(Number)
true; // 불린(Boolean)
null; // null; 빈 값
undefined; // 정의되지 않은 값
```
#### 4.1.1. Primitive value 의 특징
- 값을 복사한다.
```
var num1 = 1;
var num2 = 1;

console.log(num1 === num2); // true
```
num1과 num2에 각각 1을 저장했다 그리고 num1과 num2가 같은지 확인하니 true가 출력된다.
이게 왜? 뭐가 어때서 라고 생각할 수 있으니 Primitive value와 비교되는 Reference value를 보고오자.

### 4.2. Reference value
참조 값이라고하며 Ojbect, Array, Function, RegExg가 이에 해당한다. 참조 값은 주소를 복사한다.
```
var obj1 = new Object({a:1});
var obj2 = new Object({a:1});
console.log(obj1 === obj2) // false
```
obj1과 obj2는 모두 `{a:1}` 로 같은 값이다. 하지만 obj1과 obj2이 이 값을 가져오는 방식이 조금 특이하다. {a:1}은 두 개의 다른 메모리 주소에 저장됐고, obj1과 obj2는 이 주소를 참조해서 값을 가지고 오는 것이다. 따라서 `obj1 === obj2`는 다른 주소를 비교하기 때문에 `false`라는 결과를 출력한다.
```
var obj1 = new Object({a:1});
var obj2 = obj1;
obj1['num'] = 1;
console.log(obj1 === obj2); // true
```
그래서 위와 같이 obj2에 obj1을 할당하고 obj1 객체를 수정해도 각 변수가 가리키는 주소가 동일하기 때문에 `obj1 === obj2` 역시 `true` 인 것이다. 


다시 돌아와서 Primitive value는 Reference value와 달리 값 자체를 저장하고 복사한다. 따라서 순수한 값의 비교를 할 수 있다. 
```
var num1 = 1;
var num2 = num1;
var num1 = 2;
console.log(num1 === num2); // false;
```
### 4.3 Converting Betwwen Types
```
var a = "42";
var b = Number( a );
console.log( a );         // "42"
console.log( b );         // 42
consonle.log ( a == b );  // true
```
`Number(..)`는 explicit coercion 이다. 다른 타입에서 `number` 타입으로 의도적으로 타입을 바꾼다.

#### 4.3.1. implicit coercion
위 예제와 같이 `a == b`가 실행되면 javascript는 `string` `"42"`를 `number` `42`로 바꾸고 비교해서 `true`를 출력한다. 
이와 같은 Javascript가 작성자 몰래 타입을 바꾸는 행위를 implicit coercion이라고 한다.

## 5. Variables
보통 프로그래밍 언어에서는 변수를 선언할 때 int, str과 같이 그 값의 타입을 명시한다. 즉 특정한 타입의 값을 저장하기 위해 이에 맞는 타입의 변수가 필요하다. 이는 의도하지 않은 값의 변화를 방지할 수 있어 프로그램의 정확성을 높인다.
이와 달리 Javascript는 특정 타입을 선언하는 키워드가 없다. `var` 키워드를 사용해서 모든 타입의 변수를 선언하고 심시어 다른 타입으로 수정도 가능하다. 유연성을 강조한 언어이다.
```
var amount = 99.99;
amount = amount * 2;
console.log( amount );            // 199.98
ammount = "$" + String( amount );
console.log( amount );            // "$199.98"
```
amount에 저장된 값이 `number` 타입에서 `string` 타입으로 변했다.
이 처럼 프로그램이 실행되는 도중이라면 필요에 따라 타입에 관여 받지않고 어떤 값이든 하나의 변수에 저장할 수 있다는 장점이 있다.
하지만 .... 개발자는 이런 유연성이 오히려 독이 될 수 있기 때문에 주의해야 한다. 
그래서 변수의 쓰임을 분명하게 밝히기 위해 식별자를 `ammountStr`와 같이 선언하기도 한다.

### 5.1. 변수의 두가지 쓰임
1. 변하는 값을 저장할 때: 일반적인 변수로 위의 예제와 같이 변화하는 상태의 값을 저장하고 덮어 씌운다. 
2. 변하지 않은 값을 저장 할 때: 변하지 않을 값을 저장 할때 우리는 관념적으로 대문자와 단어사이에 `_`를 포함해서 식별자를 작성한다.
이는 constant라고 불리며, 이전까지는 암묵적인 약속에 불과했으나 ES6 버전부터 이를 기능적으로 지원하는 `const` 키워드가 등장했다. `const`로 변수를 선언하면 그 안의 값은 절대 변경되지 않는다.
```
// as of ES6:
cont TAX_RATE =  0.08;
```
## 6. Block
때때로 하나의 기능을 구현하기 위해 다수 명령문이 실행되고 이 명령문들을 구룹화 할 필요가 있다. 이 때 사용하는 것이 Block이다.  

```
var amount = 99.99;

// a general block
{
  amount = amount * 2;
  console.log( amount ); // 199.98
}
```
일반적인 Block은 위와 같다. 하지만 보통 Block은 혼자서 쓰이는 경우는 드물다. 보통은 loop문이나 if문 처럼 어떤 명령문을 컨트롤 하기 위한 키워드와 함께 쓰인다.
```
var amount = 99.99;

// is amount bic enough?
if (amount > 10) {                // <-- block attached to `if`
  amount = amount *2;
  console.log( amount ); // 199.98
}
```

## 7. Conditional
조건문은 `if (...) {statements}` 형태로 작성된다.
소괄호 안의 값이 참이면 해당하는 Block안의 명령문들이 실행되는 구조이다. 
한가지 눈여겨 볼 것은 javascript가 false로 implicit coercion 하는 list가 있는데 `undefined`, `null`, `""`, `0` 등이 있고 이 값이 (...)안에 들어오면 false이기 때문에 실행되지 않는다. 반대로 true로 implicit coercion하는 list가 있는데 false list에 속하지 않은 실존하는 값은 true로 변화한다. `99.99`, `free` 같은 값이 이에 해당한다. 하
## 8. Loops
### 8.1. while
`while(조건식){statements}` 형태로 작성된다.
조건문과 마찬가지로 소괄호 안의 값이 참인 경우에만 Blbock안의 명령문들이 반복적으로 실행되는 구조이다.
즉 조건문이 fail인 경우가 발생하지 않으면 끝없이 반복된다. 
### 8.2. do while
`do {statements} while(조건식)` 형태로 작성된다.
while과 다른점은 조건이 참인지 거짓인지 확인하기 전에 먼저 명령문이 실행된다. 그 이후 값이 거짓이라면 반복되지 않는다.
즉 한번은 무조건 실행된다는 것이 while과의 차이점이다.

### 8.3. for
반복 횟수가 정해져 있는 경우 for문을 사용하면 편리하다. 아래와 같이 소괄호 안에 index 변수 i를 선언하고, 조건식과 block안의 명령문이 실행된 이후 실행할 명령문을 작성한다. 보통은 i를 증감하는 명령어를 사용한다.
```
for (var i = 0; i <= 9; i++) {
  console.log( i );
}
// 0 1 2 3 4 5 6 7 8 9
```
## 9. Functions
여러번 반복적으로 같은 코드를 실행해야할 때 function을 이용하면 중복되는 코드를 줄일 수 있다.
```
function printAmount(amt) {
  console.log( amt.toFiexd( 2 ) );
}

var amount = 99.99;
printAmount(amount); // "99.99"

amount = amount * 2;

printAmount(); // "199.98"
```
또한 한번 사용될 코드라도, 코드를 조직화하고 깔끔한 작성을 위해서 function을 사용하기도 한다.
```
const TAX_RATE = 0.08;

function calculateFinalPurchaseAmount(amt) {
  //  calculate the new amount with the tax
  amt = amt + (amt * TAX_RATE);
  return amt;
}

var amount = 99.99;

amount = calculateFinalPurchaseAmount( amount );

console.log( amount.toFixed( 2 ) );   // "107.99"
```

## 10. Scope
스코프란 변수의 범위를 제한하기 위해 나온 개념이다. 
```
function one() {
  var a = 1;
  console.log( a );
}
function two() {
  var a = 2;
  console.log( a );
}
one();		// 1
two();		// 2
```
같은 이름의 변수가 중복으로 사용될 수 없음은 당연히 알 것이라 생각한다. 하지만 Scope에 따라서 조금 예외사항이 있다.
위 코드를 보면 one 함수와 two 함수 내부에 각각 a라는 변수가 선언되었고, one 함수를 실행하면 `1`이 two 함수를 실행하면 `2`가 출력된다.
함수는 내부적으로 별개의 변수를 저장하고 접근 할 수 있는 속성이 있다.

그리고 함수내에 함수를 겹처서 선언 할 수 있는데 이 경우 외부함수는 내부함수의 변수에 접근하지 못하지만, 내부함수는 내부함수의 변수 뿐만 아니라 그 밖에 있는 모든 변수에 접근할 수 있다.
```
function outer() {
  var a = 1;
  
  function inner() {
    var b =2;
    // we  can access both `a` and `b` here even though `a` is outside the inner function.
    console.log( a + b ); //3
  }
  inner();
  console.log( a ); // 1
}
outer();
```
##### 참고:
- [자바스크립트 기본타입(원시값=단순값)](https://webclub.tistory.com/240)
