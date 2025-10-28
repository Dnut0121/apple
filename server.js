const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙을 위한 미들웨어
app.use(express.static(path.join(__dirname, 'public')));

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🍎 사과 게임 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
    console.log(`게임을 즐기려면 브라우저에서 위 주소를 방문하세요.`);
});

// 에러 핸들링
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('서버 오류가 발생했습니다!');
});

// 404 핸들링
app.use((req, res) => {
    res.status(404).send('페이지를 찾을 수 없습니다!');
});
