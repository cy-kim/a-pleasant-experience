let userList = [];
let polyParams = [];
let isLoading = true;
let voices = 8;
let device;
const { createDevice } = RNBO;
let play1;
let pitch1;
let myStuff;
let mySlider = document.getElementById("mySlider");
let myCheckbox = document.getElementById("myCheckbox");

let rangeslider1;
let playing = false;

let WAContext = window.AudioContext || window.webkitAudioContext;
let context = new WAContext();
let checkBoxDiv = document.getElementById("checkboxes");

document.addEventListener("DOMContentLoaded", () => {
  myCheckbox.addEventListener("change", (event) => {
    console.log(event.target.checked);
    play1.value = event.target.checked;
    if (!playing) {
      context.resume();
      playing = true;
    }
    socket.emit("checkboxChange", {
      id: socket.id,
      isPlaying: event.target.checked,
      pitch: mySlider.value,
    });
  });
  mySlider.addEventListener("change", () => {
    console.log("sliding");
    socket.emit("checkboxChange", {
      id: socket.id,
      isPlaying: myCheckbox.checked,
      pitch: mySlider.value,
    });
  });
});
const startup = async () => {
  let rawPatcher = await fetch("patch.export.json");
  let polyPatcher = await rawPatcher.json();

  device = await createDevice({ context, patcher: polyPatcher });

  play1 = device.parametersById.get("polything/8/gatey");
  pitch1 = device.parametersById.get("polything/8/midival");

  device.node.connect(context.destination);
  isLoading = false;
};

startup().then(() => {
  setInterval(() => {
    for (let i = 0; i < voices; i++) {
      if (userList[i] == undefined) return;
      device.parametersById.get(`polything/${i + 1}/gatey`).value =
        userList[i].isPlaying;
      device.parametersById.get(`polything/${i + 1}/midival`).value = 500;
    }
  }, 1000);
});

const socket = io("https://a-pleasant-experience.herokuapp.com/");

//https://a-pleasant-experience.herokuapp.com/
//ws://localhost:3000

socket.on("connect", () => {
  socket.emit("userList");
});

socket.on("userList", (data) => {
  console.log(data);
  checkBoxDiv.innerHTML = "";
  userList = data;
  data.forEach(({ id, isPlaying, pitch }, index) => {
    if (id == socket.id) return;
    if (index > voices - 1) return;
    else {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = isPlaying;
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "0";
      slider.max = "1500";
      slider.value = pitch;
      label.appendChild(checkbox);
      label.appendChild(slider);
      label.appendChild(document.createTextNode(`id: ${id}`));
      checkBoxDiv.appendChild(label);
    }
  });
});
