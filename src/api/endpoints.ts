export const ENDPOINTS = {
  users: {
    list: (page: number = 1) => `/api/users?page=${page}`,
    detail: (id: number) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: number) => `/api/users/${id}`,
    delete: (id: number) => `/api/users/${id}`,
  },
} as const;
