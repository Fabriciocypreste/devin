import { ChevronDownIcon } from './Icons';

interface MobileFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function MobileFilters({ activeFilter, onFilterChange }: MobileFiltersProps) {
  const filters = [
    { id: 'series', label: 'Séries' },
    { id: 'movies', label: 'Filmes' },
    { id: 'categories', label: 'Categorias', hasDropdown: true }
  ];

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-[#141414] border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/30 hover:border-white/60'
            }`}
          >
            <span className="text-sm font-medium">{filter.label}</span>
            {filter.hasDropdown && (
              <ChevronDownIcon className="w-4 h-4" size={16} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
