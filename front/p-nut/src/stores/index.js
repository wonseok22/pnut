import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import UISlice from "./UISlice";
import searchSlice from "./searchSlice";
import authSlice from "./authSlice";

// https://kyounghwan01.github.io/blog/React/redux/redux-persist/#%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5
// https://velog.io/@hongdol/redux-toolkit%EC%A0%81%EC%9A%A9%EA%B3%BC-persist-%EC%A0%81%EC%9A%A9

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const reducers = combineReducers({
  ui: UISlice.reducer,
  auth: authSlice.reducer,
  search: searchSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
