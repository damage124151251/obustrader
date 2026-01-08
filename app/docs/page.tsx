'use client';

import Image from 'next/image';
import Link from 'next/link';

// X (Twitter) Icon Component
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function DocsPage() {
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

          <div className="header-nav">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/docs" className="nav-link active">Docs</Link>
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

      {/* Docs Content */}
      <div className="docs-container">
        {/* Hero */}
        <div className="docs-hero">
          <Image
            src="/logo.png"
            alt="OBUS"
            width={120}
            height={120}
            className="logo-image"
            style={{ objectFit: 'cover', marginBottom: '24px' }}
          />
          <h1 className="docs-title">OBUS TRADER</h1>
          <p className="docs-subtitle">
            Autonomous AI-powered trading bot for Solana memecoins.
            100% of profits distributed to $OBUS token holders.
          </p>
        </div>

        {/* What is OBUS */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">What is OBUS?</h2>
            <p className="docs-text">
              OBUS is an autonomous trading bot that monitors new token launches on Pump.fun,
              uses artificial intelligence (Claude AI) to analyze each token, and automatically
              executes trades based on the AI&apos;s decisions.
            </p>
            <p className="docs-text">
              What makes OBUS unique is its profit distribution model: 100% of all trading profits
              are distributed to $OBUS token holders every 10 minutes. This creates a truly
              community-owned trading operation where everyone benefits from the bot&apos;s success.
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">How the AI Sniper Works</h2>
            <p className="docs-text">
              The bot continuously monitors Pump.fun for new token launches. When a new token is
              detected, it goes through a rigorous analysis process:
            </p>
            <ul className="docs-list">
              <li>
                <strong>Token Detection</strong> — Real-time monitoring of Pump.fun via WebSocket
                connection detects new tokens within seconds of launch.
              </li>
              <li>
                <strong>Data Collection</strong> — The bot gathers metrics including token age,
                market cap, holder count, developer holdings, and bundle percentage.
              </li>
              <li>
                <strong>AI Analysis</strong> — Claude AI analyzes all metrics and provides a
                sentiment (FEAR/NEUTRAL/EUPHORIA), confidence score, and BUY/SKIP decision.
              </li>
              <li>
                <strong>Trade Execution</strong> — If the AI decides to BUY with confidence above
                70%, the bot automatically executes the trade via PumpPortal API.
              </li>
              <li>
                <strong>Position Management</strong> — Open positions are monitored every 10 seconds.
                Automatic Take Profit at +30% and Stop Loss at -15%.
              </li>
            </ul>
          </div>
        </section>

        {/* Analysis Criteria */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">Analysis Criteria</h2>
            <p className="docs-text">
              The AI considers these key metrics when analyzing tokens:
            </p>
            <ul className="docs-list">
              <li>
                <strong>Token Age</strong> — Ideal: less than 5 minutes old. Early entry is crucial
                for capturing momentum.
              </li>
              <li>
                <strong>Market Cap</strong> — Ideal: under $10,000. Lower market cap means more
                upside potential.
              </li>
              <li>
                <strong>Developer Holdings</strong> — Ideal: dev sold less than 80%. A developer
                still holding shows confidence.
              </li>
              <li>
                <strong>Holder Count</strong> — Ideal: 40+ holders. Indicates organic interest and
                distribution.
              </li>
              <li>
                <strong>Bundle Percentage</strong> — Ideal: under 30%. High bundles suggest
                coordinated buying (potential dump risk).
              </li>
            </ul>
          </div>
        </section>

        {/* Profit Distribution */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">Profit Distribution</h2>
            <p className="docs-text">
              Every 10 minutes, the bot calculates all profits since the last distribution and
              sends SOL directly to $OBUS token holders proportional to their holdings.
            </p>
            <ul className="docs-list">
              <li>
                <strong>100% Distribution</strong> — All trading profits go to holders. The bot
                keeps nothing.
              </li>
              <li>
                <strong>Proportional Rewards</strong> — If you hold 1% of $OBUS supply, you receive
                1% of profits.
              </li>
              <li>
                <strong>Automatic Delivery</strong> — SOL is sent directly to your wallet. No
                claiming required.
              </li>
              <li>
                <strong>Real Holders Only</strong> — PDAs, liquidity pools, and bonding curves are
                excluded from distribution.
              </li>
            </ul>
          </div>
        </section>

        {/* How to Participate */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">How to Become a Holder</h2>
            <p className="docs-text">
              To receive profit distributions, simply hold $OBUS tokens in your wallet:
            </p>
            <ul className="docs-list">
              <li>
                <strong>Buy $OBUS</strong> — Purchase $OBUS tokens on Pump.fun or any supported DEX.
              </li>
              <li>
                <strong>Hold in Wallet</strong> — Keep tokens in a standard Solana wallet (Phantom,
                Solflare, etc.).
              </li>
              <li>
                <strong>Receive SOL</strong> — Every 10 minutes, if there are profits, you&apos;ll
                receive SOL automatically.
              </li>
            </ul>
          </div>
        </section>

        {/* Technology */}
        <section className="docs-section">
          <div className="card">
            <h2 className="docs-section-title">Technology Stack</h2>
            <ul className="docs-list">
              <li>
                <strong>Blockchain</strong> — Solana (fast, low-cost transactions)
              </li>
              <li>
                <strong>AI</strong> — Claude AI by Anthropic (advanced reasoning)
              </li>
              <li>
                <strong>Trading</strong> — PumpPortal API and Jupiter Aggregator
              </li>
              <li>
                <strong>Data</strong> — Helius RPC and DexScreener
              </li>
              <li>
                <strong>Database</strong> — Supabase (real-time updates)
              </li>
              <li>
                <strong>Frontend</strong> — Next.js with real-time Supabase subscriptions
              </li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="docs-section">
          <div className="card" style={{ borderColor: 'var(--obus-red)' }}>
            <h2 className="docs-section-title" style={{ color: 'var(--obus-red)' }}>
              Risk Disclaimer
            </h2>
            <p className="docs-text">
              Trading memecoins involves significant risk. Past performance does not guarantee
              future results. Key risks include:
            </p>
            <ul className="docs-list">
              <li>
                <strong>Market Risk</strong> — Memecoin prices are extremely volatile and can go
                to zero.
              </li>
              <li>
                <strong>Smart Contract Risk</strong> — Bugs or exploits in token contracts can
                result in total loss.
              </li>
              <li>
                <strong>Rug Pull Risk</strong> — Despite AI analysis, some projects may still be
                scams.
              </li>
              <li>
                <strong>Technical Risk</strong> — Bot malfunctions, network issues, or API failures
                can occur.
              </li>
            </ul>
            <p className="docs-text" style={{ marginTop: '20px', color: 'var(--obus-red)' }}>
              Only invest what you can afford to lose. This is not financial advice.
            </p>
          </div>
        </section>
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
