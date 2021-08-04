let map;
let marker;

window.onload = () => {
  let mapOptions = {
    center: [51.958, 9.141],
    zoom: 10,
  };

  map = new L.map("map", mapOptions);

  let layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  marker = new L.Marker([51.958, 9.141], {
    icon: L.icon({
      iconUrl: "tagebau_transparent.png",
      iconSize: getIconSize(), // size of the icon
      iconAnchor: getIconAnchor(), // point of the icon which will correspond to marker's location,
    }),
  });
  marker.addTo(map);

  map.on("zoomend", () => {
    resizeIcon();
  });

  map.on("dragend", () => {
    moveIconToCenter();
  });

  initOpacitySlider();
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
  // TODO: Adapt to final png
  return [(1346 / pixelsPerMeter()) * 10, (896 / pixelsPerMeter()) * 10];
}

function getIconAnchor() {
  return [getIconSize()[0] / 2, getIconSize()[1] / 2];
}

function getIcon() {
  const iconWidth = (1346 / pixelsPerMeter()) * 10;
  const iconHeight = (896 / pixelsPerMeter()) * 10;

  return L.icon({
    iconUrl: "tagebau_transparent.png",
    iconSize: [iconWidth, iconHeight], // size of the icon
    iconAnchor: [iconWidth / 2, iconHeight / 2], // point of the icon which will correspond to marker's location
  });
}

function moveIconToCenter() {
  marker.setLatLng(map.getCenter());
}

function initOpacitySlider() {
  var slider = document.getElementById("opacity");
  slider.oninput = function () {
    console.log("slider here");
    marker.setOpacity(this.value / 100);
  };
}
