import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function parseAirports() {
  const url = 'https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2';
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const $ = cheerio.load(data);

  console.log('Total sections found:', $('section').length);
  $('h2, h3').each((i, el) => {
    console.log(`Header ${i}:`, $(el).text().trim());
  });

  console.log('Total tables found:', $('table').length);
  $('table').each((i, table) => {
    console.log(`Table ${i} first row:`, $(table).find('tr').first().text().trim().substring(0, 100));
  });

  const airports = [];

  // Commercial Airports
  let commercialCount = 0;
  $('section:contains("รายชื่อสนามบินที่มีการบินเชิงพาณิชย์")').find('table').first().find('tr').each((i, el) => {
    if (i === 0) return; // Header
    const cols = $(el).find('td');
    if (cols.length >= 6) {
      commercialCount++;
      // ... existing code ...
      const province = $(cols[0]).text().trim();
      const district = $(cols[1]).text().trim();
      const iata = $(cols[2]).text().trim();
      const icao = $(cols[3]).text().trim();
      const nameTh = $(cols[4]).text().trim();
      const nameEn = $(cols[5]).text().trim();
      const agency = $(cols[6]).text().trim();
      const wikiLink = $(cols[4]).find('a').attr('href');
      airports.push({
        icao,
        iata,
        nameTh,
        nameEn,
        locationTh: province,
        districtTh: district,
        agencyTh: agency,
        wikiUrl: wikiLink ? (wikiLink.startsWith('http') ? wikiLink : `https://th.wikipedia.org${wikiLink}`) : null,
        status: 'ACTIVE',
        type: 'COMMERCIAL'
      });
    }
  });
  console.log(`Extracted ${commercialCount} commercial airports.`);

  // Non-Commercial Airports
  let nonCommercialCount = 0;
  $('section:contains("รายชื่อสนามบินที่ไม่มีการบินเชิงพาณิชย์")').find('table').first().find('tr').each((i, el) => {
    if (i === 0) return; // Header
    const cols = $(el).find('td');
    if (cols.length >= 6) {
      nonCommercialCount++;
      const province = $(cols[0]).text().trim();
      const district = $(cols[1]).text().trim();
      const iata = $(cols[2]).text().trim();
      const icao = $(cols[3]).text().trim();
      const nameTh = $(cols[4]).text().trim();
      const nameEn = $(cols[5]).text().trim();
      const agency = $(cols[6]).text().trim();
      const revoked = cols.length >= 9 ? $(cols[8]).text().trim() : '';
      
      const wikiLink = $(cols[4]).find('a').attr('href');
      airports.push({
        icao,
        iata,
        nameTh,
        nameEn,
        locationTh: province,
        districtTh: district,
        agencyTh: agency,
        wikiUrl: wikiLink ? (wikiLink.startsWith('http') ? wikiLink : `https://th.wikipedia.org${wikiLink}`) : null,
        status: revoked ? 'CLOSED' : 'ACTIVE',
        type: 'NON-COMMERCIAL'
      });
    }
  });
  console.log(`Extracted ${nonCommercialCount} non-commercial airports.`);

  // Other Airports
  let otherCount = 0;
  $('section:contains("สนามบินอื่น ๆ")').find('table').first().find('tr').each((i, el) => {
    if (i === 0) return; // Header
    const cols = $(el).find('td');
    if (cols.length >= 3) {
      otherCount++;
      const province = $(cols[0]).text().trim();
      const district = $(cols[1]).text().trim();
      const nameTh = $(cols[2]).text().trim();
      const wikiLink = $(cols[2]).find('a').attr('href');
      airports.push({
        nameTh,
        locationTh: province,
        districtTh: district,
        agencyTh: 'PRIVATE',
        wikiUrl: wikiLink ? (wikiLink.startsWith('http') ? wikiLink : `https://th.wikipedia.org${wikiLink}`) : null,
        status: 'ACTIVE',
        type: 'OTHER'
      });
    }
  });
  console.log(`Extracted ${otherCount} other airports.`);

  // Historical Airports (Lists)
  let historicalCount = 0;
  const historicalHeader = $('h2:contains("สนามบินในยุคก่อนพระราชบัญญัติการเดินอากาศ พ.ศ. 2497")');
  if (historicalHeader.length > 0) {
    historicalHeader.closest('.mw-heading').nextAll('section').addBack().find('li').each((i, li) => {
      const text = $(li).text().trim();
      // Match patterns like "สนามบินสำหรับจังหวัด...", "สนามบินประจำจังหวัด...", "สนามบินจังหวัด..."
      const matches = text.matchAll(/(สนามบิน(?:สำหรับ|ประจำ)?จังหวัด|สนามบินตำบล|สนามบิน)(\S+)/g);
      for (const match of matches) {
        const fullName = match[0];
        const location = match[2];
        
        // Try to find a link if it exists for this specific airport
        let wikiUrl = null;
        $(li).find('a').each((j, a) => {
          if ($(a).text().includes(location)) {
            const href = $(a).attr('href');
            wikiUrl = href ? (href.startsWith('http') ? href : `https://th.wikipedia.org${href}`) : null;
          }
        });

        historicalCount++;
        airports.push({
          nameTh: fullName,
          locationTh: location,
          agencyTh: 'HISTORICAL',
          wikiUrl: wikiUrl,
          status: 'CLOSED',
          type: 'HISTORICAL'
        });
      }
    });
  }
  console.log(`Extracted ${historicalCount} historical airports.`);

  fs.writeFileSync('airports_data.json', JSON.stringify(airports, null, 2));
  console.log(`Extracted ${airports.length} airports.`);
}

parseAirports().catch(console.error);
