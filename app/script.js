let userList = [];
let polyParams = [];
let isLoading = true;
let voices = 32;
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
    pitch1.value = mySlider.value;
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

  play1 = device.parametersById.get(`polything/${voices}/gatey`);
  pitch1 = device.parametersById.get(`polything/${voices}/midival`);

  device.node.connect(context.destination);
  isLoading = false;
};
startup();

// startup().then(() => {
//   setInterval(() => {
//     console.log(device.parametersById.get(`polything/3/gatey`).value);
//     for (let i = 0; i < voices; i++) {
//       console.log(`polything/${i + 1}/gatey`);
//       if (userList[i] == undefined) return;
//       device.parametersById.get(`polything/${i + 1}/gatey`).value =
//         userList[i].isPlaying;
//       device.parametersById.get(`polything/${i + 1}/midival`).value = Number(
//         userList[i].pitch
//       );
//     }
//   }, 5000);
// });

const socket = io("ws://localhost:3000");

//https://a-pleasant-experience.herokuapp.com/
//ws://localhost:3000

socket.on("connect", () => {
  socket.emit("userList");
});

socket.on("userList", (data) => {
  checkBoxDiv.innerHTML = "";
  userList = data;
  data.forEach(({ id, isPlaying, pitch }, index) => {
    if (id == socket.id) return;
    if (index > voices - 2)
      return; // because the last voice is prescribed to user1
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
      slider.value = Number(pitch);
      label.appendChild(checkbox);
      label.appendChild(slider);
      // label.appendChild(document.createTextNode(`id: ${id}`));
      checkBoxDiv.appendChild(label);
    }
  });
});
