# Import necessary libraries for Flask app, CORS, WebSocket, and weather API
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
import openweathermap_api as weather_api
import json
import os
from datetime import datetime

# Set up Flask app and enable CORS for all routes
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes so frontend can access API

# Set up WebSocket support for real-time updates
socketio = SocketIO(app, cors_allowed_origins="*")

# Manage configuration as a singleton


class ConfigManager:
    """
    Manage configuration as a singleton.

    This class ensures only one instance exists and loads configuration
    such as API keys from environment variables or uses default values.

    :cvar _instance: The singleton instance of the class.
    :ivar config: The configuration dictionary containing API keys and other settings.
    """

    _instance = None

    def __new__(cls):
        """
        Ensure only one instance of ConfigManager exists.

        Loads configuration on first instantiation and returns the singleton instance.

        :return: The singleton instance of ConfigManager.
        :rtype: ConfigManager
        """
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.load_config()  # Load configuration on first instantiation
        return cls._instance

    def load_config(self):
        """
        Load API keys and other config from environment or defaults.

        Loads configuration values such as API keys from environment variables,
        or uses default values if not set.

        :return: None
        """
        self.config = {
            'openweathermap_api_key': os.getenv('OPENWEATHERMAP_API_KEY', '8308621c89d7d1f83e27b92133cd6a04')
        }

# Provide a simple interface to get weather data and forecast


class WeatherServiceFacade:
    """
    Provide a simple interface to get weather data and forecast.

    This class hides the complexity of different weather API strategies and
    provides a unified interface for fetching weather data.

    :ivar config: The configuration manager instance.
    :ivar strategy: The weather API strategy used for fetching data.
    """

    def __init__(self):
        """
        Set up the configuration manager and select the default weather API strategy.

        Initializes the WeatherServiceFacade with configuration and strategy.

        :return: None
        """
        self.config = ConfigManager()  # Get configuration
        self.strategy = OpenWeatherMapStrategy(
            # Use OpenWeatherMap by default
            self.config.config['openweathermap_api_key'])

    def get_weather_data(self, city):
        """
        Get current weather for a city.

        Fetches the current weather data for the specified city using the selected strategy.

        :param city: The name of the city.
        :type city: str
        :return: The current weather data for the city.
        :rtype: dict
        """
        return self.strategy.get_weather(city)

    def get_forecast(self, city):
        """
        Get weather forecast for a city.

        Fetches the weather forecast data for the specified city using the selected strategy.

        :param city: The name of the city.
        :type city: str
        :return: The weather forecast data for the city.
        :rtype: dict
        """
        return self.strategy.get_forecast(city)

# Define base class for weather API strategies


class WeatherStrategy:
    """
    Define base class for weather API strategies.

    Subclasses should implement methods to fetch weather data.
    """

    def get_weather(self, city):
        """
        Get current weather for a city.

        This method should be implemented by subclasses to fetch weather data.

        :param city: The name of the city.
        :type city: str
        :return: The current weather data for the city.
        :rtype: dict
        """
        pass

# Implement strategy for using OpenWeatherMap API


class OpenWeatherMapStrategy(WeatherStrategy):
    """
    Implement strategy for using OpenWeatherMap API.

    Implements methods to fetch current weather and forecast using OpenWeatherMap.

    :ivar api_key: The API key for OpenWeatherMap.
    """

    def __init__(self, api_key):
        """
        Store the API key for use in API requests.

        Initializes the OpenWeatherMapStrategy with the provided API key.

        :param api_key: The API key for OpenWeatherMap.
        :type api_key: str
        :return: None
        """
        self.api_key = api_key  # Store API key

    def get_weather(self, city):
        """
        Fetch current weather from OpenWeatherMap.

        Retrieves the current weather data for the specified city using the OpenWeatherMap API.

        :param city: The name of the city.
        :type city: str
        :return: The current weather data for the city.
        :rtype: dict
        """
        return weather_api.get_current_weather(city, self.api_key)

    def get_forecast(self, city):
        """
        Fetch weather forecast from OpenWeatherMap.

        Retrieves the weather forecast data for the specified city using the OpenWeatherMap API.

        :param city: The name of the city.
        :type city: str
        :return: The weather forecast data for the city.
        :rtype: dict
        """
        return weather_api.get_weather_forecast(city, self.api_key)

# Define API endpoint to get current weather for a city


@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    """
    Define API endpoint to get current weather for a city.

    Returns weather data as JSON for the specified city.
    Handles errors and returns appropriate HTTP status codes.

    :param city: The name of the city.
    :type city: str
    :return: JSON response containing weather data or error message.
    :rtype: Response
    """
    try:
        weather_facade = WeatherServiceFacade()
        data = weather_facade.get_weather_data(city)
        if not isinstance(data, dict):
            return jsonify({'error': 'Failed to fetch weather data'}), 500
        if 'error' in data:
            return jsonify(data), 400
        return jsonify(data)
    except Exception as e:
        print("Exception in /api/weather/<city>:", e)
        return jsonify({'error': 'Internal server error'}), 500

# Define API endpoint to get weather forecast for a city


@app.route('/api/forecast/<city>', methods=['GET'])
def get_forecast(city):
    """
    Define API endpoint to get weather forecast for a city.

    Returns forecast data as JSON for the specified city.

    :param city: The name of the city.
    :type city: str
    :return: JSON response containing forecast data.
    :rtype: Response
    """
    weather_facade = WeatherServiceFacade()
    data = weather_facade.get_forecast(city)
    return jsonify(data)

# Define API endpoint to get temperature data for charting


@app.route('/api/weather/temperature')
def api_weather_temperature():
    """
    Define API endpoint to get temperature data for charting.

    Returns temperature values and labels (dates) for a city,
    formatted for use in charts.

    :return: JSON response containing temperature values and labels.
    :rtype: Response
    """
    city = request.args.get('city')
    print("API received city:", city)  # Debug print
    weather_facade = WeatherServiceFacade()
    forecast = weather_facade.get_forecast(city)
    temps = []
    labels = []
    if "list" in forecast:
        for i in range(0, min(40, len(forecast["list"])), 8):
            entry = forecast["list"][i]
            temps.append(entry["main"]["temp"])
            labels.append(entry["dt_txt"].split()[0])
    return jsonify({"temps": temps, "labels": labels})


# Store hardcoded users for authentication
USERS = {
    'a': {'password': '1', 'username': 'admin'},
    'luis': {'password': '123', 'username': 'luis'},
    'prata': {'password': '123', 'username': 'prata'},
    'sergio': {'password': '123', 'username': 'sergio'},
    'maria': {'password': '1', 'username': 'maria'},
    'joana': {'password': 'abc', 'username': 'joana'},
}

# Define API endpoint for user login


@app.route('/api/login', methods=['POST'])
def login():
    """
    Define API endpoint for user login.

    Checks credentials against hardcoded users and returns a token if valid.
    Allows guest login with a special token.

    :return: JSON response containing token and user info, or error message.
    :rtype: Response
    """
    data = request.get_json()
    user = USERS.get(data.get('username'))
    if user and user['password'] == data.get('password'):
        return jsonify({'token': 'fake-jwt-token', 'user': {'username': user['username']}})
    if data.get('username') == 'guest':
        return jsonify({'token': 'guest-token', 'user': {'username': 'guest'}})
    return jsonify({'error': 'Credenciais inválidas'}), 401

# Handle new WebSocket connection


@socketio.on('connect')
def handle_connect():
    """
    Handle new WebSocket connection.

    Prints a message when a client connects via WebSocket.

    :return: None
    """
    print('Client connected')

# Handle WebSocket disconnection


@socketio.on('disconnect')
def handle_disconnect():
    """
    Handle WebSocket disconnection.

    Prints a message when a client disconnects from WebSocket.

    :return: None
    """
    print('Client disconnected')

# Handle subscription to weather updates for a city


@socketio.on('subscribe_weather')
def handle_subscribe_weather(data):
    """
    Handle subscription to weather updates for a city.

    Periodically sends weather updates for the specified city
    to the client via WebSocket.

    :param data: Dictionary containing the city name.
    :type data: dict
    :return: None
    """
    city = data.get('city')
    # Simulate periodic updates
    while True:
        socketio.sleep(10)  # Update every 10 seconds
        weather_facade = WeatherServiceFacade()
        data = weather_facade.get_weather_data(city)
        socketio.emit('weather_update', data)


# Start the Flask app with WebSocket support
if __name__ == '__main__':
    """
    Start the Flask app with WebSocket support.

    Runs the Flask application with SocketIO for real-time communication.

    :return: None
    """
    socketio.run(app, debug=True)
