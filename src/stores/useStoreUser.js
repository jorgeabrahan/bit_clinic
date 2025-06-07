import { create } from 'zustand';

const INITIAL_STATE = {
  user: {
    id: '',
    email: '',
    display_name: '',
    birthdate: '',
    phone: '',
    created_at: '',
    updated_at: '',
    branch_managers: {
      assigned_at: '',
      id_branch: '',
      id_user: '',
      branches: {
        address_line: '',
        city: '',
        created_at: '',
        department: '',
        id: '',
        id_pharmacy: '',
        latitude: 0,
        longitude: 0,
        name: '',
        offers_drive_through: false,
        offers_home_delivery: false,
        offers_in_store_service: false,
        updated_at: '',
      },
    },
    pharmacy_managers: {
      assigned_at: '',
      id_pharmacy: '',
      id_user: '',
      pharmacies: {
        commercial_name: '',
        created_at: '',
        email: '',
        id: '',
        legal_name: '',
        pharmacy_type: '',
        phone: '',
        updated_at: '',
        website: '',
      },
    },
  },
  isLoggedIn: false,
};
const useStoreUser = create((set) => ({
  ...INITIAL_STATE,
  setUser: (user) => set({ user, isLoggedIn: true }),
  updateUser: (updatedFields) =>
    set((state) => ({
      user: { ...state.user, ...updatedFields },
      isLoggedIn: true,
    })),
  updateUserPharmacy: (updatedFields) =>
    set((state) => ({
      user: {
        ...state.user,
        pharmacy_managers: {
          ...state.user.pharmacy_managers,
          pharmacies: {
            ...state.user.pharmacy_managers.pharmacies,
            ...updatedFields,
          },
        },
      },
    })),
  updateUserBranch: (updatedFields) =>
    set((state) => ({
      user: {
        ...state.user,
        branch_managers: {
          ...state.user.branch_managers,
          branches: {
            ...state.user.branch_managers.branches,
            ...updatedFields,
          },
        },
      },
    })),
  signOutUser: () => set(INITIAL_STATE),
}));

export default useStoreUser;
