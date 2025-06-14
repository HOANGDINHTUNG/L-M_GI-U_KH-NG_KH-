let elBetMoneyRight = document.querySelector(".el-bet-money-right");
let elBetMoneyLeft = document.querySelector(".el-bet-money-left");
let containerBet = document.querySelector(".container-bet");

// Hàm tải thông tin tài khoản người dùng từ localStorage
function loadUserData() {
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
  if (userLogin) {
    // Cập nhật thông tin người dùng từ dữ liệu đã lưu
    userLogin.assets = userLogin.assets;

    // Cập nhật hiển thị trên giao diện
    const money = document.querySelector(".money");
    if (money) {
      money.textContent = userLogin.assets.toLocaleString();
    }
  } else {
    alert("Không tìm thấy dữ liệu người dùng đã lưu");
  }
}

const money = document.querySelector(".money");
money.textContent = `${userLogin.assets.toLocaleString()}`;

const username = document.querySelector(".username");
username.textContent = `${userLogin.name}`;

let currentBetSide = null;
const MAX_BET = 9999999999; // Giới hạn tổng số tiền cược

// Tạo biến để lưu trạng thái tiền đặt cược chưa được xác nhận
let unconfirmedBets = {
  left: 0,
  right: 0,
};

// Ghi nhận bên cược
function showInputBetRight() {
  currentBetSide = "right";
  elBetMoneyRight.innerHTML = `
    <img src="image/image-game/money.png" class="position-absolute">
    <span></span>
  `;
  elBetMoneyLeft.innerHTML = `
    <img src="image/image-game/cuoc.png" class="position-absolute">
  `;
  containerBet.style.visibility = "visible";
}

function showInputBetLeft() {
  currentBetSide = "left";
  elBetMoneyLeft.innerHTML = `
    <img src="image/image-game/money.png" class="position-absolute">
    <span></span>
  `;
  elBetMoneyRight.innerHTML = `
    <img src="image/image-game/cuoc.png" class="position-absolute">
  `;
  containerBet.style.visibility = "visible";
}

// Xử lý nút hand-delete để dừng việc đặt cược
const btnHandDelete = document.querySelector(".btn-hand-delete");
let bettingEnabled = true; // Biến để kiểm soát trạng thái đặt cược
let pendingRefund = false; // Biến kiểm soát trạng thái hoàn tiền sau ván
btnHandDelete.addEventListener("click", () => {
  const img = btnHandDelete.querySelector("img");
  // Lấy tên file cuối cùng trong đường dẫn ảnh
  const fileName = img.src.split("/").pop();

  if (fileName === "hand-delete.png") {
    // Chuyển sang chế độ không cho phép đặt cược
    img.src = "image/image-game/hand.png";
    bettingEnabled = false;

    // Không hoàn tiền ngay lập tức mà chỉ vô hiệu hóa các nút đặt cược
    pendingRefund = true;

    // Vô hiệu hóa các nút đặt cược
    disableBettingButtons();
  } else {
    // Cho phép đặt cược trở lại
    img.src = "image/image-game/hand-delete.png";
    bettingEnabled = true;
    pendingRefund = false;

    // Kích hoạt lại các nút đặt cược
    enableBettingButtons();
  }
});

// Thêm hàm mới để hoàn lại tiền cược chưa xác nhận
function refundUnconfirmedBets() {
  const totalRefund = unconfirmedBets.left + unconfirmedBets.right;

  if (totalRefund > 0) {
    // Hoàn lại tiền vào tài khoản người dùng
    userLogin.assets += totalRefund;
    money.textContent = userLogin.assets.toLocaleString();

    // Xóa tiền cược hiển thị trên giao diện
    elBetMoneyLeft.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
    elBetMoneyRight.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;

    // Lưu dữ liệu người dùng sau khi cập nhật
    localStorage.setItem("userLogin", JSON.stringify(userLogin));

    // Reset biến lưu tiền cược chưa xác nhận
    unconfirmedBets.left = 0;
    unconfirmedBets.right = 0;

    // Reset biến lưu bên đang đặt cược
    currentBetSide = null;
  }
}

// Hàm vô hiệu hóa các nút đặt cược
function disableBettingButtons() {
  // Vô hiệu hóa nút đặt cược bên trái và phải
  elBetMoneyLeft.style.pointerEvents = "none";
  elBetMoneyRight.style.pointerEvents = "none";

  // Vô hiệu hóa các nút mệnh giá
  const amountButtons = document.querySelectorAll("[data-amount]");
  amountButtons.forEach((btn) => {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.5";
  });

  // Vô hiệu hóa nút X2 và nút Đặt cược
  document.querySelector(".btn-x2").style.pointerEvents = "none";
  document.querySelector(".btn-x2").style.opacity = "0.5";
  document.querySelector(".btn-bet").style.pointerEvents = "none";
  document.querySelector(".btn-bet").style.opacity = "0.5";

  // Thu thập tiền cược chưa được xác nhận
  const spanLeft = elBetMoneyLeft.querySelector("span");
  const spanRight = elBetMoneyRight.querySelector("span");

  unconfirmedBets.left = spanLeft
    ? parseInt(spanLeft.textContent.replace(/,/g, "")) || 0
    : 0;
  unconfirmedBets.right = spanRight
    ? parseInt(spanRight.textContent.replace(/,/g, "")) || 0
    : 0;

  // Nếu có tiền cược chưa xác nhận, thực hiện hoàn tiền
  refundUnconfirmedBets();
}

// Hàm kích hoạt lại các nút đặt cược
function enableBettingButtons() {
  // Kích hoạt nút đặt cược bên trái và phải
  elBetMoneyLeft.style.pointerEvents = "auto";
  elBetMoneyRight.style.pointerEvents = "auto";

  // Kích hoạt các nút mệnh giá
  const amountButtons = document.querySelectorAll("[data-amount]");
  amountButtons.forEach((btn) => {
    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";
  });

  // Kích hoạt nút X2 và nút Đặt cược
  document.querySelector(".btn-x2").style.pointerEvents = "auto";
  document.querySelector(".btn-x2").style.opacity = "1";
  document.querySelector(".btn-bet").style.pointerEvents = "auto";
  document.querySelector(".btn-bet").style.opacity = "1";
}

// Thêm hàm mới để hoàn lại tiền đã đặt cược
function refundPlacedBets() {
  // Lấy tiền cược từ mỗi bên
  const betMainLeftElement = document.querySelector(".el-bet-main-left span");
  const betMainRightElement = document.querySelector(".el-bet-main-right span");

  let refundAmount = 0;

  // Tính tổng tiền cược đã đặt
  if (betMainLeftElement && betMainLeftElement.textContent) {
    refundAmount +=
      parseInt(betMainLeftElement.textContent.replace(/,/g, "")) || 0;
  }

  if (betMainRightElement && betMainRightElement.textContent) {
    refundAmount +=
      parseInt(betMainRightElement.textContent.replace(/,/g, "")) || 0;
  }

  // Hoàn trả tiền vào tài khoản người dùng
  if (refundAmount > 0) {
    userLogin.assets += refundAmount;
    money.textContent = userLogin.assets.toLocaleString();

    // Lưu dữ liệu
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
  }
}

// Xử lý nút nhân đôi tiền cược (X2)
const btnX2 = document.querySelector(".btn-x2");
btnX2.addEventListener("click", () => {
  if (!currentBetSide) {
    alert("Hãy chọn bên cược trước!");
    return;
  }

  let betDisplay;
  if (currentBetSide === "left") {
    betDisplay = elBetMoneyLeft.querySelector("span");
  } else {
    betDisplay = elBetMoneyRight.querySelector("span");
  }

  // Kiểm tra xem đã có tiền cược chưa
  if (!betDisplay || !betDisplay.textContent) {
    alert("Vui lòng đặt cược trước khi nhân đôi!");
    return;
  }

  // Lấy số tiền cược hiện tại và chuyển về số
  let currentAmount = parseInt(betDisplay.textContent.replace(/,/g, "")) || 0;
  let doubledAmount = currentAmount * 2;

  // Kiểm tra xem có đủ tiền để nhân đôi không
  if (doubledAmount - currentAmount > userLogin.assets) {
    alert("Không đủ tiền để nhân đôi cược!");
    return;
  }

  // Kiểm tra xem có vượt quá giới hạn cược không
  if (doubledAmount > MAX_BET) {
    alert("Vượt quá giới hạn cược!");
    return;
  }

  // Trừ tiền từ tài khoản người dùng
  const additionalBet = doubledAmount - currentAmount;
  userLogin.assets -= additionalBet;
  money.textContent = userLogin.assets.toLocaleString();

  // Lưu dữ liệ
  localStorage.setItem("userLogin", JSON.stringify(userLogin));

  // Cập nhật hiển thị số tiền cược
  betDisplay.textContent = doubledAmount.toLocaleString();

  // Hiệu ứng nhấp nháy cho số tiền cược
  betDisplay.style.animation = "blink-bet 0.5s ease";
  setTimeout(() => {
    betDisplay.style.animation = "";
  }, 500);
});

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

    // Lấy giá trị từ giao diện và chuyển về số
    let currentAmount = parseInt(betDisplay.textContent.replace(/,/g, "")) || 0;

    // (tuỳ chọn) Cộng thêm, trừ bớt...
    currentAmount += 1000 - 1000;

    // Hiển thị lại với dấu phẩy - Sửa dòng này
    betDisplay.textContent = currentAmount.toLocaleString(); // Sửa từ "vi-VN" thành không tham số

    if (amount > userLogin.assets) {
      alert("Không đủ tiền để cược số này!");
      return;
    }

    if (currentAmount + amount > MAX_BET) {
      alert("Vượt quá giới hạn cược!");
      return;
    }

    currentAmount += amount;
    betDisplay.textContent = currentAmount.toLocaleString(); // Sửa từ "vi-VN" thành không tham số

    userLogin.assets -= amount;
    money.textContent = userLogin.assets.toLocaleString();

    // Lưu dữ liệu
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
  });
});

// xử lý số tiền đặt cược
document.querySelector(".btn-bet").addEventListener("click", () => {
  const spanLeft = elBetMoneyLeft.querySelector("span");
  const spanRight = elBetMoneyRight.querySelector("span");

  const betLeft = spanLeft
    ? parseInt(spanLeft.textContent.replace(/,/g, ""))
    : 0;
  const betRight = spanRight
    ? parseInt(spanRight.textContent.replace(/,/g, ""))
    : 0;

  if (betLeft === 0 && betRight === 0) {
    alert("Bạn chưa đặt cược!");
    return;
  }

  // Xử lý bên Chẵn (Left)
  if (betLeft > 0) {
    const betMainLeft = document.querySelector(".el-bet-main-left span");
    let currentMainLeft =
      parseInt(betMainLeft.textContent.replace(/,/g, "")) || 0;

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
      evenTotal += betLeft;
      betMainLeft.textContent = currentMainLeft.toLocaleString(); // Sửa từ "vi-VN" thành không tham số
      clone.remove();
      elBetMoneyLeft.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
    }, 600);
  }

  // Xử lý bên Lẻ (Right)
  if (betRight > 0) {
    const betMainRight = document.querySelector(".el-bet-main-right span");
    let currentMainRight =
      parseInt(betMainRight.textContent.replace(/,/g, "")) || 0;

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
      oddTotal += betRight;
      betMainRight.textContent = currentMainRight.toLocaleString(); // Sửa từ "vi-VN" thành không tham số
      clone.remove();
      elBetMoneyRight.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
    }, 600);
  }

  currentBetSide = null;

  // Sau khi đặt cược xong, bắt đầu trò chơ
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
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
  elBetMoneyLeft.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
  elBetMoneyRight.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;

  // Reset lại trạng thái cược bên trái và bên phải
  currentBetSide = null;
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
  alert(`Số tiền cược đã được hoàn lại: ${refund.toLocaleString()} đồng.`);
});

// ===== PHẦN XÚC XẮC NGẪU NHIÊN =====

const countdownElement = document.getElementById("countdown");
const plateImg = document.querySelector(".plate-img");
const diceBox = document.getElementById("diceBox");
let isGameRunning = false;

// Các hình ảnh xúc xắc
const diceImages = [
  "image/image-game/dor1.png",
  "image/image-game/dor2.png",
  "image/image-game/dor3.png",
  "image/image-game/dor4.png",
  "image/image-game/dor5.png",
  "image/image-game/dor6.png",
];

// Thêm style vào head để định nghĩa các animation
function addGameAnimationStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes pulse-grow {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes sparkle {
      0% { box-shadow: 0 0 5px 0px gold; }
      50% { box-shadow: 0 0 20px 5px gold, 0 0 30px 10px rgba(255, 215, 0, 0.5); }
      100% { box-shadow: 0 0 5px 0px gold; }
    }
    
    .winner-effect {
      animation: pulse-grow 1s infinite, sparkle 1.5s infinite;
      z-index: 100;
    }
    
    .winner-even::after, .winner-odd::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
      z-index: 90;
      pointer-events: none;
      opacity: 0;
      animation: shine 2s infinite;
    }
    
    @keyframes shine {
      0% { opacity: 0; }
      50% { opacity: 0.7; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(styleElement);
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
  addGameAnimationStyles();
});

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

function getFixedDicePosition(
  index,
  diceSize = 60,
  containerWidth = 200,
  containerHeight = 150
) {
  const fixedPositions = [
    { x: 20, y: 20 },
    { x: containerWidth - diceSize - 20, y: 20 },
    {
      x: containerWidth / 2 - diceSize / 2,
      y: containerHeight - diceSize - 20,
    },
    // Thêm vị trí nữa nếu bạn có nhiều xúc xắc hơn
  ];

  return (
    fixedPositions[index] || {
      x: containerWidth / 2 - diceSize / 2,
      y: containerHeight / 2 - diceSize / 2,
    }
  );
}

const evenEl = document.getElementById("sumEven");
const oddEl = document.getElementById("sumOdd");
const evenPlayer = document.querySelector(".total-players-even");
const oddPlayer = document.querySelector(".total-players-odd");

let evenTotal = 0;
let oddTotal = 0;
let evenPlayerNumber = 0;
let oddPlayerNumber = 0;
let timer = null;
const duration = 20; // đếm trong 5 giây
let timePassed = 0;

function numberToImage(number, container) {
  container.innerHTML = "";
  const str = number.toLocaleString("vi-VN"); // VD: 123,456,789
  for (let char of str) {
    const img = document.createElement("img");
    if (char === ".") {
      img.src = "./image/image-game/,.png";
      img.style.width = "9px";
      img.style.alignSelf = "flex-end";
    } else {
      img.src = `./image/image-game/${char}.png`;
    }
    container.appendChild(img);
  }
}

function startRandomCounter() {
  evenTotal = 0;
  oddTotal = 0;
  evenPlayerNumber = 0;
  oddPlayerNumber = 0;
  numberToImage(evenTotal, evenEl);
  numberToImage(oddTotal, oddEl);
  timePassed = 0;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    if (timePassed >= duration) {
      clearInterval(timer);
      return;
    }

    // Random từ 100 triệu đến 1 tỷ
    const randEven =
      Math.floor(Math.random() * (1_000_000_000 - 100_000_000 + 1)) +
      100_000_000;
    const randOdd =
      Math.floor(Math.random() * (1_000_000_000 - 100_000_000 + 1)) +
      100_000_000;

    evenTotal += randEven;
    oddTotal += randOdd;

    numberToImage(evenTotal, evenEl);
    numberToImage(oddTotal, oddEl);

    // Random người chơi
    const randPlayerEven = Math.floor(Math.random() * 91) + 10;
    const randPlayerOdd = Math.floor(Math.random() * 91) + 10;

    evenPlayerNumber += randPlayerEven;
    oddPlayerNumber += randPlayerOdd;

    evenPlayer.textContent = evenPlayerNumber;
    oddPlayer.textContent = oddPlayerNumber;
    timePassed++;
  }, 1000);
}

// Bắt đầu trò chơi xúc xắc
function startDiceGame() {
  if (isGameRunning) return;
  isGameRunning = true;

  // Reset biến lưu tiền cược chưa xác nhận
  unconfirmedBets = {
    left: 0,
    right: 0,
  };

  const plate = document.getElementById("plate");
  plate.style.display = "block";
  countdownElement.style.display = "block";

  // Lưu lại hiển thị xúc xắc tĩnh ban đầu nếu cần
  const originalDiceHTML = diceBox.innerHTML;

  // Xóa xúc xắc cũ nếu có
  diceBox.innerHTML = "";

  // Đếm ngược
  let timeLeft = 20;
  countdownElement.textContent = timeLeft;

  // Thêm class cho đồng hồ đếm ngược khi thời gian sắp hết
  if (timeLeft <= 3) {
    countdownElement.classList.add("time-end");
  } else {
    countdownElement.classList.remove("time-end");
  }

  // Kích hoạt lại các nút đặt cược khi bắt đầu ván mới
  enableBettingButtons();

  const countdownTimer = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    // Thêm hiệu ứng màu đỏ khi thời gian còn ít
    if (timeLeft <= 3) {
      countdownElement.classList.add("time-end");
      // Vô hiệu hóa các nút khi còn 3 giây
      disableBettingButtons();
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

function showDice() {
  // Xóa nội dung cũ
  diceBox.innerHTML = "";

  // Thiết lập kích thước và vị trí box chứa xúc xắc
  diceBox.style.position = "absolute";
  diceBox.style.width = "200px"; // Khớp containerWidth của getFixedDicePosition
  diceBox.style.height = "150px";
  diceBox.style.border = "1px solid transparent";
  diceBox.style.overflow = "visible";

  const diceSize = 80;
  const diceContainers = [];

  // Tạo hiệu ứng lắc
  const shakeDuration = 1500;
  const shakeTimes = 15;
  let shakeCount = 0;

  for (let i = 0; i < 3; i++) {
    // Lấy vị trí cố định theo index
    const position = getFixedDicePosition(i, diceSize, 200, 150);

    // Tạo container xúc xắc
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

  // Kết quả cuối cùng của xúc xắc
  const finalDiceValues = [
    getRandomDiceValue(),
    getRandomDiceValue(),
    getRandomDiceValue(),
  ];

  const shakeInterval = setInterval(() => {
    diceContainers.forEach((container, index) => {
      const diceValue =
        shakeCount < shakeTimes - 1
          ? getRandomDiceValue()
          : finalDiceValues[index];

      container.innerHTML = "";

      const diceImg = document.createElement("img");
      diceImg.src = diceImages[diceValue - 1];
      diceImg.className = "dice-img shaking";
      diceImg.style.width = "100%";
      diceImg.style.height = "100%";
      diceImg.style.background = "transparent";
      diceImg.style.border = "none";
      diceImg.style.borderRadius = "0";

      if (shakeCount < shakeTimes - 1) {
        const offsetX = Math.random() * 8 - 4;
        const offsetY = Math.random() * 8 - 4;
        const rotate = Math.random() * 40 - 20;

        container.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
      } else {
        container.style.transform = "none";
      }

      container.appendChild(diceImg);
    });

    shakeCount++;
    if (shakeCount >= shakeTimes) {
      clearInterval(shakeInterval);
      showFinalDiceResults(finalDiceValues, diceContainers);
    }
  }, shakeDuration / shakeTimes);
}

// Cập nhật lịch sử kết quả trong function showFinalDiceResults
function showFinalDiceResults(diceResults, diceContainers) {
  // Xóa xúc xắc cũ
  diceContainers.forEach((container, index) => {
    container.innerHTML = "";

    // Tạo xúc xắc kết quả với hiệu ứng cuối
    const diceImg = document.createElement("img");
    diceImg.src = diceImages[diceResults[index] - 1];
    diceImg.className = "dice-img final";
    diceImg.style.width = "100%";
    diceImg.style.height = "100%";
    diceImg.style.background = "transparent";
    diceImg.style.border = "none";
    diceImg.style.borderRadius = "0"; // tránh bo góc tạo viền trắng

    // Thêm hiệu ứng xoay riêng biệt cho từng xúc xắc
    const rotation = (index - 1) * 15; // -15, 0, 15 độ
    diceImg.style.transform = `rotate(${rotation}deg)`;

    container.appendChild(diceImg);
  });

  // Tính tổng điểm
  const totalPoints = diceResults.reduce((sum, value) => sum + value, 0);

  // Xác định kết quả Tài (lớn) hay Xỉu (nhỏ)
  let result;
  if (totalPoints == 18 || totalPoints == 3) {
    result = "Bộ ba"; // 3 con giống nhau → Tài/Xỉu thua
  } else if (totalPoints >= 11 && totalPoints <= 17) {
    result = "Xỉu";
  } else if (totalPoints >= 4 && totalPoints <= 10) {
    result = "Tài";
  }

  // Cập nhật lịch sử kết quả
  updateResultHistory(result);

  // Hiển thị kết quả với hiệu ứng đẹp mắt
  setTimeout(() => {
    // Tạo thông báo kết quả
    const resultDisplay = document.createElement("div");
    resultDisplay.className = "dice-result";
    resultDisplay.innerHTML = `
      <div class="${
        result === "Tài"
          ? "result-tai"
          : result === "Xỉu"
          ? "result-xiu"
          : "result-bo-ba"
      }">
        <h2>${result}</h2>
        <p>${totalPoints} điểm</p>
        <p>${diceResults.join(" + ")}</p>
      </div>
    `;
    resultDisplay.style.display = "none";
    resultDisplay.style.position = "absolute";
    resultDisplay.style.top = "50%";
    resultDisplay.style.left = "50%";
    resultDisplay.style.transform = "translate(-50%, -50%)";
    resultDisplay.style.background = "transparent";
    resultDisplay.style.color = result === "Tài" ? "#FF5722" : "#4CAF50";
    resultDisplay.style.padding = "15px 20px";
    resultDisplay.style.borderRadius = "10px";
    resultDisplay.style.fontWeight = "bold";
    resultDisplay.style.zIndex = "200";
    resultDisplay.style.textAlign = "center";
    resultDisplay.style.animation = "fadeIn 0.5s, pulse 1s infinite alternate";
    resultDisplay.style.textShadow = `0 0 10px ${
      result === "Tài" ? "#FF5722" : "#4CAF50"
    }`;

    diceBox.appendChild(resultDisplay);

    // Thêm hiệu ứng cho hình ảnh tương ứng với kết quả
    applyWinnerEffect(result);

    // Xử lý tiền thắng/thua sau khi ra kết quả
    handleBetResult(result);

    // Đặt lại trạng thái trò chơi sau 5 giây
    setTimeout(() => {
      // Xóa các hiệu ứng trước khi reset
      removeWinnerEffects();
      resetGameState();
    }, 5000);
  }, 1000);
}

// Hàm cập nhật lịch sử kết quả
function updateResultHistory(result) {
  const resultOddElement = document.querySelector(".result-odd");

  if (!resultOddElement) return;

  // Tạo hình ảnh mới để thêm vào cuối
  const newImg = document.createElement("img");

  if (result === "Xỉu") {
    newImg.src = "image/image-game/dot.tai.png";
    newImg.style.width = "17px"; // Giữ nguyên style như các hình ảnh Tài hiện có
    newImg.style.marginRight = "5px";
  } else {
    newImg.src = "image/image-game/dot.xiu.png";
    newImg.style.marginRight = "5px";
    // Không cần thêm style width cho hình ảnh Xỉu (dùng kích thước mặc định)
  }

  // Thêm hình ảnh mới vào cuối
  resultOddElement.appendChild(newImg);

  // Xóa hình ảnh đầu tiên để giữ số lượng ổn định
  if (resultOddElement.children.length > 14) {
    // Giữ tối đa 15 hình ảnh
    resultOddElement.removeChild(resultOddElement.children[0]);
  }
}

// Thêm hiệu ứng cho hình ảnh thắng
function applyWinnerEffect(result) {
  // Lấy các phần tử hình ảnh
  const evenImage = document.querySelector(".el-even img"); // Chẵn - Xỉu
  const oddImage = document.querySelector(".el-odd img"); // Lẻ - Tài

  if (result === "Tài") {
    // Nếu kết quả là Tài, thêm hiệu ứng cho hình ảnh lẻ (Tài)
    oddImage.classList.add("winner-effect");
    oddImage.parentElement.classList.add("winner-odd");

    // Thêm hiệu ứng ánh sáng thông qua lớp phủ tạm thời
    const glowOverlay = document.createElement("div");
    glowOverlay.style.position = "absolute";
    glowOverlay.style.top = "0";
    glowOverlay.style.left = "0";
    glowOverlay.style.width = "100%";
    glowOverlay.style.height = "100%";
    glowOverlay.style.background =
      "radial-gradient(circle, rgba(255, 87, 34, 0.4) 0%, rgba(255, 87, 34, 0) 70%)";
    glowOverlay.style.animation = "pulse 1.5s infinite";
    glowOverlay.style.zIndex = "50";
    oddImage.parentElement.appendChild(glowOverlay);
  } else {
    // Nếu kết quả là Xỉu, thêm hiệu ứng cho hình ảnh chẵn (Xỉu)
    evenImage.classList.add("winner-effect");
    evenImage.parentElement.classList.add("winner-even");

    // Thêm hiệu ứng ánh sáng thông qua lớp phủ tạm thời
    const glowOverlay = document.createElement("div");
    glowOverlay.style.position = "absolute";
    glowOverlay.style.top = "0";
    glowOverlay.style.left = "0";
    glowOverlay.style.width = "100%";
    glowOverlay.style.height = "100%";
    glowOverlay.style.background =
      "radial-gradient(circle, rgba(76, 175, 80, 0.4) 0%, rgba(76, 175, 80, 0) 70%)";
    glowOverlay.style.animation = "pulse 1.5s infinite";
    glowOverlay.style.zIndex = "50";
    evenImage.parentElement.appendChild(glowOverlay);
  }
}

// Xóa tất cả các hiệu ứng khỏi hình ảnh
function removeWinnerEffects() {
  const evenImage = document.querySelector(".el-even img");
  const oddImage = document.querySelector(".el-odd img");

  // Xóa các lớp hiệu ứng
  evenImage.classList.remove("winner-effect");
  oddImage.classList.remove("winner-effect");
  evenImage.parentElement.classList.remove("winner-even");
  oddImage.parentElement.classList.remove("winner-odd");

  // Xóa các lớp phủ ánh sáng
  const glowOverlays = document.querySelectorAll(
    ".el-even > div, .el-odd > div"
  );
  glowOverlays.forEach((overlay) => overlay.remove());
}

// Chỉnh sửa hàm xử lý kết quả cược để không xử lý kết quả khi pendingRefund = true
function handleBetResult(result) {
  // Nếu có yêu cầu hoàn tiền đang chờ, không xử lý kết quả thắng thua
  if (pendingRefund) {
    return;
  }

  // Lấy tiền cược từ mỗi bên
  const betLeftElement = document.querySelector(".el-bet-main-left span");
  const betRightElement = document.querySelector(".el-bet-main-right span");

  const betLeft = betLeftElement
    ? parseInt(betLeftElement.textContent.replace(/,/g, "")) || 0
    : 0;
  const betRight = betRightElement
    ? parseInt(betRightElement.textContent.replace(/,/g, "")) || 0
    : 0;

  let winAmount = 0;

  // Chẵn ở bên trái (Xỉu), Lẻ ở bên phải (Tài)
  if (result === "Xỉu" && betLeft > 0) {
    // Người chơi thắng khi đặt bên Chẵn (left) và kết quả là Xỉu
    winAmount = betLeft * 1.9; // Tỷ lệ thắng 1.9
  } else if (result === "Tài" && betRight > 0) {
    // Người chơi thắng khi đặt bên Lẻ (right) và kết quả là Tài
    winAmount = betRight * 1.9; // Tỷ lệ thắng 1.9
  }

  // Cộng tiền thắng vào tài khoản người chơi
  if (winAmount > 0) {
    userLogin.assets += Math.floor(winAmount);
    money.textContent = userLogin.assets.toLocaleString();

    // Lưu dữ liệu sau khi cập nhật số tiền
    localStorage.setItem("userLogin", JSON.stringify(userLogin));

    // Thông báo thắng
    setTimeout(() => {
      alert(
        `Chúc mừng! Bạn đã thắng ${Math.floor(
          winAmount
        ).toLocaleString()} đồng.`
      );
    }, 1500);
  } else if (betLeft > 0 || betRight > 0) {
    // Thông báo thua nếu có đặt cược
    setTimeout(() => {
      alert(`Rất tiếc, bạn đã thua trong lượt này.`);
    }, 1500);
  }

  // Xóa số tiền cược hiển thị trên giao diện
  if (betLeftElement) betLeftElement.textContent = "0";
  if (betRightElement) betRightElement.textContent = "0";
}

// Sửa lại hàm resetGameState để xử lý hoàn tiền sau khi ván kết thúc
function resetGameState() {
  isGameRunning = false;
  diceBox.innerHTML = "";

  // Nếu có yêu cầu hoàn tiền đang chờ, thực hiện hoàn tiền
  if (pendingRefund) {
    // Hoàn lại tiền đã đặt cược
    refundPlacedBets();
    pendingRefund = false;
  }

  // Kiểm tra xem người chơi còn đủ tiền để chơi tiếp không
  const moneyDisplay = document.querySelector(".money");
  if (moneyDisplay) {
    const currentMoney =
      parseInt(moneyDisplay.textContent.replace(/\D/g, "")) || 0;
    if (currentMoney <= 0) {
      // Hiển thị thông báo hết tiền nếu cần
      alert("Bạn đã hết tiền! Vui lòng nạp thêm để tiếp tục chơi.");
    }
  }

  // Reset tổng tiền cược khi qua ván mới
  const betMainLeftElement = document.querySelector(".el-bet-main-left span");
  const betMainRightElement = document.querySelector(".el-bet-main-right span");

  if (betMainLeftElement) betMainLeftElement.textContent = "0";
  if (betMainRightElement) betMainRightElement.textContent = "0";

  // Reset tiền cược đang chọn
  elBetMoneyLeft.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
  elBetMoneyRight.innerHTML = `<img src="image/image-game/cuoc.png" class="position-absolute">`;
  currentBetSide = null;

  // Reset tổng tiền và người chơi
  evenTotal = 0;
  oddTotal = 0;

  // Sẵn sàng cho ván tiếp theo
  setTimeout(() => {
    // Nếu chế độ đặt cược đang bị tắt, bật lại các nút đặt cược
    if (!bettingEnabled) {
      bettingEnabled = true;
      enableBettingButtons();
      // Đổi lại icon tay
      const img = btnHandDelete.querySelector("img");
      img.src = "image/image-game/hand-delete.png";
    }

    // Bắt đầu ván mới
    startDiceGame();
    evenTotal = 0;
    oddTotal = 0;
    evenPlayerNumber = 0;
    oddPlayerNumber = 0;
    evenPlayer.textContent = "0";
    oddPlayer.textContent = "0";
    startRandomCounter();
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

// Khởi tạo hiển thị khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  displayAllDice();
  resetGameState();
});
