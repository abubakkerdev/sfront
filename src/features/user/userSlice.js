import CryptoJS from "crypto-js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dbGetAll, dbAdd, dbDelete } from "../../utils/db";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function decryptDataObject(encryptedString) {
  const [ivBase64, encryptedBase64] = encryptedString.split(":");
  const key = CryptoJS.SHA256(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export const fetchItems = createAsyncThunk("json/fetchItems", async () => {
  return await dbGetAll();
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {
    addItem: (state, action) => {
      const decryptedMessage = decryptDataObject(action.payload);
      let userLoginInfo = JSON.parse(decryptedMessage);
      let uid = Date.now();
      state.items.push({ id: uid, ...userLoginInfo });
      dbAdd({
        id: uid,
        token: action.payload,
      });
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      dbDelete(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      let data = action.payload;
      if (data.length > 0) {
        const decryptedMessage = decryptDataObject(data[0].token);
        let userLoginInfo = JSON.parse(decryptedMessage);

        state.items = [{ id: data[0].id, ...userLoginInfo }];
        state.status = "succeeded";
      } else {
        state.items = [];
        state.status = "idle";
      }
    });
  },
});

export const { addItem, updateItem, deleteItem } = userSlice.actions;
export default userSlice.reducer;
