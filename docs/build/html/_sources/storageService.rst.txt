======================
StorageService.js
======================

Provides utility functions to save data to and load data from the browser's localStorage with JSON serialization.

-----------------------------
Function: saveToLocalStorage
-----------------------------

- Saves data to localStorage after converting it to a JSON string.
- Handles and logs errors without throwing, such as quota exceeded or serialization failures.
- Does not return any value.

---------------------------------
Function: loadFromLocalStorage
---------------------------------

- Retrieves JSON data from localStorage by key.
- Parses the JSON string back into an object.
- Returns null if the key does not exist or parsing fails.
- Logs errors encountered during retrieval or parsing.
- Returns the parsed object or null.
