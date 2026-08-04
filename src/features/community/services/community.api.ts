import { apiClient } from "@/core/http/apiClient";
import type {
  CommunityDataResponse,
  CommunityMessageResponse,
  CommunityPost,
  CreateCommunityPostRequest,
} from "../domain/community.types";

const COMMUNITY_PATH = "/api/v1/community";

export function getCommunityData() {
  return apiClient.get<CommunityDataResponse>(COMMUNITY_PATH);
}

export function createCommunityPost(payload: CreateCommunityPostRequest) {
  return apiClient.post<CommunityPost>(`${COMMUNITY_PATH}/posts`, payload);
}

export function sendCommunityMessage(chatId: string, text: string) {
  return apiClient.post<CommunityMessageResponse>(
    `${COMMUNITY_PATH}/chats/${chatId}/messages`,
    { text },
  );
}
