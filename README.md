# oopsify

Transform clean fake data into realistic human-entered data

## Overview

Most test data generators produce perfect, clean data that doesn't reflect how real users actually input information. `oopsify` adds realistic human errors and formatting variations to your test data, helping you build more robust applications that handle real-world messiness.

Written in TypeScript, tested with Jest.

## Installation

```bash
npm install oopsify
```

## Quick Start

```typescript
import {
  lowercaseEntireText,
  uppercaseEntireText,
  applyWithProbability,
  swapAddressLines,
  combineAddressLines,
  replaceApartmentTerms,
} from "oopsify";

// Direct transformation
const lowerCased = lowercaseEntireText("Hello World");
// Returns: "hello world"

// Address transformations
const swappedAddress = swapAddressLines({
  address: "123 Main Street",
  address2: "Suite 200",
});
// Returns: { address: "Suite 200", address2: "123 Main Street" }

const combinedAddress = combineAddressLines({
  address: "123 Main Street",
  address2: "Apt 5",
});
// Returns: { address: "Apt 5, 123 Main Street", address2: "" }

// Apartment term variation
const variedAddress = replaceApartmentTerms({
  address: "123 Main Street",
  address2: "Apt. 825",
});
// Returns: { address: "123 Main Street", address2: "Suite 825" }
// (or Apartment, Flat, Unit, etc.)

// Probabilistic transformation
const maybeUppercase = applyWithProbability(uppercaseEntireText, 0.3);
const result = maybeUppercase("hello world");
// Returns: "HELLO WORLD" with 30% chance, "hello world" with 70% chance
```

## Common Patterns

### Transform faker output

```typescript
import { faker } from "@faker-js/faker";
import {
  replaceApartmentTerms,
  applyWithProbability,
  combineAddressLines,
} from "oopsify";

// Generate clean faker data
const cleanAddress = {
  address: faker.location.streetAddress(), // "782 Derrick Springs"
  address2: faker.location.secondaryAddress(), // "Apt. 350"
};

// Replace apartment term with a variation
const withVariedTerms = replaceApartmentTerms(cleanAddress);
// Result: { address: "782 Derrick Springs", address2: "Flat 350" }

// Sometimes combine address lines
const maybeCombined = applyWithProbability(combineAddressLines, 0.3);
const oopsifiedAddress = maybeCombined(withVariedTerms);
// Result (30% chance): { address: "Flat 350, 782 Derrick Springs", address2: "" }
// Result (70% chance): { address: "782 Derrick Springs", address2: "Flat 350" }
```

### Process multiple addresses

```typescript
// Generate 100 clean addresses
const addresses = Array.from({ length: 100 }, () => ({
  address: faker.location.streetAddress(),
  address2: faker.location.secondaryAddress(),
}));

// Apply realistic variations to each
const oopsifiedAddresses = addresses.map((addr) => {
  // Always: vary the apartment term
  const varied = replaceApartmentTerms(addr);
  // Sometimes (30%): combine into single line
  return applyWithProbability(combineAddressLines, 0.3)(varied);
});

// Result: 100 addresses with varied apartment terms
//         ~30 will have combined address lines
//         ~70 will keep separate lines
```

## API Reference

### Transformation Functions

#### `lowercaseEntireText(text: string): string`

```typescript
lowercaseEntireText("Hello World"); // "hello world"
```

#### `uppercaseEntireText(text: string): string`

```typescript
uppercaseEntireText("hello world"); // "HELLO WORLD"
```

#### `lowercaseExceptFirstLetter(text: string): string`

```typescript
lowercaseExceptFirstLetter("HELLO WORLD"); // "Hello world"
```

### Address Functions

#### `swapAddressLines(input: AddressInput): AddressInput`

Swaps address line 1 and address line 2 when both contain content.

```typescript
swapAddressLines({
  address: "123 Main Street",
  address2: "Apt 5",
});
// Returns: { address: "Apt 5", address2: "123 Main Street" }
```

#### `combineAddressLines(input: AddressInput, options?: CombineAddressOptions): AddressInput`

Combines address line 2 into address line 1 and clears address line 2.

```typescript
combineAddressLines({
  address: "123 Main Street",
  address2: "Apt 5",
});
// Returns: { address: "Apt 5, 123 Main Street", address2: "" }

// With options
combineAddressLines(input, { secondLineFirst: false, separator: " - " });
```

#### `replaceApartmentTerms(input: AddressInput, options?: ApartmentOptions): AddressInput`

Replaces apartment designation terms with random variations while preserving spacing and structure. Only transforms the first apartment designation found in each address field.

**Default terms:** Apt, Apt., Apartment, Flat, Suite, Ste, Unit, No

```typescript
// Basic usage - randomly selects from default terms
replaceApartmentTerms({
  address: "123 Main Street",
  address2: "Apt. 5",
});
// Returns: { address: "123 Main Street", address2: "Suite 5" }
// (or any other default term)

// Override all default terms with custom ones
replaceApartmentTerms(input, {
  replaceTerms: ["Room", "#"],
});

// Add custom terms to defaults
replaceApartmentTerms(input, {
  additionalTerms: ["Room"],
});

// Exclude specific terms from selection
replaceApartmentTerms(input, {
  excludeTerms: ["Flat", "Suite"],
});

// Combine additional terms and exclude some terms
replaceApartmentTerms(input, {
  additionalTerms: ["Room"],
  excludeTerms: ["Flat"],
});
```

**Behavior:**

- Preserves spacing: `"Apt 5"` → `"Suite 5"`, `"Apt5"` → `"Suite5"`
- Handles letters: `"Apt 5A"` → `"Unit 5A"`
- Only replaces first match per field

**Note:** `replaceTerms` cannot be used with `additionalTerms` or `excludeTerms`.

#### `AddressInput` Interface

```typescript
interface AddressInput {
  address: string;
  address2?: string;
}
```

#### `CombineAddressOptions` Interface

```typescript
interface CombineAddressOptions {
  secondLineFirst?: boolean;
  separator?: string;
}
```

#### `ApartmentOptions` Interface

```typescript
interface ApartmentOptions {
  replaceTerms?: string[]; // Completely replaces default terms
  additionalTerms?: string[]; // Adds to default terms
  excludeTerms?: string[]; // Removes specific terms
}
```

### Utility Functions

#### `applyWithProbability<T>(fn: Function, probability: number, rng?: Function): Function`

Wraps any transformation function to apply it probabilistically.

**Parameters:**

- `fn`: The transformation function to apply
- `probability`: Number between 0-1 representing the chance of applying the transformation
- `rng`: Optional. Defaults to Math.random, but made injectible for testing purposes

```typescript
// Create a function that uppercases text 25% of the time
const sometimesUppercase = applyWithProbability(uppercaseEntireText, 0.25);
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

## Contributing

Issues and pull requests are welcome.

## License

MIT
