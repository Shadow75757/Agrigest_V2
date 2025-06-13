HistoryTable.jsx
================

HistoryTable Component
----------------------

Component that renders a history table of agricultural actions.

- Retrieves historical data from the ``WeatherContext`` and displays it in a table format.
- Falls back to sample data if no history is available.
- Displays date, action, crop, status, and details for each entry.
- Converts status values into CSS classes and display text for styling.

getStatusClass(status)
~~~~~~~~~~~~~~~~~~~~~~

Retrieves the CSS class name for a given status.

- Returns ``status-completed`` if the status is ``completed``, otherwise returns ``status-pending``.
- Used for styling the status text in the table.

:param status: The status of the action.
:type status: str
:returns: The CSS class name corresponding to the status.
:rtype: str

getStatusText(status)
~~~~~~~~~~~~~~~~~~~~~

Retrieves the display text for a given status.

- Returns ``Concluído`` if the status is ``completed``, otherwise returns ``Pendente``.
- Used as the visible label for the status in the table.

:param status: The status of the action.
:type status: str
:returns: The text label corresponding to the status.
:rtype: str
