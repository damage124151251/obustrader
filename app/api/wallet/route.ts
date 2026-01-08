import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const WALLET_ADDRESS = 'D6LFvYtYAbtgDUiqHKjUgQWiK7ziSunMAQJw7TKk7tfS';
const RPC_URL = 'https://api.mainnet-beta.solana.com';

export async function GET() {
  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    const publicKey = new PublicKey(WALLET_ADDRESS);

    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    return NextResponse.json({
      address: WALLET_ADDRESS,
      balance: solBalance,
      balanceFormatted: solBalance.toFixed(4)
    });
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json({
      address: WALLET_ADDRESS,
      balance: 0,
      balanceFormatted: '0.0000',
      error: error.message
    });
  }
}
