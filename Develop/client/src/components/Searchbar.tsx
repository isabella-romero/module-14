import { ChangeEvent } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
    return (
        <input
        type="text"
        placeholder="Search tickets..."
        value={searchTerm}
        onChange={onSearchChange}
        className='search-bar'
        />
    );
};

export default SearchBar;