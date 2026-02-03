// Re-exportar todos los servicios
export * from './firebase';
export * from './auth';
export * from './firestore';
export * from './storage';
export * from './localStore';
export * from './syncService';

export { default as authService } from './auth';
export { default as firestoreService } from './firestore';
export { default as storageService } from './storage';
export { default as localStoreService } from './localStore';
export { default as syncService } from './syncService';
