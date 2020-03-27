mapboxgl.accessToken = 'pk.eyJ1Ijoic21hcnRsaW5rZGV2IiwiYSI6ImNqeTY0dGJhbzAxdGQzY2xnbnJxNmF5MGwifQ.xdmVccelVygdEJZrF4TP7A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/smartlinkdev/ck823mpws0xhr1io75hkias1l',
    center: [-94.511,35.821],
    zoom: 4.40,
    pitch:45,
    bearing:-15,
  });
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
var days = [
  'March10',
  'March11',
  'March12',
  'March13',
  'March14',
  'March15',
  'March16',
  'March17',
  'March18',
  'March19',
  'March20',
  'March21',
  'March22',
  "March23",
  "March24",
  "March25",
  "March26"
  ];
  function filterBy(day) {
    var filters = ['==', 'date', days[day]];
    console.log(filters);
    map.setFilter('cov19-circles', filters);
    map.setFilter('confirmedCases-labels', filters);
    document.getElementById('dateLabels').textContent = days[day];
    }
    map.on('load', function() {
    d3.json("https:/ptahmedia.com/api", function(err,data ){
      if (err) throw err;
    map.addSource('dateByState', {
    'type': 'geojson',
    data: data
    });
    map.addLayer({
    'id': 'cov19-circles',
    'type': 'circle',
    'source': 'dateByState',
    'paint': {
    'circle-color': [
    'interpolate',
    ['linear'],
    ['get', 'confirmedCases'],
    0,
    '#FCA107',
    5000,
    '#7F3121'
    ],
    'circle-opacity': 0.75,
    'circle-radius': [
    'interpolate',
    ['linear'],
    ['get', 'confirmedCases'],
    0,
    8,
    50,
    12,
    100,
    20,
    1000,
    30,
    10000,
    45,
    50000,
    55
    ]
    }
    });
    map.addLayer({
      'id': 'confirmedCases-labels',
      'type': 'symbol',
      'source': 'dateByState',
      'layout': {
      'text-field': [
      'concat',
      ['to-string', ['get', 'confirmedCases']],
      ],
      'text-font': [
      'Open Sans Bold',
      'Arial Unicode MS Bold'
      ],
      'text-size': 14
      },
      'paint': {
      'text-color': 'rgba(255,255,255,1)'
      }
      });
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
      });
  var toggleableLayerIds = ['confirmedCases-labels'];
  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i]; 
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id; 
    link.onclick = function(e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();  
    var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
    if (visibility === 'visible') {
    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    this.className = '';
    } else {
    this.className = 'active';
    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
    };
    }
map.on('click', 'cov19-circles', function(e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var state = e.features[0].properties.State;
  var confirmedCases = e.features[0].properties.confirmedCases;
  var deaths = e.features[0].properties.Deaths;
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  popup.remove(); 
  map.flyTo({
    center: [coordinates[0],coordinates[1]],
    zoom: 6,
    pitch: 0
  });
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML( '<h3>' + `${state}` + '</h3>' +
  '<h4>' + `Confirmed Cases: ${confirmedCases}` + '</h4>' +
  '<h4>' + `Deaths: ${deaths} </h4>`)
  .addTo(map);
  });
  map.on('mouseenter', 'cov19-circles', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    var coordinates = e.features[0].geometry.coordinates.slice();
    var state = e.features[0].properties.State;
    var confirmedCases = e.features[0].properties.confirmedCases;
    var deaths = e.features[0].properties.Deaths;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup
    .setLngLat(coordinates)
    .setHTML( '<h3>' + `${state}` + '</h3>' +
    '<h4>' + `Confirmed Cases: ${confirmedCases}` + '</h4>' +
    '<h4>' + `Deaths: ${deaths} </h4>`)
    .addTo(map);
    });
    map.on('mouseleave', 'cov19-circles', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
      });
    filterBy(16);
    document
    .getElementById('slider')
    .addEventListener('input', function(e) {
      var day = days.length; 
      var day = parseInt(e.target.value, 10);
      filterBy(day);
    });
  }
    );
    });
    
    



