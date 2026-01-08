'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Trade, Position, AnalyzedToken, Distribution, TradingStats, BotStatus } from '@/lib/supabase';

// Helper functions
function formatSol(amount: number): string {
  if (!amount) return '0 SOL';
  return `${amount.toFixed(4)} SOL`;
}

function formatPercent(value: number): string {
  if (!value) return '0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

// X (Twitter) Icon Component
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [analyses, setAnalyses] = useState<AnalyzedToken[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch bot status (to get OBUS token mint)
        const { data: statusData } = await supabase
          .from('bot_status')
          .select('*')
          .limit(1)
          .single();
        if (statusData) setBotStatus(statusData);

        // Fetch trading stats
        const { data: statsData } = await supabase
          .from('trading_stats')
          .select('*')
          .single();
        if (statsData) setStats(statsData);

        // Fetch recent trades
        const { data: tradesData } = await supabase
          .from('trades')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (tradesData) setTrades(tradesData);

        // Fetch open positions
        const { data: positionsData } = await supabase
          .from('positions')
          .select('*')
          .eq('is_open', true)
          .order('opened_at', { ascending: false });
        if (positionsData) setPositions(positionsData);

        // Fetch recent analyses
        const { data: analysesData } = await supabase
          .from('analyzed_tokens')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (analysesData) setAnalyses(analysesData);

        // Fetch distributions
        const { data: distributionsData } = await supabase
          .from('distributions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (distributionsData) setDistributions(distributionsData);

        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up realtime subscriptions
    const tradesChannel = supabase
      .channel('trades-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTrades(prev => [payload.new as Trade, ...prev.slice(0, 19)]);
        }
      })
      .subscribe();

    const positionsChannel = supabase
      .channel('positions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'positions' }, () => {
        supabase
          .from('positions')
          .select('*')
          .eq('is_open', true)
          .order('opened_at', { ascending: false })
          .then(({ data }) => {
            if (data) setPositions(data);
          });
      })
      .subscribe();

    const analysesChannel = supabase
      .channel('analyses-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analyzed_tokens' }, (payload) => {
        setAnalyses(prev => [payload.new as AnalyzedToken, ...prev.slice(0, 9)]);
      })
      .subscribe();

    const statusChannel = supabase
      .channel('status-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_status' }, (payload) => {
        setBotStatus(payload.new as BotStatus);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tradesChannel);
      supabase.removeChannel(positionsChannel);
      supabase.removeChannel(analysesChannel);
      supabase.removeChannel(statusChannel);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <main>
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <Image
              src="/logo.png"
              alt="OBUS"
              width={48}
              height={48}
              className="logo-image"
              style={{ objectFit: 'cover' }}
            />
            <span className="logo-text">OBUS</span>
          </div>

          {/* Token CA Card */}
          <div className="token-ca-card">
            {botStatus?.obus_token_mint ? (
              <>
                <span className="token-ca-label">$OBUS CA:</span>
                <span
                  className="token-ca-address"
                  onClick={() => copyToClipboard(botStatus.obus_token_mint || '')}
                  title="Click to copy"
                >
                  {shortenAddress(botStatus.obus_token_mint, 6)}
                </span>
              </>
            ) : (
              <span className="token-not-launched">TOKEN NOT LAUNCHED YET</span>
            )}
          </div>

          <div className="header-nav">
            <Link href="/" className="nav-link active">Dashboard</Link>
            <Link href="/score" className="nav-link">Score</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
            <span className="badge badge-live">
              <span className={`led ${isConnected ? 'led-green' : 'led-red'}`} />
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="x-button"
              title="Follow on X"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Stats Grid */}
        <section className="grid grid-4" style={{ marginBottom: '40px' }}>
          <div className="card">
            <div className="card-title">
              <span className="led led-green" />
              Total PNL
            </div>
            <div className={`stat-value ${(stats?.total_pnl_sol || 0) >= 0 ? 'positive' : 'negative'}`}>
              {formatSol(stats?.total_pnl_sol || 0)}
            </div>
            <div className="stat-label">Lifetime profit/loss</div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="led led-yellow" />
              Win Rate
            </div>
            <div className="stat-value">
              {stats?.win_rate?.toFixed(1) || 0}%
            </div>
            <div className="stat-label">{stats?.winning_trades || 0}W / {stats?.losing_trades || 0}L</div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="led led-yellow" />
              Total Trades
            </div>
            <div className="stat-value">{stats?.total_trades || 0}</div>
            <div className="stat-label">Completed trades</div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="led led-green" />
              Open Positions
            </div>
            <div className="stat-value" style={{ color: 'var(--obus-cyan)' }}>
              {positions.length}
            </div>
            <div className="stat-label">Active trades</div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-2" style={{ marginBottom: '40px' }}>
          {/* AI Analysis Section */}
          <div className="card">
            <div className="card-title">
              <span className="led led-yellow" />
              AI Analysis
            </div>
            {analyses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="inner-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Token Image */}
                        {analysis.image_url ? (
                          <img
                            src={analysis.image_url}
                            alt={analysis.symbol}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid var(--obus-gray-dark)'
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--obus-gray-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--obus-gray)'
                          }}>
                            {analysis.symbol?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a
                              href={`https://pump.fun/coin/${analysis.mint_address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontWeight: 600,
                                color: 'var(--obus-white)',
                                fontSize: '14px',
                                textDecoration: 'none'
                              }}
                              className="token-link"
                            >
                              {analysis.symbol}
                            </a>
                            <span className={`badge badge-${analysis.ai_sentiment?.toLowerCase()}`}>
                              {analysis.ai_sentiment}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--obus-gray)' }}>
                            MCap: ${analysis.market_cap_usd?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: analysis.ai_decision === 'BUY' ? 'var(--obus-green)' : 'var(--obus-red)'
                      }}>
                        {analysis.ai_decision}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--obus-gray)', marginBottom: '10px', lineHeight: '1.5' }}>
                      {analysis.ai_reasoning}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: 'var(--obus-gray)' }}>Confidence: {analysis.ai_confidence}%</span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <a
                          href={`https://pump.fun/coin/${analysis.mint_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--obus-cyan)', textDecoration: 'none', fontSize: '11px' }}
                        >
                          View on Pump.fun
                        </a>
                        <span style={{ color: 'var(--obus-gray)' }}>{timeAgo(analysis.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-text">Waiting for tokens to analyze...</div>
              </div>
            )}
          </div>

          {/* Open Positions */}
          <div className="card">
            <div className="card-title">
              <span className="led led-green" />
              Open Positions
            </div>
            {positions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {positions.map((position) => (
                  <div key={position.id} className="inner-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{position.token_symbol}</span>
                      <span style={{
                        color: (position.current_pnl_percent || 0) >= 0 ? 'var(--obus-green)' : 'var(--obus-red)',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}>
                        {formatPercent(position.current_pnl_percent || 0)}
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${(position.current_pnl_percent || 0) >= 0 ? 'green' : 'red'}`}
                          style={{
                            width: `${Math.min(100, Math.abs(position.current_pnl_percent || 0) * 3.33)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--obus-gray)' }}>
                      <span>Entry: {formatSol(position.entry_amount_sol)}</span>
                      <span>TP: +30% | SL: -15%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-text">No open positions</div>
              </div>
            )}
          </div>
        </div>

        {/* Trade History */}
        <div className="card" style={{ marginBottom: '40px' }}>
          <div className="card-title">
            <span className="led led-yellow" />
            Trade History
          </div>
          {trades.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Action</th>
                    <th>Amount</th>
                    <th>PNL</th>
                    <th>Time</th>
                    <th>TX</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, index) => (
                    <tr key={trade.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <td style={{ fontWeight: 600 }}>{trade.token_symbol}</td>
                      <td>
                        <span style={{
                          color: trade.action === 'BUY' ? 'var(--obus-green)' : 'var(--obus-red)',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          {trade.action}
                        </span>
                        {trade.reason && (
                          <span style={{ color: 'var(--obus-gray)', fontSize: '11px', marginLeft: '8px' }}>
                            ({trade.reason})
                          </span>
                        )}
                      </td>
                      <td>{formatSol(trade.amount_sol)}</td>
                      <td style={{
                        color: (trade.pnl_percent || 0) >= 0 ? 'var(--obus-green)' : 'var(--obus-red)'
                      }}>
                        {trade.action === 'SELL' ? formatPercent(trade.pnl_percent || 0) : '-'}
                      </td>
                      <td style={{ color: 'var(--obus-gray)' }}>{timeAgo(trade.created_at)}</td>
                      <td>
                        {trade.tx_signature && (
                          <a
                            href={`https://solscan.io/tx/${trade.tx_signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="token-address"
                          >
                            {shortenAddress(trade.tx_signature)}
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-text">No trades yet</div>
            </div>
          )}
        </div>

        {/* Distributions */}
        <div className="card">
          <div className="card-title">
            <span className="led led-green" />
            Profit Distributions
          </div>
          {distributions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {distributions.map((dist) => (
                <div key={dist.id} className="inner-card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--obus-green)', marginBottom: '4px', fontSize: '14px' }}>
                      {formatSol(dist.total_amount_sol)} distributed
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--obus-gray)' }}>
                      to {dist.holders_count} holders
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--obus-gray)' }}>
                      {timeAgo(dist.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-text">No distributions yet</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <Image
              src="/logo.png"
              alt="OBUS"
              width={36}
              height={36}
              className="logo-image"
              style={{ objectFit: 'cover' }}
            />
            <span className="pixel-font" style={{ fontSize: '12px', color: 'var(--obus-yellow)' }}>OBUS TRADER</span>
          </div>
          <p className="footer-text">
            Autonomous AI-Powered Trading Bot | 100% Profit Distribution to Holders
          </p>
          <p className="footer-text" style={{ marginTop: '8px' }}>
            Built on Solana | Powered by Claude AI
          </p>
        </div>
      </footer>
    </main>
  );
}
