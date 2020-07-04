window.addEventListener('DOMContentLoaded', initialize)
const baseURL = "http://coronavirus-tracker-api.herokuapp.com/v2/locations";
let coronaDetails;
let coronaDropDown;
let worldDetails;
let coronaDetails2;

const data = {
    latest: {},
    locations: []
}

const countryCodes = {
    "TH": "Thailand",
    "JP": "Japan",
    "SG": "Singapore",
    "NP": "Nepal",
    "MY": "Malaysia",
    "CA": "Canada",
    "AU": "Australia",
    "KH": "Cambodia",
    "LK": "Sri Lanka",
    "DE": "Germany",
    "FI": "Finland",
    "AE": "United Arab Emirates",
    "PH": "Philippines",
    "IN": "India",
    "IT": "Italy",
    "SE": "Sweden",
    "ES": "Spain",
    "BE": "Belgium",
    "EG": "Egypt",
    "LB": "Lebanon",
    "IQ": "Iraq",
    "OM": "Oman",
    "AF": "Afghanistan",
    "BH": "Bahrain",
    "KW": "Kuwait",
    "DZ": "Algeria",
    "HR": "Croatia",
    "CH": "Switzerland",
    "AT": "Austria",
    "IL": "Israel",
    "PK": "Pakistan",
    "BR": "Brazil",
    "GE": "Georgia",
    "GR": "Greece",
    "MK": "North Macedonia",
    "NO": "Norway",
    "RO": "Romania",
    "EE": "Estonia",
    "SM": "San Marino",
    "BY": "Belarus",
    "IS": "Iceland",
    "LT": "Lithuania",
    "MX": "Mexico",
    "NZ": "New Zealand",
    "NG": "Nigeria",
    "IE": "Ireland",
    "LU": "Luxembourg",
    "MC": "Monaco",
    "QA": "Qatar",
    "EC": "Ecuador",
    "AZ": "Azerbaijan",
    "AM": "Armenia",
    "DO": "Dominican Republic",
    "ID": "Indonesia",
    "PT": "Portugal",
    "AD": "Andorra",
    "LV": "Latvia",
    "MA": "Morocco",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "AR": "Argentina",
    "CL": "Chile",
    "JO": "Jordan",
    "UA": "Ukraine",
    "HU": "Hungary",
    "LI": "Liechtenstein",
    "PL": "Poland",
    "TN": "Tunisia",
    "BA": "Bosnia and Herzegovina",
    "SI": "Slovenia",
    "ZA": "South Africa",
    "BT": "Bhutan",
    "CM": "Cameroon",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "PE": "Peru",
    "RS": "Serbia",
    "SK": "Slovakia",
    "TG": "Togo",
    "MT": "Malta",
    "MQ": "Martinique",
    "BG": "Bulgaria",
    "MV": "Maldives",
    "BD": "Bangladesh",
    "PY": "Paraguay",
    "AL": "Albania",
    "CY": "Cyprus",
    "BN": "Brunei",
    "US": "US",
    "BF": "Burkina Faso",
    "VA": "Holy See",
    "MN": "Mongolia",
    "PA": "Panama",
    "CN": "China",
    "IR": "Iran",
    "KR": "Korea, South",
    "FR": "France",
    "XX": "Cruise Ship",
    "DK": "Denmark",
    "CZ": "Czechia",
    "TW": "Taiwan*",
    "VN": "Vietnam",
    "RU": "Russia",
    "MD": "Moldova",
    "BO": "Bolivia",
    "HN": "Honduras",
    "GB": "United Kingdom",
    "CD": "Congo (Kinshasa)",
    "CI": "Cote d'Ivoire",
    "JM": "Jamaica",
    "TR": "Turkey",
    "CU": "Cuba",
    "GY": "Guyana",
    "KZ": "Kazakhstan",
    "ET": "Ethiopia",
    "SD": "Sudan",
    "GN": "Guinea",
    "KE": "Kenya",
    "AG": "Antigua and Barbuda",
    "UY": "Uruguay",
    "GH": "Ghana",
    "NA": "Namibia",
    "SC": "Seychelles",
    "TT": "Trinidad and Tobago",
    "VE": "Venezuela",
    "SZ": "Eswatini",
    "GA": "Gabon",
    "GT": "Guatemala",
    "MR": "Mauritania",
    "RW": "Rwanda",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "SR": "Suriname",
    "XK": "Kosovo",
    "CF": "Central African Republic",
    "CG": "Congo (Brazzaville)",
    "GQ": "Equatorial Guinea",
    "UZ": "Uzbekistan",
    "NL": "Netherlands",
    "BJ": "Benin",
    "LR": "Liberia",
    "SO": "Somalia",
    "TZ": "Tanzania",
    "BB": "Barbados",
    "ME": "Montenegro",
    "KG": "Kyrgyzstan",
    "MU": "Mauritius",
    "ZM": "Zambia",
    "DJ": "Djibouti",
    "GM": "Gambia, The",
    "BS": "Bahamas, The",
    "TD": "Chad",
    "SV": "El Salvador",
    "FJ": "Fiji",
    "NI": "Nicaragua",
    "MG": "Madagascar",
    "HT": "Haiti",
    "AO": "Angola",
    "CV": "Cape Verde",
    "NE": "Niger",
    "PG": "Papua New Guinea",
    "ZW": "Zimbabwe",
    "TL": "Timor-Leste",
    "ER": "Eritrea",
    "UG": "Uganda",
    "DM": "Dominica",
    "GD": "Grenada",
    "MZ": "Mozambique",
    "SY": "Syria"
};

populateLocation = (country, country_code) => {
    const options = document.createElement('option');
    options.value = country;
    //console.log(options);
    options.textContent = `${country_code}-${country}`;
    // console.log(options);
    coronaDropDown.appendChild(options);
}

populateLocations = () => {
    Object.entries(countryCodes).forEach(([country_code, country]) => populateLocation(country, country_code));
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkZGhhbnQwOTEyIiwiYSI6ImNrNjMza2ZlczBqN3gza21tZ3Y5bTI3YjAifQ.wAtJ3UyOduWoJmDEPPFSNQ';
let geoCoder;
async function geocodeReverseFromLatLog(lat, log) {
    return new Promise((resolve, reject) => {
        geoCoder.mapboxClient.geocodeReverse({
                latitude: parseFloat(lat),
                longitude: parseFloat(log)
            },
            function(error, response) {
                if (error) {
                    reject(error);
                }
                resolve(response.features[0] && response.features[0].place_name);
            }
        );
    })
}

function renderMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3
    });

    geoCoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(geoCoder);
    //map.addControl(new mapboxgl.navigationControl());

    map.on('load', async function() {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('places', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: {
                type: 'FeatureCollection',
                "crs": {
                    "type": "name",
                    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
                },
                features: await Promise.all(data.locations.map(async location => {

                    const placeName = await geocodeReverseFromLatLog(
                        location.coordinates.longitude,
                        location.coordinates.latitude
                    );
                    console.log(placeName);
                    return {
                        type: 'Feature',
                        properties: {
                            description: `
                        <table>
                        <thead>
                        <tr>Place Name</tr>
                        </thead>
                        <tbody>
                        <tr>
                        <td>Confirmed Cases: </td>
                        <td>${location.latest.confirmed}</td>
                        </tr>
                        <tr>
                        <td>Deaths: </td>
                        <td>${location.latest.deaths}</td>
                        </tr>
                        <tr>
                        <td>latitude: </td>
                        <td>${location.coordinates.latitude}</td>
                        </tr>
                        <tr>
                        <td>longitude: </td>
                        <td>${location.coordinates.longitude}</td>
                        </tr>
                        </tbody>
                        </table>
                        `,
                            icon: 'rocket'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                `${location.coordinates.longitude}`,
                                `${location.coordinates.latitude}`
                            ]
                        }

                    }
                }))
            },
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                'circle-color': [
                    'step', ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step', ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        // inspect a cluster on click
        map.on('click', 'clusters', function(event) {
            const features = map.queryRenderedFeatures(event.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('places').getClusterExpansionZoom(
                clusterId,
                function(err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', function(e) {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { description } = e.features[0].properties;

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', function() {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function() {
            map.getCanvas().style.cursor = '';
        });
    });
}

async function initialize() {
    console.log("initialization");
    references();
    binding();
    NProgress.start();
    populateLocations();
    await dataFetch();
    renderUI(data.latest, world = true);
    // renderUIstatistics(data.latest, world = true);
    //console.log('Corona data world details', data.latest);
    //console.log(`corona prone Locations:${data.locations}`);
    renderMap();
    NProgress.done();


}

async function dataFetch() {
    const response = await fetch(`${baseURL}`);
    const data2 = await response.json();
    //console.log(data2);
    const { latest, locations } = data2;
    data.latest = latest;
    data.locations.push(...locations)
}

references = () => {
    coronaDetails = document.querySelector('#corona-details');
    coronaDropDown = document.querySelector('[name="select-country"]');
    worldDetails = document.querySelector('#corona-world-details');
    coronaDetails2 = document.querySelector('#st');
}

binding = () => {
    coronaDropDown.addEventListener('change', renderSelectedLocation);
        // coronaDropDown.addEventListener('change', statistics)

}

function renderSelectedLocation(event) {
    // console.log(event.target.value);
    const selectedCountry = event.target.value;
    const locationCoronaDetails = data.locations.reduce((accumulator, currentLocation) => {
        if (currentLocation.country === selectedCountry) {
            accumulator['country'] = currentLocation.country;
            accumulator['country_code'] = currentLocation.country_code;
            accumulator['country_population'] = currentLocation.country_population;
            accumulator.latest.confirmed += currentLocation.latest.confirmed;
            accumulator.latest.deaths += currentLocation.latest.deaths;
            //statistics();
            // accumulator.locations.country_population += currentLocation.locations.country_population;
        }
        return accumulator;
    }, {
        country: '',
        country_code: '',
        latest: {
            confirmed: 0,
            deaths: 0
        }
    });
    //console.log(locationCoronaDetails);
    renderUI(locationCoronaDetails);
}



function renderUI(details, world = false) {
 /*  let a = 1;
    c = details.latest.confirmed / details.country_population;
    let d = c / a; 
	console.log(d);*/
	let a,b,c,num,percent;
    let html = '';
    html = `
    <table class='table'>
    <thead>
    ${world ? '<h1>WORLD DETAILS</h1>':`
    <tr>${details.country} ${details.country_code} </tr>
    `}
    </thead>
    <tbody>
    <tr>
    <td class='cases'>Reported Cases: </td>
    <td>${world ? details.confirmed : details.latest.confirmed}</td>
    </tr>
    <tr>
    <td class='deaths'> deaths: </td>
    <td>${world ? details.deaths : details.latest.deaths}</td>
    </tr>
    <table>
    `;
    
    if(world){
        worldDetails.innerHTML = html;
    }
    else{
        coronaDetails.innerHTML = html;
      a = 0.007;
      c = details.latest.confirmed / details.country_population;
      d = c / a; 
      num = d.toPrecision(1);
	console.log(num);
    /* if(num>=0 && num<=0.1){
      console.log(`0% - 10%`);
     }
     */
    let html2='';
    html2= `
    <ul>

    <li>population: ${details.country_population}</li>
    <li>ratio: ${num}</li>
    <li>Chances of getting affected: ${num>=0 && num<=0.1? '0%-10%' : (num>0.1 && num<=0.2)? '10% - 20%' : (num>0.2 && num<=0.3)? '20% - 30%' :  (num>0.3 && num<=0.4)? '30% - 40%': (num>0.4 && num<=0.5)? '40% - 50%': (num>0.5 && num<=0.6)? '50% - 60%': (num>0.6 && num<=0.7)? '60% - 70%' : (num>0.7 && num<=0.8)? '70% - 80%' :  (num>=0.8 && num<=0.9)? '80% - 90%' : '90% - 95%' }</li>
	
	</ul>
	<p>
	<a href='https://www.amazon.in/Luzuliyo%C2%AE-Pollution-Reusable-Non-woven-Protective/dp/B08B4VFFL4/ref=sr_1_1_sspa?crid=3L8E62FIQKY2H&dchild=1&keywords=masks+for+face+n95+washable&qid=1592846892&sprefix=masks%2Caps%2C669&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFFVTQ2NVBWUTYzQTgmZW5jcnlwdGVkSWQ9QTA3NDQyOTQzRTNIWkozRkRENUtRJmVuY3J5cHRlZEFkSWQ9QTAyODY2NzExNUNQTzg3SUUxT1NBJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='>here is a link from where you can buy a mask</a></p>
	<p>
	<a href='https://www.amazon.in/Lifebuoy-%E0%A4%85%E0%A4%B2%E0%A5%8D%E0%A4%95%E0%A5%8B%E0%A4%B9%E0%A4%B2-%E0%A4%86%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%A4-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A5%8B%E0%A4%9F%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%B6%E0%A4%A8-%E0%A4%B8%E0%A5%88%E0%A4%A8%E0%A4%BF%E0%A4%9F%E0%A4%BE%E0%A4%87%E0%A4%9C%E0%A4%BC%E0%A4%B0/dp/B0866JTZXN/ref=sr_1_1_sspa?dchild=1&keywords=hand+sanitizer&qid=1592846967&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExSVdYSkQ3UDdQR01aJmVuY3J5cHRlZElkPUEwMDYxMzgxOVU2N0UwNVQ1UFlEJmVuY3J5cHRlZEFkSWQ9QTAwNjg5MzEyUUdQMDFaQjNLTTNOJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='>here is the link where you can buy the sanitizer</a>
	</p>
   <img height=500 widhth=90 src='https://undark.org/wp-content/uploads/2020/05/hanfasdf-scaled.jpg'>
	`;
        coronaDetails2.innerHTML =html2;
    }

}