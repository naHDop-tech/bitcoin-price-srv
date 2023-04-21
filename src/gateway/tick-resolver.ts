import { Server } from 'socket.io';
import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';

export enum TimerEvents {
  btcTick = 'btc-tick',
  startBtcTicker = 'start-btc-ticker',
  stopBtcTicker = 'stop-btc-ticker',
}

const userTimers = {};
// {
//   "user001-device:001":Timeout {/* data of timer1 */},
//   "user002-device:002":Timeout {/* data of timer2 */},
//   "user003-device:003":Timeout {/* data of timer3 */}
// }
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
    const res = await btcPriceSrv.getBitcoinPrice();
    sendToUserDevice(
      server,
      userId,
      deviceId,
      TimerEvents.btcTick.toString(),
      res,
    ); // Send tick message to user device.

    console.log(`user ${userId} has a timeout`);
  }, timerDuration);

  userTimers[userId + deviceId] = timer; // Store timer for this user device.
}

export function stopTimerForUserDevice(userId: string, deviceId: string) {
  console.log('GET', userId, deviceId);
  console.log('MAP', userTimers);
  clearInterval(userTimers[userId + deviceId]); // Stop the timer for this user device.

  delete userTimers[userId + deviceId]; // Delete the timer for this user device from the `userTimers` object.
}
