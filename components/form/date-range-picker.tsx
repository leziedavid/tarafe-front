'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface CalendarDateRangePickerProps {
  className?: string;
  onDateChange: (formattedDateRange: string) => void;
  isLoading?: boolean;
}

export function CalendarDateRangePicker({
  className,
  onDateChange,
  isLoading = false
}: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  React.useEffect(() => {
    if (date?.from) {
      const formattedFrom = format(date.from, 'yyyy-MM-dd');
      const formattedTo = date.to ? format(date.to, 'yyyy-MM-dd') : formattedFrom;
      onDateChange(`${formattedFrom},${formattedTo}`);
    } else {
      onDateChange('');
    }
  }, [date, onDateChange]);

  const handleReset = () => {
    setDate(undefined);
  };

  return (
    <div className={cn('grid gap-2 w-full', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full h-10 justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            disabled={isLoading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy', { locale: fr })} -{' '}
                  {format(date.to, 'dd/MM/yyyy', { locale: fr })}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy', { locale: fr })
              )
            ) : (
              <span>Choisir une période</span>
            )}
            {date && (
              <X
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={fr}
            className="border-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
                date?.from && "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
              ),
              day_range_end: "day-range-end",
              day_selected: cn(
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
              ),
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
          {date?.from && (
            <div className="border-t p-3">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <div className="font-medium">Période sélectionnée :</div>
                  <div>
                    {date.to ? (
                      <>
                        {format(date.from, 'dd MMMM yyyy', { locale: fr })} -{' '}
                        {format(date.to, 'dd MMMM yyyy', { locale: fr })}
                      </>
                    ) : (
                      format(date.from, 'dd MMMM yyyy', { locale: fr })
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8"
                >
                  Effacer
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}