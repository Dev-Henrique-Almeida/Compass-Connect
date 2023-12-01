import create from "zustand";

interface StoreState {
  open: boolean;
  selectedItem: string;
  modalOpen: boolean;
  id: string;
  setOpen: (value: boolean) => void;
  setId: (value: string) => void;
  setSelectedItem: (item: string) => void;
  setModalOpen: (value: boolean) => void;
}

const localStorageKey = "globalState";

// const useStore = create<StoreState>((set) => ({

//   open: false,
//   selectedItem: "Página inicial",
//   modalOpen: false,
//   id: "",
//   setOpen: (value) => set({ open: value }),
//   setId: (value) => set({ id: value }),
//   setSelectedItem: (item) => set({ selectedItem: item }),
//   setModalOpen: (value) => set({ modalOpen: value }),
// }));

const useStore = create<StoreState>((set) => {
  const storedState = localStorage.getItem(localStorageKey);
  const initialState: StoreState = storedState
    ? JSON.parse(storedState)
    : {
        open: false,
        selectedItem: "Página inicial",
        modalItem: false,
        id: "",
      };

  set(initialState);

  return {
    ...initialState,
    setOpen: (value) => set({ open: value }),
    setId: (value) => set({ id: value }),
    setSelectedItem: (item) => set({ selectedItem: item }),
    setModalOpen: (value) => set({ modalOpen: value }),
  };
});

useStore.subscribe((state) => {
  /*   console.log("atualizei todos os estados"); */
  localStorage.setItem(localStorageKey, JSON.stringify(state));
});

export default useStore;
