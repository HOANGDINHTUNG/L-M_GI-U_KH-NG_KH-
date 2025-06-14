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

localStorage.setItem("userList", JSON.stringify(userList));

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

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
