import { configureStore } from "@reduxjs/toolkit";
import { userAPISlice } from "../features/user/userAPISlice";
import userReducer from "../features/user/userSlice";
import { customerAPISlice } from "../features/customer/customerAPISlice";
import fetchOnInit from "../utils/fetchOnInit";
import tokenReducer from "../features/user/tokenSlice";

export default configureStore({
  reducer: {
    userInfo: userReducer,
    tokenInfo: tokenReducer,
    [userAPISlice.reducerPath]: userAPISlice.reducer,
    [customerAPISlice.reducerPath]: customerAPISlice.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares()
      .concat(fetchOnInit)
      .concat(userAPISlice.middleware)
      .concat(customerAPISlice.middleware),
  devTools: false,
});
