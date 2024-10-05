// Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // Initial map center [lng, lat]
    zoom: 9
});

// Function to search for locations
function searchLocation() {
    const location = document.getElementById("location-search").value;
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            const coordinates = data.features[0].center;
            map.flyTo({ center: coordinates, zoom: 12 });
            new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
        })
        .catch(error => console.error('Error:', error));
}

// Function to calculate distance between two locations
function calculateDistance() {
    const start = document.getElementById("start-location").value;
    const end = document.getElementById("end-location").value;

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?access_token=${mapboxgl.accessToken}`;

    fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0];
            alert(`Distance: ${route.distance} meters, Duration: ${route.duration} seconds`);
            displayRouteOnMap(route.geometry.coordinates);
        })
        .catch(error => console.error('Error:', error));
}

// Function to display the calculated route on the map
function displayRouteOnMap(coordinates) {
    const routeLayer = map.getSource('route');

    if (routeLayer) {
        map.removeLayer('route');
        map.removeSource('route');
    }

    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        }
    });

    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#888',
            'line-width': 8
        }
    });
}
