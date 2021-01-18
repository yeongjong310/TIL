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

## 4. Values & Types
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
var num2 = num1;

var num1 = null;

console.log(num1, num2); // null 1
```
num2에 num1를 저장하고 num1을 null로 초기화했다. 그리고 num2를 출력해보면 num1에 저장된 null과는 다른 1이 출력된다.
이게 왜? 뭐가 어때서 라고 생각할 수 있으니 Primitive value와 비교되는 Reference value를 보고오자.

### 4.2. reference value
참조 값이라고하며 Ojbect, Array 즉 
```
```
https://webclub.tistory.com/240




