export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens: number;
  reaction: string | null;
  is_edited: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  folder_id: string | null;
  persona_id: string | null;
  title: string;
  system_prompt: string;
  is_pinned: boolean;
  total_tokens: number;
  message_count: number;
  created_at: string;
  updated_at: string;
  persona?: Persona;
}

export interface Persona {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  avatar_emoji: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}
