const centerStart = [50.911, 6.514];

// https://nominatim.openstreetmap.org/search?q=69118+germany&format=json

let map;
let marker;
let opacity;
let downloading = false;

window.onload = () => {
  let mapOptions = {
    center: centerStart,
    zoom: 11,
  };

  map = new L.map("map", mapOptions);

  let layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  marker = new L.Marker(centerStart, {
    icon: getIcon(),
  });
  marker.addTo(map);

  L.easyButton("fa-expand", {
    states: [
      {
        stateName: "expand",
        icon: "fa-expand",
        title: "Fullscreen",
        onClick: function (control) {
          text.style.display = "none";
          map.invalidateSize();
          control.state("collapse");
        },
      },
      {
        stateName: "collapse",
        icon: "fa-compress",
        title: "Show Text",
        onClick: function (control) {
          text.style.display = "";
          map.invalidateSize();
          control.state("expand");
        },
      },
    ],
  }).addTo(map);

  // Button to jump to current location
  L.easyButton("fa-map-marker", function (btn, map) {
    moveToOwnLocation();
  }).addTo(map);

  // Share Button
  L.easyButton("fa-camera", function (btn, map) {
    getSharePic();
  }).addTo(map);

  map.on("zoomend", () => {
    resizeIcon();
    document.getElementById("downloadContainer").style.display = "none";
  });

  map.on("dragend moveend", () => {
    moveIconToCenter();
    document.getElementById("downloadContainer").style.display = "none";
  });

  initOpacitySlider();
  // initShareButton();

  let sliderContainer = document.querySelector("#sliderContainer");
  sliderContainer.addEventListener("pointerover", (event) => {
    map.dragging.disable();
  });
  sliderContainer.addEventListener("pointerout", (event) => {
    map.dragging.enable();
  });

  const searchButton = document.getElementById("searchButton");
  const postcodeInput = document.getElementById("postcodeInput");

  postcodeInput.addEventListener("input", function (event) {
    const value = this.value;
    if (value && value.length == 5) {
      searchPostcode(value);
      searchButton.disabled = false;
    } else {
      searchButton.disabled = true;
    }
  });
};

function moveToOwnLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude]);
    });
  }
}

async function searchPostcode(postcode) {
  if (!postcode) {
    postcode = document.getElementById("postcodeInput").value;
    console.log(postcode);
  }
  const response = await window.fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${postcode}&country=germany&format=json`
  );
  const responseJson = await response.json();
  console.log(responseJson);
  const coords = [responseJson[0].lat, responseJson[0].lon];
  map.panTo(coords);
  console.log(coords);
}

async function getSharePic() {
  document.getElementById("downloadContainer").style.display = "none";
  try {
    // prevent multiple downloads at the same time

    if (downloading) {
      return;
    }
    downloading = true;
    document.getElementById("loaderContainer").style.display = "";

    const center = map.getCenter();
    const width = map.getSize().x;
    const queryString = `?opacity=${opacity}&lat=${center.lat}&long=${
      center.lng
    }&zoom=${map.getZoom()}&width=${width}px`;
    let image = await window.fetch(
      `https://us-central1-tagebauheimat.cloudfunctions.net/sharePic${queryString}`
    );
    let blob = await image.blob();
    let url = window.URL.createObjectURL(blob);
    var download = document.getElementById("download");
    download.href = url;
    download.download = "tagebau_share.png";

    let linkClicked = false;
    download.addEventListener("click", () => (linkClicked = true));
    download.click();
    setTimeout(() => {
      if (!linkClicked) {
        document.getElementById("downloadContainer").style.display = "";
      }
    }, 100);
    document.getElementById("loaderContainer").style.display = "none";
  } catch (error) {
    document.getElementById("loaderContainer").style.display = "none";
  } finally {
    downloading = false;
  }
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

function moveIconToCenter() {
  marker.setLatLng(map.getCenter());
}

function initOpacitySlider() {
  var slider = document.getElementById("opacity");
  slider.oninput = function () {
    opacity = this.value / 100;
    marker.setOpacity(opacity);
  };
}
