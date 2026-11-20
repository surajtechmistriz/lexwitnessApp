import { EventEmitter } from 'eventemitter3';

export const authEvents = new EventEmitter();

export const AUTH_EVENTS = {
  UNAUTHORIZED: 'unauthorized',
  LOGOUT: 'logout',
} as const;
