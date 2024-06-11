import Link from 'next/link';
import * as React from 'react';

import Wallet from '@/components/Providers/wallet';

export default function Header() {
  return (
    <header className='sticky top-0 z-50'>
      <div className=' w-full'>
        <div className="navbar bg-base-200 px-6 border-b-2 border-base-300">
          <div className="navbar-start">
            <Link href="/" className="btn btn-ghost text-xl text-primary">Fact</Link>
          </div>
          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle mx-2">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            <Wallet />
          </div>
        </div>
      </div>
    </header>
  );
}
