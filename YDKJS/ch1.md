# into JS Programming

## Statements
프로그램은 프로그램의 목적을 수행하는 많은 Statement의 집합이다. Statment는 어떤 명령을 수행하는 문장이며 
즉 문자(Words)들, 숫자(Numbers)들, 연산자(Operators)들이 모여 하나의 명령문이 되고, 특정한 일을 수행한다. 아래가 그 예시이다.

```
a = b * 2 ;
```
a와 b는 변수(variables)이며 변수는 어떤 재료(문자,숫자 등)를 담는 공간이다.
반면에 숫자 2는 값이다. literal value라고도 불린다. 왜냐하면 2는 어느 공간에 저장되고 말고를 떠나서 그 자체로 문자 2의 의미를 가지기 때문이다.
&#61;와 &#42;는 연산자이다. 변수에 값을 할당하거나 곱하기 같은 수학적인 연산에 사용한다.

## Expressions
일반적으로 Statement(명령문)은 Expressions(표현식)들이 모여 구성된다. 어떤 value 혹은 valuable을 참조하거나, operator(연산자)와 결합된 valuable와 value를 Expression(표현식)이라고 한다. 아래가 Statement이고 4개의 표현식으로 구성되었다.

```
a = b * 2;
```
- 2 는 literal value 표현식이다. 문자 그대로 값을 가진다.
- b 는 variable(변수) 표현식이다. 변수는 변수안에 담긴 값을 불러온다.
- b * 2 는 산술 표현식(곱샘)이다. 곱샘 후 결과를 반환한다.
- a = b * 2 는 할당 표현식이다. a에 값을 저장한다.

아래와 같이 혼자있는 일반적인 표현식(general expression)은 expression statement라고도 불리는데 프로그램에 어떠한 영향도 미치지 않는다.
```
b * 2;
```
그래서 흔히 쓰이는 expression statement는 call expression statement이며, 함수내에 statement들 전체를 불러오는 그 문장 자체를 뜻한다.
```
alert( a );
```
## Try It Yourself
콘솔창으로 직접 javascript 문장을 실행해보자.
콘솔창에 대한 자료는 ("http://blog.teamtreehouse.com/mastering-developer-tools-console") 이곳 참고.


