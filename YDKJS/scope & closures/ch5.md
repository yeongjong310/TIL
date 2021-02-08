# Closure

## 1. Enlightenment
closure는 특별한 것이 아니다. closure는 본인도 모르게 계속 사용해왔던 우리에게 너무 친숙한 것이다.

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
closure는 lexical scope와 아주 연관이 깊다. bar scope에 포함되지 않는 a 를 lexical scope인 foo에서 찾는 과정을 생각해보자. 우리가 배운 scope 규칙에 의하면 bar는 foo의 밖에서는 사용할 수 없다. 왜냐하면 foo의 내부 함수로 선언되었기 때문이다. 그렇다면 bar 함수를 반환하면 어떻게 될까?

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
**closure는 함수의 주소 값이 lexical scope의 외부로 보내지는 과정에서 그 변수에 담긴 함수를 실행될 때 까지 lexical scope를 보존하고 참조하는 과정을 의미한다.**  만약에 closure가 없다면, 일반적으로 함수가 종료된 시점에서 garbege collector가 더 이상 사용하지 않는 메모리를 치워버린다. 즉 함수가 종료되면 해당 scope에서 선언된 모든 것들은 할당해제 될 것이다.

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
하지만 현대에는 위의 방법에 조금 변화를 주어 모듈을 유동적으로 추가하는 방법을 사용한다.
```
var  MyModules = (function Manager() {
	var modules = {}; // 모듈 기능을 저장할 객체 생성.
	
	// name: 생성할 모듈의 이름, deps: 기존 모듈의 이름이 담긴 배열(재사용을 위함), newModule: 새로 정의할 모듈 
	function define(name, deps, newModule) { 
		for (var i = 0; i < deps.length; i ++) {
			deps[i] = modules[deps[i]]; // 기존 모듈 객체(modules[deps[i]])를 찾아 deps[i]에 저장한다.
		}
		modules[name] = newModule.apply(newModule, deps); // apply를 사용하는 이유는 deps의 개수에 맞춰 newModule의 파라미터로 입력하기 위함.
	}
	
	function get(name) {
		return modules[name];
	}
	
	return {
		define: define,
		get: get
	}
})();
```

Manager는 define, get 메소드를 제공하는 object를 반환한다. 이 object는 module을 생성하고 불러오는 Manager 역할을 한다.
define의 `modules[name] = newModule.apply(newModule, deps);`를 보면 modules(모듈이 담긴 객체)에 원하는 모듈을 할당한다.
그리고 get 메소드로 modules에 담긴 모듈을 불러온다.
 
**실습**: 간단한 모듈 만들어보기.
```
MyModules.define("operator", [], function() {
	function sum(a, b) {
		let result = a + b;
		if( result !== result )
			throw "enter valid values"
		return a + b;
	}
	
	return {
		sum: sum
	};
});

MyModules.define("calculator", ["operator"], function(operator) {
	var currentValue = 0;
	function display(){
		console.log("current value is ", currentValue);
	}
	
	function plus(value){
		if( value !== value )
			throw "enter valid value"
		currentValue = operator.sum(currentValue, value);
		display();
	}
	
	return {
		display: display,
		plus: plus
	}
});

var operator = MyModules.get( "operator" );
var calculator = MyModules.get( "calculator" );

console.log(operator.sum(1, 2)); // 3
calculator.plus(1); // current value is 1
calculator.plus(); // enter valid value
calculator.plus(2); // current value is 3
```
### 5.2. Future Modules
지금까지는 function based module 방식을 알아보았다.
function이 실행되어야 module이 생성되기 때문에 function이 실행되는 중간에 얼마든지 module이 포함할 API를 객체에 넣거나 빼는등 수정할 수 있었다. 즉 module의 API는 run-time 과정에서 결정된다는 의미이다. 

반면에 ES6 모듈 부터는 API가 run-time 과정에서 결정되지 않고, compile-time 단계에서 결정되는 새로운 문법이 추가되었다.
compile-time 단계에서 API가 결정되었을 때의 장점은, API를 참조할 때 실제로 API가 존재하는지 확인하는 단계를 compile-time에서 수행하여 
미리 error 처리를 할 수 있다는 점이다. function based module 방식은 run-time 단계에서 module이 생성된 후 API를 참조하는 코드에 도달해야 
error를 처리할 수 있었다.

ES6 모듈 문법에 대해 알아보자. ES6의 모듈은 각 모듈마다 새로운 파일에 정의한다. 그리고 각 browser와 engine은 이 모듈들을 다른 파일로 동기화 하기 위한 loader를 가지고 있다.  


#### 실습
1. 우선 13.2 버전 이상의 node.js를 설치한다.
2. 모듈을 저장한다. 
```
// ../module/Module.js

var  MyModules = (function Manager() {
	var modules = {}; // 모듈 기능을 저장할 객체 생성.
	function define(name, deps, newModule) { 
		for (var i = 0; i < deps.length; i ++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = newModule.apply(newModule, deps);
	}
	function get(name) {
		return modules[name];
	}
	return {
		define: define,
		get: get
	}
})();

export { MyModules };
```
모듈을 실행하면, 아래와 같이 SyntaxError가 발생한다. 글을 읽어보면 package.json 내부에 type을 module로 설정하거나 .mjs 확장자를 사용하라고 한다. 
3. package.json 을 생성하고 type을 module로 설정한다.
4. module을 불러올 index.js 를 생성한다.
```
// ../module/index.js

import { MyModules } from './Module.js';

console.log(MyModules) // { define: [Function: define], get: [Function: get] }
```

하지만 이전에도 언급했듯 js코드를 해석하는 engine은 여러가지다. 즉 node.js engine이 Ecmascript의 몇 버전까지 지원하는 지에 따라 혹은 문법을 어떻게 해석하는지에 따라 사용할 수 있는 문법이 달라진다. node.js는 ES6 문법을 지원하지만 모듈에 관해서는 기본적으로 Common.js의 문법을 따르며 export 대신 exports.moduleName or module.exports를, import 대신 require를 사용한다.(export.moduleName 방식은 기존 export 객체에모듈들을 할당하는 방식(주소참조)이라면, module.exports(immutable)는 아예 새로운 메모리에 module을 할당한다.
```
// ../module/Module.js

var  MyModules = (function Manager() {
	var modules = {}; // 모듈 기능을 저장할 객체 생성.
	function define(name, deps, newModule) { 
		for (var i = 0; i < deps.length; i ++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = newModule.apply(newModule, deps);
	}
	function get(name) {
		return modules[name];
	}
	return {
		define: define,
		get: get
	}
})();

exports.MyModules = MyModules;
exports.test = test;
```

```
// ../module/index.js
const testModules = require('./Module')

console.log(testModules) // { MyModules: { define: [Function: define], get: [Function: get] }, test: {} }
```
## 6. Review
기존에 closure를 단순히 함수를 반환하는 경우에 lexical scope가 보존되는 것으로만 알고 있었는데, closure는 scope와 연관된 js의 근본이되는 대단한 녀석이었다. lexical scope에 어떤 값이든 외부로 반환되면 closure가 적용되었다고 볼 수 있다.

array, object 또한 lexical scope를 벗어났을 때 기존의 주소를 계속 참조한다.
```
var outValue;

function test(){
	var innerValue = ["123"];
	outValue = innerValue;
	outValue.push("456");
	
	function getInnerValue() {
		return innerValue;
	}
	
	return {
        	getInnerValue:getInnerValue,
    	}
}
testModule = test();
testModule.getInnerValue(); // ["123", "456"];
outValue.push("789");
testModule.getInnerValue(); // ["123", "456", "789"];
```

그리고 closure를 공부할 목적이었지만 module에 대해서도 많이 알게된 시간이었다.

1. js의 초창기에는 funcation based module만 지원하기 때문에 inline 문법(같은 파일내에 정의)을 사용했다.
2. 모듈을 편리하게 사용하려는 다양한 시도가 있었다.
- 초기: 메소드 형채로 객체 반환 + IIFE로 모듈 비전역화
- 중기: 모듈 매니저( 모듈을 정의하는 define, 모듈을 부르는 get)
- 후기: 모듈의 파일화( import, export | require, export.moduleName, module.exports )

##### 참고
[Modules: CommonJS modules](https://nodejs.org/api/modules.html)

[Modules: ECMAScript modules](https://nodejs.org/docs/latest-v15.x/api/esm.html#esm_enabling)

[The Revealing Module Pattern in Javascript](https://gist.github.com/zcaceres/bb0eec99c02dda6aac0e041d0d4d7bf2)
