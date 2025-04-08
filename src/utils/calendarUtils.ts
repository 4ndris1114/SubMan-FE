import { ISubscription } from "@/types/interfaces/ISubscription";

export function getCalendarForMonth(payments: ISubscription[], month: number, year: number) {
    const currentDate = new Date();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDay = firstDayOfMonth.getDay() - 1;

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize an array of days
    const calendarDays = Array.from({ length: daysInMonth }, (_, index) => ({
        date: index + 1,
        payments: []
    }));
      
// Map each payment to its corresponding day
payments.forEach((payment) => {
    const startDate = new Date(payment.startDate);
    const interval = payment.interval; // Assume interval is in days
    let paymentDate = new Date(startDate);

    // Only start adding payments if the paymentDate is after today
    if (paymentDate < new Date()) {
        // Skip payments that are before the current date
        paymentDate = new Date(new Date().setDate(new Date().getDate() + 1)); // Start from tomorrow
    }

    // Loop to add future payments only, based on the interval
    while (paymentDate <= new Date('2028-12-31')) { // End the loop after a reasonable date far into the future
        // Check if paymentDate is within the target month (or future months)
        if (paymentDate.getFullYear() > year || 
            (paymentDate.getFullYear() === year && paymentDate.getMonth() >= month)) {

            const day = paymentDate.getDate();

            // Initialize the day in the calendar if not already initialized
            if (!calendarDays[day - 1]) {
                calendarDays[day - 1] = { date: day, payments: [] };
            }

            // Add the payment to the corresponding day
            calendarDays[day - 1].payments.push(payment);
        }

        // Increment the payment date by the interval (in days)
        paymentDate.setDate(paymentDate.getDate() + interval);
    }
});




    // Add empty days before the first day of the month
    const paddingDays = Array.from({ length: firstDay }, () => ({
        date: null,
        payments: []
    }));

    return [...paddingDays, ...calendarDays];
}