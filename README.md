# Google Apps Script StorageService

Small utility class built in TypeScript for storing [almost] any sized values in the `UserProperties` of Google Apps Script properties.

## Why

The nature of how the JavaScript runtime executes on Google Apps Scripts projects makes it inherently difficult to store centralized state. The one way that I've found to consistently store and maintain state for a larger Google Apps Script project (like an add-on) is through storing values in one of the 3 different [Properties](https://developers.google.com/apps-script/reference/properties/properties-service) locations. There are a couple of downsides to using this as your state store, however:

1. Whatever you're storing must be a `key: value` combination, both of which must be `string`s.
1. There is an overall limit to the amount stored in a single property location (At this time, it 500MB, though, so that really hasn't been a major issue for projects that I've worked on).
1. There is a limit to the size of a single `value` that you store per key (at this time, it's 9KB, which can definitely get in the way).

This StorageService class can help overcome some of these hurdles.

## What it Does

Really, this class is just a wrapper for `UserProperties` service, maintained by the GAS (Google Apps Script) project. It does have some benefits, though:

- Handles storing and retrieving of large values, no matter the size (well, as long as it's less than the 500MB total storage cap).
- Prefixes all keys to avoid collision with other values stored in the properties
- Simple, straightforward API contract

## Installation

The way in which you use this class depends on the structure of your GAS project. In this repo, you'll find both the `.ts` class used for development, and the transpiled `.gs` file that you can drop into your projects directly in the GAS Script Editor.

If you're developing your project using [clasp](https://github.com/google/clasp), and writing your project in TypeScript (which I would highly recommend), then feel free to snag the `StorageService.ts` file and drop it into your project. You can then enjoy the benefit of autocompletion, intellisense, and cleaner code.

If you're working on a smaller, quick project, but still need to store state locally on the script / document, then feel free to grab the `.gs` file and simply add that to your project. It will behave exactly the same.

## Usage

The `StorageService` class has 4 methods that you can use.

**Note**: Currently, each method expects that you'll be passing a `string` to store, or receiving a `string` from storage. In the future, we might change this. For now, though, you'll just need to do a simple conversion prior to storing, and after receiving (if you're attempting to store anything other than a `string`).

### storeValue

```typescript
const key = "foo";
const value = {
  bar: "baz"
};

StorageService.storeValue(key, JSON.stringify(value1));
```

**Note**: You would not need to `JSON.stringify()` the value if you're simply storing a `string`.

### getValue

```typescript
const key = "foo";
const value = JSON.parse(StorageService.getValue(key));
```

**Note**: You would not need to `JSON.parse()` the value if you're simply storing a `string`.

### deleteValue

```typescript
const key = "foo";

StorageService.deleteValue(key);
```

### deleteAllValues

```typescript
StorageService.deleteAllValues();
```
