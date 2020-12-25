# 클로저.

정의: 내부함수가 외부함수의 맥락(함수내 변수)에 접근할 수 있는 것을 가르킨다.

```
var outter = function(){
  var name = 'yeongjong';
  var innter = function(){
    console.log(name); // yeongjong
  }
  inner();
}
outter();
```
var는 함수스코프를 따르기 때문에 console.log(name) 명령어를 실행시 inner 함수 내에서
name을 찾고 없다면 outter 함수 내에서 그 다음 그 밖에서 name을 찾게된다.
따라서 yeongjong이 출력되는 것은 당연하다.
```
var name = 'tory';
var outter = function(){
  var name = 'yeongjong';
  return function (){
    console.log(name);
  }()
}
outter();
```
위 코드를 보면 조금 이상하다고 생각할 수 있다. outter를 실행하는 마지막 줄에서
함수를 리턴하고 있는데 리턴 후 outter는 생을 마감했고 리턴된 함수 내에서 console.log(name)
실행문은 마감된 outter의 지역변수 name을 참조하고 있다. 이미 종료된 함수 outter의 name을
어떻게 참조할 수 가 있는가? 의문이 들었다. 이 때 클로저의 특성이 발휘된다. 
클로저란 외부함수가 마감되었을 지라도 외부함수의 지역변수를 사용하는 내부 함수가
소멸될 때까지 소멸되지 않는 특성을 의미한다.

클로저와 관련된 예제를 살펴보자.

```
var arr = [];
for(var i = 0; i < 5; i++){ // 1th for
  arr[i] = function(){
    console.log(i);
  }
}
for(var index in arr) { // 2th for
  console.log(arr[index]())
}
```
첫번 째 for문에서 배열 arr에 i를 출력하는 함수를 넣어주었기 때문에.
이 코드의 마지막 명령문인 for문이 실행되며 arr[index]() 함수를 실행할 때,
i의 값인 0부터 4까지가 출력될 것이라 생각하기 쉽다.
하지만 첫번 째 for문에서 arr안에는 함수가 할당되었을 뿐 실행된 것이 아니기에 
두번 째 for문에서 함수를 실행시키며 참조하는 i의 값은 전역변수인 5가 된다.

따라서 이 문제를 해결하기 위해서는 두가지 방법이 있다.
1. 외부 함수를 만들고 for문과 함께 외부 함수를 실행시키며 파라미터로 i의 값을 외부 함수의 내부로 전달한다.
i는 외부함수의 지역변수가 되고 내부 함수는 그 값을 참조할 수 있다.
```
var arr = [];
for(var i = 0; i < 5; i++){
  arr[i] = function(index){
    return function(){
      return index;
    }
  }(i);
}
for(let i = 0; i < 5; i++){
  console.log(arr[i]());
}
```
2. let 사용, let은 블록 스코프를 사용한다. 따라서 첫번 째 for문의 내부함수로 쓰인 let i는 for문이 끝난 후
사라지는 것이 당연하지만, for문의 안에서 생성된 내부 함수가 지역변수 i를 호출하고 있다면,
for문이 끝난 후에 내부 함수가 호출되었을 경우일 지라도 지역변수 i를 호출하게 된다.
```
var arr = [];
for(let i = 0; i < 5; i++){ // 1th for
  arr[i] = function(){
    return i;
  }
}
for(let i = 0; i < 5; i++){ // 2th for
  console.log(arr[i]());
}
```
