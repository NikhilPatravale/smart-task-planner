import { useEffect, useState, type PropsWithChildren } from "react";
import { DataContext } from "./DataContext";
import type { Ticket, TicketsDataState } from "../../types/types";
import fetchWithAuth from "../../utils/fetchWithAuth";

export function DataContextProvider({ children }: PropsWithChildren) {
  const [ticketsData, setTicketsData] = useState<TicketsDataState>({
    isLoading: true,
    error: null,
    tickets: [],
  });

  const addTicket = (data: Ticket) => {
    setTicketsData((prev) => ({ ...prev, tickets: [...prev.tickets, data] }));
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/ticket`, {
          credentials: "include",
        });
        if (response.ok) {
          const { tickets } = await response.json();
          setTicketsData({ isLoading: false, error: null, tickets });
        }
      } catch (error) {
        console.error("❌ Error while fetching tickets", error);
        setTicketsData((prev) => {
          return { ...prev, isLoading: false, error: "Some error occurred. Please try again later." };
        });
      }
    })();
  }, []);

  return (
    <DataContext.Provider value={{ ticketsDataState: ticketsData, addTicket }}>
      {children}
    </DataContext.Provider>
  );
};