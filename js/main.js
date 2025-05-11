let userList = [
  {
    name: "admin6868",
    password: "09042006",
    role: "ADMIN",
    accountNumber: "0867422301",
    accountUser: "HOANG DINH TUNG",
    assets: "99999999999999",
  },
];

//Khởi tạo vào localStorage
function loadFromLocalStorage(key, defaultValue = []) {
  let data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data); // Nếu đã có thì lấy ra
  } else {
    localStorage.setItem(key, JSON.stringify(defaultValue)); // Nếu chưa có thì lưu mặc định
    return defaultValue;
  }
}

userList=loadFromLocalStorage("userList",userList)

// làm lấy dữ liệu từ form (cụ thể hơn là lấy thông tin từ input)
function getFormData(formEL) {
  let data = {};
  for (element of formEL.elements) {
    if (element.name != "") {
      data[element.name] = element.value;
    }
  }
  return data;
}

// Lưu dữ liệu lên hệ thống
function saveDataToLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getUserLoginData() {
  let userData = JSON.parse(localStorage.getItem("userLogin"));
  return userData;
}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
