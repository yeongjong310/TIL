# 동시성
내가 지금 알고 있는 동시성에 대해 적어보기.

## 용어정리
1. stack: 변수가 임시로 머무는 영역. 함수가 실행될 때 함수 내부에서만 사용되는 지역변수를 stack 메모리 영역에 할당하고, 함수가 종료되면 할당을 해제한다. js에서는 function 단위로 stack에 차곡차곡 쌓인다.
2. frame: 위에서 언급했듯이 function이 실행될 때마다 stack에 어떤 단위가 하나씩 쌓이고, 종료될 때 마다 하나씩 빠져나온다. 
이때 단위를 js에서는 frame 이라고 한다. 따라서 함수가 실행되면 frame이 stack에 쌓이게 된다. frame은 함수에 속하는 지역변수와 arguments를 포함하고 있다.
3. heap: heap이라는 영어단어의 뜻에는 "무질서하게 쌓아올린 물건", "많은 양"이라는 뜻이 있다. heap 메모리 영역도 같은 뜻으로 사용되었다.
heap영역은 다른 메모리 영역과는 달리 주소를 순차적이로 사용하지 않는다. Js에서는 Ojbect가 이곳에 할당되는데 매우 방대한 영역이기 때문에 이곳 저곳 들 쑤시며 위치하게 된다.
c에서는 동적인 할당을 위해 존재한다. 
4. Queue: 비동기 함수들이 순서대로 입력되는 메모리 공간이다.

![image](https://user-images.githubusercontent.com/39623897/107874410-ec49b700-6efc-11eb-987d-413ff399565f.png)

## 1. 자바스크립트는 어떻게 작동하는가?
자바스크립트는 단일 스레드로 동작한다. 이하 내용은 단일 스레드 기반 언어가 **브라우저 위에서** 어떻게 동시성을 지원하는지 중점으로 서술한 내용이다.

### 1.2. 자바스크립트 엔진
대표적인 JS 엔진은 구글의 V8엔진이다. V8엔진은 크롬과 노드js에서 사용된다. 

#### 1.2.1. Js 엔진의 구성 ( stack, heap )
![image](https://user-images.githubusercontent.com/39623897/107872686-45125300-6eef-11eb-8206-07235b72fb03.png)

크게 Memory Heap과 Call Stack으로 나뉜다.
- Memory Heap: 메모리 할당이 이루어지는 곳.
- Call stack: 코드가 실행될 때 stack frame들이 쌓이는 곳.

### 1.3. 브라우저에서 Js RunTime에 관여하는 것들. ( Web APIs, Queue, Event Loop ) - 브라우저 환경의 구성도
브라우저에서 코드가 실행될 때, 개발자들은 "setTimeout" 같은 API를 자연스럽게 사용한다. 그렇다면 이 API는 어디서 제공하는 것일까?
이 API들은 Js Engine이 제공하는게 아니라 Browser에서 제공한다. 즉 브라우저 위에서 개발자가 사용하는 Js는 Js엔진만으로 구현된 것이 아니다.
![image](https://user-images.githubusercontent.com/39623897/107872926-6d9b4c80-6ef1-11eb-9740-e7f6f068db27.png)

위 그림을 살펴보면 JS 엔진 내부에 Memory Heap, Call Stack이 있고 그 밖에 Web APIs(DOM, AJAX, Timeout[setTimeout]), Event Loop, Callback Queue가 있다. 브라우저 위에서 동시성을 위해 이 모두가 관여하고 있다. 

- JS Engine(Memory Heap, Call Stack)
- Web APIS(DOM, AJAX, Timeout)
- Event Loop
- Callback Queue

### 1.4. 콜스택
보통 프로세스에는 코드, 데이터, 힙, 스택 영역의 메모리가 할당되는데
멀티스레드로 동작하는 경우 프로세스 내부에서 코드, 데이터, 힙영역을 스레드끼리 공유한다. 하지만 스택은 스레드마다 고유의 영역을 가지고 있다. 그럼에도 불구하고 JS는 단일 스레드로 동작하는 언어기 때문에 오직 하나의 스택, 힙 영역만이 존재한다.
Js의 경우 싱글 프로세스, 싱글 스레드이기 때문에 모든 영역이 1개만 존재한다. 

그리고 Js에서는 이 스택을 콜스택이라고 부르는데, 함수가 실행될 때마다 스택에는 frame이라는 하나의 실행 단위가 차곡차곡 쌓이게 된다. 
이때 나중에 들어온 frame이 가장 위에 쌓이는 구조가 되어 위쪽의 frame이 현재 실행되고 있는 함수가 된다. 
그러다 실행중인 함수가 값을 반환하면 그 frame이 stack에서 빠져나오며 그 아래에 있던 frame이 가장 위쪽에 위치하는 구조를 형성하게 되고,
이 때 이어서 다시 위쪽에 위치한 frame을 실행시키며 stack이 비어있을 때까지 반복한다.
그래서 콜스택은 프로그램 내에서 지금 실행되고 있는 구간을 기록하는 자료구조이기도 하다. 

결론적으로 이런 구조속에서 Js는 단일 스레드이기 때문에 한번에 오직 하나의 작업만을 처리할 수 있다.

![image](https://user-images.githubusercontent.com/39623897/107874379-a42a9480-6efc-11eb-8a90-5963cdb44e53.png)


```
function multiply(x, y) {
    return x * y;
}
function printSquare(x) {
    var s = multiply(x, x);
    console.log(s);
}
printSquare(5);
```

위 코드가 실행되는 동안 stack의 변화는 다음과 같다.
![image](https://user-images.githubusercontent.com/39623897/107873132-65441100-6ef3-11eb-9a13-cfa732719c2d.png)

그래서 만약 함수의 내부에서 다른 함수가 실행되는 동안 에러가 발생하면, 에러를 발생한 함수가 어디에서 실행됐는지 추적할 수 있습니다.
```
1 function multiply() {
2     throw new Error('SessionStack will help you resolve crashes :)');
3 }
4 function printSquare() {
5     multiply();
6 }
7 function start() {
8     printSquare();
9 }
10 start();
```
![image](https://user-images.githubusercontent.com/39623897/107873201-1f3b7d00-6ef4-11eb-80ff-b9926ed9e162.png)

위 코드를 살펴보면, 가정 먼저 오류를 발생시킨 함수인 multiply 내부에서 오류가 발생한 위치를 알려준다. 2번째 줄에서 오류가 발생했음을 알 수 있다. 
그 다음으로 multiply를 호출한 pritSquare 내부에서 muliply를 호출한 위치를 알려준다. 5번째에서 호출했음을 알 수 있다. 그 다음은 같은 과정을 반복하며
연관된 모든 함수의 위치를 알려준다.

#### 1.4.1. Blowing the stack
```
function foo() {
    foo();
}
foo();
```
위 구조를 실행하다보면, foo가 foo를 실행하기 때문에 끝도 없이 Frame이 Stack에 쌓이게 된다.

![image](https://user-images.githubusercontent.com/39623897/107873297-ea7bf580-6ef4-11eb-96dd-c7f640f934fe.png)

그러다 스택의 크기를 넘기게 되면, 다음과 같은 에러가 발생한다.

![image](https://user-images.githubusercontent.com/39623897/107873277-bbfe1a80-6ef4-11eb-8912-9ce17a4cba69.png)

### 1.5. Heap
보통 다른언어에서 힙영역은 동적으로 할당된 변수를 저장하는 메모리이다. Js에서는 objects가 이곳에 저장된다.

### 1.6. Queue & Event Loop
자바스크립트는 단일 스레드이기 때문에 다른 언어와는 다른 모델로 동시성을 제공한다. 바로 비동기 방식이다. Js엔진 자체는 단일 스레드(스택) 기반의 언어이지만
실제로 Js가 구현되는 브라우저 위에서는 이를 보완하기 위해 여러개의 스레드를 사용한다. 그중 하나가 이벤트 루프인데, Queue와 함께 살펴보자. 
브라우저에서 제공하는 API가 실행되면 우선 그 함수는 stack에 올라간다. 
그리고 실행을 마친 후 stack에서 빠져나온 뒤 개발자가 해당 API로 넘겨준 Callback 함수를 큐에 메세지(실행할 함수와 같음)로서 삽입한다. 
따라서 이 큐에는 처리해야할 메세지들이 나열된다. 이제 queue는 스택에 현재 실행중인 태스크가 있는지 확인한다. 없다면 queue의 가장 첫번 째 메세지를
호출하여 stack에 쌓는다. 이 때 이미 stack은 처리할 함수가 생겼기 때문에 실행중인 상태로 바뀌며, queue는 다시 stack에 현재 실행중인 테스크가 없을 때 까지
기다린다. 이런 과정을 반복한다. 

이렇게 브라우저에서 지원하는 API를 통해 함수를 실행하는 과정을 비동기 방식이라고 한다. 왜냐하면 순처적으로 진행되어야 할 스택 호출 과정에서 벗어나
독자적으로 스택이 실행되지 않는 때가 되면 그 함수가 실행되기 때문이다. 

예를들어 SetTimeout을 예제로 살펴보자.
```
function delay() {
  for (var i = 0; i < 100000; i++);
}
function foo() {
    delay(); (3)
    console.log('foo!'); // (4)
}
function baz() {
    console.log('baz!'); // (5)
}
setTimeout(baz, 0); (1);
foo(); (2)
```
delay가 100초, 10000초 동안 실행되더라도 setTimeout은 0초 뒤에 실행되게 설정했는데 가장 마지막에 실행된다.
그 이유는 setTimeout이 1번 째로 stack에 쌓이고, 0초 뒤에 queue에는 baz함수가 메세지로 쌓이게 된다. 
이어서 foo가 2번째, delay가 3번째 console.log('foo!')가 4번째로 모두 실행된 후에 stack에
더 이상 실행중인 테스크가 없어진 시점인 이 순간 setTimeout으로 넘겨준 baz가 stack에 쌓이며 실행되기 때문이다.

## 2. 동시성
싱글 스레드는 다중 스레드와 달리 스레드를 변경하지 않기 때문에 context Switching이 일어나지 않는다. 따라서 속도면에서 다중스레드 보다 
우위를 점한다. 그런데 문제점이 있다. 싱글 스레드는 한번에 단 하나의 작업만을 처리할 수 있다. 만약 하나의 작업이 몇 초 단위로 오래걸린다면 어떤 일이 발생할까?
예를 들어 이미지 변환같은 오래걸리는 작업을 Browswer의 JS로 처리한다고 생각해보자. 이 변환작업이 끝나기 전까지 브라우저는 다른 어떤 작업도 처리할 수 없다.
이것은 렌더링 또한 할 수 없다는 의미기 때문에 사용자의 입장에서는 몇 초 동안 고정된 UI를 바라보고 있어야만 한다. 그리고 오랜기간 응답이 없는 경우 
브라우저에서 페이지를 닫을 것인지 물어보기도 한다. 이러한 문제를 위의 Queue와 event loop 그리고 stack을 이용해 해결한 것이다.
예를들어 서버로 부터 데이터를 전송받는 과정을 AJAX 비동기를 이용한다면 전송 받는 과정동안 사용자의 입력과 같은 다른 작업을 처리할 수 있게 된다.

그런데 의문이 든다. setTimeout이 stack에 쌓이면 종료되는 시점에 callback 함수가 queue에 입력되는 것은 알겠는데, setTimeout이 실행되는
동안에는 어떻게 다른 일을 할 수 있는 것인가..? 그 이유는 setTimeout 함수가 실행되는 즉시 해당 Web APIs 중 Timer를 호출한다. 여기까지가 setTimeout의 역할이기 때문에 함수가 종료되면 stack에 빠져나온다. 즉 setTimeout은 거의 호출됨과 동시에 stack을 빠져나오기 때문에 다른 함수가 연이어 실행된다. 사용자의 입장에서는 setTimeout과 같은 비동기 함수가 실행되면 그 즉시 다른 일을 요청할 수 있게 된다. 

이제 호출된 Timer의 입장에서는 setTimeout에 입력된 특정 시간이 지난 후 내부 함수를 queue에 삽입한다. AJAX DOM Events와 관련된
함수를 실행할 때도 모두 해당하는 Web API를 호출해서 관련된 업무를 대신 처리하기 때문에 동시성을 제공할 수 있게 된다.

동시성에 대해 조금 더 자세히 숙지하려면 이벤트 루프 6단계에 대해 공부해 보자. => 다음시간에...

## 3. 이벤트 루프 6


### 참고:
[이벤트루프](https://meetup.toast.com/posts/89)

[이벤트루프](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)


