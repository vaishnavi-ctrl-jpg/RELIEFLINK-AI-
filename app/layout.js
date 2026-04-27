import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'ReliefLink AI',
  description: 'AI-powered disaster relief matching',
};

import { ToastProvider } from './components/ToastProvider';
import Image from 'next/image';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="layout-shell">
            <Sidebar />

            <main className="main-content">
              <header className="top-header">
                <input type="text" placeholder="Search events, resources..." className="search-bar" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.25rem', cursor: 'pointer' }}>🔔</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden', position: 'relative' }}>
                      <Image 
                        src="/images/adminstrator.jpeg" 
                        alt="User" 
                        width={36} 
                        height={36} 
                        style={{ objectFit: 'cover' }} 
                        unoptimized
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Jane Doe</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrator</p>
                    </div>
                  </div>
                </div>
              </header>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
