import { create } from 'zustand';

const INITIAL_STATE = {
  user: {
    id: '',
    id_user: '',
    birthdate: '',
    created_at: '',
    display_name: '',
    phone: '',
    updated_at: '',
    email: '',
  },
  isLoggedIn: false,
};
const useStoreUser = create((set) => ({
  ...INITIAL_STATE,
  signIn: (user) => set({ user, isLoggedIn: true }),
  signOut: () => set(INITIAL_STATE),
}));

export default useStoreUser;
