// test/raw-api.ts - Check raw API response

async function checkRawAPI() {
  console.log('🔍 Checking raw CoinGecko API response...\n');

  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true';
    
    console.log('Fetching from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));
    
    // Check the structure
    console.log('\nResponse structure:');
    Object.keys(data).forEach(key => {
      console.log(`${key}:`, data[key]);
    });

  } catch (error) {
    console.error('Raw API check failed:', error);
  }
}

checkRawAPI().catch(console.error);
