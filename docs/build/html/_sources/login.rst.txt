Login.jsx
==============

Module for the Login component handling user authentication and UI transitions.

Login
-----

Main Login component managing the login form, splash screen, loading overlay, and navigation.

showLoadingOverlayAndNavigate
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Shows loading overlay with fade-in animation.
- Navigates to the specified route after the fade animation.
- Provides a smooth transition from login screen to dashboard.

:parameter to: Route path to navigate to (string).
:return: None.

handleSubmit
~~~~~~~~~~~~

- Handles the login form submission.
- Uses the context login function to authenticate.
- On success, stores user data in localStorage and navigates to dashboard.
- On failure, displays an error message.

:parameter e: Form submit event.
:return: None.

handleGuestLogin
~~~~~~~~~~~~~~~~

- Logs in the user as a guest (no password).
- Saves guest user data to localStorage.
- Navigates to the dashboard on success.
- Displays error on failure.

:return: None.

handleChange
~~~~~~~~~~~~

- Updates the form input state for username or password.
- Clears error message if present.

:parameter field: Name of the input field ("username" or "password").
:return: Function to handle input change event.
