import create from "zustand";

interface StoreState {
  open: boolean;
  selectedItem: string;
  modalOpen: boolean;
  setOpen: (value: boolean) => void;
  setSelectedItem: (item: string) => void;
  setModalOpen: (value: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  open: false,
  selectedItem: "Página inicial",
  modalOpen: false,
  setOpen: (value) => set({ open: value }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setModalOpen: (value) => set({ modalOpen: value }),
}));

export default useStore;
