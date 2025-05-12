let facemesh;
let video;
let predictions = [];

// 定義三組點的編號
const pointIndicesGroup1 = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];
const pointIndicesGroup2 = [
  243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112,
  133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155
];
const pointIndicesGroup3 = [
  359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255,
  263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249
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

  // 繪製三組臉部特徵點的連線
  drawConnections(pointIndicesGroup1, color(255, 0, 0)); // 紅色
  drawConnections(pointIndicesGroup2, color(0, 255, 0)); // 綠色
  drawConnections(pointIndicesGroup3, color(128, 0, 128)); // 紫色
}

function drawConnections(pointIndices, lineColor) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(lineColor); // 設定線條顏色
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
