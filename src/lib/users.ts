export type UserRole = 'admin' | 'user';

export interface UserRecord {
  id: number;
  email: string;
  username: string;
  password: string; // Plain text for demo only
  role: UserRole;
  createdAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __users: UserRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __userIdCounter: number | undefined;
}

function getStore() {
  if (!global.__users) global.__users = [];
  if (!global.__userIdCounter) global.__userIdCounter = 1;
  return { users: global.__users, nextId: () => global.__userIdCounter!++ };
}

export const users = {
  create: (params: { email: string; username: string; password: string; role: UserRole }): UserRecord => {
    const { users: store, nextId } = getStore();
    const user: UserRecord = {
      id: nextId(),
      email: params.email.toLowerCase(),
      username: params.username.toLowerCase(),
      password: params.password,
      role: params.role,
      createdAt: Date.now(),
    };
    store.push(user);
    return user;
  },
  findByEmailOrUsername: (identifier: string): UserRecord | undefined => {
    const { users: store } = getStore();
    const idLower = identifier.toLowerCase();
    return store.find((u) => u.email === idLower || u.username === idLower);
  },
  existsByEmailOrUsername: (email: string, username: string): boolean => {
    const { users: store } = getStore();
    const e = email.toLowerCase();
    const u = username.toLowerCase();
    return store.some((usr) => usr.email === e || usr.username === u);
  },
};


