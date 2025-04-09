import { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import SearchBar from '../components/Searchbar';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTickets = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return tickets.filter(ticket => {
      const matchedName = ticket.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const matchedUser = ticket.assignedUser?.username?.toLowerCase().includes(lowerCaseSearchTerm);
      return matchedName || matchedUser;
    });
  }, [tickets, searchTerm]);

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            <button type='button' id='create-ticket-link'>
              <Link to='/create' className='new-ticket-btn' >New Ticket</Link>
            </button>
            <div className='board-display'>
              {boardStates.map((status) => {
                const swimlaneTickets = filteredTickets.filter(ticket => ticket.status === status);
                return (
                  <Swimlane 
                    title={status} 
                    key={status} 
                    tickets={swimlaneTickets} 
                    deleteTicket={deleteIndvTicket}
                  />
                );
              })}
            </div>
          </div>
        )
    }
    </>
  );
};

export default Board;