# TCP / IP
기술 동기: 네이버 FE 채용공고의 한 작성 문항에서 글로벌 서비스를 개발할 때 어떤 점을 중요하다고 생각하는지 기술하는 란이 있었다.
그 동안 글로벌한 서비스에 대해 따로 깊이 있게 생각해 보지 않았는데, 이번 기회에 글로벌 서비스를 위한 기술로 어떤 것들이 쓰이는지 찾아보려한다. HTTP/2는 기존 HTTP/1.1의 단점을 보완한 것으로 글로벌 네트워크에서 RTT(Round Trip Time)를 개선하는 할 수 있는 새로운 방법 글로벌 네트워크에서  개선하는 중요한 방법  를 접하게 되었다. 여기서는 HTTP/2를 알아보기 전 밑바탕이되는 TCP/IP 개념을 다시 한번 집고 넘어가려고 한다.

## 4계층
LAN은 다들 한번 들어봤을 것이다. 가정에서 보통 KT, LG, SK 등의(ISP)의 인터넷망을 결제해서 사용한다. 
이 ISP에서 제공하는 공인 IP는 우리가 자주보는 공유기에 연결되고, 공유기는 여러 개의 사설 IP를 생성한다. 
PC 혹은 모바일 디바이스마다 연결된 LAN 혹은 WIFI를 통해 사설 IP가 부여되고 이로서 우리는 기기마다 고유의 IP를 가지고 인터넷을 사용할 수 있게 된다. 그렇다면 이 네트워크 구조에서 IP는 무엇이며 어떤 구조를 통해 데이터를 주고 받을까? TCP/IP 4 Layer를 살펴보면 그 원리를 파악할 수 있다.

4 Layer. Application Layer : http, stp, ftp ... (응용프로그램에서 서버로 데이터를 요청하고 해석하기 위한 규칙을 지정하는 계층),  

3 Layey. Transport Layer : TCP(데이터를 안전하고 정확하게 전달하는 방법), UDP(데이터를 빠르게 전달하기 위한 방법) ..

2 Layer. Internet Layer : IP(네트워크 상에서 목적지를 빠르게 찾아가기 위한 방법)

1 Layer. Network Access Layer: Ethernet, Wifi, 5G...

## 5계층 => Update된 TCP/IP의 새로운 계층으로 실제로 최근에는 이 모델을 더 많이 따른다.
5 Layer. Application Layer : http, stp, ftp ...

4 Layer. Transpoprt Layer : TCP, UDP

3 Layer. Network Layer : IP

2 Layer. DataLink Layer: 여러대의 컴퓨터가 연결된 네트워크 속 데이터의 수신은 동시 다발적으로 일어난다. 데이터 링크 레이어는 한 컴퓨터가 받고있는 데이터들을 구분하여 데이터의 시작과 끝을 파악한다.

1 Layer. Physical Layer: 전선은 아날로그 신호 밖에 전송하지 못한다. 디지털신호를 만들어내는 컴퓨터를 아날로그 신호로 바꾸어 전송하고 
전달받은 아날로그 신호는 디지털 신호로 바꾸어 주는 역할을 담당하는 레이어이다.

### 4 Transport Layer:
Transport Layer는 계층의 이름과 같이 데이터를 수송하는 방법과 직접적으로 연관된 계층이다. 
프로세스가 점유하고 있는 Port넘버를 확인하여 정확한 프로세스로 데이터를 전달하는데 중점을 두고있다.
대표적으로 이 계층에서 사용되는 프로토콜은 TCP와 UDP이다. 

#### 4.1. TCP(Transmission Control Protocol): 
TCP는 데이터를 **안전하게** 해당 프로세스로 보내기 위해 고안된 통신 규약이다.
왜 이러한 방법이 고안되었을까? 예를들어 발신자가 데이터를 송신하는 중 알 수 없는 이유로 그 데이터는 수신자에게 도착하지 않았다.
전송과정 중 어디선가 데이터가 누락됐을 가능성이 크다. 실제로 라우터가 처리할 수 있는 한계치를 넘어갔을 경우 이러한 일이 발생 할 수 있다. 이와 같이 데이터 누락 혹은 훼손된 데이터가 전송되는 것을 방지하기 위해 TCP는 특정한 방법으로 데이터를 주고 받는다. 

##### 4.1.1 서버와 클라이언트간의 신뢰성 있는 연결 - 3-Way Handshake
3-Way Handshake는 데이터를 주고 받기 전 서버와 클라이언트 사이의 논리적 연결을 위한 방법이다. 논리적 연결이란 물리적인 연결과 반대로
서로 데이터를 받을 준비가 됐음을 통신을 통해 알리고 인지하는 것이라 할 수 있다.
###### 4.1.1 3-Way Handshake step
```
Client                 Server
     1.------SYN------>
      <----SYN/ACK-----2.
     3.------ACK------>
```
###### 4.1.1.1 flag
TCP에서 주고 받는 Segment는 TCP header와 Data로 나누어지는데 TCP header에는 송수신자의 PORT 번호와 송수신시 필요한 9가지의 플래그가 있다. 9가지 플래그는 각 역할이 정해저 있으며 여기서는 SYN, ACK만 기술할 것이다.  
- SYN(Syncronize): Client와 Server 사이에서 상대방이 연결을 원하는지 확인하기 위한 플래그.
- ACK(Acknowledgement): 정상적으로 데이터(신호)를 받았음을 알리기 위한 플래그. 
##### 4.1.2 연결 과정
- 1. 위의 그림을 보면 Client가 SYN을 SERVER로 넘겨주게 되는데 Server는 이 SYN이 넘어왔음을 확인하여 Client가 연결을 원하는지 알아차린다.
- 2. 그 다음으로 Server는 Client로 SYN/ACK을 보내게 된다. 그 이유는 Client는 SYN을 보내고 난 후 Server가 그 SYN을 잘 받았는지 알 수가 없다. 따라서 ACK은 SERVER가 Client에게서 데이터(연결요망)를 잘 받았다고 알리기 위함이고 SYN을 같이 보냄으로써 Server 또한 통신하고 싶다는 메세지를 Client에게 확인시키기 위함이다.
- 3. 마찬가지로 다시 Clinet가 Server에게 ACK을 보낸다. Client가 Server의 SYN/ACK을 잘 받았다고 알리기 위해서이다.
이 3가지 단계를 거치면 Client와 Server 사이에 연결이 수립되고, 그 이후로는 아래와 같이 Segment(DATA+SYN)를 보내고 ACK을 보내기를 반복한다.
```
Client                           Server  
     1.----Segment(SYN+DATA)---->  
     <---------ACK(SYN+1)-------2.  
     3.----Segment(SYN+DATA)---->  
```
여기서 중요한 것은 SYN과 ACK의 관계이다. 예를들어 보통 랜덤하게 생성된 SYN 넘버 5000을 생성하고 Client는 이 값을 Server로 보냈다. 서버는 이 값을 잘 받았으면 받은 SYN에 +1을 해서 5001 ACK을 생성하고 Client에게 보낸다. Client는 5001 ACK을 보고 5000번 SYN이 잘 도착했다는 것을 인지한다. 혹여나 5001번의 ACK이 오지 않으면 SYN 5000번을 다시 보내게 된다. 이로서 데이터는 확실하게 목적지로 도달하게 된다.

##### 4.1.3 TCP의 안전한 데이터 전송을 위한 두가지 제어 방법.
1. 신뢰성 및 흐름제어(Flow Control): 수신자의 처리속도가 송신자의 처리속도보다 느릴경우에 수신자가 데이터를 받아들있수 있는 최대치를 넘어가면 그 이후 전송되는 데이터는 누락될 가능성이 크다. 이 때 이를 해결하기 위한 방법으로 1. Stop-and-Wait, 2. Sliding Window 등의 흐름제어 기법을 사용한다.
2. 혼잡제어(Congestion Control): 네트워크의 라우터가 처리할 수 있는 데이터의 양은 정해져있다. 만약 최대치를 넘어가면 그 이후 전성되는 데이터는 라우터가 처리하지 못하기 때문에 누락될 가능성이 크고, 이 때 이를 해결하기 위한 방법으로 1. Slow Start, 2. AIMD 등이 있다.
##### 4.1.3 TCP의 문제점
TCP는 데이터의 신뢰성을 보장하지만 수신속도가 떨어지는 단점이 있고, 경우에 따라 조금 손상된 데이터가 전송되어도 상관없는 동영상 스트리밍같은
데이터 송수신 과정에서는 TCP를 이용하면 비효율적일 수 있다. 그래서 그 대안으로 UDP를 사용한다.

#### 4.2. UDP
UDP는 짧은 레이턴시를 우선적으로 생각하는 방법이다. 즉 빠른 전송이 특징이다. 대신 서버와 클라이언트 사이에 연결이 되었는지 확인하지 않고 데이터 유실을 책임지지 않는다. 즉 데이터를 보내는 것 외에는 별다른 절차가 없어 전송이 빠르다. 

### 예제(네이버에서 아이디를 입력하고 로그인 버튼을 클릭했을 때, PC[client]와 SERVER의 데이터 송수신 과정[웹 페이지 전송등])

#### 용어정리
##### 데이터 단위(PDU[Protocol Data Unit])
- data: 5 Layer Apllication Layer 에서 http 프로토콜에 의해 http 헤더와 바디 형태로 데이터가 만들어진다. 헤더에는 GET/POST 메소드와 URL 등의 메타정보가 담겨 있다.
- segment: 4 Layer Transport Layer 에서 TCP 프로토콜에 의해 4Layer에서 만들어진 데이터 앞에 TCP 헤더가 붙는다. TCP 헤더에는 클라이언트와 서버의 port 넘버가 담겨있다. 이렇게 만들어진 데이터를 "Segment" 라고 한다.
- Packet: 3 Layer Internet Layer 에서 IP 프로토콜에 의해 Segment 앞에 IP 헤더가 붙는다. IP 헤더에는 클라이언트와 서버의 IP 주소가 담겨있다.
이렇게 만들어진 데이터를 "Packet"이라고 한다.
- Frame: 1,2 Layer(Network Access Layer) 에서 Segment 앞에 클라이언트와 서버의 MAC주소(Ethernet 헤더)가 붙고, 이렇게 만들어진 데이터를 "Frame"이라고 한다.

##### 네트워크 용어
- WAN: 국가 이상의 넓은 지역을 지원하는 네트워크 구조. 둘 이상의 LAN이 넓은 지역에 걸쳐 연결되어 있는 네트워크를 말한다.
- LAN: 비교적으로 가까운 거리에 위치한 소수의 장치들을 서로 연결한 네트워크로, 일반적으로 하나의 사무실 또는 몇 개의 건물을 연결한 네트워크를 말한다. 
- 라우터: LAN과 LAN , WAN과 WAN, WAN과 LAN을 연결해주는 장치이면서 데이터가 이 LAN과 WAN을 통해 최적의 경로를 설정하고 목적지에 도달하게 도와주는 장치.
- MAC address: 하드웨어가 가지고있는 물리적인 주소.
#### 데이터 전송 과정(TCP)
0. server와 client의 연결 수립
1. Client에서 로그인 DATA를 입력하고 로그인 버튼을 누르면 5Layer에서는 HTTP header(POST, HOST....) + DATA 형태로 다음 레이어로 갈 준비를 마친다.
2. 4Layer에서는 Port번호와 함께 랜덤의 SYN 넘버를 생성하여 TCP header에 저장하고 그 TCP header + DATA 형태로 Segment를 만든다.
3. 3Layer에서는 Ip header(송수신자의 ip주소) + Segment 형태로 Packet을 만든다.
4. 2Layer와 1Layer를 거쳐 Ethernet header(Mac 주소) + Packet 형태로 Frame을 만들고 Frame은 아날로그 신호로 변경된다.
5. 네트워크 카드에 연결된 LAN선을 통해 Frame은 종단 라우터(edge router: 라우터의 가장자리)로 이동한다.(공유기 등의 과정은 생략)
6. 종단 라우터는 Frame의 가장 앞 단인 Ethernet 헤더를 벗겨 Packet 데이터로 만들고, Packet의 Ip 헤더 부분에 담겨있는 서버(송신자)의 Ip 주소를 확인한다. Ip 주소를 통해 가장 최적의 경로를 확인하고 그 방향에 위치한 코어 라우터(core router: 라우터의 핵심-고성능,신뢰성 요구)로 Frame을 전송한다.
7. 이렇게 라우터를 타고가다 서버에 연결된 종단 라우터(최종 라우터)에 도착하면 이 라우터는 2번과 같은 과정을 통해 IP를 확인한 후,
Frame에 담긴 LAN카드의 mac address 를 확인하여 Server로 진입한다. 
8. Server에서는 Segment의 TCP헤더에 저장된 Port 번호를 확인하여 이 데이터가 80번 포트라면 http 요청이라는 것을 확인한다.
9. 80번 포트를 사용하고있는 프로세스(웹 프레임워크)에서 data를 확인하고 header에 저장된 메타데이터에서는 어떤 메소드와 어떤 주소로 데이터를 요청했는지 확인하여 이에 맞는 코드를 실행한다.
10. 실행된 결과(데이터)를 다시 Frame화 한 후 앞 과정을 거처 Client에게 보낸다.
11. 5-9번 반복
12. 이번에는 해당 포트를 사용하고 있는 프로세스가 브라우저이다. 브라우저에서 header에 저장된 데이터를 토대로 data를 해석해서 사용자에게 화면을 보여준다.


### 다음에 공부할 자료:
[HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)  
[Response Header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header#:~:text=A%20request%20header%20is%20an,preferred%20formats%20of%20the%20response.)  
[Request Header](https://developer.mozilla.org/en-US/docs/Glossary/Response_header)    
## 참고자료
[TCP/IP 원리](https://www.youtube.com/watch?v=W9uosPORF8Y&t=479s)

[네트워크 계층으로 알아보는 인터넷의 원리](https://www.youtube.com/watch?v=6jo2OYPK7k0&t=294s)

[TCP/IP 4계층](https://ryusae.tistory.com/4)

[네트워크 상식 정리](https://blog.naver.com/park30420/221973149468)

[TCP](https://namu.wiki/w/TCP)



