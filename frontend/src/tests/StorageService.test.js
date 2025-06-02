import { saveToLocalStorage, loadFromLocalStorage } from '../services/storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should save and load data from localStorage', () => {
    const testData = { key: 'value' };
    saveToLocalStorage('test', testData);
    const loadedData = loadFromLocalStorage('test');
    expect(loadedData).toEqual(testData);
  });

  it('should return null for non-existent key', () => {
    const loadedData = loadFromLocalStorage('non-existent');
    expect(loadedData).toBeNull();
  });
});