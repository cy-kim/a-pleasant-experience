let userList = [];
const socket = io("https://a-pleasant-experience.herokuapp.com/");
const myCheckbox = document.createElement("input");
//https://a-pleasant-experience.herokuapp.com/
//ws://localhost:3000
let checkBoxDiv = document.getElementById("checkboxes");
socket.on("connect", () => {
  console.log(socket.id);
  socket.emit("userList");
});

socket.on("userList", (data) => {
  console.log(data);
  checkBoxDiv.innerHTML = "";
  data.forEach(({ id, isPlaying }) => {
    if (id == socket.id) return;
    else {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = isPlaying;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(`id: ${id}`));
      checkBoxDiv.appendChild(label);
    }
  });
  const myLabel = document.createElement("label");
  myCheckbox.type = "checkbox";
  myCheckbox.id = "myCheckbox";
  myLabel.appendChild(myCheckbox);
  myLabel.appendChild(document.createTextNode(`my checkbox: ${socket.id}`));
  checkBoxDiv.appendChild(myLabel);
});

myCheckbox.addEventListener("change", (event) => {
  console.log(event.target.checked);
  socket.emit("checkboxChange", {
    id: socket.id,
    isPlaying: event.target.checked,
  });
});
