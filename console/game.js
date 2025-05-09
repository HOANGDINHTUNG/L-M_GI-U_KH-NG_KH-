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
  "../image/image-game/dor1.png",
  "../image/image-game/dor2.png",
  "../image/image-game/dor3.png",
  "../image/image-game/dor4.png",
  "../image/image-game/dor5.png",
  "../image/image-game/dor6.png",
];

// Hiển thị tất cả xúc xắc trong diceBox khi trang tải lên
function displayAllDice() {
  // Xóa nội dung cũ nếu có
  diceBox.innerHTML = "";

  // Hiển thị tất cả 6 mặt xúc xắc theo hàng ngang
  diceImages.forEach((imgSrc, index) => {
    const diceImg = document.createElement("img");
    diceImg.src = imgSrc;
    diceImg.className = "dice-img static-dice";
    diceImg.style.position = "relative"; // Thay đổi từ absolute thành relative
    diceImg.style.display = "none";
    diceImg.style.margin = "5px";
    diceImg.style.width = "60px";
    diceImg.style.height = "60px";

    diceBox.appendChild(diceImg);
  });
}

// Gọi hàm hiển thị tất cả xúc xắc khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  displayAllDice();
});

// Hàm tạo số ngẫu nhiên từ 1 đến 6
function getRandomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

// Tạo xúc xắc ở vị trí không chồng lấp với khoảng cách an toàn
function getRandomNonOverlappingPosition(
  existingPositions,
  diceSize = 60,
  containerWidth = 250,
  containerHeight = 150,
  safeDistance = 10
) {
  let x,
    y,
    attempts = 0;
  let overlapping = true;
  const maxAttempts = 100;

  // Đảm bảo kích thước xúc xắc + khoảng cách an toàn không lớn hơn kích thước container
  const effectiveSize = diceSize + safeDistance;

  while (overlapping && attempts < maxAttempts) {
    // Tạo vị trí ngẫu nhiên trong phạm vi container
    x = Math.floor(Math.random() * (containerWidth - diceSize));
    y = Math.floor(Math.random() * (containerHeight - diceSize));

    // Kiểm tra xem vị trí mới có đủ xa các vị trí hiện tại không
    overlapping = existingPositions.some((pos) => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Kiểm tra xem khoảng cách có nhỏ hơn tổng kích thước hai xúc xắc + khoảng cách an toàn không
      return distance < diceSize + safeDistance;
    });

    attempts++;
  }

  // Nếu sau nhiều lần thử mà vẫn không tìm được vị trí phù hợp, áp dụng chiến lược backup
  if (attempts >= maxAttempts) {
    // Phân chia không gian thành lưới và đặt xúc xắc vào các vị trí cố định
    const gridPositions = [
      {x: 20, y: 20},
      {x: containerWidth - diceSize - 20, y: 20},
      {x: containerWidth / 2 - diceSize / 2, y: containerHeight - diceSize - 20},
    ];

    // Lấy vị trí lưới tương ứng với số lượng xúc xắc hiện tại
    return (
      gridPositions[existingPositions.length] || {
        x: containerWidth / 2 - diceSize / 2,
        y: containerHeight / 2 - diceSize / 2,
      }
    );
  }

  return {x, y};
}

// Bắt đầu trò chơi xúc xắc
function startDiceGame() {
  if (isGameRunning) return;
  isGameRunning = true;

  const plate = document.getElementById("plate");
  plate.style.display = "block";
  countdownElement.style.display = "block";

  // Lưu lại hiển thị xúc xắc tĩnh ban đầu nếu cần
  const originalDiceHTML = diceBox.innerHTML;

  // Xóa xúc xắc cũ nếu có
  diceBox.innerHTML = "";

  // Đếm ngược
  let timeLeft = 10;
  countdownElement.textContent = timeLeft;

  // Thêm class cho đồng hồ đếm ngược khi thời gian sắp hết
  if (timeLeft <= 3) {
    countdownElement.classList.add("time-end");
  } else {
    countdownElement.classList.remove("time-end");
  }

  const countdownTimer = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    // Thêm hiệu ứng màu đỏ khi thời gian còn ít
    if (timeLeft <= 3) {
      countdownElement.classList.add("time-end");
    }

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

// Hiển thị xúc xắc với hiệu ứng lắc - Cải tiến về vị trí
function showDice() {
  // Xóa nội dung cũ
  diceBox.innerHTML = "";

  // Thiết lập kích thước và vị trí box chứa xúc xắc
  diceBox.style.position = "absolute";
  diceBox.style.width = "250px";
  diceBox.style.height = "150px";
  diceBox.style.border = "1px solid transparent";
  diceBox.style.overflow = "visible";

  // Tạo hiệu ứng lắc cải tiến
  const shakeDuration = 1500; // 1.5 giây
  const shakeTimes = 15;
  let shakeCount = 0;

  // Kích thước xúc xắc
  const diceSize = 60;

  // Mảng lưu trữ vị trí xúc xắc để tránh chồng lấp
  const dicePositions = [];

  // Tạo container cho mỗi xúc xắc với vị trí không chồng lấp
  const diceContainers = [];
  for (let i = 0; i < 3; i++) {
    // Tính toán vị trí không chồng lấp
    const position = getRandomNonOverlappingPosition(
      dicePositions,
      diceSize,
      parseInt(diceBox.style.width),
      parseInt(diceBox.style.height),
      15 // Khoảng cách an toàn giữa các x  úc xắc
    );

    // Lưu vị trí để kiểm tra cho xúc xắc tiếp theo
    dicePositions.push(position);

    // Tạo container cho xúc xắc
    const diceContainer = document.createElement("div");
    diceContainer.className = "dice-container";
    diceContainer.style.position = "absolute";
    diceContainer.style.width = `${diceSize}px`;
    diceContainer.style.height = `${diceSize}px`;
    diceContainer.style.left = `${position.x}px`;
    diceContainer.style.top = `${position.y}px`;
    diceContainer.style.transition = "transform 0.2s ease-in-out";

    diceBox.appendChild(diceContainer);
    diceContainers.push(diceContainer);
  }

  // Tạo các giá trị cố định cho kết quả cuối cùng
  const finalDiceValues = [getRandomDiceValue(), getRandomDiceValue(), getRandomDiceValue()];

  const shakeInterval = setInterval(() => {
    // Tạo hiệu ứng lắc tự nhiên hơn cho từng xúc xắc
    diceContainers.forEach((container, index) => {
      // Lấy giá trị xúc xắc ngẫu nhiên trong quá trình lắc,
      // chỉ hiển thị kết quả cuối cùng ở lần cuối
      const diceValue = shakeCount < shakeTimes - 1 ? getRandomDiceValue() : finalDiceValues[index];

      // Xóa xúc xắc cũ
      container.innerHTML = "";

      // Tạo xúc xắc mới
      const diceImg = document.createElement("img");
      diceImg.src = diceImages[diceValue - 1];
      diceImg.className = "dice-img shaking";
      diceImg.style.width = "100%";
      diceImg.style.height = "100%";

      // Thêm hiệu ứng di chuyển ngẫu nhiên trong quá trình lắc
      if (shakeCount < shakeTimes - 1) {
        // Hiệu ứng rung lắc trong khu vực nhỏ
        const offsetX = Math.random() * 8 - 4; // Di chuyển ngẫu nhiên -4px đến 4px
        const offsetY = Math.random() * 8 - 4;
        const rotate = Math.random() * 40 - 20; // Xoay ngẫu nhiên -20 đến 20 độ

        // Áp dụng hiệu ứng rung lắc
        container.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
      } else {
        // Dừng hiệu ứng rung lắc ở lần cuối
        container.style.transform = "none";
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

// Hiển thị kết quả xúc xắc cuối cùng - Cải tiến
function showFinalDiceResults(diceResults, diceContainers) {
  // Xóa xúc xắc cũ và hiển thị kết quả cuối cùng
  diceContainers.forEach((container, index) => {
    container.innerHTML = "";

    // Tạo xúc xắc kết quả với hiệu ứng cuối
    const diceImg = document.createElement("img");
    diceImg.src = diceImages[diceResults[index] - 1];
    diceImg.className = "dice-img final";
    diceImg.style.width = "100%";
    diceImg.style.height = "100%";

    // Thêm hiệu ứng xoay riêng biệt cho từng xúc xắc
    const rotation = (index - 1) * 45; // -15, 0, 15 độ
    diceImg.style.transform = `rotate(${rotation}deg)`;

    container.appendChild(diceImg);
  });

  // Tính tổng điểm
  const totalPoints = diceResults.reduce((sum, value) => sum + value, 0);

  // Xác định kết quả Tài (lớn) hay Xỉu (nhỏ)
  const result = totalPoints >= 11 ? "Tài" : "Xỉu";

  // Hiển thị kết quả với hiệu ứng đẹp mắt
  setTimeout(() => {
    // Tạo thông báo kết quả
    // const resultDisplay = document.createElement("div");
    // resultDisplay.className = "dice-result";
    // resultDisplay.innerHTML = `
    //   <div class="${result === "Tài" ? "result-tai" : "result-xiu"}">
    //     <h2>${result}</h2>
    //     <p>${totalPoints} điểm</p>
    //     <p>${diceResults.join(" + ")}</p>
    //   </div>
    // `;

    // diceBox.appendChild(resultDisplay);

    // Xử lý tiền thắng/thua sau khi ra kết quả
    if (typeof handleBetResult === "function") {
      handleBetResult(result);
    }

    // Đặt lại trạng thái trò chơi sau 5 giây
    setTimeout(() => {
      if (typeof resetGameState === "function") {
        resetGameState();
      } else {
        // Nếu hàm resetGameState chưa được định nghĩa, thực hiện reset cơ bản
        isGameRunning = false;
        diceBox.innerHTML = "";
      }
    }, 5000);
  }, 100);
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
  if (result === "Tài" && betLeft > 0) {
    // Người chơi thắng khi đặt bên Chẵn (left) và kết quả là Xỉu
    winAmount = betLeft * 1.9; // Tỷ lệ thắng 1.9
  } else if (result === "Xỉu" && betRight > 0) {
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

// Hàm reset trạng thái trò chơi
function resetGameState() {
  isGameRunning = false;
  diceBox.innerHTML = "";

  // Kiểm tra xem người chơi còn đủ tiền để chơi tiếp không
  const moneyDisplay = document.querySelector(".money");
  if (moneyDisplay) {
    const currentMoney = parseInt(moneyDisplay.textContent.replace(/\D/g, "")) || 0;
    if (currentMoney <= 0) {
      // Hiển thị thông báo hết tiền nếu cần
      alert("Bạn đã hết tiền! Vui lòng nạp thêm để tiếp tục chơi.");
    }
  }

  // Sẵn sàng cho ván tiếp theo - có thể tự động bắt đầu sau một khoảng thời gian
  setTimeout(() => {
    startDiceGame();
  }, 3000);
}

// Thêm CSS cho hiệu ứng nâng cao
const style = document.createElement("style");
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
const quickRollButton = document.createElement("button");
quickRollButton.textContent = "Test Xúc Xắc";
quickRollButton.className = "quick-roll-button";
quickRollButton.style.position = "fixed";
quickRollButton.style.bottom = "10px";
quickRollButton.style.right = "10px";
quickRollButton.style.padding = "10px 15px";
quickRollButton.style.backgroundColor = "#ff9800";
quickRollButton.style.color = "white";
quickRollButton.style.border = "none";
quickRollButton.style.borderRadius = "5px";
quickRollButton.style.zIndex = "1000";
quickRollButton.style.cursor = "pointer";
quickRollButton.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
quickRollButton.style.transition = "all 0.3s ease";
quickRollButton.addEventListener("click", () => {
  if (!isGameRunning) {
    startDiceGame();
  }
});
quickRollButton.addEventListener("mouseover", () => {
  quickRollButton.style.backgroundColor = "#f57c00";
  quickRollButton.style.transform = "scale(1.05)";
});
quickRollButton.addEventListener("mouseout", () => {
  quickRollButton.style.backgroundColor = "#ff9800";
  quickRollButton.style.transform = "scale(1)";
});
document.body.appendChild(quickRollButton);

// Khởi tạo hiển thị khi tải trang
displayAllDice();
