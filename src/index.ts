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

/**
 * Configuration options for apartment term replacement
 */
interface ApartmentOptions {
  /** Completely replaces the default apartment terms. Cannot be used with other options. */
  replaceTerms?: string[];
  /** Adds additional terms to the default list */
  additionalTerms?: string[];
  /** Removes specific terms from the available options */
  excludeTerms?: string[];
}

/**
 * Replaces apartment designation terms with random variations while preserving spacing.
 * Only transforms the first apartment designation found in each address field.
 * 
 * Note: replaceTerms cannot be used with additionalTerms or excludeTerms (throws error).
 * 
 * @param input - Address object with address and optional address2
 * @param options - Configuration for term selection and exclusion
 * @returns Address object with varied apartment terms
 * @throws {Error} When replaceTerms is combined with other options, or when all terms are filtered out
 * 
 * @example
 * replaceApartmentTerms({ address: "Apt 5, 123 Main St" })
 * // Returns: { address: "Apartment 5, 123 Main St" } (or other random variation)
 */
function replaceApartmentTerms(
  input: AddressInput,
  options: ApartmentOptions = {}
): AddressInput {
  // Validate conflicting options (only check non-empty arrays)
  const hasReplaceTerms = options.replaceTerms?.length;
  const hasAdditionalTerms = options.additionalTerms?.length;
  const hasExcludeTerms = options.excludeTerms?.length;
  
  if (hasReplaceTerms && (hasAdditionalTerms || hasExcludeTerms)) {
    throw new Error("Cannot use replaceTerms with additionalTerms or excludeTerms");
  }

  const defaultWords = ["Apt", "Apt.", "Apartment", "Flat", "Suite", "Unit"];
  
  // Use replaceTerms if provided, otherwise merge additionalTerms with defaults
  let wordsToUse = options.replaceTerms?.length 
    ? options.replaceTerms 
    : [...defaultWords, ...(options.additionalTerms || [])];
  
  // Filter out excluded terms using exact matching
  const excludeTerms = options.excludeTerms;
  if (excludeTerms?.length) {
    wordsToUse = wordsToUse.filter(term => 
      !excludeTerms.some(exclude => 
        term.trim().toLowerCase() === exclude.trim().toLowerCase()
      )
    );
  }

  // Validate we have terms to work with
  if (wordsToUse.length === 0) {
    throw new Error("No apartment terms available after applying filters");
  }
  
  const replaceInText = (text: string): string => {
    // Regex pattern matches apartment designations followed by numbers
    // (apt\.?|apartment|flat|suite|ste\.?|unit|no\.?) - Captures apartment term
    // (\s*) - Captures optional whitespace (preserved in output)
    // (\d+[A-Za-z]?) - Captures number with optional letter (5A, 3b, etc.)
    // i flag - Case insensitive
    const apartmentRegex = /(apt\.?|apartment|flat|suite|ste\.?|unit|no\.?)(\s*)(\d+[A-Za-z]?)/i;
    
    const match = text.match(apartmentRegex);
    if (!match) {
      return text;
    }
    
    const whitespace = match[2];
    const number = match[3];
    const randomWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
    
    return text.replace(apartmentRegex, `${randomWord}${whitespace}${number}`);
  };
  
  return {
    address: replaceInText(input.address),
    address2: replaceInText(input.address2 || "")
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
  combineAddressLines,
  ApartmentOptions,
  replaceApartmentTerms
};