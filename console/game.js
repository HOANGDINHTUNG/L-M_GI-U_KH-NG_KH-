let elBetMoneyRight = document.querySelector(".el-bet-money-right");
let elBetMoneyLeft = document.querySelector(".el-bet-money-left");
let containerBet = document.querySelector(".container-bet");

const money = document.querySelector(".money");
money.textContent = `${userLogin.assets.toLocaleString()}`;

const username = document.querySelector(".username");
username.textContent = `${userLogin.name}`;

let currentBetSide = null;
const MAX_BET = 9999999999; // Giới hạn tổng số tiền cược

// Ghi nhận bên cược
function showInputBetRight() {
  currentBetSide = "right";
  elBetMoneyRight.innerHTML = `
    <img src="../image/image-game/money.png" class="position-absolute">
    <span></span>
  `;
  elBetMoneyLeft.innerHTML = `
    <img src="../image/image-game/cuoc.png" class="position-absolute">
  `;
  containerBet.style.visibility = "visible";
}

function showInputBetLeft() {
  currentBetSide = "left";
  elBetMoneyLeft.innerHTML = `
    <img src="../image/image-game/money.png" class="position-absolute">
    <span></span>
  `;
  elBetMoneyRight.innerHTML = `
    <img src="../image/image-game/cuoc.png" class="position-absolute">
  `;
  containerBet.style.visibility = "visible";
}

// Xử lý khi click các mệnh giá
const amountButtons = document.querySelectorAll("[data-amount]");
amountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!currentBetSide) {
      alert("Hãy chọn bên cược trước!");
      return;
    }

    const amount = parseInt(btn.dataset.amount);
    let betDisplay;

    if (currentBetSide === "left") {
      betDisplay = elBetMoneyLeft.querySelector("span");
    } else {
      betDisplay = elBetMoneyRight.querySelector("span");
    }

    let currentAmount = parseInt(betDisplay.textContent.replace(/,/g, "")) || 0;

    if (amount > userLogin.assets) {
      alert("Không đủ tiền để cược số này!");
      return;
    }

    if (currentAmount + amount > MAX_BET) {
      alert("Vượt quá giới hạn cược!");
      return;
    }

    currentAmount += amount;
    betDisplay.textContent = currentAmount.toLocaleString();

    userLogin.assets -= amount;
    money.textContent = userLogin.assets.toLocaleString();
  });
});

// Nút x2
document.querySelector(".btn-bet").addEventListener("click", () => {
  const spanLeft = elBetMoneyLeft.querySelector("span");
  const spanRight = elBetMoneyRight.querySelector("span");

  const betLeft = spanLeft ? parseInt(spanLeft.textContent.replace(/,/g, "")) : 0;
  const betRight = spanRight ? parseInt(spanRight.textContent.replace(/,/g, "")) : 0;

  if (betLeft === 0 && betRight === 0) {
    alert("Bạn chưa đặt cược!");
    return;
  }

  // Xử lý bên Chẵn (Left)
  if (betLeft > 0) {
    const betMainLeft = document.querySelector(".el-bet-main-left span");
    let currentMainLeft = parseInt(betMainLeft.textContent.replace(/,/g, "")) || 0;

    let clone = spanLeft.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "50%";
    clone.style.transform = "translateX(-50%)";
    clone.style.transition = "top 0.5s ease";
    clone.style.zIndex = "10";

    elBetMoneyLeft.appendChild(clone);

    setTimeout(() => {
      clone.style.top = "100px";
    }, 10);

    setTimeout(() => {
      currentMainLeft += betLeft;
      betMainLeft.textContent = currentMainLeft.toLocaleString();
      clone.remove();
      elBetMoneyLeft.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;
    }, 600);
  }

  // Xử lý bên Lẻ (Right)
  if (betRight > 0) {
    const betMainRight = document.querySelector(".el-bet-main-right span");
    let currentMainRight = parseInt(betMainRight.textContent.replace(/,/g, "")) || 0;

    let clone = spanRight.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "50%";
    clone.style.transform = "translateX(-50%)";
    clone.style.transition = "top 0.5s ease";
    clone.style.zIndex = "10";

    elBetMoneyRight.appendChild(clone);

    setTimeout(() => {
      clone.style.top = "100px";
    }, 10);

    setTimeout(() => {
      currentMainRight += betRight;
      betMainRight.textContent = currentMainRight.toLocaleString();
      clone.remove();
      elBetMoneyRight.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;
    }, 600);
  }

  currentBetSide = null;
  
  // Sau khi đặt cược xong, bắt đầu trò chơi
  startDiceGame();
});

document.querySelector(".btn-cancel").addEventListener("click", () => {
  let refund = 0;

  // Lấy các phần tử hiển thị số tiền cược ở bên trái và bên phải
  const spanLeft = elBetMoneyLeft.querySelector("span");
  const spanRight = elBetMoneyRight.querySelector("span");

  // Tính tổng số tiền cược nếu có
  if (spanLeft && spanLeft.textContent) {
    refund += parseInt(spanLeft.textContent.replace(/,/g, "")) || 0;
  }

  if (spanRight && spanRight.textContent) {
    refund += parseInt(spanRight.textContent.replace(/,/g, "")) || 0;
  }

  // Hoàn lại số tiền cược vào tài khoản người dùng
  userLogin.assets += refund;
  money.textContent = userLogin.assets.toLocaleString(); // Cập nhật số dư tài khoản

  // Xóa tiền cược trên giao diện (thay ảnh hoặc nội dung khác)
  elBetMoneyLeft.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;
  elBetMoneyRight.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;

  // Reset lại trạng thái cược bên trái và bên phải
  currentBetSide = null;

  alert(`Số tiền cược đã được hoàn lại: ${refund.toLocaleString()} đồng.`);
});

// ===== PHẦN XÚC XẮC NGẪU NHIÊN =====

// ===== PHẦN XÚC XẮC NGẪU NHIÊN =====

const countdownElement = document.getElementById("countdown");
const plateImg = document.querySelector(".plate-img");
const diceBox = document.getElementById("diceBox");
let isGameRunning = false;

// Các hình ảnh xúc xắc
const diceImages = [
  '../image/image-game/dor1.png',
  '../image/image-game/dor2.png',
  '../image/image-game/dor3.png',
  '../image/image-game/dor4.png',
  '../image/image-game/dor5.png',
  '../image/image-game/dor6.png'
];

// Hiển thị tất cả xúc xắc trong diceBox khi trang tải lên
function displayAllDice() {
  // Xóa nội dung cũ nếu có
  diceBox.innerHTML = '';
  
  // Hiển thị tất cả 6 mặt xúc xắc theo hàng ngang
  diceImages.forEach((imgSrc, index) => {
    const diceImg = document.createElement('img');
    diceImg.src = imgSrc;
    diceImg.className = 'dice-img static-dice';
    diceImg.style.position = 'relative'; // Thay đổi từ absolute thành relative
    diceImg.style.display = 'none';
    diceImg.style.margin = '5px';
    diceImg.style.width = '60px';
    diceImg.style.height = '60px';
    
    diceBox.appendChild(diceImg);
  });
}

// Gọi hàm hiển thị tất cả xúc xắc khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  displayAllDice();
});

// Hàm tạo số ngẫu nhiên từ 1 đến 6
function getRandomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

// Tạo xúc xắc ở vị trí không chồng lấp
function getRandomNonOverlappingPosition(existing, size = 60, containerWidth = 200, containerHeight = 150) {
  let x, y, attempts = 0;
  let overlapping = false;

  do {
    x = Math.floor(Math.random() * (containerWidth - size));
    y = Math.floor(Math.random() * (containerHeight - size));
    overlapping = existing.some((pos) => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      return Math.sqrt(dx * dx + dy * dy) < size;
    });
    attempts++;
  } while (overlapping && attempts < 100);

  return { x, y };
}

// Bắt đầu trò chơi xúc xắc
function startDiceGame() {
  if (isGameRunning) return;
  isGameRunning = true;
  
  const plate = document.getElementById("plate");
  plate.style.display = "block";
  countdownElement.style.display = "block";
  
  // Lưu lại hiển thị xúc xắc tĩnh ban đầu
  const originalDiceHTML = diceBox.innerHTML;
  
  // Xóa xúc xắc cũ nếu có
  diceBox.innerHTML = '';
  
  // Đếm ngược
  let timeLeft = 10;
  countdownElement.textContent = timeLeft;
  
  const countdownTimer = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      
      // Ẩn đĩa và số đếm
      plate.style.display = "none";
      countdownElement.style.display = "none";
      
      // Hiển thị xúc xắc
      showDice();
    }
  }, 1000);
}

// Hiển thị xúc xắc với hiệu ứng lắc - Đã cải tiến
function showDice() {
  // Xóa nội dung cũ
  diceBox.innerHTML = '';
  
  // Thay đổi kiểu hiển thị của diceBox để hỗ trợ xúc xắc di chuyển
  diceBox.style.position = 'relative';
  diceBox.style.height = '200px';
  diceBox.style.border = '1px solid transparent';
  
  // Tạo hiệu ứng lắc cải tiến
  const shakeDuration = 1500; // 1.5 giây
  const shakeTimes = 15;
  let shakeCount = 0;
  
  // Tạo container cho mỗi xúc xắc để thêm hiệu ứng di chuyển riêng biệt
  const diceContainers = [];
  for (let i = 0; i < 3; i++) {
    const diceContainer = document.createElement('div');
    diceContainer.className = 'dice-container';
    diceContainer.style.position = 'absolute';
    diceContainer.style.width = '60px';
    diceContainer.style.height = '60px';
    
    // Đặt vị trí ban đầu cho từng xúc xắc
    if (i === 0) {
      diceContainer.style.left = '20%';
      diceContainer.style.top = '30%';
    } else if (i === 1) {
      diceContainer.style.left = '50%';
      diceContainer.style.top = '50%';
      diceContainer.style.transform = 'translate(-50%, -50%)';
    } else {
      diceContainer.style.left = '80%';
      diceContainer.style.top = '30%';
    }
    
    diceBox.appendChild(diceContainer);
    diceContainers.push(diceContainer);
  }
  
  // Tạo các giá trị cố định cho kết quả cuối cùng
  const finalDiceValues = [
    getRandomDiceValue(),
    getRandomDiceValue(),
    getRandomDiceValue()
  ];
  
  const shakeInterval = setInterval(() => {
    // Tạo hiệu ứng lắc tự nhiên hơn cho từng xúc xắc
    diceContainers.forEach((container, index) => {
      // Lấy giá trị xúc xắc ngẫu nhiên trong quá trình lắc, 
      // chỉ hiển thị kết quả cuối cùng ở lần cuối
      const diceValue = shakeCount < shakeTimes - 1 ? 
                          getRandomDiceValue() : 
                          finalDiceValues[index];
      
      // Xóa xúc xắc cũ
      container.innerHTML = '';
      
      // Tạo xúc xắc mới
      const diceImg = document.createElement('img');
      diceImg.src = diceImages[diceValue - 1];
      diceImg.className = 'dice-img shaking';
      diceImg.style.width = '100%';
      diceImg.style.height = '100%';
      
      // Thêm hiệu ứng di chuyển ngẫu nhiên trong quá trình lắc
      if (shakeCount < shakeTimes - 1) {
        const offsetX = Math.random() * 10 - 5; // Di chuyển ngẫu nhiên -5px đến 5px
        const offsetY = Math.random() * 10 - 5;
        const rotate = Math.random() * 30 - 15; // Xoay ngẫu nhiên -15 đến 15 độ
        
        diceImg.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
      }
      
      container.appendChild(diceImg);
    });
    
    shakeCount++;
    
    // Tăng dần thời gian hiển thị các mặt xúc xắc để tạo hiệu ứng chậm dần
    if (shakeCount >= shakeTimes) {
      clearInterval(shakeInterval);
      // Hiển thị kết quả cuối cùng với hiệu ứng nảy lên
      showFinalDiceResults(finalDiceValues, diceContainers);
    }
  }, shakeDuration / shakeTimes);
}

// Hiển thị kết quả xúc xắc cuối cùng - Đã cải tiến
function showFinalDiceResults(diceResults, diceContainers) {
  // Xóa xúc xắc cũ
  diceContainers.forEach((container, index) => {
    container.innerHTML = '';
    
    // Tạo xúc xắc kết quả với hiệu ứng cuối
    const diceImg = document.createElement('img');
    diceImg.src = diceImages[diceResults[index] - 1];
    diceImg.className = 'dice-img final';
    diceImg.style.width = '100%';
    diceImg.style.height = '100%';
    
    // Thêm hiệu ứng xoay riêng biệt cho từng xúc xắc
    const rotation = (index - 1) * 15; // -15, 0, 15 độ
    diceImg.style.transform = `rotate(${rotation}deg)`;
    
    container.appendChild(diceImg);
  });
  
  // Tính tổng điểm
  const totalPoints = diceResults.reduce((sum, value) => sum + value, 0);
  
  // Xác định kết quả Tài (lớn) hay Xỉu (nhỏ)
  const result = totalPoints >= 11 ? 'Tài' : 'Xỉu';
  
  // Hiển thị kết quả với hiệu ứng đẹp mắt
  setTimeout(() => {
    // Tạo thông báo kết quả
    const resultDisplay = document.createElement('div');
    resultDisplay.className = 'dice-result';
    resultDisplay.innerHTML = `
      <div class="${result === 'Tài' ? 'result-tai' : 'result-xiu'}">
        <h2>${result}</h2>
        <p>${totalPoints} điểm</p>
        <p>${diceResults.join(' + ')}</p>
      </div>
    `;
    resultDisplay.style.position = 'absolute';
    resultDisplay.style.top = '50%';
    resultDisplay.style.left = '50%';
    resultDisplay.style.transform = 'translate(-50%, -50%)';
    resultDisplay.style.background = 'transparent';
    resultDisplay.style.color = result === 'Tài' ? '#FF5722' : '#4CAF50';
    resultDisplay.style.padding = '15px 20px';
    resultDisplay.style.borderRadius = '10px';
    resultDisplay.style.fontWeight = 'bold';
    resultDisplay.style.zIndex = '200';
    resultDisplay.style.textAlign = 'center';
    resultDisplay.style.animation = 'fadeIn 0.5s, pulse 1s infinite alternate';
    resultDisplay.style.textShadow = `0 0 10px ${result === 'Tài' ? '#FF5722' : '#4CAF50'}`;
    resultDisplay.style.display="none"
    diceBox.appendChild(resultDisplay);
    
    // Xử lý tiền thắng/thua sau khi ra kết quả
    handleBetResult(result);
    
    // Đặt lại trạng thái trò chơi sau 5 giây
    setTimeout(() => {
      resetGameState();
    }, 5000);
  }, 1000);
}

// Xử lý kết quả cược
function handleBetResult(result) {
  // Lấy tiền cược từ mỗi bên
  const betLeftElement = document.querySelector(".el-bet-main-left span");
  const betRightElement = document.querySelector(".el-bet-main-right span");
  
  const betLeft = betLeftElement ? parseInt(betLeftElement.textContent.replace(/,/g, "")) || 0 : 0;
  const betRight = betRightElement ? parseInt(betRightElement.textContent.replace(/,/g, "")) || 0 : 0;
  
  let winAmount = 0;
  
  // Chẵn ở bên trái (Xỉu), Lẻ ở bên phải (Tài)
  if (result === 'Tài' && betLeft > 0) {
    // Người chơi thắng khi đặt bên Chẵn (left) và kết quả là Xỉu
    winAmount = betLeft * 1.9; // Tỷ lệ thắng 1.9
  } else if (result === 'Xỉu' && betRight > 0) {
    // Người chơi thắng khi đặt bên Lẻ (right) và kết quả là Tài
    winAmount = betRight * 1.9; // Tỷ lệ thắng 1.9
  }
  
  // Cộng tiền thắng vào tài khoản người chơi
  if (winAmount > 0) {
    userLogin.assets += Math.floor(winAmount);
    money.textContent = userLogin.assets.toLocaleString();
    
    // Thông báo thắng
    setTimeout(() => {
      alert(`Chúc mừng! Bạn đã thắng ${Math.floor(winAmount).toLocaleString()} đồng.`);
    }, 1500);
  } else if (betLeft > 0 || betRight > 0) {
    // Thông báo thua nếu có đặt cược
    setTimeout(() => {
      alert(`Rất tiếc, bạn đã thua trong lượt này.`);
    }, 1500);
  }
  
  // Xóa số tiền cược hiển thị trên giao diện
  if (betLeftElement) betLeftElement.textContent = "";
  if (betRightElement) betRightElement.textContent = "";
}

// Đặt lại trạng thái trò chơi
function resetGameState() {
  // Xóa kết quả hiển thị
  diceBox.innerHTML = '';
  
  // Khôi phục hiển thị tất cả các mặt xúc xắc như ban đầu
  displayAllDice();
  
  // Đặt lại đĩa và bộ đếm
  const plate = document.getElementById("plate");
  plate.style.display = "block";
  countdownElement.style.display = "none";
  
  // Đặt lại trạng thái cược
  const elBetMoneyLeft = document.querySelector(".el-bet-money-left");
  const elBetMoneyRight = document.querySelector(".el-bet-money-right");
  
  if (elBetMoneyLeft) {
    elBetMoneyLeft.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;
  }
  
  if (elBetMoneyRight) {
    elBetMoneyRight.innerHTML = `<img src="../image/image-game/cuoc.png" class="position-absolute">`;
  }
  
  const betMainLeft = document.querySelector(".el-bet-main-left span");
  const betMainRight = document.querySelector(".el-bet-main-right span");
  if (betMainLeft) betMainLeft.textContent = "";
  if (betMainRight) betMainRight.textContent = "";
  
  // Đặt lại biến theo dõi trạng thái
  isGameRunning = false;
  currentBetSide = null;
}

// Thêm CSS cho hiệu ứng nâng cao
const style = document.createElement('style');
style.textContent = `
  .dice-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 10px;
    min-height: 70px;
    position: relative;
    perspective: 600px; /* Thêm hiệu ứng 3D */
  }
  
  .dice-container {
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
  }
  
  .dice-img {
    width: 60px;
    height: 60px;
    filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));
    backface-visibility: hidden;
  }
  
  .static-dice {
    display: inline-block;
    margin: 5px;
    transition: transform 0.3s ease;
  }
  
  .static-dice:hover {
    transform: scale(1.1) rotate(5deg);
  }
  
  .shaking {
    animation: shake 0.1s infinite alternate;
  }
  
  .final {
    animation: reveal 0.5s ease-out forwards;
  }
  
  @keyframes shake {
    0% { transform: rotate(-5deg) translate(-2px, -2px) scale(0.95); }
    25% { transform: rotate(-2deg) translate(-1px, 1px) scale(0.98); }
    50% { transform: rotate(0deg) translate(0px, -1px) scale(1); }
    75% { transform: rotate(2deg) translate(1px, 1px) scale(0.98); }
    100% { transform: rotate(5deg) translate(2px, -1px) scale(0.95); }
  }
  
  @keyframes reveal {
    0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(1) rotate(360deg); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  
  @keyframes pulse {
    from { transform: translate(-50%, -50%) scale(1); text-shadow: 0 0 10px currentColor; }
    to { transform: translate(-50%, -50%) scale(1.05); text-shadow: 0 0 20px currentColor; }
  }
  
  .result-tai {
    color: #FF5722;
    text-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
  }
  
  .result-xiu {
    color: #4CAF50;
    text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }
  
  .dice-result h2 {
    font-size: 32px;
    margin: 0 0 10px 0;
    letter-spacing: 2px;
  }
  
  .dice-result p {
    margin: 5px 0;
    font-size: 18px;
  }
`;
document.head.appendChild(style);

// Thêm nút lắc xúc xắc để kiểm tra
const quickRollButton = document.createElement('button');
quickRollButton.textContent = 'Test Xúc Xắc';
quickRollButton.className = 'quick-roll-button';
quickRollButton.style.position = 'fixed';
quickRollButton.style.bottom = '10px';
quickRollButton.style.right = '10px';
quickRollButton.style.padding = '10px 15px';
quickRollButton.style.backgroundColor = '#ff9800';
quickRollButton.style.color = 'white';
quickRollButton.style.border = 'none';
quickRollButton.style.borderRadius = '5px';
quickRollButton.style.zIndex = '1000';
quickRollButton.style.cursor = 'pointer';
quickRollButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
quickRollButton.style.transition = 'all 0.3s ease';
quickRollButton.addEventListener('click', () => {
  if (!isGameRunning) {
    startDiceGame();
  }
});
quickRollButton.addEventListener('mouseover', () => {
  quickRollButton.style.backgroundColor = '#f57c00';
  quickRollButton.style.transform = 'scale(1.05)';
});
quickRollButton.addEventListener('mouseout', () => {
  quickRollButton.style.backgroundColor = '#ff9800';
  quickRollButton.style.transform = 'scale(1)';
});
document.body.appendChild(quickRollButton);

// Khởi tạo hiển thị khi tải trang
displayAllDice();
