import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import Auth from '../utils/auth';

const handleApiResponse = async (response: Response) => {
  const data = await response.json();

  if(!response.ok) {
    if (response.status === 403) {
      Auth.logout();
      return Promise.reject('Token expired. Redirecting to login');
    }
    throw new Error(`API Error: ${response.status} - ${data?.message || response.statusText}`);
  }
  return data;
};

const retrieveTickets = async () => {
  try {
    const response = await fetch(
      '/api/tickets/',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );
    return handleApiResponse(response);
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not retrieve tickets');
  }
};

const retrieveTicket = async (id: number | null): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );

    return handleApiResponse(response);
  } catch (err) {
      console.error('Error from data retrieval: ', err);
      return Promise.reject('Could not fetch singular ticket');
  }
};

const createTicket = async (body: TicketData) => {
  try {
    const response = await fetch(
      '/api/tickets/', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
          },
        body: JSON.stringify(body)
      }

    )
    return handleApiResponse(response);
    } catch (err) {
        console.error('Error from Ticket Creation: ', err);
        return Promise.reject('Could not create ticket');
    }
};

const updateTicket = async (ticketId: number, body: TicketData): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(body)
      }
    )
    return handleApiResponse(response);
    } catch (err) {
        console.error('Error from Ticket Creation: ', err);
        return Promise.reject('Could not create ticket');
    }
};

const deleteTicket = async (ticketId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    )
    return handleApiResponse(response);
    } catch (err) {
        console.error('Error from Ticket Creation: ', err);
        return Promise.reject('Could not create ticket');
    }
};


export { createTicket, deleteTicket, retrieveTickets, retrieveTicket, updateTicket};