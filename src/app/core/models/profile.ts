
export interface ProfilePhoto {
  id: number;
  url: string;
  is_main: boolean;
  sort_order?: number;
}

export interface ProfileVideo {
  id: number;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

export interface ProfileDepartment {
  id: number;
  code: string;
  name: string;
}

export interface ProfileCity {
  id: number;
  code: string;
  name: string;
  department: ProfileDepartment;
}

export interface Profile {
  id: number;
  user_id?: number;
  name: string;
  title: string | null;
  nickname: string | null;
  birth_date?: string | null;
  description?: string | null;
  city_id: number | null;
  whatsapp?: string | null;
  telegram?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
  photos: ProfilePhoto[];
  videos?: ProfileVideo[];
  cityData: ProfileCity | null;

  total_views?: number;
  rating?: {
    average: number;
    total: number;
  };
}

export interface ProfileRating {
  average?: number;
  total?: number;
  [key: string]: unknown;
}


export interface ProfileComment {
  id: number;
  profile_id: number;
  visitor_token: string;
  nickname: string | null;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}



export interface ProfileDetailResponse {
  success: boolean;
  data: {
    profile: Profile;
    views: number;
    rating: ProfileRating;
    comments: ProfileComment[];
  };
}

export interface ProfilesResponse {
  success: boolean;
  data: {
    profiles: Profile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
