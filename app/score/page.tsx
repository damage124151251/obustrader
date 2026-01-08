'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TokenScore {
  symbol: string;
  name: string;
  imageUrl: string | null;
  mintAddress: string;
  score: number;
  grade: string;
  metrics: {
    marketCap: number;
    liquidity: number;
    holders: number;
    ageMinutes: number;
    devSoldPercent: number;
    bundlePercent: number;
  };
  risks: string[];
  positives: string[];
}

// X (Twitter) Icon Component
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'var(--obus-green)';
    case 'B': return '#7FFF00';
    case 'C': return 'var(--obus-yellow)';
    case 'D': return '#FFA500';
    case 'F': return 'var(--obus-red)';
    default: return 'var(--obus-gray)';
  }
}

function getScoreGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

export default function ScorePage() {
  const [mintAddress, setMintAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TokenScore | null>(null);

  const analyzeToken = async () => {
    if (!mintAddress.trim()) {
      setError('Please enter a token CA');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/score?mint=${mintAddress.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze token');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze token');
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/score" className="nav-link active">Score</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
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
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="pixel-font" style={{
            fontSize: '20px',
            color: 'var(--obus-yellow)',
            marginBottom: '16px',
            textShadow: '0 0 30px var(--obus-yellow-glow)'
          }}>
            TOKEN SCORE
          </h1>
          <p style={{ color: 'var(--obus-gray)', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
            Enter a Pump.fun token CA to get an instant risk score and analysis
          </p>
        </div>

        {/* Search Card */}
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div className="card-title">
            <span className="led led-yellow" />
            Analyze Token
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="Enter token CA (mint address)..."
              onKeyDown={(e) => e.key === 'Enter' && analyzeToken()}
              style={{
                flex: 1,
                background: 'var(--obus-dark)',
                border: '1px solid var(--obus-card-border)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--obus-white)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button
              onClick={analyzeToken}
              disabled={loading}
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 7, 58, 0.1)',
              border: '1px solid var(--obus-red)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'var(--obus-red)',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--obus-gray)' }}>Fetching token data...</p>
          </div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Token Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--obus-card-border)'
            }}>
              {result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt={result.symbol}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--obus-card-border)'
                  }}
                />
              ) : (
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--obus-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'var(--obus-gray)',
                  border: '3px solid var(--obus-card-border)'
                }}>
                  {result.symbol?.charAt(0) || '?'}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--obus-white)' }}>
                    {result.symbol}
                  </span>
                  <a
                    href={`https://pump.fun/coin/${result.mintAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--obus-cyan)', fontSize: '12px', textDecoration: 'none' }}
                  >
                    View on Pump.fun
                  </a>
                </div>
                <div style={{ color: 'var(--obus-gray)', fontSize: '13px', marginTop: '4px' }}>
                  {result.name}
                </div>
              </div>

              {/* Score Circle */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(${getGradeColor(result.grade)} ${result.score * 3.6}deg, var(--obus-dark) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--obus-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: getGradeColor(result.grade),
                    lineHeight: 1
                  }}>
                    {result.grade}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--obus-gray)' }}>
                    {result.score}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Market Cap</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--obus-white)' }}>
                  ${result.metrics.marketCap?.toLocaleString() || 0}
                </div>
              </div>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Liquidity</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--obus-white)' }}>
                  ${result.metrics.liquidity?.toLocaleString() || 0}
                </div>
              </div>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Holders</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--obus-white)' }}>
                  {result.metrics.holders || 0}
                </div>
              </div>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Age</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--obus-white)' }}>
                  {result.metrics.ageMinutes < 60
                    ? `${result.metrics.ageMinutes?.toFixed(0)}m`
                    : `${(result.metrics.ageMinutes / 60)?.toFixed(1)}h`}
                </div>
              </div>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Dev Sold</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: result.metrics.devSoldPercent > 50 ? 'var(--obus-red)' : 'var(--obus-white)'
                }}>
                  {result.metrics.devSoldPercent?.toFixed(0) || 0}%
                </div>
              </div>
              <div className="inner-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--obus-gray)', marginBottom: '4px' }}>Bundle %</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: result.metrics.bundlePercent > 30 ? 'var(--obus-red)' : 'var(--obus-white)'
                }}>
                  {result.metrics.bundlePercent?.toFixed(0) || 0}%
                </div>
              </div>
            </div>

            {/* Risks */}
            {result.risks.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--obus-red)',
                  fontWeight: 600,
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  Risks
                </div>
                {result.risks.map((risk, i) => (
                  <div key={i} style={{
                    background: 'rgba(255, 7, 58, 0.1)',
                    border: '1px solid rgba(255, 7, 58, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: 'var(--obus-red)'
                  }}>
                    {risk}
                  </div>
                ))}
              </div>
            )}

            {/* Positives */}
            {result.positives.length > 0 && (
              <div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--obus-green)',
                  fontWeight: 600,
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  Positives
                </div>
                {result.positives.map((positive, i) => (
                  <div key={i} style={{
                    background: 'rgba(0, 255, 65, 0.1)',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: 'var(--obus-green)'
                  }}>
                    {positive}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
        </div>
      </footer>
    </main>
  );
}
