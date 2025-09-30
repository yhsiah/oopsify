import { lowercaseEntireText, lowercaseExceptFirstLetter, uppercaseEntireText, swapAddressLines, combineAddressLines, replaceApartmentTerms, applyWithProbability } from './index';

describe('lowercaseEntireText', () => {
  test('converts text to lowercase', () => {
    expect(lowercaseEntireText('Hello World')).toBe('hello world');
    expect(lowercaseEntireText('HIGH STREET')).toBe('high street');
    expect(lowercaseEntireText('MiXeD cAsE')).toBe('mixed case');
  });

  test('handles already lowercase text', () => {
    expect(lowercaseEntireText('hello world')).toBe('hello world');
  });

  test('handles empty strings', () => {
    expect(lowercaseEntireText('')).toBe('');
  });

  test('handles single characters', () => {
    expect(lowercaseEntireText('A')).toBe('a');
  });

  test('handles numbers and symbols', () => {
    expect(lowercaseEntireText('123 Main St!')).toBe('123 main st!');
  });

  test('handles whitespace variations', () => {
    expect(lowercaseEntireText('  HELLO  ')).toBe('  hello  ');
  });

  test('handles special characters', () => {
    expect(lowercaseEntireText('Café-Restaurant')).toBe('café-restaurant');
  });
});

describe('uppercaseEntireText', () => {
  test('converts text to uppercase', () => {
    expect(uppercaseEntireText('hello world')).toBe('HELLO WORLD');
    expect(uppercaseEntireText('High Street')).toBe('HIGH STREET');
    expect(uppercaseEntireText('mixed case')).toBe('MIXED CASE');
  });

  test('handles already uppercase text', () => {
    expect(uppercaseEntireText('HELLO WORLD')).toBe('HELLO WORLD');
  });

  test('handles empty strings', () => {
    expect(uppercaseEntireText('')).toBe('');
  });

  test('handles single characters', () => {
    expect(uppercaseEntireText('a')).toBe('A');
  });

  test('handles numbers and symbols', () => {
    expect(uppercaseEntireText('123 main st!')).toBe('123 MAIN ST!');
  });

  test('handles whitespace variations', () => {
    expect(uppercaseEntireText('  hello  ')).toBe('  HELLO  ');
  });

  test('handles special characters', () => {
    expect(uppercaseEntireText('café-restaurant')).toBe('CAFÉ-RESTAURANT');
  });
});

describe('lowercaseExceptFirstLetter', () => {
  test('capitalizes first letter only', () => {
    expect(lowercaseExceptFirstLetter('hello world')).toBe('Hello world');
    expect(lowercaseExceptFirstLetter('HIGH STREET')).toBe('High street');
    expect(lowercaseExceptFirstLetter('mIxEd CaSe')).toBe('Mixed case');
  });

  test('handles already correctly capitalized text', () => {
    expect(lowercaseExceptFirstLetter('Hello world')).toBe('Hello world');
  });

  test('handles empty strings', () => {
    expect(lowercaseExceptFirstLetter('')).toBe('');
  });

  test('handles single characters', () => {
    expect(lowercaseExceptFirstLetter('a')).toBe('A');
  });

  test('handles numbers and symbols', () => {
    expect(lowercaseExceptFirstLetter('123 MAIN ST!')).toBe('123 main st!');
  });

  test('handles whitespace variations', () => {
    expect(lowercaseExceptFirstLetter('  HELLO  ')).toBe('  hello  ');
  });

  test('handles special characters', () => {
    expect(lowercaseExceptFirstLetter('CAFÉ-RESTAURANT')).toBe('Café-restaurant');
  });
});

describe('swapAddressLines', () => {
  test('swaps address lines when both are present', () => {
    const input = {
      address: "123 Main Street",
      address2: "Apt 5"
    };
    const result = swapAddressLines(input);
    expect(result).toEqual({
      address: "Apt 5",
      address2: "123 Main Street"
    });
  });

  test('returns unchanged when address2 is undefined', () => {
    const input = {
      address: "123 Main Street"
    };
    const result = swapAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street"
    });
  });

  test('returns unchanged when address2 is empty string', () => {
    const input = {
      address: "123 Main Street",
      address2: ""
    };
    const result = swapAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street",
      address2: ""
    });
  });

  test('returns unchanged when address2 is only whitespace', () => {
    const input = {
      address: "123 Main Street",
      address2: "   "
    };
    const result = swapAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street",
      address2: "   "
    });
  });

  test('handles tab and newline whitespace', () => {
    const input = {
      address: "123 Main Street",
      address2: "\t\n"
    };
    const result = swapAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street",
      address2: "\t\n"
    });
  });
});

describe('combineAddressLines', () => {
  test('combines address lines with default settings', () => {
    const input = {
      address: "123 Main Street",
      address2: "Apt 5"
    };
    const result = combineAddressLines(input);
    
    // Should combine the lines and clear address2
    expect(result.address2).toBe("");
    expect(result.address).toContain("123 Main Street");
    expect(result.address).toContain("Apt 5");
  });

  test('returns unchanged when address2 is undefined', () => {
    const input = {
      address: "123 Main Street"
    };
    const result = combineAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street"
    });
  });

  test('returns unchanged when address2 is empty string', () => {
    const input = {
      address: "123 Main Street",
      address2: ""
    };
    const result = combineAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street",
      address2: ""
    });
  });

  test('returns unchanged when address2 is only whitespace', () => {
    const input = {
      address: "123 Main Street",
      address2: "   "
    };
    const result = combineAddressLines(input);
    expect(result).toEqual({
      address: "123 Main Street",
      address2: "   "
    });
  });

  test('uses custom separator when provided', () => {
    const input = {
      address: "123 Main Street",
      address2: "Apt 5"
    };
    const result = combineAddressLines(input, { separator: " | " });
    
    expect(result.address).toContain(" | ");
    expect(result.address2).toBe("");
  });

  test('puts second line first when specified', () => {
    const input = {
      address: "123 Main Street",
      address2: "Apt 5"
    };
    const result = combineAddressLines(input, { secondLineFirst: true });
    
    expect(result.address).toMatch(/^Apt 5/);
    expect(result.address).toContain("123 Main Street");
    expect(result.address2).toBe("");
  });

  test('puts first line first when specified', () => {
    const input = {
      address: "123 Main Street",
      address2: "Apt 5"
    };
    const result = combineAddressLines(input, { secondLineFirst: false });
    
    expect(result.address).toMatch(/^123 Main Street/);
    expect(result.address).toContain("Apt 5");
    expect(result.address2).toBe("");
  });

  test('uses both custom separator and order', () => {
    const input = {
      address: "123 Main Street",
      address2: "Suite 200"
    };
    const result = combineAddressLines(input, { 
      separator: " - ", 
      secondLineFirst: true 
    });
    
    expect(result.address).toBe("Suite 200 - 123 Main Street");
    expect(result.address2).toBe("");
  });
});

describe('replaceApartmentTerms', () => {
  // Basic functionality - happy path
  test('replaces apartment term while maintaining structure', () => {
    const input = {
      address: "Apt 5, 123 Main Street",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toContain("5, 123 Main Street");
  });

  test('transforms apartment term in address1 only', () => {
    const input = {
      address: "Apt 5, 123 Main Street",
      address2: "Building A"
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toContain("5");
    expect(result.address2).toBe("Building A");
  });

  test('transforms apartment term in address2 only', () => {
    const input = {
      address: "123 Main Street",
      address2: "Suite 200"
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toBe("123 Main Street");
    expect(result.address2).toContain("200");
  });

  // Negative cases - what should NOT match
  test('returns unchanged when no apartment term found', () => {
    const input = {
      address: "123 Main Street",
      address2: "Building A"
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  test('does not match apartment term within a larger word', () => {
    const input = {
      address: "Aptitude5 Street",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  test('does not match when term is part of another word', () => {
    const input = {
      address: "Flatiron 5th Floor",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  test('does not match apartment term without adjacent number', () => {
    const input = {
      address: "Apartment building, 123 Main Street",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  test('does not match when number is not immediately adjacent', () => {
    const input = {
      address: "Apartment on 5th floor",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  test('does not match standalone street numbers', () => {
    const input = {
      address: "5 Main Street",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result).toEqual(input);
  });

  // Formatting preservation
  test('preserves no spacing', () => {
    const input = {
      address: "Apt5",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).not.toContain(" ");
    expect(result.address).toContain("5");
  });

  test('preserves single space', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toMatch(/^(Apt|Apt\.|Apartment|Flat|Suite|Ste|Unit|No) 5$/);
  });

  test('preserves multiple spaces', () => {
    const input = {
      address: "Apt  5",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toMatch(/^(Apt|Apt\.|Apartment|Flat|Suite|Ste|Unit|No)  5$/);
  });

  test('handles apartment numbers with letters', () => {
    const input = {
      address: "Apt 5A",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toContain("5A");
  });

  // Multiple matches behavior
  test('only replaces first apartment term when multiple exist', () => {
    const input = {
      address: "Apt 5, Suite 200, 123 Main Street",
      address2: ""
    };
    const result = replaceApartmentTerms(input);
    
    expect(result.address).toContain(" 5, Suite 200, 123 Main Street");
  });

  // Options API - replaceTerms
  test('uses replaceTerms to override defaults', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    const result = replaceApartmentTerms(input, {
      replaceTerms: ["Custom"]
    });
    
    expect(result.address).toBe("Custom 5");
  });

  // Options API - additionalTerms
  test('additionalTerms work without errors', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    const result = replaceApartmentTerms(input, {
      additionalTerms: ["NewTerm"]
    });
    
    const usedTerm = result.address.split(" ")[0];
    expect(["Apt", "Apt.", "Apartment", "Flat", "Suite", "Ste", "Unit", "No", "NewTerm"]).toContain(usedTerm);
  });

  test('additionalTerms can be selected', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    const result = replaceApartmentTerms(input, {
      excludeTerms: ["Apt", "Apt.", "Apartment", "Flat", "Suite", "Ste", "Unit", "No"],
      additionalTerms: ["NewTerm"]
    });
    
    expect(result.address).toBe("NewTerm 5");
  });

  // Options API - excludeTerms
  test('excludes specific terms from selection', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    
    const result = replaceApartmentTerms(input, {
      excludeTerms: ["Flat"]
    });
    
    const usedTerm = result.address.split(" ")[0];
    expect(["Apt", "Apt.", "Apartment", "Suite", "Unit"]).toContain(usedTerm);
  });

  test('combines excludeTerms and additionalTerms', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    const result = replaceApartmentTerms(input, {
      additionalTerms: ["Custom"],
      excludeTerms: ["Flat", "Suite"]
    });
    
    const usedTerm = result.address.split(" ")[0];
    expect(["Apt", "Apt.", "Apartment", "Unit", "Custom"]).toContain(usedTerm);
  });

  // Error handling
  test('throws error when replaceTerms combined with additionalTerms', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    
    expect(() => {
      replaceApartmentTerms(input, {
        replaceTerms: ["Custom"],
        additionalTerms: ["Extra"]
      });
    }).toThrow("Cannot use replaceTerms with additionalTerms or excludeTerms");
  });

  test('throws error when replaceTerms combined with excludeTerms', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    
    expect(() => {
      replaceApartmentTerms(input, {
        replaceTerms: ["Custom"],
        excludeTerms: ["Flat"]
      });
    }).toThrow("Cannot use replaceTerms with additionalTerms or excludeTerms");
  });

  test('throws error when all terms filtered out', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    
    expect(() => {
      replaceApartmentTerms(input, {
        excludeTerms: ["Apt", "Apt.", "Apartment", "Flat", "Suite", "Ste", "Unit", "No"]
      });
    }).toThrow("No apartment terms available after applying filters");
  });

  test('allows empty arrays without throwing conflict error', () => {
    const input = {
      address: "Apt 5",
      address2: ""
    };
    
    expect(() => {
      replaceApartmentTerms(input, {
        replaceTerms: ["Custom"],
        additionalTerms: [],
        excludeTerms: []
      });
    }).not.toThrow();
  });
});

describe('applyWithProbability', () => {
  test('applies transformation when random returns low value', () => {
    const alwaysLow = () => 0.1;
    const maybeUppercase = applyWithProbability(uppercaseEntireText, 0.5, alwaysLow);
    expect(maybeUppercase('hello')).toBe('HELLO');
  });

  test('skips transformation when random returns high value', () => {
    const alwaysHigh = () => 0.9;
    const maybeUppercase = applyWithProbability(uppercaseEntireText, 0.5, alwaysHigh);
    expect(maybeUppercase('hello')).toBe('hello');
  });
});