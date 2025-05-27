import localforage from 'localforage';

export const memoryStore = localforage.createInstance({
  name: 'bbMemory',
  storeName: 'memory_nodes',
});