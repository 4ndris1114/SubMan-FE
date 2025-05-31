import { ISubscription } from "@/types/interfaces/ISubscription";

export function getCalendarForMonth(payments: ISubscription[], month: number, year: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDay = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => ({
    date: index + 1,
    payments: [] as ISubscription[],
  }));

  payments.forEach((payment) => {
    const startDate = new Date(payment.startDate);
    const interval = payment.interval; // in days

    let paymentDate = new Date(startDate);

    // Find the first payment date in or after the start of the target month
    while (
      paymentDate.getTime() < new Date(year, month, 1).getTime()
    ) {
      paymentDate.setDate(paymentDate.getDate() + interval);
    }

    // Add all payment dates in the target month
    while (
      paymentDate.getFullYear() === year &&
      paymentDate.getMonth() === month
    ) {
      const dayIndex = paymentDate.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < daysInMonth) {
        calendarDays[dayIndex].payments.push(payment);
      }

      // Move to the next payment date
      paymentDate.setDate(paymentDate.getDate() + interval);
    }
  });

  // Add padding for days before the first of the month
  const paddingDays = Array.from({ length: firstDay }, () => ({
    date: null,
    payments: [] as ISubscription[],
  }));

  return [...paddingDays, ...calendarDays];
}
