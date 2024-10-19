import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// 서버 실행
const server = app.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

// 정적 파일 제공 (dist 폴더 내 파일)
app.use(express.static(path.join(__dirname, '/build_game')));

// 라우트 설정 (최종적으로 index.html 제공)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build_game', 'newGame.html'));
});

const wss = new WebSocketServer({ server });

// WebSocket 연결 이벤트 처리
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 클라이언트로부터 메시지를 받았을 때 실행되는 함수
  ws.on('message', (data) => {
    try {
      // 자이로스코프 데이터는 JSON 문자열로 전송되므로, 이를 파싱
      const parsedData = JSON.parse(data);
      
      if (parsedData.event === 'gyroscope_data') {
        console.log(`Received gyroscope data: x=${parsedData.x}, y=${parsedData.y}, z=${parsedData.z}`);
        ws.send('메시지를 잘 받았습니다!');
      } else {
        console.log(`Unknown event: ${parsedData.event}`);
      }
    } catch (err) {
      console.log('Error parsing message:', err);
    }
  });

  // 클라이언트 연결 종료 이벤트 처리
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
