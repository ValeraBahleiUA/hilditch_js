const dropzone = document.getElementById("dropzone");
const imgs = document.getElementById("imgs")
const file_input=document.getElementById("file_input")
window.addEventListener("drop", (e) => {
  if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
    e.preventDefault();
  }
});
window.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
      (item) => item.kind === "file"
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    if (!dropzone.contains(e.target)) {
      e.dataTransfer.dropEffect = "none";
    }
  }
});




dropzone.addEventListener("drop",dropHandler);

dropzone.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
      (item) => item.kind === "file"
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    const firstFile = fileItems[0];
    if (firstFile.type.startsWith("image/")) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }
});

function dropHandler(ev) {
  ev.preventDefault();
  const item = [...ev.dataTransfer.items].find(
      (i) => i.kind === "file"
  );
  if (item) {
    const file = item.getAsFile();
    displayImage(file);

  }
}
file_input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  displayImage(file);
});


function displayImage(file) {
  if (file && file.type.startsWith("image/")) {
    !! document.getElementById("uploaded_img") && document.getElementById("uploaded_img").remove();

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.id = "uploaded_img";
    imgs.textContent="";
    imgs.appendChild(img);
    const event = new CustomEvent('image_added', { detail: { img } });
    imgs.dispatchEvent(event);

  }
}


// (() => {
//   const displayDiv = document.getElementById('display');
//
//   // Allow dropping
//   window.addEventListener('dragover', e => e.preventDefault());
//
//   window.addEventListener('drop', async e => {
//     e.preventDefault();
//
//     const file = e.dataTransfer.files[0];
//     if (!file || !file.type.startsWith('image/')) return;
//
//     // Read file as a DataURL
//     const dataUrl = await fileToDataUrl(file);
//
//     // Create and append <img>
//     const img = document.createElement('img');
//     img.src = dataUrl;
//     displayDiv.appendChild(img);
//
//     // Hide div after image is added
//     displayDiv.style.display = 'none';
//
//     // Fire custom event so listener.js can react
//     const event = new CustomEvent('image-added', { detail: { img } });
//     displayDiv.dispatchEvent(event);
//   });
//
//   function fileToDataUrl(file) {
//     return new Promise((res, rej) => {
//       const reader = new FileReader();
//       reader.onload = () => res(reader.result);
//       reader.onerror = rej;
//       reader.readAsDataURL(file);
//     });
//   }
// })();
