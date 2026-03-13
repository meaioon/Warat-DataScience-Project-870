import fs from 'fs';

const geocoded = JSON.parse(fs.readFileSync('airports_geocoded_v2.json', 'utf8'));

const mapped = geocoded
  .filter(a => a.lat && a.lon)
  .map(a => {
    let category = 'PRIVATE';
    const agency = a.agencyTh || '';
    const status = a.status || 'ACTIVE';

    if (status === 'CLOSED' || a.type === 'HISTORICAL') {
      category = 'CLOSED';
    } else if (agency.includes('ท่าอากาศยานไทย')) {
      category = 'AOT';
    } else if (agency.includes('กรมท่าอากาศยาน')) {
      category = 'DOA';
    } else if (agency.includes('กองทัพบก')) {
      category = 'ARMY';
    } else if (agency.includes('กองทัพเรือ')) {
      category = 'NAVY';
    } else if (agency.includes('กองทัพอากาศ')) {
      category = 'AIRFORCE';
    }

    let wikiUrl = a.wikiUrl;
    if (wikiUrl && wikiUrl.includes('https://th.wikipedia.org//th.wikipedia.org/')) {
      wikiUrl = wikiUrl.replace('https://th.wikipedia.org//th.wikipedia.org/', 'https://th.wikipedia.org/');
    }

    return {
      id: a.icao || a.iata || a.nameTh,
      nameTh: a.nameTh,
      nameEn: a.nameEn || a.nameTh,
      locationTh: a.locationTh,
      lat: a.lat,
      lng: a.lon,
      category: category,
      wikiUrlTh: wikiUrl
    };
  });

fs.writeFileSync('airports_for_app.json', JSON.stringify(mapped, null, 2));
console.log(`Transformed ${mapped.length} airports for the app.`);
