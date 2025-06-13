TemperatureChart.jsx
====================

React component displaying a weekly temperature line chart for a given city.

TemperatureChart Component
--------------------------

Displays temperature data over a week as a line chart using Chart.js.
The chart updates dynamically based on the provided city and today's temperature.

Functions
~~~~~~~~~

generateWeekData
~~~~~~~~~~~~~~~~

Generates an array of temperature values for the week based on today's temperature.

:param todayValue: Temperature for the current day
:param min: Minimum random deviation from today's temperature
:param max: Maximum random deviation from today's temperature
:return: Array of 7 temperature values representing the week

Component Props
~~~~~~~~~~~~~~~

- ``city`` (string): Name of the city to display
- ``todayTemperature`` (number): Temperature value for today

Chart Details
~~~~~~~~~~~~~

- X-axis: Days of the week abbreviated as ``Dom``, ``Seg``, etc.
- Y-axis: Temperature in Celsius (°C)
- Line color: Red with semi-transparent fill
- Responsive and includes a legend at the top

Usage
-----

Import and use in any React component to visualize temperature trends:

.. code-block:: javascript

   import TemperatureChart from './components/TemperatureChart';

   function App() {
     return <TemperatureChart city="São Paulo" todayTemperature={28} />;
   }
