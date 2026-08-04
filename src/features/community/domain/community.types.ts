export interface CommunityPost {
  id: string;
  foodName: string;
  restriction: string;
  targetGroup?: string | null;
  description: string;
  preparation: string;
  ingredients: string;
  photo?: string | null;
  photoName?: string | null;
  authorId?: string | null;
  authorName: string;
  createdAtUtc: string;
}

export interface CommunityMessage {
  id: string;
  chatId: string;
  author: string;
  text: string;
  time: string;
  createdAtUtc: string;
}

export interface CommunityChat {
  id: string;
  seedKey: string;
  title: string;
  subtitle: string;
  time: string;
  unread: number;
  accent: string;
  isPrivate: boolean;
  tags: string[];
  messages: CommunityMessage[];
}

export interface CommunityDataResponse {
  posts: CommunityPost[];
  chats: CommunityChat[];
}

export interface CreateCommunityPostRequest {
  foodName: string;
  restriction: string;
  targetGroup?: string;
  description: string;
  preparation: string;
  ingredients: string;
  photo: string;
  photoName?: string;
  authorId?: string;
  authorName: string;
}

export interface CommunityMessageResponse {
  id: string;
  chatId: string;
  author: string;
  text: string;
  time: string;
  createdAtUtc: string;
}
