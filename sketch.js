let facemesh;
let video;
let predictions = [];
const pointIndices = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(640, 480);

  // 初始化攝影機
  video = createCapture(VIDEO, (stream) => {
    console.log("Camera access granted");
  }, (err) => {
    console.error("Camera access denied:", err);
  });

  video.size(width, height);
  video.hide();

  // 初始化 facemesh 模型
  facemesh = ml5.facemesh(video, modelReady);

  // 監聽模型的預測結果
  facemesh.on('predict', (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log('Facemesh model loaded!');
}

function draw() {
  image(video, 0, 0, width, height);

  // 繪製臉部特徵點的連線
  drawConnections();
}

function drawConnections() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(255, 0, 0); // 設定線條顏色為紅色
    strokeWeight(5); // 設定線條粗細為 5
    noFill();

    // 使用 line() 指令將所有點串接起來
    for (let i = 0; i < pointIndices.length - 1; i++) {
      const startIdx = pointIndices[i];
      const endIdx = pointIndices[i + 1];

      if (keypoints[startIdx] && keypoints[endIdx]) {
        const [x1, y1] = keypoints[startIdx];
        const [x2, y2] = keypoints[endIdx];
        line(x1, y1, x2, y2);
      }
    }

    // 將最後一個點連接回第一個點
    const firstIdx = pointIndices[0];
    const lastIdx = pointIndices[pointIndices.length - 1];
    if (keypoints[firstIdx] && keypoints[lastIdx]) {
      const [x1, y1] = keypoints[firstIdx];
      const [x2, y2] = keypoints[lastIdx];
      line(x1, y1, x2, y2);
    }
  }
}
