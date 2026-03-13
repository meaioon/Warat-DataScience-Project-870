import axios from 'axios';
import fs from 'fs';

async function geocodeAirports() {
  const sourceAirports = JSON.parse(fs.readFileSync('airports_data.json', 'utf8'));
  let cache = [];
  if (fs.existsSync('airports_geocoded_v2.json')) {
    cache = JSON.parse(fs.readFileSync('airports_geocoded_v2.json', 'utf8'));
  }
  
  const geocoded = [];

  for (const airport of sourceAirports) {
    // Check if already geocoded in cache
    const cached = cache.find(a => a.nameTh === airport.nameTh && a.locationTh === airport.locationTh);
    if (cached && cached.lat && cached.lon) {
        geocoded.push({ ...airport, lat: cached.lat, lon: cached.lon });
        continue;
    }
    console.log(`Geocoding ${airport.nameTh}...`);
    let lat = null;
    let lon = null;

    if (airport.wikiUrl) {
      try {
        let wikiUrl = airport.wikiUrl;
        if (wikiUrl.includes('https://th.wikipedia.org//th.wikipedia.org/')) {
            wikiUrl = wikiUrl.replace('https://th.wikipedia.org//th.wikipedia.org/', 'https://th.wikipedia.org/');
        }
        const title = decodeURIComponent(wikiUrl.split('/wiki/')[1]);
        const apiUrl = `https://th.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=${encodeURIComponent(title)}&format=json`;
        const { data } = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].coordinates) {
          lat = pages[pageId].coordinates[0].lat;
          lon = pages[pageId].coordinates[0].lon;
          console.log(`  Found coordinates from Wikipedia: ${lat}, ${lon}`);
        }
      } catch (e) {
        console.error(`  Error fetching from Wikipedia for ${airport.nameTh}: ${e.message}`);
      }
    }

    if (!lat || !lon) {
      // Try Nominatim as fallback
      try {
        const query = `${airport.nameTh} ${airport.locationTh} Thailand`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const { data } = await axios.get(nominatimUrl, {
          headers: { 'User-Agent': 'ThailandAirportApp/1.0' }
        });
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
          console.log(`  Found coordinates from Nominatim: ${lat}, ${lon}`);
        }
      } catch (e) {
        console.error(`  Error fetching from Nominatim for ${airport.nameTh}: ${e.message}`);
      }
    }

    geocoded.push({ ...airport, lat, lon });
    // Sleep to respect API limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  fs.writeFileSync('airports_geocoded_v2.json', JSON.stringify(geocoded, null, 2));
  console.log(`Geocoded ${geocoded.length} airports.`);
}

geocodeAirports().catch(console.error);
