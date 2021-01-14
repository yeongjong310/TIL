#  HTTP(HyperText Tranfer Protocol)
데이터를 주고 받기 위해 사용자와 클라이언트 사이에서 웹브라우저는 어떤 데이터를 어떤 방식으로 요청할 것인지 적혀있는 문서를 서버에게 보내고,
서버는 이 문서를 해석해서 알맞은 데이터를 웹 브라우저에게 보내준다. 하지만 만약 매번 그 문서의 양식이 달라진다면 서버가 사용자로 부터
어떤 데이터를 요청 받았을 때, 그에 맞는 해석방법이 달라질 것이고, 서버가 간신히 그 문서를 해석해서 웹 브라우저에게 데이터를 보내준다고 할지라도 웹브라우저가 전송 받은 문서가 매번 달라진다면, 문서 속 데이터를 분석하기 위해 많은 시간과 노력을 기울여야 한다. 
그래서 **일정한 양식으로 문서를 작성하고 통신을 원활하게 하자는 취지를 통해 고안된 약속이 HTTP 프로토콜**이다. 
# 1. HTTP 정의 및 웹브라우저 살펴보기
## 1.1. HTTP 정의
HTTP는 응용프로그램 계층의 통신 규약으로, 웹 브라우저가 서버와 클라이언트의 사이에서 통신을 주고 받기 위한 특정한 양식이다.
Request Header와 Response Header를 살펴보자. 
## 1.2. Request Header와 Response Header
### 1.2.1. Request Headers
Request Headers는 유저가 요청한 데이터를 서버에게 어떠한 방법으로 요청할지 기술한 문서이다. 곧 서버가 해석하기 쉽게 작성된 문서이기도 하다.  즉 웹브라우저는 사용자가 요청한 정보를 Request Header라는 양식에 맞춰 작성한 다음 웹서버에게 전송하여 데이터를 요청한다.  
![image](https://user-images.githubusercontent.com/39623897/104257757-7ac3b680-54c1-11eb-9ecf-7ad461509e91.png)  
HTTP/1.1 버전의 통신 규약과 함께 GET 방식으로 localhost:8000(호스트)에게 coupon_210112.html 데이터를 요청하고있다.

### 1.2.2. Response Headers
서버는 Request Headers를 받아 어떤 정보를 요청하고 있는지 파악하고, Response Header라는 문서를 생성하여 알맞은 데이터와 함께 다시 웹 브라우저에게 보낸다. 웹 브라우저는 Response Header를 HTTP 프로토콜을 기반으로 이 문서를 해석해서 사용자에게 데이터를 보여준다. Response Header에는 아래와 같은 내용들을 포함하고 있다. 
![image](https://user-images.githubusercontent.com/39623897/104257662-4bad4500-54c1-11eb-9130-94fbd56c544b.png)
즉 서버는 HTTP/1.1 통신규약으로 응답했고 200 OK라는 오류없이 정상적으로 요청한 데이터를 찾아 응답했다는 메세지가 담겨있다.

## 1.3. HTTP 형식
![image](https://user-images.githubusercontent.com/39623897/104270366-b3708980-54db-11eb-8125-d9e1cdb2b342.png)
- 출처: [HTTP Messages-MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)
### 1.3.1. Request Headers
1. Start line(Request line): Method(GET/POST), Request file(coupon_210112.html), Protocol(사용할 HTTP 버전 => HTTP/1.1)
2. HTTP Headers(Request Headers): 대표적으로 다음과 같은 내용들을 포함한다. 
- HOST: 요청할 서버의 주소 ex) 127.0.0.1:8080 
- User-Agent: 웹 브라우저 정보
- Accept-Encoding: 웹 브라우저가 지원하는 압축방식(데이터가 클 경우 서버는 이 지원 방식으로 압축해야한다.)
- [If-Modified-Since](#참고)&#91;1&#93;: 이전에 Response 받은 정보를 다시 Reqeust해야 할 때 이 정보가 마지막으로 수정된 날짜를 포함하여 서버에 전송한다. 서버는 이 날짜를 기준으로 요청받은 정보(파일등)에 변화가 있는지 확인하여 없다면 304 Redirection(Not Modified)를 보낸다. 즉 기본 데이터를 재활용하기 위한 정보이다.
3. Blank: 헤더와 바디를 구분하기 위한 Blank
4. Body: 전송할 정보

### 1.3.2. Responses Headers
1. Start line(status): rotocol(사용할 HTTP 버전 => HTTP/1.1), status(200 ok 등)
2. HTTP Headers(Response Headers): 대표적으로 다음과 같은 내용들을 포함한다.
- Content-Type: text/html, image/jpg(브라우저는 Content-Type을 통해 어떠한 타입의 데이터인지 확인하고 그 데이터를 해석한다.)
- Content-Length: 컨텐츠의 크기(사이즈) byte단위
- Content-Encoding: 압축형식(gzip 등의 형식으로 압축해서 브라우저가 이 방식을 디코딩해야 한다고 알려준다.
- Last-Modified: 마지막으로 언제 수정되었는지 알려주는 내용.

# 2. HTTP 버전
## 2.1. HTTP1.1
HTTP가 처음으로 상용화된 1.0 버전에는 생각보다 불편한 것들이 있었다. 그 중 가장 큰 문제는 서버와 클라이언트 사이의 연결시 딱 1번의 Request와 Response만 할 수 있고 그 이후로 연결이 끊겨서 매 요청마다 재연결이 필요했기 때문이다. 특히 TCP는 서버의 연결 수립과정이 3-handshake로 느렸기 때문에 이를 보완한 1.1 버전은 그 효과가 뛰어났다.

### 2.1.1. Persistent Connections:
지정한 시간동안 연결을 닫지 않는 방법으로 HTTP1.1 부터는 기본적으로 별도의 Keep-alive가 없어도 지속적으로 연결상태를 유지한다.
### 2.1.2. Pipelining
기존 1.0 버전에서는 하나의 요청이 들어오고 다른 요청을 보내려면 이전 요청에 대한 응답을 기다려야했다. 이 방법을 해결하기 위해 이전에 보낸 요청에 대한 응답이 오지 않더라도 우선 다음 요청을 보내고 요청에 대한 응답을 순차적으로 처리하는 기법이 도입됐다.
### 2.1.3. [Chunked Response&#91;2&#93;](#참고)
Request에 대한 처리가 완전히 끝나기 전까지 사용자에게 얼마나 큰 데이터를 응답할지 알 수 없는 경우기 있다. 큰 이미지를 보내는 경우나
큰 데이터 양을 테이블로 만들 때 사용한다.

그 외에도 헤더에 호스트가 추가되는 등이 꽤 많은 것이 바뀌었다.

### 2.2.4. 문제점
#### 2.2.4.1. Head Of Line Blocking
HTTP1.1에도 문제가 있었는데 앞서 말했듯이 한번에 여러개의 요청을 보낼 수는 있었으나 요청 순서대로 처리해야했고,
처리시간이 짧은 순서대로 처리고하고 싶어도 선택권이 없었다. 
#### 2.2.4.2. Header 구조의 중복
데이터를 주고 받을 때 Header파일 내에 중복된 데이터를 사용.(리소스 증가)
## 2.2. [HTTP2&#91;3&#93;](#참고)
### 2.2.1. BinaryFraming
바이너리 형태로 인코딩을 한다. TEXT와 달리 더 이상 수동적으로 만들수도, 읽을 수도 없지만 파싱과 전송속도가 빨라졌고 오류 방생 가능성이 낮아졌다. 
#### 2.2.1.1. Resolve Head of Line Blocking
HTTP/2는 코드를  Header와 Data로 분할한다. 그리고 분할한 데이터를 비순차적으로 전송할 수 있고, 서버에 도착하여 각 Header에 맞는 Data를 조립하는 방식을 택한다. 어떠한 원리로 동작하는지 정확히 파악하지는 못했으나, 이 방법으로 이전 데이터에 대한 응답이 도착할 때까지 기다릴 필요없이 완전한 병렬처리기 가능해졌다.  
![image](https://user-images.githubusercontent.com/39623897/104611579-a369cd00-56c8-11eb-8d98-7abfab763edb.png)  
이미지 출처-(https://developers.google.com/web/fundamentals/performance/http2)

### 2.2.2. Stream Prioritization
보내고 싶은 데이터를 우선적으로 전송 가능.
### 2.2.3. Server Push
요청하지 않은 데이터를 응답할 수 있음.
### 2.2.4. Header Compression
Header내의 중복된 데이터를 재사용하여 새로운 데이터와 함께 압축하여 전송함.(리소스 감소)

##### 참고
- &#91;1&#93; [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since)
- &#91;2&#93; [Chenked Response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
- &#91;3&#93; [HTTP2](https://developers.google.com/web/fundamentals/performance/http2)
- [Evolution HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
