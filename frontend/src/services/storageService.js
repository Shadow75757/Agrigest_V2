// Saves data to localStorage under the specified key after converting it to a JSON string
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Loads and parses JSON data from localStorage by key, returns null if key not found or error occurs
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

/**
 * Saves data to the browser's localStorage after serializing it as a JSON string.
 *
 * This function attempts to store the provided data under the specified key in
 * localStorage. If an error occurs during the process (e.g., storage quota exceeded),
 * it catches and logs the error without throwing.
 *
 * :param key: The key string under which the data will be stored.
 * :param data: The data object to be saved; it will be serialized to JSON.
 * :return: None.
 */

/**
 * Loads data from the browser's localStorage by key, parsing it from JSON.
 *
 * This function retrieves the JSON string stored under the given key and attempts
 * to parse it back into an object. If the key does not exist or parsing fails,
 * it returns null and logs any errors encountered.
 *
 * :param key: The key string of the item to retrieve from localStorage.
 * :return: The parsed object if successful, otherwise null.
 */
