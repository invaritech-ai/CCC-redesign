import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface FilterOption {
    label: string;
    value: string;
}

interface SearchAndFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: {
        label: string;
        key: string;
        options: FilterOption[];
        value: string;
        onChange: (value: string) => void;
    }[];
    onClearFilters: () => void;
    displayedCount: number;
    totalCount: number;
    className?: string;
}

export const SearchAndFilter = ({
    searchValue,
    onSearchChange,
    filters = [],
    onClearFilters,
    displayedCount,
    totalCount,
    className,
}: SearchAndFilterProps) => {
    const [localSearchValue, setLocalSearchValue] = useState(searchValue);
    const debouncedSearchValue = useDebounce(localSearchValue, 300);

    // Sync local search value with external changes (e.g., when filters are cleared)
    useEffect(() => {
        setLocalSearchValue(searchValue);
    }, [searchValue]);

    // Update parent when debounced value changes
    useEffect(() => {
        if (debouncedSearchValue !== searchValue) {
            onSearchChange(debouncedSearchValue);
        }
    }, [debouncedSearchValue, searchValue, onSearchChange]);

    const hasActiveFilters = searchValue || filters.some((f) => f.value && f.value !== "all");

    return (
        <div className={cn("space-y-4 mb-8", className)}>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={localSearchValue}
                        onChange={(e) => setLocalSearchValue(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filters */}
                {filters.map((filter) => (
                    <Select
                        key={filter.key}
                        value={filter.value || "all"}
                        onValueChange={filter.onChange}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All {filter.label}</SelectItem>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="w-full md:w-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {totalCount > 0 ? (
                        <>
                            Showing {displayedCount} of {totalCount} result{totalCount !== 1 ? "s" : ""}
                        </>
                    ) : (
                        "No results found"
                    )}
                </span>
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                        {searchValue && (
                            <Badge variant="secondary" className="text-xs">
                                Search: "{searchValue}"
                            </Badge>
                        )}
                        {filters.map(
                            (filter) =>
                                filter.value &&
                                filter.value !== "all" && (
                                    <Badge key={filter.key} variant="secondary" className="text-xs">
                                        {filter.label}: {filter.options.find((o) => o.value === filter.value)?.label || filter.value}
                                    </Badge>
                                )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

