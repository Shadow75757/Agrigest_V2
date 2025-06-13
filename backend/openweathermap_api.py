import requests

# Functions to get current weather and forecast from OpenWeatherMap API

# Fetches current weather data for a city from OpenWeatherMap API.


def get_current_weather(city, api_key):
    """
    Get current weather data for a city from OpenWeatherMap API.

    This function fetches the current weather information for a specified city
    by sending a request to the OpenWeatherMap API. It returns a dictionary
    containing temperature, humidity, wind, and other weather details. If the
    request fails, it returns an error message.

    :param city: Name of the city to fetch weather data for.
    :type city: str
    :param api_key: Your OpenWeatherMap API key.
    :type api_key: str
    :return: Dictionary with weather details or an error message.
    :rtype: dict
    """
    # Build the API URL for current weather, using metric units and Portuguese language
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=pt"
    print(f"[OpenWeatherMap] Requesting: {url}")  # Show API request URL

    # Send GET request to the API
    response = requests.get(url)
    # Print the raw API response text
    print(f"[OpenWeatherMap] Response: {response.text}")
    # Parse the response as JSON
    data = response.json()

    # If request is successful and data is present, extract weather info
    if response.status_code == 200 and 'main' in data:
        return {
            'temperature': data['main']['temp'],  # Current temperature
            'humidity': data['main']['humidity'],  # Current humidity
            'pressure': data['main']['pressure'],  # Atmospheric pressure
            'wind_speed': data['wind']['speed'],  # Wind speed
            # Wind direction (default 0)
            'wind_direction': data['wind'].get('deg', 0),
            # Weather description
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],  # Weather icon code
            # Add these if you want to avoid frontend errors:
            # Max temperature (or '--')
            'temp_max': data['main'].get('temp_max', '--'),
            # Min temperature (or '--')
            'temp_min': data['main'].get('temp_min', '--'),
            # Precipitation in last hour (or 0)
            'precipitation': data.get('rain', {}).get('1h', 0),
            'soil_humidity': None  # OpenWeatherMap doesn't provide this
        }
    else:
        # Return error as JSON
        return {'error': data.get('message', 'Unknown error')}

# Fetches 5-day weather forecast data for a city from OpenWeatherMap API.


def get_weather_forecast(city, api_key):
    """
    Get 5-day weather forecast data for a city from OpenWeatherMap API.

    This function fetches the 5-day weather forecast for a specified city by
    sending a request to the OpenWeatherMap API. It returns the raw JSON
    response containing a list of forecasted weather conditions, including
    temperature, humidity, wind, and descriptions.

    :param city: Name of the city to fetch forecast data for.
    :type city: str
    :param api_key: Your OpenWeatherMap API key.
    :type api_key: str
    :return: Raw JSON response with forecast data.
    :rtype: dict
    """
    # Build the API URL for 5-day forecast, using metric units and Portuguese language
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=pt"
    print(f"[OpenWeatherMap] Requesting: {url}")  # Print full API path

    # Send GET request to the API
    response = requests.get(url)
    # Print the raw API response text
    print(f"[OpenWeatherMap] Response: {response.text}")  # Print raw response

    # Return the parsed JSON response
    return response.json()
