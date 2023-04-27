import * as WebSocket from 'ws';
import * as process from 'process';
import * as dotenv from 'dotenv';
import * as sqlite3Lib from 'sqlite3';
import * as path from 'path';
import { Lock } from 'async-await-mutex-lock';

const sqlite3 = sqlite3Lib.verbose();
const lock = new Lock();

interface BtcUsdtInfo {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

async function createDbConnection(
  dbPathName: string,
): Promise<sqlite3Lib.Database> {
  const filePath = path.join(process.cwd(), dbPathName);

  const db = new sqlite3.Database(filePath, (error) => {
    if (error) {
      return console.error('error connection', error.message);
    }
    createBitcoinTable(db);
  });
  console.log('Connection with SQLite has been established');
  return db;
}

async function prepareDbData(db: sqlite3Lib.Database, id: string) {
  try {
    const isExists = await selectBitcoinRows(db, id);
    console.log('DATA', isExists.data);
    if (!isExists.data) {
      // TODO: get true price
      await insertBitcoinRow(db, id, '1', '1');
    }
  } catch (err) {
    console.log('ERR', err.message);
  }
}

function createBitcoinTable(db: sqlite3Lib.Database) {
  db.exec(`
     CREATE TABLE IF NOT EXISTS bitcoin
        (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          symbol    VARCHAR(50) NOT NULL,
          bid_price  VARCHAR(50) NOT NULL,
          ask_price  VARCHAR(50) NOT NULL
        );
   `);
}

function insertBitcoinRow(
  db: sqlite3Lib.Database,
  symbol: string,
  bidPrice: string,
  askPrice: string,
) {
  db.run(
    `INSERT INTO bitcoin (symbol, bid_price, ask_price) VALUES (?, ?, ?)`,
    [symbol, bidPrice, askPrice],
    function (error) {
      if (error) {
        console.error('insert err', error.message);
      }
      console.log(`Inserted a row with the ID: ${this.lastID}`);
    },
  );
}

function selectBitcoinRows(
  db,
  id: string,
): Promise<{ error: string; data: any }> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM bitcoin WHERE symbol = ?`,
      [id],
      function (error, row) {
        if (error) {
          reject({ error: error.message, data: null });
        }
        resolve({ data: row, error: null });
      },
    );
  });
}

function updateRow(
  db: sqlite3Lib.Database,
  bidPrice: string,
  askPrice: string,
  id: string,
) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE bitcoin SET bid_price = ?, ask_price = ? WHERE symbol = ?',
      [bidPrice, askPrice, id],
      function (error) {
        if (error) {
          reject({ error: error });
        }
        resolve({ data: this.lastID });
      },
    );
  });
}

async function runTicker() {
  const nodeEnv = process.env.NODE_ENV;
  await dotenv.config({ path: `./.env.${nodeEnv}` });
  const dbConnect = await createDbConnection(process.env.DB_NAME);
  const ws = new WebSocket(process.env.WS_BITCOIN_BASE_URL);
  await prepareDbData(
    dbConnect,
    String(process.env.BITCOIN_SYMBOL).toLowerCase(),
  );

  try {
    ws.on('error', function error(err) {
      console.error(err.message);
      dbConnect.close();
    });

    ws.on('open', async function open() {
      console.log('OPEN');
    });

    ws.on('message', async function message(data: string) {
      try {
        const bitcoinIfo: BtcUsdtInfo = JSON.parse(data);
        // LOCK TILL DB HAS DONE WITH SAVING
        await lock.acquire(bitcoinIfo.s);
        if (!lock.isAcquired(bitcoinIfo.s)) {
          console.log('SKIP');
          return;
        }
        await updateRow(
          dbConnect,
          bitcoinIfo.a,
          bitcoinIfo.b,
          String(process.env.BITCOIN_SYMBOL).toLowerCase(),
        );
        // UNLOCK
        lock.release(bitcoinIfo.s);
        console.log('received: %s', bitcoinIfo.a);
      } catch (err) {
        console.error(err.message);
      }
    });
  } catch (err) {
    console.error(err.message);
    ws.close();
    dbConnect.close();
  }
}

runTicker();
