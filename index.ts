import { StickerBot } from "./models/StickerBot";
import dotenv from "dotenv";
dotenv.config();

const bot = new StickerBot();
bot.login();
