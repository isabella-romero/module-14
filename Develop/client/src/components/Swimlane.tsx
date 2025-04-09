import { useState, useMemo } from 'react';
import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

interface SwimlaneProps {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>
}

const Swimlane = ({ title, tickets, deleteTicket }: SwimlaneProps) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedTickets = useMemo(() => {
    const ticketsCopy = [...tickets];
    ticketsCopy.sort((a, b) => {
      const titleA = a.name ? a.name.toLowerCase() : '';
      const titleB = b.name ? b.name.toLowerCase() : '';

      if (sortOrder === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
    return ticketsCopy;
  }, [tickets, sortOrder]);

  const handleSortClick = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'swim-lane todo';
      case 'In Progress':
        return 'swim-lane inprogress';
      case 'Done':
        return 'swim-lane done';
      default:
        return 'swim-lane';
    }
  };

  return (
    <div className={`swimlane ${getStatusClass(title)}`}>
      <h2>
        {title}
        <button onClick={handleSortClick} className="sort-button">
          {sortOrder === 'asc' ? '⌃' : '⌄'}
        </button>
        </h2>
      {sortedTickets.map(ticket => (
        <TicketCard 
          key={ticket.id}
          ticket={ticket}
          deleteTicket={deleteTicket}
        />
      ))}
    </div>
  );
};

export default Swimlane;