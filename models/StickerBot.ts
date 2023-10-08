import { Client } from "whatsapp-web.js";
import { LoggerService } from "../services/LoggerService";
import { EventsService } from "../services/EventsService";

export class StickerBot extends Client {
	private readonly Logger = new LoggerService("StickerBot");
	public Events!: EventsService;

	constructor() {
		super({
			puppeteer: {
				args:
					process.env.NO_GUI == "true"
						? ["--no-sandbox", "--disable-setuid-sandbox"]
						: [],
			},
		});
	}

	async login() {
		this.Logger.printInfo("Initializing...");

		if (process.env.NO_GUI == "true")
			this.Logger.printWarning("Running in NO_GUI mode");

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
