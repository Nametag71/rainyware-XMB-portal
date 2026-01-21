let config;
let catIndex = 3;
let itemIndex = 0;

fetch("config.json")
  .then(r => r.json())
  .then(data => {
    config = data;
    render();
  });

function render() {
  const xmb = document.getElementById("xmb");
  xmb.innerHTML = "";

  config.categories.forEach((cat, cIdx) => {
    const container = document.createElement("div");
    container.className = "category-container";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "category-icon-wrapper";

    const catDiv = document.createElement("div");
    catDiv.className = "category" + (cIdx === catIndex ? " active" : "");

    const iconScale = document.createElement("div");
    iconScale.className = "icon-scale";
    iconScale.innerHTML = `<img src="${cat.icon}">`;

    const label = document.createElement("div");
    label.className = "cat-label";
    label.textContent = cat.name;

    catDiv.appendChild(iconScale);
    catDiv.appendChild(label);

    catDiv.onclick = () => {
      catIndex = cIdx;
      itemIndex = 0;
      render();
    };

    iconWrapper.appendChild(catDiv);
    container.appendChild(iconWrapper);

    if (cIdx === catIndex) {
      const itemsDiv = document.createElement("div");
      itemsDiv.className = "items";

      cat.items.forEach((item, i) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item" + (i === itemIndex ? " active" : "");
        itemDiv.innerHTML = `<img src="${item.icon}"><span>${item.title}</span>`;

        itemDiv.onmouseenter = () => {
          const prev = document.querySelector(".item.active");
          if (prev) prev.classList.remove("active");

          itemDiv.classList.add("active");
          itemIndex = i;

          const descBox = document.getElementById("item-description");
          if (item.description) {
            descBox.style.display = "block";
            descBox.textContent = item.description;
          } else {
            descBox.style.display = "none";
          }
        };

        itemDiv.onclick = () => openItem(item);

        itemsDiv.appendChild(itemDiv);
      });

      container.appendChild(itemsDiv);
    }

    xmb.appendChild(container);
  });

  const descBox = document.getElementById("item-description");
  const activeItem = config.categories[catIndex].items[itemIndex];
  if (activeItem && activeItem.description) {
    descBox.style.display = "block";
    descBox.textContent = activeItem.description;
  } else {
    descBox.style.display = "none";
  }
}

function openItem(item) {
  if (!item || !item.url) return;

  const targetWin = window.open("", "_blank");
  if (!targetWin) return;

  if (item.aboutBlank) {
    targetWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${item.title}</title>
        <style>
          html, body { margin:0; height:100%; overflow:hidden; }
          iframe { border:none; width:100%; height:100%; }
        </style>
      </head>
      <body>
        <iframe src="${item.url}"></iframe>
      </body>
      </html>
    `);
    targetWin.document.close();
  } else {
    targetWin.location.href = item.url;
  }
}

document.addEventListener("keydown", e => {
  if (!config) return;

  const maxCat = config.categories.length - 1;
  const maxItem = config.categories[catIndex].items.length - 1;

  switch (e.key) {
    case "ArrowLeft": catIndex = Math.max(0, catIndex - 1); itemIndex = 0; break;
    case "ArrowRight": catIndex = Math.min(maxCat, catIndex + 1); itemIndex = 0; break;
    case "ArrowUp": itemIndex = Math.max(0, itemIndex - 1); break;
    case "ArrowDown": itemIndex = Math.min(maxItem, itemIndex + 1); break;
    case "Enter": openItem(config.categories[catIndex].items[itemIndex]); break;
  }
  render();

});
