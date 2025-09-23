import { lowercaseEntireText, lowercaseExceptFirstLetter, uppercaseEntireText, swapAddressLines, combineAddressLines, applyWithProbability } from './index';

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