import { openDB } from "idb";

const DB_NAME = "UserDB";
const STORE_NAME = "UserStore";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

export const dbAdd = async (item) => {
  const db = await dbPromise;
  await db.add(STORE_NAME, item);
};

export const dbGetAll = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const dbUpdate = async (item) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, item);
};

export const dbDelete = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};
