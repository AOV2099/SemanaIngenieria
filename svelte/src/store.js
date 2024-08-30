
import { writable } from 'svelte/store';

export var test = writable('Hello, world!');
export const API_URL = process.env.API_URL || 'localhost:3000';
