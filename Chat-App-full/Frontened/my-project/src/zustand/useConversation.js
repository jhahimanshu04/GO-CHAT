import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  // Group chat state
  selectedGroup: null,
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  groupMessages: [],
  setGroupMessages: (groupMessages) => set({ groupMessages }),
}));

export default useConversation;
