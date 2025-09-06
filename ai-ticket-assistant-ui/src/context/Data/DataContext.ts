import { createContext, useContext } from "react";
import type { DataContextType } from "../../types/types";

export const DataContext = createContext<DataContextType>({
  ticketsDataState: {
    isLoading: true,
    error: null,
    tickets: [],
  },
  addTicket: () => { },
});


export const useDataContext = () => {
  const dataContext = useContext(DataContext);
  if (!dataContext) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return dataContext;
};