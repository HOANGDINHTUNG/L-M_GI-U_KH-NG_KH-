const showChat = document.getElementById("show-chat");
const btnChat = document.querySelector(".btn-chat");
const containerInfor = document.querySelector(".container-current-money");
let checkChat = true;

btnChat.addEventListener("click", () => {
  if (checkChat) {
    showChat.classList.remove("d-none");
    showChat.classList.add("d-flex");
    containerInfor.style.bottom = "550px";
    checkChat = false;
  } else {
    showChat.classList.remove("d-flex");
    showChat.classList.add("d-none");
    checkChat = true;
    containerInfor.style.bottom = "10px";
  }
});

// Danh sách các tin nhắn mẫu mở rộng
const sampleMessages = [
  // Tin nhắn gốc
  {username: "tru***in", content: "X9 chanh", vip: 1},
  {username: "anh***01", content: "Tháng nào bảo gặp cầu phong châu", vip: 2},
  {username: "tha***84", content: "Lại bú tài", vip: 6},
  {username: "nha***97", content: "tài 5l", vip: 1},
  {username: "kha***00", content: "ok bú ko ae", vip: 2},
  {username: "nhu***05", content: "Gậy", vip: 7},
  {username: "t12***7t", content: "Bú lại 1m gậy 6m", vip: 0},
  {username: "tha***ot", content: "Anh em của tôi đâu", vip: 4},
  {username: "dun***en", content: "Xỉu 12 nhà chúng m", vip: 7},
  {username: "bet***nh", content: "thấy theo 86 ko mà", vip: 5},
  {username: "duc***23", content: "Lên 86", vip: 2},
  {username: "tha***gy", content: "Bay nhẹ 4m", vip: 5},
  {username: "vie***91", content: "Xỉu nhẹ hoặc bỏ", vip: 0},
  {username: "838***26", content: "Cứu vs a", vip: 8},
  {username: "tdj***23", content: "Bú", vip: 1},
  {username: "gam***er", content: "Theo tài ko ae", vip: 3},
  {username: "pro***88", content: "Lấy lại 500k nào", vip: 4},
  {username: "win***11", content: "Lên 5 gậy luôn", vip: 2},
  {username: "bet***vn", content: "Ai theo xỉu ko", vip: 6},
  {username: "top***23", content: "Tài nhé anh em", vip: 8},
  {username: "hot***69", content: "Bẻ cầu đi", vip: 2},
  {username: "vip***77", content: "All in tài", vip: 5},
  {username: "xyz***99", content: "Đánh lớn ko ae", vip: 6},
  {username: "abc***11", content: "Xỉu 3 phiên nữa", vip: 8},
  {username: "bet***pro", content: "Thắng lớn rồi ae ơi", vip: 5},
  
  // Thêm tin nhắn mới
  {username: "cuo***999", content: "Bú tài cháy túi", vip: 3},
  {username: "son***68", content: "Hôm nay tài nổ", vip: 7},
  {username: "vip***345", content: "Xỉu 2 phiên nữa", vip: 4},
  {username: "ban***789", content: "All in xỉu hôm nay", vip: 8},
  {username: "hoc***111", content: "Tài tài tài", vip: 2},
  {username: "bet***789", content: "Ai đang thắng ko", vip: 5},
  {username: "mai***686", content: "Đặt gấp đôi hôm nay", vip: 6},
  {username: "kin***555", content: "X3 chanh sáng nay", vip: 7},
  {username: "mon***123", content: "Bẻ cầu thần thánh", vip: 4},
  {username: "tra***268", content: "Lụm 20tr rồi ae", vip: 8},
  {username: "ric***888", content: "Thắng to hôm qua", vip: 6},
  {username: "fun***777", content: "Cầu đẹp quá", vip: 3},
  {username: "lov***666", content: "Tài xỉu đều được", vip: 5},
  {username: "ngc***234", content: "Ae theo không", vip: 2},
  {username: "vdo***345", content: "Vận may đến rồi", vip: 4},
  {username: "luc***111", content: "Hôm nay thắng to", vip: 7},
  {username: "hoa***789", content: "Thấy cầu đẹp quá", vip: 5},
  {username: "vin***246", content: "Theo tài lần cuối", vip: 3},
  {username: "tha***456", content: "X10 luôn", vip: 6},
  {username: "kim***879", content: "Thắng từ hôm qua giờ", vip: 8},
  {username: "quy***235", content: "Gỡ lại nào anh em", vip: 4},
  {username: "che***111", content: "Xanh chín đến rồi", vip: 7},
  {username: "xda***345", content: "Đỏ đen gì cũng được", vip: 5},
  {username: "ant***567", content: "Hôm nay ăn to", vip: 6},
  {username: "dat***999", content: "Tài tài tài tài", vip: 8},
  {username: "zlo***123", content: "Ae ơi theo không", vip: 3},
  {username: "nam***567", content: "Đỏ hết rồi", vip: 4},
  {username: "thu***987", content: "Bám theo vip8", vip: 2},
  {username: "ken***456", content: "Đánh lớn luôn", vip: 5},
  {username: "eri***777", content: "Toàn cao thủ ở đây", vip: 7},
  {username: "big***999", content: "Đánh nhỏ thôi ae", vip: 3},
  {username: "may***333", content: "Gấp thếp nào ae", vip: 6},
  {username: "leo***444", content: "Cho em theo với", vip: 1},
  {username: "win***222", content: "Hôm nay ngày đẹp", vip: 5},
  {username: "tot***234", content: "Thần tài gõ cửa", vip: 7},
  {username: "luc***756", content: "Mai ăn to", vip: 4},
  {username: "hoi***890", content: "Xanh chín đỏ ba", vip: 6},
  {username: "phe***235", content: "Phất lên nào ae", vip: 8},
  {username: "cha***111", content: "Gỡ gấp đôi", vip: 3},
  {username: "vtv***222", content: "Hôm nay là ngày đẹp", vip: 5}
];

// Lấy các phần tử DOM
const chatMessages = document.getElementById("chatMessages");
const playerCount = document.getElementById("playerCount");

// Đếm người chơi
let players = 1;

// Hàm tạo tin nhắn - đã sửa để căn chỉnh icon
function createMessage(messageData) {
  const message = document.createElement("div");
  message.className = "message";

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";

  // Tạo container chứa icon và username để căn chỉnh
  const userContainer = document.createElement("div");
  userContainer.className = "user-container";

  // Thêm icon rank dựa vào cấp VIP với đường dẫn mới
  const rankIcon = document.createElement("img");
  rankIcon.className = "rank-icon";
  rankIcon.src = `image/image-game/vip${messageData.vip}.png`;
  userContainer.appendChild(rankIcon);

  // Thêm username
  const username = document.createElement("span");
  username.className = `username vip-${messageData.vip}`;
  username.textContent = messageData.username + ":";
  userContainer.appendChild(username);

  // Thêm container vào message-content
  messageContent.appendChild(userContainer);

  // Thêm nội dung tin nhắn
  const content = document.createElement("span");
  content.className = "message-text";
  content.textContent = messageData.content;
  messageContent.appendChild(content);

  // Thêm nhãn "new" nếu là tin nhắn mới nhất
  if (Math.random() < 0.2) {
    const newLabel = document.createElement("span");
    newLabel.className = "new-label";
    newLabel.textContent = "NEW";
    messageContent.appendChild(newLabel);
  }

  message.appendChild(messageContent);
  return message;
}

// Hàm lấy màu dựa vào cấp VIP
function getVipColor(vip) {
  const colors = ["b0b0b0", "4ab4f1", "ffcc00", "ff6600", "ff3366", "dd33ff", "9933ff", "33cc99", "ff0000"];
  return vip < colors.length ? colors[vip] : colors[0];
}

// Hàm cập nhật số người chơi
function updatePlayerCount() {
  players = Math.floor(Math.random() * 200) + 800; // 800-1000 người chơi
  playerCount.textContent = players;
}

// Khởi tạo chat ban đầu
function initializeChat() {
  // Xáo trộn tin nhắn
  const shuffledMessages = [...sampleMessages].sort(() => Math.random() - 0.5);

  // Thêm 15 tin nhắn ban đầu
  for (let i = 0; i < 15; i++) {
    const messageElement = createMessage(shuffledMessages[i % shuffledMessages.length]);
    chatMessages.appendChild(messageElement);
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
  updatePlayerCount();
}

// Thêm tin nhắn mới
function addNewMessage() {
  // Chọn ngẫu nhiên một tin nhắn từ mẫu
  const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

  // Tạo phần tử tin nhắn mới
  const messageElement = createMessage(randomMessage);

  // Thêm vào khung chat
  chatMessages.appendChild(messageElement);

  // Cuộn xuống cuối
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Giới hạn số lượng tin nhắn
  if (chatMessages.children.length > 30) {
    chatMessages.removeChild(chatMessages.children[0]);
  }

  // Cập nhật số người chơi
  if (Math.random() < 0.2) {
    updatePlayerCount();
  }
}

// Khởi tạo chat
initializeChat();

// Thêm tin nhắn mới mỗi 1-3 giây
setInterval(() => {
  addNewMessage();
}, Math.random() * 2000 + 1000);

// Xử lý nút đóng
document.querySelector(".close-button").addEventListener("click", function () {
  alert("Đã đóng cửa sổ chat");
});

// Xử lý nút gửi
document.querySelector(".send-button").addEventListener("click", function () {
  const input = document.querySelector(".input-field");
  if (input.value.trim() !== "") {
    // Thêm tin nhắn của người dùng
    const userMessage = {
      username: "Bạn",
      content: input.value,
      vip: 8, // Giả sử người dùng là VIP cao nhất
    };
    const messageElement = createMessage(userMessage);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    input.value = "";
  }
});

document.head.insertAdjacentHTML("beforeend", `
  <style>
    .user-container {
      display: flex;
      align-items: center;
      margin-right: 5px;
    }
  </style>
`);