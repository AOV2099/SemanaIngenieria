
import { writable } from 'svelte/store';

export var test = writable('Hello, world!');
export const API_URL = `${window.location.origin}`