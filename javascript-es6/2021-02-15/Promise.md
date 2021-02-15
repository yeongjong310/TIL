# Promise

Promise를 살펴보기전 Js의 콜백지옥에 대해 알아보자.

Js는 비동기 프로그램이다. 비동기함수인 setTimeout을 활용해 비동기 프로그래밍 방식에 어떤 문제점이 있는지 알아보자.

```
var foo;
setTimeout(() => {
  foo = 1;
},3000);
console.log(foo);
```
3초 뒤 foo에 1을 할당하고 그 후에 foo를 출력하는 프로그램을 만들고 싶다. 하지만 위와 같이 작성하면 
undefined를 출력한다.

어떻게 이 문제를 해결할 수 있을까? => 콜백함수를 사용하자. 원리는 단순하다. setTimeout에 내부에서 원하는 코드를 실행하면 비동기 함수가 실행된 이후에 
원하는 명령문을 처리할 수 있다.
```
var foo;

function bar(){
  foo = 1;
  console.log(foo);
}

setTimeout(() => {
  bar();
},3000);
```

## 콜백지옥
하나의 비동기 함수를 기준으로 원하는 명령문을 다음 순번에 실행시키려면 위 처럼 비동기 함수 내부에 모든 코드를 작성해야 한다.
그러다 콜백함수를 argument로 입력받는 한 함수가 등장한다. 이 콜백함수를 편리성을 위해 익명 함수로 작성한다.
익명 함수 내부에서 또다른 콜백함수를 argument로 입력받는 함수를 사용했다. 또 콜백함수를 익명함 수로 작성해 넘겨준다.
그러다보면 비동기 함수 내부에 콜백함수가 겹겹이 쌓이는 구조가 되어 가독성이 매우 떨어지게 된다.

이를 콜백 지옥이라고 하는데, 아래 코드가 그 예시다. 이게 어떻게 동작하는지 보기만 해도 헷갈린다. 이 함수가 생성된 경로를 추적하면 다음과 같다.
step1은 콜백함수를 요구한다. 콜백함수로 익명함수 function (value1) 을 넣어준다. 익명함수를 작성하다보면 또 다른 콜백함수가 필요하게(API등) 된다.
또다른 콜백함수를 사용한다. 여기서 API가 step2()라고 가정하면 step2는 또다른 콜백함수를 요구한다. 
따라서 내부에 익명함수인 function(value2)를 다시한번 콜백함수로 넣어준다.반복한다...

```
setTimeout(() => {
  step1(function (value1) {
      step2(function (value2) {
          step3(function (value3) {
              step4(function (value4) {
                  step5(function (value5) {
                      step6(function (value6) {
                          // Do something with value6
                      });
                  });
              });
          });
      });
  });
}, 1000);
```

### 해별방법 1. 익명함수를 사용하지 않고 이름이 있는 콜백함수를 따로 정의한다. 그리고 이 함수를 콜백함수로 넘겨준다.
```
function afterStep1(value1) { // 2. afterStep1에서 또다른 API(step2)를 사용한다.
    step2(afterStep2); // step2의 콜백함수로 afterStep2를 넘겨준다.
}
function afterStep2(value2) { // 3.
    step3(afterStep3);
}
// 생략
setTimeout(() => {
  step1(afterStep1); 1. // step1의 콜백함수로 afterStep1을 넘겨준다.
}
```

Promise는 이런 콜백지옥을 해결하기 위해 제안된 패턴 중 하나이다. 

**예제**

```
new Promise(function(resolve, reject){
  setTimeout(function() {
    resolve(1);
  }, 2000);
})
.then(function(result) {
  console.log(result); // 1
  return result + 10;
})
.then(function(result) {
  console.log(result); // 11
  return result + 20;
})
.then(function(result) {
  console.log(result); // 31
});
```

## Promise 흐름(From MDZ)

![image](https://user-images.githubusercontent.com/39623897/107959798-2d1dfa80-6fe7-11eb-860f-df2e36ade29b.png)

위 흐름을 보면 살펴보자.
2가지의 루트가 있다. 
1. 1)pending -> 2)fulfill -> 3)settled -> 4)return -> 5)pending
2. 1)pending -> 2)reject -> 3)settled -> 4)return -> 5)pending

New를 통해 Promise를 생성하면 pending 상태의 Promise를 반환한다. 그리고 pending이 정해지는 순간 내부로 넘겨준 함수가 실행되며 
resolve 혹은 reject 함수가 실행될 때 까지 pending 상태를 유지한다.
이 때 resolve 혹은 reject 중 어떤 함수가 실행되느냐에 따라 fulfill 혹은 reject로 상태가 변경된다. fulfill로 상태가 변경된 경우
then만이 실행되고 then 내부에서 resolve로 넘어온 값을 받을 수 있다. reject의 경우는 catch만이 실행되고 내부에서 에러 코드를 받을 수 있다.

```
function setTimeoutSync(time) {
    return new Promise((resolve, reject) => {
      if ( time > 0 ) {
        setTimeout(() => resolve(1), time);
      } else {
        reject(new Error("Time is not valid"));
    }
  });
}
```
setTimeout을 이용하면 pending 상태에서 fulfill로 넘어가는 과정을 확인해 볼 수 있다.
```
var foo = setTimeoutSync(1000); 
console.log(foo); // pending 상태의 promise 반환
--- 1초 뒤---
console.log(foo); // foo의 상태가 fulfilled로 변경됨

```

reject 실험
```
var foo = setTimeoutSync(-1);
foo.then(err => console.log(err)); // err가 발생했기 때문에 then은 실행되지 않고 reject상태의 promise를 그대로 반환한다.
```
![image](https://user-images.githubusercontent.com/39623897/107965445-e1bb1a80-6fed-11eb-96ae-28f2a82c6b8a.png)

```
var foo = setTimeoutSync(-1);
foo.catch(err => console.log(err)); // catch문이 실행되며 내부함수의 argument로 reject에 입력한 에러코드가 넘어온다.
```
![image](https://user-images.githubusercontent.com/39623897/107965511-f8617180-6fed-11eb-9c87-ac89b1d4d303.png)

then과 catch문을 함께 사용하면 err가 발생했을 때 then을 스킵하고 catch만 실행하도록 유도할 수 있다.

![image](https://user-images.githubusercontent.com/39623897/107967557-9e15e000-6ff0-11eb-8c31-5b925da6cbdf.png)

fulfill 상태에서 then을 사용하면 pending 상태의 promise를 다시 반환하고 내부 함수가 즉시 실행된다.
실행된 함수에 문제가 없다면 또 다시 fulfill 상태의 promise를 반환하여 연속적으로 then을 사용할 수 있다.
마찬가지로 reject의 promise가 반환된 경우 catch문을 사용하면 다시 pending 상태의 promise를 반환하기 때문에
즉시 내부 코드가 실행되고 문제가 없다면 fulfill 상태의 promise를 다시 반환한다. 이 과정을 무한히 반복할 수 있다.

그래서 보통은 then을 연속으로 사용하고 catch문을 마지막에 사용한다.

```
foo(1000)
  .then(...)
  .then(...)
  .then(...)
  .catch(...)
```
