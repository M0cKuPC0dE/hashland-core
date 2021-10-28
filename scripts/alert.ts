import { utils } from 'ethers';
import { ethers } from 'hardhat';
import TelegramBot from 'node-telegram-bot-api';

async function main() {
  const token = '2069552244:AAHCbvYTta8tEHA0DmV4AQxOYQ6oBZXd12g';
  const bot = new TelegramBot(token, { polling: true });
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const message = (match as any)[1];
    bot.sendMessage(chatId, message);
  });

  const hc = await ethers.getContractAt('HC', '0x20a3276972380E3c456137E49c32061498311Dd2');
  const filter = hc.filters.Transfer(null, '0xdb83d062fa300fb8b00f6ceb79ecc71dfef921a5')
  hc.on(filter, (from, to, amount, event) => {
    const msg = `${from} sell ${utils.formatEther(amount)} HC`;
    console.log(msg);
    // bot.sendMessage(chatId, msg);
  });
}

main();
