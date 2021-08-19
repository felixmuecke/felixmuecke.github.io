const defaults = {
  lat: 50.911,
  long: 6.514,
  opacity: 0.4,
  zoom: 12,
  width: "600px",
};

let mapOptions = {
  zoomControl: false,
  attributionControl: false,
};

let map;
let params = {};

window.onload = () => {
  parseParams();
  loadMap();
};

function loadMap() {
  mapOptions.center = [
    params.lat ?? defaults.lat,
    params.long ?? defaults.long,
  ];
  mapOptions.zoom = params.zoom ?? defaults.zoom;

  document.getElementById("map").style.width = params.width ?? defaults.width;
  document.getElementById("map").style.height = params.width ?? defaults.width;
  map = new L.map("map", mapOptions);

  let layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  console.log(mapOptions.center);

  const marker = new L.Marker(mapOptions.center, {
    icon: getIcon(),
  });
  marker.setOpacity(params.opacity ?? 0.5);
  marker.addTo(map);
}

function pixelsPerMeter() {
  return map
    .containerPointToLatLng([0, 0])
    .distanceTo(map.containerPointToLatLng([1, 0]));
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

function parseParams() {
  const queryString = window.location.search;
  const paramPairs = queryString.substr(1).split("&");
  for (let i = 0; i < paramPairs.length; i++) {
    const pair = paramPairs[i].split("=");
    params[pair[0]] = pair[1];
  }
}
