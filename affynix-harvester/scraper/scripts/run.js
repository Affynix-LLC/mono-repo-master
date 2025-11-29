

/**
 * Affynix Autonomous Scraper Runner
 *
 * This script loads each network-specific scraper (ClickBank, WarriorPlus,
 * JVZoo, Impact, CJ, etc.), executes them, normalizes their results, and
 * posts each offer to the Affynix backend intake API.
 */

import axios from 'axios';
import clickbank from './clickbank.js';
import warriorplus from './warriorplus.js';
import jvzoo from './jvzoo.js';
import impact from './impact.js';
import cj from './cj.js';
import generic from './generic.js';

// Master list of scrapers to run (extendable)
const SCRAPERS = [
  { name: 'ClickBank', fn: clickbank },
  { name: 'WarriorPlus', fn: warriorplus },
  { name: 'JVZoo', fn: jvzoo },
  { name: 'Impact', fn: impact },
  { name: 'CJ', fn: cj },
  { name: 'Generic', fn: generic }
];

const INTAKE_URL = process.env.AFFYNIX_INTAKE_URL || 'https://affynix.com/api/scraper-intake';
const AUTH_KEY = process.env.AFFYNIX_SCRAPER_KEY || null;

if (!AUTH_KEY) {
  console.error('[SCRAPER] Missing AFFYNIX_SCRAPER_KEY');
}

/**
 * Push offer to backend intake API.
 */
async function submitOffer(offer, source) {
  try {
    const res = await axios.post(
      INTAKE_URL,
      { ...offer, source },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-AFFYNIX-SCRAPER': AUTH_KEY
        }
      }
    );

    console.log(`[INTAKE] OK → ${offer.name} (${source})`);
    return res.data;

  } catch (err) {
    console.error(`[INTAKE] ERROR for ${offer.name} (${source})`, err?.response?.data || err);
    return null;
  }
}

/**
 * Run all scrapers sequentially.
 */
async function runAll() {
  console.log('=== Affynix Autonomous Scraper Engine START ===');

  for (const scraper of SCRAPERS) {
    console.log(`\n[SOURCE] Running → ${scraper.name}`);

    try {
      const offers = await scraper.fn();

      if (!offers || offers.length === 0) {
        console.log(`[${scraper.name}] No offers returned.`);
        continue;
      }

      console.log(`[${scraper.name}] Extracted ${offers.length} offers.`);

      for (const offer of offers) {
        await submitOffer(offer, scraper.name);
      }

    } catch (err) {
      console.error(`[${scraper.name}] FAILED`, err);
    }
  }

  console.log('\n=== Affynix Autonomous Scraper Engine COMPLETE ===');
}

// Execute
runAll();