#  HTTP
데이터를 주고 받기 위해 사용자와 클라이언트 사이에서 웹브라우저는 어떤 데이터를 어떤 방식으로 요청할 것인지 적혀있는 문서를 서버에게 보내고,
서버는 이 문서를 해석해서 알맞은 데이터를 웹 브라우저에게 보내준다. 하지만 만약 매번 그 문서의 양식이 달라진다면 서버가 사용자로 부터
어떤 데이터를 요청 받았을 때, 그에 맞는 해석방법이 달라질 것이고, 서버가 간신히 그 문서를 해석해서 웹 브라우저에게 데이터를 보내준다고 할지라도
웹브라우저가 전송 받은 문서가 매번 달라진다면, 문서 속 데이터를 분석하기 위해 많은 시간과 노력을 기울여야 한다. 
그래서 **일정한 양식으로 문서를 작성하고 통신을 원활하게 하자는 취지를 통해 고안된 약속이 HTTP 프로토콜**이다. 
# HTTP 정의 및 웹브라우저 살펴보기
## HTTP 정의
HTTP는 응용프로그램 계층의 통신 규약으로, 웹 브라우저가 서버와 클라이언트의 사이에서 통신을 주고 받기 위한 특정한 양식이다.
Request Header와 Response Header를 살펴보자. 
## Request Header와 Response Header
### Request Headers
Request Headers는 유저가 요청한 데이터를 서버에게 어떠한 방법으로 요청할지 기술한 문서이다. 곧 서버가 해석하기 쉽게 작성된 문서이기도 하다.  즉 웹브라우저는 사용자가 요청한 정보를 Request Header라는 양식에 맞춰 작성한 다음 웹서버에게 전송하여 데이터를 요청한다.  
![image](https://user-images.githubusercontent.com/39623897/104257757-7ac3b680-54c1-11eb-9ecf-7ad461509e91.png)  
HTTP/1.1 버전의 통신 규약과 함께 GET 방식으로 localhost:8000(호스트)에게 coupon_210112.html 데이터를 요청하고있다.

### Response Headers
서버는 Request Headers를 받아 어떤 정보를 요청하고 있는지 파악하고, Response Header라는 문서를 생성하여 알맞은 데이터와 함께 다시 웹 브라우저에게 보낸다. 웹 브라우저는 Response Header를 HTTP 프로토콜을 기반으로 이 문서를 해석해서 사용자에게 데이터를 보여준다. Response Header에는 아래와 같은 내용들을 포함하고 있다. 
![image](https://user-images.githubusercontent.com/39623897/104257662-4bad4500-54c1-11eb-9130-94fbd56c544b.png)
즉 서버는 HTTP/1.1 통신규약으로 응답했고 200 OK라는 오류없이 정상적으로 요청한 데이터를 찾아 응답했다는 메세지가 담겨있다.

## HTTP 형식
![image](https://user-images.githubusercontent.com/39623897/104270366-b3708980-54db-11eb-8125-d9e1cdb2b342.png)
- 출처: [HTTP Messages-MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)
### Request Headers
1. Start line(Request line): Method(GET), Request file(coupon_210112.html), Protocol(사용할 HTTP 버전 => HTTP/1.1)
2. HTTP Headers(Request Headers): HOST(요청할 서버의 주소 => 127.0.0.1:8080), User-Agent(웹 브라우저 정보), Accept-Encoding(지원하는 압축방식), [If-Modified-Since](#참고)&#91;1&#93;(이전에 Response 받은 정보를 다시 Reqeust해야 할 때 이 정보가 마지막으로 수정된 날짜를 기준으로 변화가 있는지 확인하여 없다면 304 Response(Not Modified)를 보내어 재활용하기 위한 정보) 
3. Blank: 헤더와 바디를 구분하기 위한 Blank
4. Body: 전송할 정보(내용

##### 참고
