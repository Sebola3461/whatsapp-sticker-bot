import { Client } from "whatsapp-web.js";
import { LoggerService } from "../services/LoggerService";
import { EventsService } from "../services/EventsService";

export class StickerBot extends Client {
	private readonly Logger = new LoggerService("StickerBot");
	public Events!: EventsService;

	constructor() {
		super({});
	}

	async login() {
		this.Logger.printInfo("Initializing...");

		this.initialize();

		this.Events = new EventsService(this);

		this.on("qr", (qr) => this.Events.handleQrCode.bind(this.Events)(qr));
		this.on("message", (message) => {
			try {
				this.Events.handleMessageReceive.bind(this.Events)(message);
			} catch (e) {
				console.error(e);
				message.reply("Algo deu errado");
			}
		});
		this.on("message_create", (message) => {
			try {
				if (!message.fromMe) return;

				this.Events.handleMessageReceive.bind(this.Events)(message);
			} catch (e) {
				console.error(e);
				message.reply("Algo deu errado");
			}
		});
	}
}
