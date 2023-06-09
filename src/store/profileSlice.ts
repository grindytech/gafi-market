import { createSlice } from "@reduxjs/toolkit";
import { UserDto } from "../services/types/dtos/UserDto";

export type ProfileState = {
  accessToken: string;
  isLoggedIn: boolean;
  user: string;
  profile: UserDto;
};

export const LOCAL_PROFILE_KEY = "profile";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    accessToken: "",
    isLoggedIn: false,
    user: "",
    profile: {},
  },
  reducers: {
    login: (state, { payload }) => {
      const { accessToken, user } = payload;
      state.accessToken = accessToken;
      state.user = user?.toLowerCase();
      state.isLoggedIn = true;
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(payload));
    },
    logout: (state) => {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
      state.accessToken = "";
      state.user = "";
      state.isLoggedIn = false;
    },
    userData: (state, { payload }) => {
      const { profile } = payload;
      state.profile = profile;
    },
  },
});

export const { login, logout, userData } = profileSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectProfile = (state: any): ProfileState => state.profile;

export default profileSlice.reducer;
