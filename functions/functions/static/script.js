const lat = 49.40095858436034
const long = 8.672684466722458;
let map;
const mapOptions = {
    center: [lat, long],
    zoom: 12,
    zoomControl: false,
    attributionControl: false
  };

window.onload = () => {
    loadMap();
};

function loadMap () {
    map = new L.map("map", mapOptions);

  let layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  const marker = new L.Marker([lat, long], {
    icon: getIcon()
  });
  marker.setOpacity(0.5);
  marker.addTo(map);
}

function pixelsPerMeter() {
  return map
    .containerPointToLatLng([0, 0])
    .distanceTo(map.containerPointToLatLng([1, 0]));
}

function resizeIcon() {
  marker.setIcon(getIcon());
}

function getIconSize() {
  return [(1346 / pixelsPerMeter()) * 10, (941 / pixelsPerMeter()) * 10];
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




