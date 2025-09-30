# oopsify

Transform clean fake data into realistic human-entered data

## Overview

Most test data generators produce perfect, clean data that doesn't reflect how real users actually input information. `oopsify` adds realistic human errors and formatting variations to your test data, helping you build more robust applications that handle real-world messiness.

Written in TypeScript, tested with Jest.

**Note:** oopsify transforms existing data - it doesn't generate it. Use with faker, chance, or any data generator.

## Installation

```bash
npm install oopsify
```

## Quick Start

```typescript
import {
  pipe,
  removeSpacing,
  lowercaseEntireText,
  applyWithProbability,
} from "oopsify";

// Simple transformation
const clean = removeSpacing("DF3 3OF"); // "DF33OF"

// Compose transformations
const oopsified = pipe(
  removeSpacing,
  applyWithProbability(lowercaseEntireText, 0.2)
);

oopsified("DF3 3OF"); // "DF33OF" or "df33of"
```

## Common Patterns

### Transform a single value

```typescript
import { removeSpacing } from "oopsify";

const postcode = removeSpacing("DF3 3OF"); // "DF33OF"
```

### Compose transformations with pipe

```typescript
import {
  pipe,
  removeSpacing,
  lowercaseEntireText,
  applyWithProbability,
} from "oopsify";

const oopsifiedPostcode = pipe(
  removeSpacing,
  applyWithProbability(lowercaseEntireText, 0.2)
);

oopsifiedPostcode("DF3 3OF");
// Returns: "DF33OF" (80% of the time) or "df33of" (20% of the time)
```

### Transform faker data

```typescript
import { faker } from "@faker-js/faker";
import {
  pipe,
  replaceApartmentTerms,
  combineAddressLines,
  applyWithProbability,
} from "oopsify";

// Generate clean address data
const cleanAddress = {
  address: faker.location.streetAddress(), // "782 Derrick Springs"
  address2: faker.location.secondaryAddress(), // "Apt. 350"
};

// Create reusable transformation pipeline
const oopsifiedAddress = pipe(
  replaceApartmentTerms,
  applyWithProbability(combineAddressLines, 0.3)
);

const result = oopsifiedAddress(cleanAddress);
// 30% chance: { address: "Flat 350, 782 Derrick Springs", address2: "" }
// 70% chance: { address: "782 Derrick Springs", address2: "Suite 350" }
```

### Process multiple addresses

```typescript
// Generate 100 clean addresses
const addresses = Array.from({ length: 100 }, () => ({
  address: faker.location.streetAddress(),
  address2: faker.location.secondaryAddress(),
}));

// Create transformation pipeline
const oopsifiedAddress = pipe(
  replaceApartmentTerms,
  applyWithProbability(combineAddressLines, 0.3)
);

// Apply to all addresses
const results = addresses.map(oopsifiedAddress);

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

#### `removeSpacing(text: string): string`

Removes all whitespace from text including spaces, tabs, and newlines.

```typescript
removeSpacing("DF3 3OF"); // "DF33OF"
removeSpacing("0115 269 4127"); // "01152694127"
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

### Composition Functions

#### `pipe<T>(...fns: Array<(arg: T) => T>): (value: T) => T`

Composes functions left-to-right, passing the output of each function as input to the next.

```typescript
// Create a transformation pipeline
const oopsifiedPostcode = pipe(
  removeSpacing,
  applyWithProbability(lowercaseEntireText, 0.2)
);

oopsifiedPostcode("DF3 3OF");
// Returns: "DF33OF" (80% of the time) or "df33of" (20% of the time)

// Combine multiple transformations
const oopsifiedAddress = pipe(
  replaceApartmentTerms,
  applyWithProbability(combineAddressLines, 0.3)
);

oopsifiedAddress({ address: "123 Main St", address2: "Apt 5" });
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
