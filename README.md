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
} from "oopsify";

// Direct transformation
const result = lowercaseEntireText("Hello World");
// Returns: "hello world"

// Probabilistic transformation
const maybeUppercase = applyWithProbability(uppercaseEntireText, 0.3);
const result = maybeUppercase("hello world");
// Returns: "HELLO WORLD" with 30% chance, "hello world" with 70% chance

// Address transformation
const swappedAddress = swapAddressLines({
  address: "123 Main Street",
  address2: "Suite 200",
});
// Returns: { address: "Suite 200", address2: "123 Main Street" }

// Address with probability
const maybeSwap = applyWithProbability(swapAddressLines, 0.3);
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

#### `AddressInput` Interface

```typescript
interface AddressInput {
  address: string;
  address2?: string;
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

This is an early-stage project. Issues and pull requests are welcome.

## License

MIT
