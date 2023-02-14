import { create } from "zustand";

export const useUserStore = create((set) => ({
    username: "",
    userdescription: "",
    setUser: (newusername, newuserdescription) => set(() => ({
        username: newusername, 
        userdescription: newuserdescription
    }))
}))