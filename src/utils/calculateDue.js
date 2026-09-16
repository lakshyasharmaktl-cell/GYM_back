// Calculates due amount = totalFee - amountPaid
export const calculateDue = (totalFee, amountPaid) => {
  const due = totalFee - amountPaid;
  return due > 0 ? due : 0;
};

// Calculates membership end date based on plan duration
export const calculateEndDate = (startDate, durationInDays) => {
  const start = new Date(startDate);
  start.setDate(start.getDate() + durationInDays);
  return start;
};