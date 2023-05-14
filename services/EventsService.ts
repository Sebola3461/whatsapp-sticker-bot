import { StickerBot } from "../models/StickerBot";
import qrcode from "qrcode-terminal";
import { LoggerService } from "./LoggerService";
import WAWebJS from "whatsapp-web.js";

export class EventsService {
	public readonly bot: StickerBot;

	constructor(bot: StickerBot) {
		this.bot = bot;
	}

	public handleQrCode(code: string) {
		const Logger = new LoggerService("EventsService: QR Code");
		Logger.printInfo("Received QR Code");

		qrcode.generate(
			code,
			{
				small: true,
			},
			(code) => {
				console.log(code);
			}
		);
	}

	public async handleMediaAttachment(message: WAWebJS.Message) {
		try {
			const target =
				message.body?.toLowerCase().trim().split(" ") ||
				([] as string[]);

			if (target[0].trim() != "!sticker") return;

			const stickerName = (target[1] || "").trim();

			const image = await message.downloadMedia();
			const sticker = new WAWebJS.MessageMedia(
				image.mimetype,
				image.data
			);

			message.reply(sticker, undefined, {
				sendMediaAsSticker: true,
				stickerName: stickerName || "Sticker Bot",
				stickerAuthor: `StickerBot ${process.env.PHONE_NUMBER}`,
			});
		} catch (e) {
			console.error(e);
		}
	}

	public async handleMessageReceive(message: WAWebJS.Message) {
		try {
			const Logger = new LoggerService("EventsService: Message Create");
			Logger.printInfo(`Received new message from ${message.author}`);

			if (message.type == WAWebJS.MessageTypes.IMAGE)
				this.handleMediaAttachment(message);
		} catch (e) {
			console.error(e);
		}
	}
}
