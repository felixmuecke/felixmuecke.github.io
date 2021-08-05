const centerStart = [50.911, 6.514];

let map;
let marker;

window.onload = () => {
  let mapOptions = {
    center: centerStart,
    zoom: 11,
  };

  map = new L.map("map", mapOptions);

  let layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  marker = new L.Marker(centerStart, {
    icon: getIcon(),
  });
  marker.addTo(map);

  map.on("zoomend", () => {
    resizeIcon();
  });

  map.on("dragend", () => {
    moveIconToCenter();
  });

  initOpacitySlider();
  initHideTextButton();
};

function pixelsPerMeter() {
  return map
    .containerPointToLatLng([0, 0])
    .distanceTo(map.containerPointToLatLng([1, 0]));
}

function resizeIcon() {
  marker.setIcon(getIcon());
}

function getIconSize() {
  return [(1346 / pixelsPerMeter()) * 10, (896 / pixelsPerMeter()) * 10];
}

function getIconAnchor() {
  return [getIconSize()[0] / 2, getIconSize()[1] / 2];
}

function getIcon() {
  return L.icon({
    iconUrl: "tagebau.png",
    iconSize: getIconSize(),
    iconAnchor: getIconAnchor(),
  });
}

function moveIconToCenter() {
  marker.setLatLng(map.getCenter());
}

function initOpacitySlider() {
  var slider = document.getElementById("opacity");
  slider.oninput = function () {
    marker.setOpacity(this.value / 100);
  };
}

function initHideTextButton() {
  // Script to hide/show menu
  let button = document.querySelector("#hideButton");
  let text = document.querySelector("#text");
  button.addEventListener("click", function (event) {
    if (text.style.display == "") {
      text.style.display = "none";
      button.innerHTML = "Show Text";
      map.invalidateSize();
    } else {
      text.style.display = "";
      button.innerHTML = "Hide Text";
      map.invalidateSize();
    }
  });
}
