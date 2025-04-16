import { fetchItems } from "../features/user/userSlice";

let didFetch = false;

const fetchOnInit = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === "APP_READY" && !didFetch) {
    didFetch = true;
    store.dispatch(fetchItems());
  }

  return result;
};

export default fetchOnInit;
