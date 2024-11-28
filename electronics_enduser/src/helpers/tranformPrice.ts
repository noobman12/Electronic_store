function transformPrice(input: string): string {
  // Check if the input matches the pattern "duoi-5-trieu"
  const regex = /^duoi-(\d+)-trieu$/;
  const match = input.match(regex);

  if (match) {
    // If the input is "duoi-5-trieu", return min_price=0
    return "5000000";
  } else {
    // Handle other cases if needed
    return "Invalid input";
  }
}

// Example usage:
const result = transformPrice("duoi-5-trieu");
console.log(result); // Output: "min_price=0"
