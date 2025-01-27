import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./userAuthStore";
import { use } from "react";


export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            let res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in getUsers:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            let res = await axiosInstance.get(`/messages/${userId}`);
            set({ message: res.data });
        } catch (error) {
            toast.error(error.response.error.message);
            console.log("Error in getMessages:", error);
        }
        finally {
            set({ isMessagesLoading: false });
        }

    },

    setSelectedUser: async (selectedUser) => {
        set({ selectedUser });
    },


    sendMessage: async (msgData) => {
        const { selectedUser, message } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, msgData);
            set({ message: [...message, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToNewMessages: () => {
        
        const { selectedUser } = get();
        if(!selectedUser)return;
        const {socket} = useAuthStore.getState();
        socket.on("newMessage" , (newMessage) =>{
            if(newMessage.senderId !== selectedUser._id) return;
            set({message : [...get().message , newMessage]});
        })
    },

    unsubscribeFromMessages: () =>{
        // const socket = useAuthStore.getState().socket;
        const {socket} = useAuthStore.getState();

        socket.off("newMessage");
    }

}))