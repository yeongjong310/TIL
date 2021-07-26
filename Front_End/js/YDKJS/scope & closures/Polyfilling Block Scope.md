# Appendix B: Polyfilling Block Scope.

ES6 이하로는 `let`을 지원하지 않는다. 그렇다면 ES6 아래 버전에서는 Block scope를 사용할 수 없을까?
우리는 with와 catch가 Block Scope를 사용하고 있음을 확인했다. 그래서 catch를 활용하면 Block scope를 흉내낼수 있다.
```
//ES6
{
    let a = 2;
    console.log( a ); //2
}
```
```
// under ES6
try{
    throw 2
} catch(a) {
    console.log( a ); //2
}

console.log( a ); // ReferenceError
```
throw를 통해 value를 catch의 argument로 사용할 수 있다. 하지만... 이렇게 코드를 작성 하는 것은 정말 비효율 적이다.

## Traceur
Google이 지원하는 transpiler "Traceur"는 ES6 이하 버전에서도 let문법을 사용할 수 있게 해준다. ES6 문법을 버전에 맞게
compiling 해주기 때문이다.

```
{
	try {
		throw undefined;
	} catch (a) {
		a = 2;
		console.log( a );
	}
}

console.log( a );
```
이러한 형태로 말이다.

## Implicit vs. Explicit Blocks

let block
```
let (a = 2) {
	console.log( a ); // 2
}

console.log( a ); // ReferenceError
```
