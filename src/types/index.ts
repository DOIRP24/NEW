export interface Event {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  speaker: string;
  description: string;
  location: string;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  sessions_attended: number;
  connections: number;
  last_seen: string;
}

export interface Message {
  id: number;
  userId: number;
  text: string;
  timestamp: string;
  user: {
    name: string;
    photoUrl: string;
  };
}

export interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
  text: string;
  date: number;
}