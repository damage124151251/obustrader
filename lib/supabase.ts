import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface BotStatus {
  id: string;
  wallet_address: string;
  obus_token_mint: string | null;
  status: string;
  total_profit_sol: number;
  total_distributed_sol: number;
  tokens_analyzed: number;
  tokens_bought: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyzedToken {
  id: string;
  mint_address: string;
  symbol: string;
  name: string;
  age_minutes: number;
  market_cap_usd: number;
  dev_sold_percent: number;
  holders: number;
  bundle_percent: number;
  liquidity_usd: number;
  ai_sentiment: 'FEAR' | 'NEUTRAL' | 'EUPHORIA';
  ai_decision: 'BUY' | 'SKIP';
  ai_confidence: number;
  ai_reasoning: string;
  ai_metrics: Record<string, any>;
  was_bought: boolean;
  created_at: string;
}

export interface Trade {
  id: string;
  token_mint: string;
  token_symbol: string;
  action: 'BUY' | 'SELL';
  reason: string;
  amount_sol: number;
  amount_token: number;
  price_usd: number;
  market_cap_usd: number;
  tx_signature: string;
  status: string;
  pnl_sol: number;
  pnl_percent: number;
  created_at: string;
}

export interface Position {
  id: string;
  token_mint: string;
  token_symbol: string;
  entry_price_usd: number;
  entry_amount_sol: number;
  entry_amount_token: number;
  entry_market_cap: number;
  current_price_usd: number;
  current_pnl_percent: number;
  is_open: boolean;
  exit_reason: string | null;
  exit_price_usd: number | null;
  exit_pnl_sol: number | null;
  exit_pnl_percent: number | null;
  opened_at: string;
  closed_at: string | null;
}

export interface Distribution {
  id: string;
  total_amount_sol: number;
  holders_count: number;
  tx_signatures: string[];
  created_at: string;
}

export interface TradingStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  total_pnl_sol: number;
  win_rate: number;
}
