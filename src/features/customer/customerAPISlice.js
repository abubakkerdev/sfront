import { createApi } from "@reduxjs/toolkit/query/react";
import CryptoJS from "crypto-js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ENCRYPTION_KEY = "Am#H9W_dEI2N+eKj";

function generateStrongPassword(length = 11) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = upper + lower + numbers + symbols;

  let password = "";
  // Ensure at least one character from each set
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable placement
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

function encryptDataObject(text) {
  let uniqueCode = generateStrongPassword();

  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY.substring(0, 16));

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  let encryptedText = `Basic ${btoa(
    `user:${
      encrypted.toString() +
      uniqueCode +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9)
    }`
  )}`;

  return encryptedText;
}

const customBaseQuery = async ({ url, method, body, token }) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) {
    let encryptToken = encryptDataObject(token);
    // console.log("encryptToken", encryptToken);

    headers.set("Authorization", `${encryptToken}`);
    // headers.set("Authorization", `Basic ${btoa(`user:${token}`)}`);
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return {
        error: { status: response.status, data: await response.json() },
      };
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: { status: "FETCH_ERROR", data: error.message } };
  }
};

export const customerAPISlice = createApi({
  reducerPath: "customerAPI",
  baseQuery: customBaseQuery,
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (token) => ({
        url: "/backend/customer/all",
        method: "get",
        token,
      }),
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query({
      query: ({ token, id }) => ({
        url: `/backend/customer/edit/${id}`,
        method: "get",
        token,
      }),
    }),
    addCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/store",
        method: "post",
        body: data,
        token,
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/update",
        method: "post",
        body: data,
        token,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/destroy",
        method: "post",
        body: data,
        token,
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerAPISlice;
