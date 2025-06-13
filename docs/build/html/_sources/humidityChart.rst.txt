HumidityChart.jsx
==================

Weekly humidity chart using React and Chart.js. Displays humidity levels for each day based on current weather data.

HumidityChart Component
-----------------------

Displays a bar chart of humidity data for the week. Integrates with a weather context to dynamically update data.

Features:
- Uses Chart.js via `react-chartjs-2`
- Realistic simulated humidity data for the week
- Dynamic update when weather data changes

Functions
~~~~~~~~~

generateWeekData
~~~~~~~~~~~~~~~~

Generates mock humidity data for the current week.

:param todayValue: Humidity value for the current day
:param min: Minimum deviation from today's value
:param max: Maximum deviation from today's value
:return: List of 7 humidity values (one per day)

React Hooks
~~~~~~~~~~~

- `useContext(WeatherContext)`: Fetches current weather from global context
- `useEffect(...)`: Re-generates chart data when weather data updates
- `useState(...)`: Stores humidity and weekday label state

Chart Configuration
~~~~~~~~~~~~~~~~~~~

- X-axis: Weekday labels (``Dom``, ``Seg``, ..., ``Sáb``)
- Y-axis: Humidity percentage (0–100%)
- Dataset: Labeled ``Umidade (%)``, styled with blue tones

Usage
-----

To use this component:

.. code-block:: javascript

   import HumidityChart from './components/HumidityChart';

   function Dashboard() {
     return (
       <div>
         <h2>Humidity Overview</h2>
         <HumidityChart />
       </div>
     );
   }
