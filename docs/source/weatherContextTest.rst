==========================
WeatherContext.test.js
==========================

Unit tests for the ``WeatherContext`` React context, which manages global application state related to weather and authentication.

--------------
Test Overview
--------------

These tests validate key context behaviors including:

- Updating location data using context actions.
- Handling asynchronous login and updating user state.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Test: should update location correctly
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Wraps test with ``WeatherProvider`` to access context.
- Calls ``updateLocation`` with a new city.
- Asserts that the ``location.city`` value is updated accordingly.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Test: should handle login success
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Mocks the global ``fetch`` function to simulate an API call returning user credentials.
- Invokes the ``login`` function from context with test credentials.
- Waits for context state to update.
- Asserts that the ``user`` state is updated with the returned user object.

-------------
Setup and Tools
-------------

- Uses ``@testing-library/react-hooks`` to render and interact with context inside hooks.
- Uses ``act`` from React to ensure state updates are applied correctly.
- Mocks external API calls to isolate context behavior.
