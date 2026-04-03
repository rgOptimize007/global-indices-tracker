#!/usr/bin/env python3
import json
import math
import random
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / 'data' / 'indices.db'
OUTPUT_PATH = BASE_DIR / 'public' / 'data' / 'indices.json'

INDICES = [
    ('NIFTY50', 'NIFTY 50', 'INR', 22713.10, 0.9),
    ('NASDAQ100', 'NASDAQ 100', 'USD', 18443.77, 1.15)
]
TIMEFRAMES = {
    '1D': 48,
    '1W': 56,
    '1M': 60
}


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS index_ticks (
          symbol TEXT NOT NULL,
          name TEXT NOT NULL,
          currency TEXT NOT NULL,
          timeframe TEXT NOT NULL,
          ts TEXT NOT NULL,
          value REAL NOT NULL
        )
        '''
    )
    conn.execute('CREATE INDEX IF NOT EXISTS idx_symbol_tf_ts ON index_ticks(symbol, timeframe, ts)')


def reseed_dataset(conn: sqlite3.Connection) -> None:
    """Rebuild the dataset on every run so timestamps and values stay fresh."""
    conn.execute('DELETE FROM index_ticks')

    now = datetime.now(timezone.utc).replace(second=0, microsecond=0)

    for symbol, name, currency, base, volatility in INDICES:
        for timeframe, points in TIMEFRAMES.items():
            start = now - timedelta(minutes=points * 15)

            for i in range(points):
                phase = i / max(points - 1, 1)
                wave = math.sin(phase * 6.28) * (base * 0.002)
                noise = random.uniform(-1, 1) * volatility * (base * 0.0009)
                drift = (i / points) * base * 0.0012
                value = max(base * 0.82, base + wave + noise + drift)
                timestamp = (start + timedelta(minutes=i * 15)).isoformat()

                conn.execute(
                    'INSERT INTO index_ticks(symbol, name, currency, timeframe, ts, value) VALUES (?, ?, ?, ?, ?, ?)',
                    (symbol, name, currency, timeframe, timestamp, round(value, 2))
                )

    conn.commit()


def export_json(conn: sqlite3.Connection) -> None:
    rows = conn.execute(
        '''
        SELECT symbol, name, currency, timeframe, ts, value
        FROM index_ticks
        ORDER BY symbol, timeframe, ts
        '''
    ).fetchall()

    payload = {
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'timeframes': list(TIMEFRAMES.keys()),
        'indices': []
    }

    grouped = {}
    for symbol, name, currency, timeframe, ts, value in rows:
        key = (symbol, name, currency)
        grouped.setdefault(key, {}).setdefault(timeframe, []).append({'ts': ts, 'value': value})

    for (symbol, name, currency), series in grouped.items():
        payload['indices'].append(
            {
                'symbol': symbol,
                'name': name,
                'currency': currency,
                'series': series
            }
        )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding='utf-8')


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        ensure_schema(conn)
        reseed_dataset(conn)
        export_json(conn)


if __name__ == '__main__':
    main()
