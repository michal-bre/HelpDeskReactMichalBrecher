export type Ticket = {
    id: number,
    subject: string,
    description: string,
    status_id: number,
    priority_id: number,
    created_at: string,
    updated_at: string | null,
    created_by: number,
    assigned_to: number | null,
    status_name: string,
    priority_name: string,
    created_by_name: string,
    created_by_email: string,
    assigned_to_name: string | null,
    assigned_to_email: string | null
};

export interface TicketToCreate  {
    subject: string,
    description: string,
    status_id: number,
    priority_id: number,
    assigned_to: number
};

export interface TicketToUpdate  {
    status_id: number,
    priority_id: number,
    assigned_to: number
}