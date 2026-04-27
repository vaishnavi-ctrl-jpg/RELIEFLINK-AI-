'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/incidents', label: 'Active Incidents', icon: '⚠️' },
    { href: '/map', label: 'Resource Map', icon: '🗺️' },
    { href: '/volunteers', label: 'Volunteers', icon: '👥' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const bottomItems = [
    { href: '/help', label: 'Help Center', icon: '❓' },
  ];

  const isActive = (href) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* Brand area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>R</span>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>ReliefLink <span style={{ color: 'var(--accent-primary)' }}>AI</span></h2>
        </div>
        
        {/* System Pulse */}
        <div className="system-status">
          <div className="pulse-dot"></div>
          RES_COMMAND: ACTIVE
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
          >
            <div className="nav-pip"></div>
            <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        {bottomItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
          >
            <div className="nav-pip"></div>
            <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
