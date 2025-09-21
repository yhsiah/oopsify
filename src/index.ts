// Interfaces
interface AddressInput {
  address: string;
  address2?: string;
}

// Transformation functions
function lowercaseEntireText(text: string): string {
  return text.toLowerCase();
}

function uppercaseEntireText(text: string): string {
  return text.toUpperCase();
}

function lowercaseExceptFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Address-specific functions
function swapAddressLines(input: AddressInput): AddressInput {
  // Only swap if both address lines have content
  if (!input.address2?.trim()) {
    return { ...input };
  }
  
  return {
    address: input.address2,
    address2: input.address
  };
}

// Probability wrapper
function applyWithProbability<T>(
  fn: (input: T) => T, 
  probability: number, 
  rng = Math.random // rng is injectible for testing
) {
  return (input: T): T => {
    if (rng() < probability) {
      return fn(input);
    }
    return input;
  };
}

// Export everything
export { 
  AddressInput,
  lowercaseEntireText, 
  lowercaseExceptFirstLetter, 
  uppercaseEntireText,
  applyWithProbability,
  swapAddressLines
};