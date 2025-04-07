import { ISubscription } from "@/types/interfaces/ISubscription";

export function getCalendarForMonth(payments: ISubscription[]) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0 = January, 11 = December

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDay = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize an array of days
    const calendarDays = Array.from({ length: daysInMonth }, (_, index) => ({
        date: index + 1,
        payments: []
    }));

    // Map each payment to its corresponding day
    payments.forEach((payment) => {
        const paymentDate = new Date(payment.startDate);
        if (paymentDate.getMonth() === month && paymentDate.getFullYear() === year) {
            const day = paymentDate.getDate();
            // Add the payment to the corresponding day in the calendar
            calendarDays[day - 1].payments.push(payment);
        }
    });

    // Add empty days before the first day of the month
    const paddingDays = Array.from({ length: firstDay }, () => ({
        date: null,
        payments: []
    }));

    return [...paddingDays, ...calendarDays];
}