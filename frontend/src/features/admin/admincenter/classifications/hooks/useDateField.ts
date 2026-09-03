import { useEffect, useMemo, useState } from 'react';
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isValid,
    parse,
    startOfMonth,
    startOfWeek,
} from 'date-fns';
import type { DatePickerCell } from '@/components/ui/datepicker';

const TEXT_FORMAT = 'dd-MM-yyyy';
const ISO_FORMAT = 'yyyy-MM-dd';

/**
 * Drives the controlled DatePicker in components/ui — it renders, this decides.
 * `value` is the ISO date the form holds; `onChange` writes it back.
 */
export function useDateField(value: string, onChange: (iso: string) => void) {
    const [text, setText] = useState(() =>
        value ? format(parse(value, ISO_FORMAT, new Date()), TEXT_FORMAT) : '',
    );
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() =>
        value ? parse(value, ISO_FORMAT, new Date()) : new Date(),
    );

    // Re-sync when the form clears or replaces the value (reset, submit) — otherwise
    // the input keeps showing the old date after the form has been emptied.
    // Typing alone doesn't touch `value`, so this won't fight the user mid-edit.
    useEffect(() => {
        setText(value ? format(parse(value, ISO_FORMAT, new Date()), TEXT_FORMAT) : '');
    }, [value]);

    const commitText = () => {
        const parsed = parse(text, TEXT_FORMAT, new Date());
        if (isValid(parsed)) {
            onChange(format(parsed, ISO_FORMAT));
            setMonth(parsed);
        } else if (text === '') {
            onChange('');
        }
    };

    const cells = useMemo<DatePickerCell[]>(() => {
        const start = startOfWeek(startOfMonth(month));
        const end = endOfWeek(endOfMonth(month));
        const out: DatePickerCell[] = [];
        for (let d = start; d <= end; d = addDays(d, 1)) {
            const iso = format(d, ISO_FORMAT);
            out.push({
                iso,
                day: d.getDate(),
                inMonth: isSameMonth(d, month),
                disabled: false,
                isweekend: d.getDay() === 0 || d.getDay() === 6,
                selected: iso === value,
            });
        }
        return out;
    }, [month, value]);

    const selectDay = (iso: string) => {
        onChange(iso);
        setText(format(parse(iso, ISO_FORMAT, new Date()), TEXT_FORMAT));
        setOpen(false);
    };

    return {
        text,
        onTextChange: setText,
        onBlur: commitText,
        open,
        onOpenChange: setOpen,
        monthLabel: format(month, 'MMMM yyyy'),
        weekdayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        cells,
        onSelectDay: selectDay,
        onPrevMonth: () => setMonth((m) => addMonths(m, -1)),
        onNextMonth: () => setMonth((m) => addMonths(m, 1)),
        onClear: () => {
            setText('');
            onChange('');
        },
        onToday: () => selectDay(format(new Date(), ISO_FORMAT)),
    };
}
