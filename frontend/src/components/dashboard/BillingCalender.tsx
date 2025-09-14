import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
interface CalendarEvent {
  date: Date
  type: 'due' | 'overdue' | 'grace'
  label: string
}
interface BillingCalendarProps {
  events: CalendarEvent[]
  month: Date
}
const BillingCalendar: React.FC<BillingCalendarProps> = ({ events, month }) => {
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const firstDayOfMonth = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  ).getDay()
  const days = Array.from(
    {
      length: daysInMonth,
    },
    (_, i) => i + 1,
  )
  const blanks = Array.from(
    {
      length: firstDayOfMonth,
    },
    (_, i) => i,
  )
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const getEventForDay = (day: number) => {
    return events.find(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === month.getMonth() &&
        event.date.getFullYear() === month.getFullYear(),
    )
  }
  const getEventClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'due':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'grace':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return ''
    }
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Billing Calendar
          </CardTitle>
          <div className="text-sm font-medium">
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-neutral-500 dark:text-neutral-400"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((blank, i) => (
            <div key={`blank-${i}`} className="h-10"></div>
          ))}
          {days.map((day) => {
            const event = getEventForDay(day)
            return (
              <div
                key={day}
                className={cn(
                  'h-10 rounded-md flex flex-col justify-center items-center text-sm border border-neutral-200 dark:border-neutral-700',
                  event
                    ? getEventClass(event.type)
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                )}
              >
                <span>{day}</span>
                {event && (
                  <span className="text-xs truncate max-w-full px-1">
                    {event.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default BillingCalendar
