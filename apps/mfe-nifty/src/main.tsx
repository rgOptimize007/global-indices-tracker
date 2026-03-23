import React from 'react';
import ReactDOM from 'react-dom/client';
import MarketCard from './MarketCard';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="remote-preview">
      <MarketCard />
    </div>
  </React.StrictMode>
);
