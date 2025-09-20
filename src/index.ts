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
  applyWithProbability 
};