================
App.js
================

Application entry point that sets up routing and context for the React application.

-------------
Components
-------------

- ``PrivateRoute``: A wrapper for protected routes that checks user authentication.
- ``App``: Main component that initializes the context and routing.

~~~~~~~~~~~~~~~~~
PrivateRoute
~~~~~~~~~~~~~~~~~

A higher-order component that protects certain routes.

Checks the user context provided by ``WeatherProvider``. If a user is authenticated, it renders
the given child components. Otherwise, it redirects to the login page.

**Parameters:**

- ``children`` – The JSX elements to render if the user is authenticated.

**Returns:**

- Protected JSX content or a redirect to ``/login``.

~~~~~~~~~~~~~~~~~
App
~~~~~~~~~~~~~~~~~

The root component of the application.

Sets up the application with ``WeatherProvider`` context and configures the routing
using ``react-router-dom``.

**Routes:**

- ``/login`` – Renders the ``Login`` component.
- ``/*`` – Renders the ``Dashboard`` component inside ``PrivateRoute``.

**Returns:**

- The complete application layout with context and routes.
