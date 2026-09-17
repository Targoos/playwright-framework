export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
  support: {
    url: string;
    text: string;
  };
}

export interface SingleUserResponse {
  data: ApiUser;
  support: {
    url: string;
    text: string;
  };
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}
