export type User = {
  email: string;
  role: string;
  createdAt: Date;
  skills: [string],
}

export type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: "TODO" | "IN PROGRESS" | "COMPLETE";
  createdBy: string,
  assignedTo: User | null;
  helpfulNotes: string,
  priority: string,
  deadline: string,
  relatedSkills: [string],
  createdAt: Date | null;
};

export type TicketsDataState = {
  isLoading: boolean;
  error: string | null;
  tickets: Ticket[];
};

export type DataContextType = {
  ticketsDataState: TicketsDataState;
  addTicket: (ticket: Ticket) => void;
};