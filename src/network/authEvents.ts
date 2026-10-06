import { EventEmitter } from 'eventemitter3';

/**
 * Single app-wide event emitter, moved here from utils/authEvents.js
 * (now deleted — that was a duplicate of this exact file).
 * Use AUTH_EVENTS constants instead of raw string event names anywhere
 * you call .emit() / .on() / .off().
 */
export const authEvents = new EventEmitter();

export const AUTH_EVENTS = {
  UNAUTHORIZED: 'unauthorized',
  LOGOUT: 'logout',
} as const;