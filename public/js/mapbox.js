// document.addEventListener("DOMContentLoaded", function () {
const locations = JSON.parse(
  document.getElementById("map").getAttribute("data-locations")
);

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29ka2lkIiwiYSI6ImNscnowYjRrNzFmZjEyaXBnOWplMnJ1NnAifQ.ahv6peRlLIRPgELk9F0rOw";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/godkid/clrz0vqlj009801pv4qhf2f7g",
  scrollZoom: false,
});

const bounds = new mapboxgl.LatLngBounds();
locations.forEach((loc) => {
  const el = document.createElement("div");
  el.className = "marker";

  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
// });
