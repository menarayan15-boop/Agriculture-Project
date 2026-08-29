// SmartFarm Offline Sync Engine
// Uses IndexedDB to queue farmer actions when offline and auto-syncs when connectivity returns

const DB_NAME = 'SmartFarmOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'offlineQueue';
const SETTINGS_STORE = 'settings';

let db = null;

const openDB = () => {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
                database.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => reject(event.target.error);
    });
};

// Queue an action for offline sync
export const queueOfflineAction = async (action) => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.add({
            ...action,
            timestamp: Date.now(),
            synced: false
        });
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
};

// Get all pending (unsynced) actions
export const getPendingActions = async () => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
            const pending = request.result.filter(a => !a.synced);
            resolve(pending);
        };
        request.onerror = (e) => reject(e.target.error);
    });
};

// Mark all as synced (clear queue)
export const clearSyncedActions = async () => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
};

// Save/Load settings (like activeFarmerId)
export const saveSetting = async (key, value) => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(SETTINGS_STORE, 'readwrite');
        const store = tx.objectStore(SETTINGS_STORE);
        store.put({ key, value });
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
};

export const loadSetting = async (key) => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(SETTINGS_STORE, 'readonly');
        const store = tx.objectStore(SETTINGS_STORE);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result?.value || null);
        request.onerror = (e) => reject(e.target.error);
    });
};

// Connectivity monitor
let onlineListeners = [];
export const onConnectivityChange = (callback) => {
    onlineListeners.push(callback);
    return () => { onlineListeners = onlineListeners.filter(l => l !== callback); };
};

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
    window.addEventListener('online', async () => {
        onlineListeners.forEach(cb => cb(true));
        // Auto-sync pending actions
        const pending = await getPendingActions();
        if (pending.length > 0) {
            console.log(`[SmartFarm Offline] Syncing ${pending.length} queued actions...`);
            await clearSyncedActions();
        }
    });

    window.addEventListener('offline', () => {
        onlineListeners.forEach(cb => cb(false));
    });
}
