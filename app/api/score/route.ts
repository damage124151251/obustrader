import { NextRequest, NextResponse } from 'next/server';

interface PumpfunTokenData {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string | null;
  show_name: boolean;
  king_of_the_hill_timestamp: number | null;
  market_cap: number;
  reply_count: number;
  last_reply: number | null;
  nsfw: boolean;
  market_id: string | null;
  inverted: boolean | null;
  usd_market_cap: number;
}

// Get current SOL price from CoinGecko
async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
      next: { revalidate: 60 }
    });
    if (response.ok) {
      const data = await response.json();
      return data.solana?.usd || 180;
    }
  } catch (error) {
    // Fallback
  }
  return 180;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    return NextResponse.json({ error: 'Missing mint address' }, { status: 400 });
  }

  // Validate mint address format (Solana addresses are base58, typically 32-44 chars)
  if (mint.length < 32 || mint.length > 50) {
    return NextResponse.json({ error: 'Invalid mint address format' }, { status: 400 });
  }

  try {
    // Get current SOL price
    const solPrice = await getSolPrice();

    // Fetch token data from Pump.fun API
    const response = await fetch(`https://frontend-api.pump.fun/coins/${mint}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OBUS-Trader/1.0'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          error: 'Token not found on Pump.fun. Only Pump.fun tokens are supported.'
        }, { status: 404 });
      }
      throw new Error(`Pump.fun API error: ${response.status}`);
    }

    const tokenData: PumpfunTokenData = await response.json();

    // Validate this is actually a Pump.fun token (must have bonding curve)
    if (!tokenData.bonding_curve && !tokenData.raydium_pool) {
      return NextResponse.json({
        error: 'This token is not from Pump.fun. Only Pump.fun tokens are supported.'
      }, { status: 400 });
    }

    // Calculate age in minutes
    const ageMinutes = (Date.now() - tokenData.created_timestamp) / 1000 / 60;

    // Use usd_market_cap directly from Pump.fun API (most accurate)
    let marketCap = tokenData.usd_market_cap || 0;

    // Fallback to market_cap field if usd_market_cap is not available
    if (!marketCap && tokenData.market_cap > 0) {
      marketCap = tokenData.market_cap;
    }

    // Calculate liquidity - virtual_sol_reserves is in lamports, convert to SOL first
    const solReservesInSol = (tokenData.virtual_sol_reserves || 0) / 1_000_000_000;
    const liquidity = solReservesInSol * solPrice;

    // Estimate holders (pump.fun doesn't give exact holder count, use reply_count as proxy)
    const holders = Math.max(1, tokenData.reply_count || 1);

    // Dev sold percent - we can't get this directly from pump.fun API
    const devSoldPercent = tokenData.complete ? 100 : 0;

    // Bundle percent - can't determine from pump.fun API alone
    const bundlePercent = 0;

    // Calculate score based on various factors
    let score = 50; // Start at neutral
    const risks: string[] = [];
    const positives: string[] = [];

    // Age scoring
    if (ageMinutes < 5) {
      score -= 15;
      risks.push('Token is very new (< 5 minutes)');
    } else if (ageMinutes < 30) {
      score -= 5;
      risks.push('Token is less than 30 minutes old');
    } else if (ageMinutes > 60) {
      score += 10;
      positives.push('Token has survived for over 1 hour');
    }

    // Market cap scoring
    if (marketCap < 5000) {
      score -= 10;
      risks.push('Very low market cap (< $5k)');
    } else if (marketCap >= 5000 && marketCap < 20000) {
      score += 5;
      positives.push('Growing market cap ($5k-$20k range)');
    } else if (marketCap >= 20000 && marketCap < 100000) {
      score += 15;
      positives.push('Healthy market cap ($20k-$100k)');
    } else if (marketCap >= 100000) {
      score += 20;
      positives.push('Strong market cap (> $100k)');
    }

    // Liquidity scoring
    if (liquidity < 1000) {
      score -= 10;
      risks.push('Very low liquidity');
    } else if (liquidity >= 5000) {
      score += 10;
      positives.push('Good liquidity available');
    }

    // Community engagement (using reply count)
    if (tokenData.reply_count > 50) {
      score += 10;
      positives.push('Active community engagement');
    } else if (tokenData.reply_count > 10) {
      score += 5;
      positives.push('Some community interest');
    } else if (tokenData.reply_count < 3) {
      score -= 5;
      risks.push('Very low community engagement');
    }

    // Social presence
    if (tokenData.twitter || tokenData.telegram || tokenData.website) {
      score += 10;
      positives.push('Has social media presence');
    } else {
      score -= 5;
      risks.push('No social media links');
    }

    // Bonding curve status
    if (tokenData.complete) {
      score += 15;
      positives.push('Bonding curve completed - migrated to Raydium');
    }

    // NSFW check
    if (tokenData.nsfw) {
      score -= 10;
      risks.push('Flagged as NSFW content');
    }

    // King of the hill status
    if (tokenData.king_of_the_hill_timestamp) {
      score += 10;
      positives.push('Reached King of the Hill status');
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine grade
    let grade: string;
    if (score >= 80) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';
    else if (score >= 20) grade = 'D';
    else grade = 'F';

    return NextResponse.json({
      symbol: tokenData.symbol,
      name: tokenData.name,
      imageUrl: tokenData.image_uri,
      mintAddress: mint,
      score,
      grade,
      metrics: {
        marketCap: Math.round(marketCap),
        liquidity: Math.round(liquidity),
        holders,
        ageMinutes,
        devSoldPercent,
        bundlePercent
      },
      risks,
      positives
    });

  } catch (error: any) {
    console.error('Error analyzing token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze token. Make sure this is a Pump.fun token.' },
      { status: 500 }
    );
  }
}
