// 宣告全域變數：存放題目資料陣列
let questions = [];
// 宣告全域變數：當前進行到的題目索引 (0 到 4)
let currentQuestion = 0;
// 宣告全域變數：紀錄答對的總題數
let correctCount = 0;
// 宣告全域變數：使用者點選的選項索引 (-1 表示尚未選擇)
let selectedOption = -1;
// 宣告全域變數：標記當前題目是否已經回答
let isAnswered = false;
// 宣告全域變數：答錯時正確選項上下跳動的 Y 軸位移量
let bounceOffset = 0;
// 宣告全域變數：標記測驗是否已經完成
let quizFinished = false;

// 初始化設定函式，僅執行一次
function setup() {
  // 建立全螢幕畫布，尺寸隨視窗寬高自動調整
  createCanvas(windowWidth, windowHeight);
  // 設定文字對齊方式為水平居中、垂直居中
  textAlign(CENTER, CENTER);
  // 指定清晰繁體中文字體，增強文字顯示效果
  textFont('"Microsoft JhengHei", "PingFang TC", "Helvetica Neue", sans-serif');
  
  // 建立 5 題 p5.js 核心語法與觀念測驗題目資料
  questions = [
    {
      question: "1. 在 p5.js 程式生命週期中，哪一個函式只會在啟動時執行一次？",
      options: [
        "A) draw() - 每秒重複執行",
        "B) setup() - 初始設定與建立畫布",
        "C) start() - 非 p5.js 內建函式",
        "D) create() - 非初始控制函式"
      ],
      answer: 1
    },
    {
      question: "2. 若要自訂視覺畫布的大小尺寸，應該呼叫哪一個繪製指令？",
      options: [
        "A) setCanvas()",
        "B) makeCanvas()",
        "C) createCanvas()",
        "D) initCanvas()"
      ],
      answer: 2
    },
    {
      question: "3. 欲設定封閉幾何圖形（如圓形、矩形）內部的填滿色彩，請選出正確指令：",
      options: [
        "A) fill() - 設定圖形填滿色彩",
        "B) color() - 建立顏色物件",
        "C) background() - 清空並填滿背景",
        "D) stroke() - 繪製邊框線條色彩"
      ],
      answer: 0
    },
    {
      question: "4. 在互動視覺創作中，哪一個內建系統變數可即時取得滑鼠當前的 X 軸座標？",
      options: [
        "A) mousePos.x",
        "B) xMouse",
        "C) mouseX",
        "D) getMouseX()"
      ],
      answer: 2
    },
    {
      question: "5. 若需要在畫布上繪製出標準的正圓形或橢圓形，應選用哪一個繪圖函式？",
      options: [
        "A) rect() - 繪製四角矩形",
        "B) circle() - 繪製標準圓形",
        "C) line() - 繪製直線段",
        "D) triangle() - 繪製三邊三角形"
      ],
      answer: 1
    }
  ];
}

// 主繪製函式，每秒循環執行約 60 次
function draw() {
  // 清除背景並塗上淺灰藍色
  background(240, 244, 248);

  // 判斷測驗是否已經結束
  if (quizFinished) {
    drawResultScreen();
    return;
  }

  // 利用正弦函數以影格數計算 smooth 上下跳動位移量
  bounceOffset = sin(frameCount * 0.15) * 8;

  // 取得目前索引對應的題目物件
  let q = questions[currentQuestion];

  // --- 1. 繪製題目卡片 ---
  fill(255);
  stroke(220);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height * 0.16, width * 0.85, 90, 12);

  noStroke();
  fill(30);
  textStyle(BOLD);
  textSize(20);
  text(q.question, width / 2, height * 0.16);

  // --- 2. 繪製 4 個選項按鈕 ---
  let optionWidth = width * 0.75;
  let optionHeight = 50;
  let startY = height * 0.31;
  let spacing = 62;

  for (let i = 0; i < 4; i++) {
    let x = width / 2;
    let y = startY + i * spacing;

    let bgColor = color(255);
    let textColor = color(50);
    let currentY = y;

    // 判斷玩家是否已經點選選項作答
    if (isAnswered) {
      if (i === q.answer) {
        if (selectedOption === q.answer) {
          bgColor = color(212, 237, 218); // 答對綠色
        } else {
          bgColor = color("#caf0f8");      // 提示正確答案藍色
          currentY += bounceOffset;
        }
      } else if (i === selectedOption) {
        bgColor = color(248, 215, 218);   // 選錯紅色
      }
    }

    stroke(200);
    strokeWeight(1.5);
    fill(bgColor);
    rect(x, currentY, optionWidth, optionHeight, 10);

    noStroke();
    fill(textColor);
    textStyle(NORMAL);
    textSize(17);
    text(q.options[i], x, currentY);
  }

  // --- 3. 繪製提示文字或「下一題」控制按鈕 ---
  if (!isAnswered) {
    // 【未作答】在最後一個選項下方獨立區塊繪製「加大、加粗、無重疊」的提示文字
    let promptY = startY + 3.5 * spacing + 35; // 確保位於第 4 個選項（3*spacing）下方安全距離
    
    noStroke();
    fill("#1A365D"); // 深藍色提升質感與對比度
    textStyle(BOLD);  // 粗體字
    textSize(20);     // 加大字級至 20px
    text("👉 請點擊上方其中一個選項進行作答", width / 2, promptY);
  } else {
    // 【已作答】顯示下一題按鈕
    let btnX = width / 2;
    let btnY = height * 0.88;
    let btnWidth = 180;
    let btnHeight = 48;

    fill(41, 128, 185);
    noStroke();
    rect(btnX, btnY, btnWidth, btnHeight, 25);

    fill(255);
    textStyle(BOLD);
    textSize(18);
    let btnText = (currentQuestion < questions.length - 1) ? "下一題 ➔" : "觀看總結試算 ➔";
    text(btnText, btnX, btnY);
  }
}

// 監聽滑鼠按下的事件函式
function mousePressed() {
  if (quizFinished) return;

  let optionWidth = width * 0.75;
  let optionHeight = 50;
  let startY = height * 0.31;
  let spacing = 62;

  if (!isAnswered) {
    // 檢查點擊是否落在 4 個選項範圍內
    for (let i = 0; i < 4; i++) {
      let x = width / 2;
      let y = startY + i * spacing;

      if (
        mouseX > x - optionWidth / 2 &&
        mouseX < x + optionWidth / 2 &&
        mouseY > y - optionHeight / 2 &&
        mouseY < y + optionHeight / 2
      ) {
        selectedOption = i;
        isAnswered = true;

        if (selectedOption === questions[currentQuestion].answer) {
          correctCount++;
        }
        break;
      }
    }
  } else {
    // 檢查點擊是否落在「下一題」按鈕範圍內
    let btnX = width / 2;
    let btnY = height * 0.88;
    let btnWidth = 180;
    let btnHeight = 48;

    if (
      mouseX > btnX - btnWidth / 2 &&
      mouseX < btnX + btnWidth / 2 &&
      mouseY > btnY - btnHeight / 2 &&
      mouseY < btnY + btnHeight / 2
    ) {
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        selectedOption = -1;
        isAnswered = false;
      } else {
        quizFinished = true;
      }
    }
  }
}

// 當瀏覽器視窗大小發生改變時自動觸發
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 繪製最終答對題數與結算畫面
function drawResultScreen() {
  fill(30);
  noStroke();
  textStyle(BOLD);
  textSize(32);
  text("🎉 測驗完成！", width / 2, height * 0.35);

  textStyle(NORMAL);
  textSize(22);
  text("最終得分結果：" + correctCount + " / " + questions.length + " 題", width / 2, height * 0.46);

  let btnX = width / 2;
  let btnY = height * 0.60;
  let btnWidth = 200;
  let btnHeight = 52;

  fill(46, 204, 113);
  noStroke();
  rect(btnX, btnY, btnWidth, btnHeight, 26);

  fill(255);
  textStyle(BOLD);
  textSize(20);
  text("🔄 重新挑戰一次", btnX, btnY);

  // 判斷使用者點擊重新挑戰按鈕
  if (
    mouseIsPressed &&
    mouseX > btnX - btnWidth / 2 &&
    mouseX < btnX + btnWidth / 2 &&
    mouseY > btnY - btnHeight / 2 &&
    mouseY < btnY + btnHeight / 2
  ) {
    resetQuiz();
  }
}

// 重設測驗狀態與數據
function resetQuiz() {
  currentQuestion = 0;
  correctCount = 0;
  selectedOption = -1;
  isAnswered = false;
  quizFinished = false;
}