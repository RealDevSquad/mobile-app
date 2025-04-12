export const formatDateTime = (timestamp: string | number): string => {
    if (!timestamp) return "Invalid date";
  
    // Convert the timestamp to a number if it's a string
    let numericTimestamp = Number(timestamp);
  
    // Check if the timestamp is in seconds (10 digits) and convert to milliseconds
    if (numericTimestamp < 1000000000000) {
      numericTimestamp *= 1000;
    }
  
    const date = new Date(numericTimestamp);
  
    // Format the date only
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    return formattedDate;
  };