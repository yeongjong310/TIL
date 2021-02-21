# Appendix C: Lexical-this

`this`를 실행하는 대상이 this의 주인이 된다.

따라서 다음과 같은 오류가 생길 수 있다.

```
var obj = {
  id: "awesome",
  cool: function() {
    console.log( this.id );
  }
};

var id = "not awesome";

obj.cool(); //awesome

setTimeout( obj.cool, 100 ); // not awesome
```
## 문제 해결 방법 1번.
cool 메소드가 setTimeout의 내부에서 지역변수에 저장되기 때문에 전역변수의 not awesome이 출력되었다.
이는 콜백함수로 obj의 메소드를 넘겨줄 때 발생하는 문제이기 때문에 콜백함수로 넘겨주지 않으면 해결할 수 있다.
```
var obj = {
  id: "awesome",
  cool: function coolFn() {
    var self = this;
    setTimeout(function() { // 클로져의 개념이 적용된다. coolFn 내부에 선언된 coolFn는 setTimeout의 콜백함수로 넘어가도 self에 접근 할 수 있다.
      console.log( self.id );
    }, 100);
  }
};

obj.cool(); // awesome
```
## 문제 해결 방법 2번
arrow function을 사용하면 문제를 해결 할 수 있다.
arrow function은 선언된 시점에 this를 외부 scope의 this로 고정시킨다.

```
var obj = {
  id: "awesome",
  cool: function coolFn() {
    setTimeout(() => console.log(this.id)) // coolFn 함수 내부에서 arrow function이 선언되었기 때문에 함수 외부 scope의 this로 고정된다. 즉 외부 scope인 coolFn의 this는 obj를 가리킨다.
  }
}

obj.cool(); // "awesome"
```

## 문제 해결 방법 3번
bind call apply 사용하기
```
var obj = {
  id: "awesome",
  cool: function coolFn() {
    setTimeout(function(){
      console.log(this.id);
    }.bind(this), 100); // bind 되는 순간 this는 고정된다.
  }
}

obj.cool(); // "awesome"
```
