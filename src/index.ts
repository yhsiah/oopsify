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
interface AddressInput {
  address: string;
  address2?: string;
}

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

interface CombineAddressOptions {
  secondLineFirst?: boolean;
  separator?: string;
}

function combineAddressLines(
  input: AddressInput,
  options: CombineAddressOptions = {}
): AddressInput {
  if (!input.address2?.trim()) {
    return { ...input };
  }
  
  const secondLineFirst = options.secondLineFirst ?? (Math.random() < 0.5);
  
  let separator: string;
  if (options.separator) {
    separator = options.separator;
  } else {
    const separators = [", ", ", ", ", ", " ", ",", " - ", ". "];
    separator = separators[Math.floor(Math.random() * separators.length)];
  }
  
  const combinedAddress = secondLineFirst 
    ? `${input.address2}${separator}${input.address}`
    : `${input.address}${separator}${input.address2}`;
  
  return {
    address: combinedAddress,
    address2: ""
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
  lowercaseEntireText, 
  lowercaseExceptFirstLetter, 
  uppercaseEntireText,
  applyWithProbability,
  AddressInput,
  swapAddressLines,
  CombineAddressOptions,
  combineAddressLines
};