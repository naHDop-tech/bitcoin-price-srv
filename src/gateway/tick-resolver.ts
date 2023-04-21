import { Server } from 'socket.io';
import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { Lock } from 'async-await-mutex-lock';

const lock = new Lock();
export enum TimerEvents {
  btcTick = 'btc-tick',
  startBtcTicker = 'start-btc-ticker',
  stopBtcTicker = 'stop-btc-ticker',
}

const userTimers = {};

export function getUserDeviceRoom(userId: string, deviceId: string) {
  return userId + deviceId;
}

export function sendToUserDevice(
  server: Server,
  userId: string,
  deviceId: string,
  event: string,
  payload: any,
) {
  server.to(getUserDeviceRoom(userId, deviceId)).emit(event, payload); // Actually send the message to the user device via WebSocket channel.
}

export function startTimerForUserDevice(
  server: Server,
  userId: string,
  deviceId: string,
  btcPriceSrv: BitcoinPriceService,
  timerDuration: number,
) {
  const timer = setInterval(async function () {
    await lock.acquire(userId + deviceId);
    if (!lock.isAcquired(userId + deviceId)) {
      return;
    }
    const res = await btcPriceSrv.getBitcoinPrice();
    sendToUserDevice(
      server,
      userId,
      deviceId,
      TimerEvents.btcTick.toString(),
      res,
    ); // Send tick message to user device.
    lock.release(userId + deviceId);
  }, timerDuration);

  userTimers[userId + deviceId] = timer; // Store timer for this user device.
}

export function stopTimerForUserDevice(userId: string, deviceId: string) {
  clearInterval(userTimers[userId + deviceId]); // Stop the timer for this user device.

  delete userTimers[userId + deviceId]; // Delete the timer for this user device from the `userTimers` object.
}
