import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, UserCoins } from './userApi';

export interface UserState {
  profile: UserProfile | null;
  coins: number | null;
  multiplier: number | null;
  lastUpdated?: string;
}

const initialState: UserState = {
  profile: null,
  coins: null,
  multiplier: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
    setCoins(state, action: PayloadAction<UserCoins | null>) {
      if (!action.payload) {
        state.coins = null;
        state.multiplier = null;
        state.lastUpdated = undefined;
        return;
      }
      state.coins = action.payload.coins;
      state.multiplier = action.payload.multiplier ?? null;
      state.lastUpdated = action.payload.updatedAt;
    },
  },
});

export const { setProfile, setCoins } = slice.actions;
export const userReducer = slice.reducer;
