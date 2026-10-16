export interface CityDepartment {
  id: number;
  code: string;
  name: string;
}

export interface City {
  id: number;
  code: string;
  name: string;
  department?: CityDepartment;
}

export interface ForumTopic {
  id?: number;
  title: string;
  content: string;
  nickname: string;
  status?: 'PUBLISHED' | 'HIDDEN' | 'DELETED';
  city_id: number;
  city?: City | null; // Objeto de la ciudad que viene del include del backend
  created_at?: string;
  updated_at?: string;
}

export interface ForumComment {
  id?: number;
  topic_id?: number;
  visitor_token?: string;
  nickname: string;
  content: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ForumTopicsResponse {
  success: boolean;
  data: {
    topics: ForumTopic[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ForumDetailResponse {
  success: boolean;
  data: {
    topic: ForumTopic;
    comments: ForumComment[];
  };
}
