export interface AppNotification {
id: number;
profile_id: number;
type: 'COMMENT' | 'RATING' | 'REGISTRATION' | 'SUBSCRIPTION' | string;
title: string;
message: string;
is_read: boolean;
createdAt: string;
updatedAt: string;
}

export interface NotificationsResponse {
success: boolean;
data: {
notifications: AppNotification[];
pagination: {
page: number;
limit: number;
total: number;
totalPages: number;
};
};
}

export interface UnreadCountResponse {
success: boolean;
data: {
unread: number;
};
}

