// NOTE: As of 4/19, the total amount allowed to be stored
// per value in the UserProperties was 9kB. We're lowering that
// slightly here in order to avoid the app crashing when storing
// large values
const PER_VALUE_STORAGE_LIMIT = 8500;
const MULTI_PART_STORAGE_VALUE = 'MULTI_PART_STORAGE_ENABLED';

class StorageService {
  public static get(key: string): string {
    const value = PropertiesService.getUserProperties().getProperty(
      this.generatePrefixedKey(key),
    );

    if (value === MULTI_PART_STORAGE_VALUE) {
      return this.getMultiPartValue(key);
    }

    return value;
  }

  public static store(key: string, value: string): void {
    if (value.length >= PER_VALUE_STORAGE_LIMIT) {
      this.storeMultiPartValue(key, value);
    } else {
      PropertiesService.getUserProperties().setProperty(
        this.generatePrefixedKey(key),
        value,
      );
    }
  }

  public static delete(key: string): void {
    PropertiesService.getUserProperties().deleteProperty(
      this.generatePrefixedKey(key),
    );
  }

  public static deleteAll(): void {
    PropertiesService.getUserProperties().deleteAllProperties();
  }

  private static generatePrefixedKey(key: string): string {
    return `@@APP_STORAGE_SERVICE_${key}`;
  }

  private static storeMultiPartValue(key: string, value: string): void {
    const properties = PropertiesService.getUserProperties();
    const prefixedKey = this.generatePrefixedKey(key);

    properties.setProperty(prefixedKey, MULTI_PART_STORAGE_VALUE);

    let chunkNumber = 1;
    for (let i = 0; i < value.length; i += PER_VALUE_STORAGE_LIMIT) {
      const chunk = value.substring(i, i + PER_VALUE_STORAGE_LIMIT);
      properties.setProperty(`${prefixedKey}${chunkNumber}`, chunk);
      chunkNumber += 1;
    }
  }

  private static getMultiPartValue(key: string): string {
    const properties = PropertiesService.getUserProperties();
    const prefixedKey = this.generatePrefixedKey(key);
    const value = [];
    let chunkNumber = 1;
    let newChunk = properties.getProperty(`${prefixedKey}${chunkNumber}`);

    while (newChunk != null) {
      value.push(newChunk);
      chunkNumber += 1;
      newChunk = properties.getProperty(`${prefixedKey}${chunkNumber}`);
    }

    return value.join('');
  }
}
