# ch1. what is scope?
변수에 값을 저장하고 수정하는 것은 프로그램의 상태를 관리하는 것과 같다. 그렇다면 변수는 어디에 저장되는가? 프로그램은 어떻게 이 변수들을 찾을 수 있을까? JS엔진은 프로그램이 변수를 메모리에 저장하고 찾기 위한 규칙을 정의하고 있다. 이런 규칙을 바로 `Scope`라고 한다.

## 1. compiler Theory
자바스크립트는 인터프리터 언어로 알려져있다. 하지만 자바스크립트는 코드를 실행하기 전에 컴파일을 한다. Scope를 이해하기 전에 컴파일 과정을 간단하게 짚고 넘어가자.

1. Tokenizing/Lexing: 
문자들을 토큰별로 나눈다. 예를들어 `var a = 2;`를 `var`, `a`, `=`, `2`, `;` 5개의 토큰으로 분리한다.
**Note**: tokenizing이 문자들을 각각의 토큰으로 분리하는 것이라면, lexing은 각각의 토큰을 구별할 수 있게 한다.
2. Parsing: 토큰들을 활용해서 프로그램 전체를 구조화한 트리를 만든다. 컴파일러는 이 트리를 통해 빠르게 코드의 구조를 파악할 수 있고
에러를 찾아내거나 필요시 코드를 변형시킬 수 있다.
이 트리는 상위 엘리먼트에서 부터 하위 엘리먼트로 이어지는 노드로 구성되며 "AST(Abstract Syntax Tree)" 라고 불린다.
3. Code-Generation:
AST를 보고 실행가능한 코드로 바꾸는 과정이다. 

자바스크립트는 위의 3가지 단계보다 더 복잡한 과정을 거친다. 
예를들어 Parsing과 Code-Genration과정 중에 중복 요소를 제거하는 등 성능을 최적화하는 단계를 포함한다.

## 2. Understanding Scope
Scope를 이해하기 위해 다음 세가지를 알고 넘어가자.
1. Engine(엔진): 컴파일러를 불러 컴파일을 하도록 명령하고, 자바스크립트 프로그램을 실행한다.
2. Compiler(컴파일러): Parsing과 code-generation을 수행한다. ( 토큰을 분석해서 AST를 만들고, 실행가능한 코드로 만드는 것. )
3. Scope(스코프): 선언된 모든 식별자(변수)를 리스트화하고, 어떻게 이 변수에 접근할지 엄격한 규정으로 변수들을 관리한다.

### 2.1. Back & Forth (Parsing과 Code-Generation 과정)
일반적으로 사람이 보기에는 `var a = 2;`가 하나의 명령이지만, Js 엔진의 입장에서는 구분되는 두 개의 명령이다. 
첫번째는 엔진이 컴퍼일러를 불러 `var a = 2;`를 컴파일하는 동안 일어나는 과정이고, 두번째는 Engine이 실제로 명령문을 실행하는 과정이다.
이제 엔진의 입장에서 `var a = 2;`를 살펴보자.

1. 컴파일러가 `var a`를 만나면 스코프에게 변수 a 가 존재하는지 묻는다. 만약 a가 속한 스코프가 있다면, 컴파일러는 선언을 무시하고 다음으로 넘어간다. 반대로 없다면 스코프에게 새로운 변수 a를 생성할 것을 요청한다.
2. 그 후 컴파일러는 a에 2를 할당하라는 실행 코드를 생성한다. 이 코드는 엔진에 의해 실행되고, 코드는 스코프에게 변수 a에 접근이 가능한지 묻는다. 접근이 가능하면 엔진은 그 변수를 사용한다. 반대로 없다면, 엔진은 상위 스코프를 찾아간다. 마침네 엔진이 변수를 찾아내면, 2는 변수 a에 할당된다. 끝끝내 찾지 못했다면 에러를 요청한다.

**요약**

1단계: 컴파일러가 모든 변수를 확인하고 각 변수들을 해당하는 스코프에 선언한다.  
2단계: 컴파일러는 실행코드를 생성한다. 실행코드는 변수에 값을 할당하는 등의 명령어이다.  
3단계: 엔진은 실행코드를 읽어 프로그램을 실행하며 변수를 스코프 내에서 변수를 찾아 변수가 있으면 값을 할당하고 없다면 에러를 요청한다.  
 
### 2.2. Compier Speak
3단계에서 코드가 실행되고 엔진은 변수를 찾는다. 이때 엔진은 경우에 따라서 두 가지 방법으로 변수를 검색한다.

#### 검색 종류
1. LHS(Left Hand Side) : 검색 후 값을 할당할 때 사용되는 방법이다. 변수가 대입 연산자의 왼쪽에 있을 때 수행한다. ex) `a = 10`
2. RHS(Right Hand Side) : 검색을 통해 값을 반환해야 할 때 사용되는 방법이다. 변수가 보통 코드의 오른쪽에 있을 때 수행한다. ex) `console.log( a )`

좀 더 자세히 알아보자.

`console.log( a );`의 a는 RHS 참조이다. 왜냐하면 변수 `a`에 아무것도 할당하지 않고, 단지 무엇이 들어있는지 확인하여 값을 반환하기 때문이다.

반면 `a = 10`의 경우 LHS 참조이다. 왜냐하면 a를 찾아 `=` 할당 연산을 수행하기 때문이다.

다음 예제에서 LHS와 RHS를 찾아보자.

```
function foo(a) {
  console.log( a ); //2
}

foo( 2 );
```

1. 마지막 라인에서 foo(..)는 함수 를 불러온다. 여기서 `foo`는 `foo의 값이 뭐야? 그리고 그것을 나에게 줘` 라는 의미이다. 즉 **RHS**다. 그리고 (..)는 반환된 값을 실행한다는 의미로 함수를 실행한다. 

2. 이곳에서 **LHS**도 찾아볼 수 있다. 2가 foo의 argument로 입력됐을 때, foo의 parameter a에 2가 할당된다. 

3. 마지막으로 또 하나의 **RHS**가 있다. console.log의 argument인 a 변수는 단독으로 사용됐다. a 값을 찾아 console.log(..)에게 넘겨준다.

4. **+:** parameter로 전달되는 값이 **LHS**된다는 사실을 알게 되었다. 마찬가지로 console.log(a)에서 a가 log method로 전달될 때 method의 parameter에 2가 할당되며 또한번의 **LHS**가 수행될 것이다.

즉, 엔진은 변수를 찾아 이 변수를 다루는 두가지 방법이 존재한다.

1. RHS는 변수를 찾아 값을 **반환**한다.
2. LHS는 변수를 찾아 값을 **할당**한다.

**NOTE**
함수 foo가 변수로서 선언되고 선언된 foo에 실행코드를 할당하는 과정을 LHS라고 생각할 수 있다. 하지만 이 과정은 사실 컴파일 단계에서 미리 처리리한다. 따라서 코드가 실행되는 동안에 엔진은 LHS를 통해 함수를 할당하지 않는다. 함수를 먼저 실행하고 나중에 선언하는 코드가 정상적으로 동작하는 이유가 증거다.

```
foo( 2 );
function foo(a) {
    console.log( a ); //2
}
```


#### QUIZ
```
fucntion foo(a) {
  var b = a;
  return a + b;
}

var c = foo( 2 );
```

  1. LHS Look-ups을 찾아라.(3개)
  2. RHS Look-ups을 찾아라.(4개)
  
  > Engine: Scope 혹시 foo 변수 들어봤니? foo에 대한 값을 찾고싶어. **(RHS)**
  
  > Scope: 응, 나 foo 가지고있어. 컴파일러가 조금전에 선언했거든. foo는 함수야. 여기~!
  
  > Engine: 고마워 Scope. 이제 나는 foo를 실행할 수 있게 됐어.
  
  > Engine: 그런데 Scope foo를 실행고보니까 a 지역변수에 2를 할당해야해. 혹시 a 있니? **(LHS)**
  
  > Scope: 그럼 있지. 컴파일러가 a를 foo의 파라미터로 선언해놨거든. a 여기있어.
  
  > Engine: 고마워. a가 잘 있구나. 이제 a에 2를 할당해야겠어.
  
  > ... 잠시후 
  
  > Engine: Scope 혹시 a가 변한게 있니..? a값을 어떤 변수에 할당하려고 하는데..확인해봐야할 것 같아. **(RHS)**
  
  > Scope: a는 그대로 있어 친구야.
  
  > Engine: 고마워 그러면 Scope 혹시 변수 b도 들어봤어? b에 a를 할당하려구. **(LHS)**
  
  > Scope: b? 음 잠시만. b는 foo의 지역변수네. 여기있어.
  
  > Engine: 항상 고맙다 Scope. 이제 a에 b를 할당해야겠어.
  
  > ... 잠시후
  
  > Engine: scope a랑 b말이야 잘있니? **(RHS * 2)**
  
  > Scope: 응!
  
  > Engine: 고마워 a랑 b를 더한 값을 반환해야겠다. 드디어 마지막이네 Scope!! 변수 c에 foo( 2 ) 로 부터 반환된 값을 할당하고 싶어 c가 있어?**(LHS)**
  
  > Scope: 응 c는 컴파일러가 잘 선언해줬어. 여기 c야.
  
  > Engine: 이제 c에 값을 저장해야겠다.
  
## 3. Nested Scope
스코프는 식별자('a', 'b' 등)를 통해 변수를 찾는다. 그리고 변수를 효율적으로 관리하기 위해 Scope의 규칙에 따라 저장되는 위치가 달라진다. 그 말은 즉, 스코프는 한 개 이상일 수도 있다. 
Block과 Function이라는 울타리가 하나의 규칙을 지정하는 스코프가되고, 이 Block과 Function들이 겹겹이 겹쳐지면 스코프는 다음과 같이 동작하게 된다.
```
function foo(a) {
  console.log( a + b );
}
var b = 2;

foo( 2 ); // 4
```
엔진은 foo 내부에서 b가 있는지 찾아야 하지만 foo에 대한 스코프가 b를 가지고 있지 않기 때문에 그러지 못한다. 이럴 경우 그 외부의 스코프에게
변수 b가 있는지 확인하는 절차를 반복적으로 수행한다.(b를 찾을 때 까지 혹은 global에 도달할 때 까지 수행한다.)

> Engine: foo의 scope야 혹시 b 들어봤어? b 값이 필요해 (RHS)

> Scope(foo): 아니 나는 b 안가지고 있는데..? 다음 스코프에게 가봐~

> Engine: 안녕 foo의 밖에 있는 스코프야, 오 너는 global 이구나? 혹시 b 들어봤니?  b값이 필요해 (RHS)

> Scope(global, outside of foo): 응 b 내가 가지고있어. 여기~

### 3.1. Building on metaphors
[더 빠른 이해를 위한 참고자료](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/scope%20%26%20closures/ch1.md#building-on-metaphors)

## 4. Errors
그렇다면 엔진은 왜 LHS와 RHS로 나눠서 처리할까? 왜 LHS와 RHS가 중요할까? 
첫번째로 생각해 볼 수 있는 것은, 위에서 설명한 것 처럼 엔진이 코드를 실행하다가 변수를 만나게 되었을 때 변수를 scope에서 찾아야 하고,
이때 변수가 존재한다면 값을 반환하거나 혹은 변수가 저장된 메모리에 새로운 값을 할당하는 두 가지의 경우로 Scope가 동작해야 하기 때문입니다.
그 외에 필요한 동작이 없기 때문에 Scope의 입장에서 LHS와  RHS로 나누어 처리하는 것 입니다.
두번째로는 Scope에 변수가 없을 때, 에러가 발생하면 두 가지의 검색법에 따라 다르게 대처해야하기 때문입니다.
다음 예시를 살펴보자.
```
function foo(a) {
  console.log( a + b );
}

foo( 2 );
```
엔진이 foo 내부에서 b에 대한 RHS를 요청하면 이것은 어디서도 선언되지 않았기 때문에 찾을 수 없다.
이렇게 RHS가 변수를 찾는데 실패하면, 엔진은 `ReferenceError`를 발생시킨다.

![image](https://user-images.githubusercontent.com/39623897/105495829-fb738580-5cff-11eb-881d-7cad08ee0d83.png)

반면, LHS를 수행하는 도중 변수를 찾는데 실패하면, 마지막의 global scope는 새로운 변수 b 를 만들어 엔진에게 보내준다.
```
function foo(a) {
  b = a;
  console.log( "b: ", b );
}

foo( 2 );
```

![image](https://user-images.githubusercontent.com/39623897/105495973-2eb61480-5d00-11eb-82ef-4944c29144b6.png)

하지만 `Strict Mode`에서는 조금 다르게 동작한다. 여기서는 global이 새로운 변수를 만드는 것을 금지하기 때문에 RHS 뿐만아니라 LHS에서도 변수를 찾지 못했을경우 엔진은 `ReferenceError`를 발생시킨다.

다음으로 RHS를 통해 변수를 찾았는데, 만약에 함수 아닌 값을 실행시키거나 null, undefined를 실행시킬 경우 엔진은 이 때
TypeError를 발생시킨다.

즉 `ReferenceError`는 스코프가 변수를 찾지 못했을 때 발생한다. 반면, `TypeError`는 스코프가 변수를 찾았으나 값에 대한 불가능한 시도를 했을 때 발생하는 에러이다.

## 4. Review

1. 스코프는 변수를 어디서 어떻게 찾을지 규정한다.
2. LHS는 `=` operator 혹은 파라미터를 통해 값이 할당 될 때 발생한다.
3. RHS는 변수의 값을 찾을 때 발생한다.
4. 자바스크립트는 코드를 실행하기전 먼저 컴파일 한다.[자세한 내용 back & forth 참고](https://github.com/toryjkim/javascript/blob/main/YDKJS/scope%20&%20closures/ch1.md#21-back--forth-parsing%EA%B3%BC-code-generation-%EA%B3%BC%EC%A0%95)
 - 토큰화와 렉싱 => `var a = 2` 를 `var`, `a`, `=`, `2`로 나누고 각 토큰별로 구분할 수 있도록함.
 - 파싱 => 토큰을 분석해서 노드트리를 만든다. AST(추상 구문 트리)
 - 코드화 => 실행코드를 생성한다.
5. 변수를 찾을 때 현재 스코프에서 못찾으면 상위 스코프를 계속 탐색한다. (glabal 까지)
6. 엔진은 RHS에서 변수를 못찾으면 ReferenceError를 발생시키고, LHS에서 변수를 못찾으면 global이 새로운 변수를 생성해서 엔진에게 넘겨준다.(strict mode는 다름)

#### 느낀점
JS도 실행전 컴파일을 한다는 사실을 알게 됐다. 사실 이 ch1에서 배운 내용은 스코프 뿐만아니라 호이스팅과도 연관이 있을 것 같다. 호이스팅이 어떠한 원리로 동작하는 것일까 궁금했는데, 컴파일 과정에서 변수를 모두 파악하고 그 다음 호이스팅 과정이 일어날 것이라는 감이 온다. 이후에 호이스팅 섹션에서 자세히 알아봐야겠다. 그리고 원리와 함께 새로운 지식을 접하는 것은 항상 오래 기억하게 된다. 내가 이 책을 선택한 이유도 JS의 동작과정을 조금 더 깊고 오래 알고 싶었기 때문이다. 다른 책보다 조금은 돌아가는 길일지 모르지만, 이 책을 알게되고 JS에 대해 알아갈 수록 저자에게 감사한 마음이 든다. Thank you.
##### 참조
[babel&AST](https://velog.io/@logqwerty/Babel-%EC%BB%B4%ED%8C%8C%EC%9D%BC%EC%9D%84-%EC%82%B4%ED%8E%B4%EB%B3%B4%EC%9E%90)

[DOM](https://vallista.kr/2019/05/07/DOM-Document-Object-Model/)

[컴파일](https://hashcode.co.kr/questions/7560/javascript-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%BB%B4%ED%8C%8C%EC%9D%BC%EC%96%B8%EC%96%B4%EC%9D%B8%EA%B0%80%EC%9A%94-%EC%9D%B8%ED%84%B0%ED%94%84%EB%A6%AC%ED%84%B0-%EC%96%B8%EC%96%B4%EC%9D%B8%EA%B0%80%EC%9A%94)