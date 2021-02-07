# Closure

## 1. Enlightenment
closure는 특별한 것이 아니다. closure은 우리가 Js를 사용할 때 이미 주변에 있던 친숙한 것이다.  

## 2. Nitty Gritty
클로저의 사전적 정의는 아래와 같다.
> Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.
> 클로저란... 함수가 lexical scope의 밖에서도 lexical scope를 기억하여 접근할 수 있을 때를 말한다.
```
function foo() {
  var a = 2;
  
  function bar() {
    console.log( a );
  }
  
  bar();
}
foo();
}
```
bar scope에 포함되지 않는 a 를 lexical scope인 foo에서 찾는 과정을 기억해 놓자. 우리가 배운 scope 규칙에 의하면 bar는 foo의 밖에서는
사용할 수 없다. 왜냐하면 foo의 내부 함수로 선언되었기 때문이다. 그렇다면 bar 함수를 반환하면 어떻게 될까?

```
function foo() {
  var a = 2;
  
  function bar() {
    console.log( a );
  }
  
  return bar;
}

var baz = foo();

baz(); // 2 -- closure was just observed, man!
```
함수 bar는 값으로 반환되었다. 그리고 그 값이 baz에 할당되어 실행되었다. 하지만 baz는 bar를 참조하고 있기 때문에 
실질적으로 실행되는 함수는 bar이다. bar는 분명히 lexical scope인 foo 내부에서만 사용할 수 있는데 어떻게 밖에서 실행됐을까? 
이것이 바로 closure 때문이다. 
**closure는 함수의 주소 값이 lexical scope의 외부로 보내지는 과정에서 그 변수에 담긴 함수를 실행될 때 까지 lexical scope를 보존하고 참조하는
과정을 의미한다.**  만약에 closure가 없다면, 일반적으로 함수가 종료된 시점에서 garbege collector가 더 이상 사용하지 않는 메모리를
치워버린다. 즉 함수가 종료되면 해당 scope에서 선언된 모든 것들은 할당해제 될 것이다.

closure 예시를 몇 가지 더 살펴보자.

```
function foo() {
  var a = 2;
  
  function baz() {
    console.log( a ); //2
  }
  
  bar( baz );
}

function bar(fn) {
  fn(); 
}

foo();
```

전역함수를 특정 function scope에서 사용하는 매우 일반적인 사례이다. 하지만 여기서도 closure가 적용된다.
foo 내부에서 bar의 argument로 baz를 lexical scope의 밖으로 보내고 있다. bar의 지역변수 fn에 bar이 할당되고, 
fn이 실행되면 baz는 foo 외부에서 실행된다.

```
var fn;

function foo() {
  var a = 2;
  
  function baz() {
    console.log( a );
  }
  fn = baz;
}

function bar() {
  fn();
}

foo();

bar(); // 2
```
위 사례와 같이 foo 내부에서 정의된 baz를 전역변수인 fn에 할당하고, 외부에서 fn을 불러오는 것도 closure이다.

## 3. Now I Can See
실례를 살펴보자.
```
function wait(message) {
  setTimeout( function timer() {
    console.log( message );
  }, 1000);
}

wait("Hello, closure!");
```
wait 내부에서 timer 함수가 정의되고 이 함수가 setTime의 callback으로 사용되면 lexical scope 범위를 벗어난다. 또한 이미 wait가 끝나 이후에
setTimeout이 실행된다. 이때 closure에 의해 lexical scope가 유지되어 timer 함수가 실행된다.

### 3.1. closure
```
function setupBot(name, selector) {
  $( selector ).click( function activator() {
     console.log("Activation: " + name );
     } );
}

setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );
```
setTimeout, event handlers, Ajax requests, cross-window messaging, web workers, asynchronous, synchronouse 어떤 것이든 
callback으로 넘겨주고 내부적으로 그 함수를 실행한다면, closure가 사용됐다고 볼 수 있다!

## 4. Loops + Closure
```
for (var i = 1; i <= 5; i ++) {
  setTimeout( function timer() {
    console.loog( i );
    }, i*1000 );
}
```
closure를 설명할 때 반복문은 매우 유용하게 쓰인다. 위 코드를 실행하면 의도한 바와 달리 6이 5번 출력된다.
그 이유는 closure에 의해 timer는 lexical scope 외 영인익 setTimeout 내부에서 실행된다. 그리고 모든 i 가 global 영역의 i를 가리키고 있다.
따라서 for문이 끝난 시점에서 globla 영역이 i는 6가 되어 6가 5번 출력되는 것이다.

**note:** setTimeout은 for문이 끝나면 실행되기 때문에 setTimeout(..., 0)일지라도 6이 5번 출력된다.

그렇다면 아래 코드는 어떨까?
```
for (var i = 1; i <= 5; i ++) {
  (function(){
    setTimeout( function timer() {
      console.log( i );
    }, i * 1000 );
  })();
}
```
IIFE는 새로운 scope를 생성한다. 하지만 이 scope에서도 i는 존재하지 않고, 외부 영역인 global에서 i를 호출하기 때문에 역시 6이 5번 출력되는
같은 결과를 낳는다.

```
for (var i = 1; i <= 5; i ++) {
  (function(j){
    setTimeout( function timer() {
      console.log( j );
    }, i * 1000 );
  })(i);
}

for (let i = 1; i <= 5; i ++) {
    setTimeout( function timer() {
      console.log( i );
    }, i * 1000 );
}
```
 
따라서 위와 같이 매 반복문이 실행될 때 마다, scope가 형성되고 그 내부에서 i는 따로 선언되어야 한다.

## 5. Modules
callback외에 closure를 열심히 사용하는 또다른 모델이 있다. 바로  module이다.
```
function CoolModule() {
	var something = "cool";
	var another = [1, 2, 3];

	function doSomething() {
		console.log( something );
	}

	function doAnother() {
		console.log( another.join( " ! " ) );
	}

	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
}

var foo = CoolModule();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```
위 코드가 바로 우리가 부르는 module의 실체다. inner functions를 메소드로 구성한 object를 반환한다. 그리고 outer function을 실행하면
module instance가 생성되어 foo 변수에서 그 객체의 주소를 참조한다. 여기서 부터 closure가 적용된다. 이미 outer function은 종료되었기 때문에 
반환한 object를 더 이상 참조할 수 없어야 하지만 closure 덕분에 참조할 수 있다. 그리고 이 object의 메소드를 통해 
foo에 저장된 CoolModule instance에 접근하는 것도 closure다.

여기까지 module이 실행되기 위한 조건을 살펴보면 다음과 같다.

1. outer function이 inner function을 감싸고 있어야한다. 그리고 outer function이 한번 이상은 실행되어야 한다.
2. outer function은 최소 하나 이상의 inner function을 반환해야한다. 
3. 반환된 inner functiond은 closure 덕분에 lexical scope 범위 밖이지만 lexical scope 범위의 변수 혹은 함수에 접근할 수 있다.


하지만 이렇게 작성된 module은 global에 노출되어 한 프로그램에서 여러번 실행할 수 있기 때문에 
누군가 한번더 실행하면 각 module 마다 고유의 scope를 가지게 된다. 

이때 IIFE를 사용하면 module을 생성하는 함수는 global에 노출되지 않는다.
```
var foo = (function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];
  
  function doSomething() {
    console.log( another.join( " ~ " ) );
  }
  
  return {
    doSomething: doSomething,
    doAnother: doAnother
  };
})();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

모듈은 함수이기 때문에, argument를 받을 수 있다.
```
function CoolModule(id) {
	function identify() {
		console.log( id );
	}

	return {
		identify: identify
	};
}

var foo1 = CoolModule( "foo 1" );
var foo2 = CoolModule( "foo 2" );

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"
```

또한 메소드를 담은 객체를 변수에 저장해서 반환하면, 변수 이름을 통해 module 내부에서 반환될 객체를 적절히 수정할 수도 있다.
```
var foo = (function CoolModule(id) {
	function change() {
		// modifying the public API
		publicAPI.identify = identify2;
	}

	function identify1() {
		console.log( id );
	}

	function identify2() {
		console.log( id.toUpperCase() );
	}

	var publicAPI = {
		change: change,
		identify: identify1
	};

	return publicAPI;
})( "foo module" );
```


### 5.1. Modern Modules
### 5.2. Future Modules

## 6. Review
