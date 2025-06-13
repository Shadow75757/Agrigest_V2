========================
StorageService.test.js
========================

Unit tests for the ``storageService`` utility module, which handles localStorage operations.

-------------
Test Overview
-------------

These tests validate that the functions ``saveToLocalStorage`` and ``loadFromLocalStorage`` operate correctly.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Test: should save and load data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Saves an object using ``saveToLocalStorage``.
- Loads the object back with ``loadFromLocalStorage``.
- Verifies the loaded object matches the original.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Test: should return null for non-existent key
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Attempts to load data with a key that was never stored.
- Verifies the returned value is ``null``.

------------------
Setup and Cleanup
------------------

Before each test:

- ``localStorage.clear()`` is called to reset storage state.
- ``jest.clearAllMocks()`` ensures no previous mocks interfere with the current test.
