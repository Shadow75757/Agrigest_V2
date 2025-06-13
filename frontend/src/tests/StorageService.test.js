// Import utility functions for saving to and loading from localStorage
import { saveToLocalStorage, loadFromLocalStorage } from '../services/storageService';

// Unit tests for the storageService module
describe('storageService', () => {
  // Clear localStorage and Jest mocks before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Test saving and loading data with localStorage
  it('should save and load data from localStorage', () => {
    const testData = { key: 'value' };
    saveToLocalStorage('test', testData);
    const loadedData = loadFromLocalStorage('test');
    expect(loadedData).toEqual(testData);
  });

  // Test loading data with a non-existent key returns null
  it('should return null for non-existent key', () => {
    const loadedData = loadFromLocalStorage('non-existent');
    expect(loadedData).toBeNull();
  });
});

/**
 * Unit tests for storageService utility functions.
 *
 * These tests validate that data can be correctly saved to and retrieved from `localStorage`.
 * They also confirm that querying a non-existent key returns `null` as expected.
 *
 * Tests:
 *
 * - Clears `localStorage` and Jest mocks before each test to ensure isolation.
 * - Confirms data saved with `saveToLocalStorage` can be loaded using `loadFromLocalStorage`.
 * - Ensures that a non-existent key returns `null`.
 */
