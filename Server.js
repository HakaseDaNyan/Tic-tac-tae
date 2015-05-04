var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var server = http.createServer(handler);

var count=1;	//回合 1是圈 2是叉
var arr=[0,0,0,0,0,0,0,0,0];	//每個圖片的值皆為0
var fn=0;	//輸贏的迴傳值

function handler(request,response){		//網路連線
	fs.readFile('./client.html',function(err,data){
		if(err)
		{
			
			response.writeHead(500,{'Content-Type':'text/plain'});
			return response.end('Error Loading msg.html');
		}
		response.writeHead(200);
		response.end(data);
	});
}

function worl(arr){                        //判斷輸贏                   
		if((arr[0]==arr[1]&&arr[1]==arr[2]&&arr[2]==1)||
		   (arr[3]==arr[4]&&arr[4]==arr[5]&&arr[5]==1)||
		   (arr[6]==arr[7]&&arr[7]==arr[8]&&arr[7]==1)|| //橫行
		   (arr[0]==arr[3]&&arr[3]==arr[6]&&arr[6]==1)||
		   (arr[1]==arr[4]&&arr[4]==arr[7]&&arr[7]==1)||
		   (arr[2]==arr[5]&&arr[5]==arr[8]&&arr[8]==1)|| //直行
		   (arr[0]==arr[4]&&arr[4]==arr[8]&&arr[8]==1)||
		   (arr[2]==arr[4]&&arr[4]==arr[6]&&arr[6]==1)){ //斜
			fn=1; //圈贏
			}
		else if((arr[0]==arr[1]&&arr[1]==arr[2]&&arr[2]==2)||
		   (arr[3]==arr[4]&&arr[4]==arr[5]&&arr[5]==2)||
		   (arr[6]==arr[7]&&arr[7]==arr[8]&&arr[7]==2)|| //橫行
		   (arr[0]==arr[3]&&arr[3]==arr[6]&&arr[6]==2)||
		   (arr[1]==arr[4]&&arr[4]==arr[7]&&arr[7]==2)||
		   (arr[2]==arr[5]&&arr[5]==arr[8]&&arr[8]==2)|| //直行
		   (arr[0]==arr[4]&&arr[4]==arr[8]&&arr[8]==2)||
		   (arr[2]==arr[4]&&arr[4]==arr[6]&&arr[6]==2)){	 //斜
			fn=2; //叉贏
			}
		else if(arr[0]!=0&&arr[1]!=0&&arr[2]!=0&&arr[3]!=0&&arr[4]!=0&&arr[5]!=0&&arr[6]!=0&&arr[7]!=0&&arr[8]!=0){
			fn=3; //平手
	}
	};

//啟動Server時顯示訊息
server.listen(3000,function(){
	console.log("Server Start.");
});
// 開啟 Socket.IO 的 listener
var io = io.listen(server);
//接收connect
io.sockets.on('connect', function (socket) {
	console.log('connetion!');
	socket.on('restart',function(){	//等待restart鍵的觸發
		arr=[0,0,0,0,0,0,0,0,0];	//初始化所有值
		count=1;
		fn=0;
	});
	//client按下圈或叉後 儲存socket的turn值 並回傳data
	socket.on('turn',function(turns){
		socket.turn = turns;
		console.log("turn="+socket.turn);
		io.sockets.emit('data',count,arr);
	});
	//收到client更改過後的data後傳給所有socket並進行輸贏判斷
	socket.on('databack',function(count,arr){
		console.log("count="+count+"arr="+arr);
		io.sockets.emit('data',count,arr);
		worl(arr);
		if(fn!=0)
			io.sockets.emit('worl',fn);
	});
	
});

