
export interface Photo {
  id: number;
  profile_id: number;
  url: string;
  is_main: boolean;
  sort_order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotosResponse {
  success: boolean;
  data: Photo[];
}

export interface PhotoResponse {
  success: boolean;
  message: string;
  data: Photo;
}

export interface PhotoActionResponse {
  success: boolean;
  message: string;
}
