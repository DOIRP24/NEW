import { Message, TelegramMessage } from '../types';

const TELEGRAM_BOT_TOKEN = '5500806685:AAHbScRB3QdYfX7TLH_6GLnzo0hU8WXur6o';
const CHAT_ID = '-1002421517137';

export async function fetchLatestMessages(): Promise<Message[]> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${CHAT_ID}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to verify chat');
    }

    const messagesResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatHistory?chat_id=${CHAT_ID}&limit=50`
    );
    
    if (!messagesResponse.ok) {
      const fallbackResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1&limit=100`
      );
      const data = await fallbackResponse.json();
      
      if (!data.ok) {
        throw new Error('Failed to fetch messages');
      }

      return data.result
        .filter((update: any) => 
          update.message && 
          update.message.chat && 
          update.message.chat.id.toString() === CHAT_ID
        )
        .map((update: any) => transformTelegramMessage(update.message))
        .reverse();
    }

    const data = await messagesResponse.json();
    return data.result.map(transformTelegramMessage).reverse();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

function transformTelegramMessage(telegramMessage: TelegramMessage): Message {
  const photoUrl = telegramMessage.from.username 
    ? `https://avatars.githubusercontent.com/${telegramMessage.from.username}`
    : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';

  return {
    id: telegramMessage.message_id,
    userId: telegramMessage.from.id,
    text: telegramMessage.text,
    timestamp: new Date(telegramMessage.date * 1000).toISOString(),
    user: {
      name: [telegramMessage.from.first_name, telegramMessage.from.last_name]
        .filter(Boolean)
        .join(' '),
      photoUrl,
    },
  };
}