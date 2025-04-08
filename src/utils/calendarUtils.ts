import { ISubscription } from "@/types/interfaces/ISubscription";

export function getCalendarForMonth(payments: ISubscription[], month: number, year: number) {
    const currentDate = new Date();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDay = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday = 0, Sunday = 6

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize an array of days
    const calendarDays = Array.from({ length: daysInMonth }, (_, index) => ({
        date: index + 1,
        payments: [] as ISubscription[],
    }));

    // Map each payment to its corresponding day
    payments.forEach((payment) => {
        const startDate = new Date(payment.startDate);
        const interval = payment.interval; // in days
        const targetYear = year;
        const targetMonth = month; // 0-based

        let paymentDate = new Date(startDate);

        // Keep adding intervals until we reach or pass the target month
        while (
            paymentDate.getFullYear() < targetYear ||
            (paymentDate.getFullYear() === targetYear && paymentDate.getMonth() < targetMonth)
        ) {
            paymentDate.setDate(paymentDate.getDate() + interval);
        }

        // If payment falls within the target month/year
        if (
            paymentDate.getFullYear() === targetYear &&
            paymentDate.getMonth() === targetMonth
        ) {
            const day = paymentDate.getDate();
            const dayIndex = day - 1;
            if (dayIndex >= 0 && dayIndex < calendarDays.length) {
                calendarDays[dayIndex].payments.push(payment);
            }
        }
    });

    // Add empty days before the first day of the month
    const paddingDays = Array.from({ length: firstDay }, () => ({
        date: null,
        payments: [] as ISubscription[],
    }));

    return [...paddingDays, ...calendarDays];
}
