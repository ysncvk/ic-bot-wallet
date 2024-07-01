export const fDate = (datemili) => {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(datemili / 1000000n);

  // Create a Date object using the milliseconds
  const date = new Date(milliseconds);

  // Format the date and time without fractional seconds
  const formattedDate = date.toLocaleString("tr-TR", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formattedDate;
};
