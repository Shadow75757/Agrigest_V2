from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
import openweathermap_api as weather_api
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Singleton para gerenciamento de configurações
class ConfigManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.load_config()
        return cls._instance
    
    def load_config(self):
        self.config = {
            'openweathermap_api_key': os.getenv('OPENWEATHERMAP_API_KEY', '8308621c89d7d1f83e27b92133cd6a04')
        }

# Facade para serviços meteorológicos
class WeatherServiceFacade:
    def __init__(self):
        self.config = ConfigManager()
        self.strategy = OpenWeatherMapStrategy(self.config.config['openweathermap_api_key'])
    
    def get_weather_data(self, city):
        return self.strategy.get_weather(city)
    
    def get_forecast(self, city):
        return self.strategy.get_forecast(city)

# Strategy Pattern para diferentes APIs meteorológicas
class WeatherStrategy:
    def get_weather(self, city):
        pass

class OpenWeatherMapStrategy(WeatherStrategy):
    def __init__(self, api_key):
        self.api_key = api_key
    
    def get_weather(self, city):
        return weather_api.get_current_weather(city, self.api_key)
    
    def get_forecast(self, city):
        return weather_api.get_weather_forecast(city, self.api_key)

# Rotas da API
@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    weather_facade = WeatherServiceFacade()
    data = weather_facade.get_weather_data(city)
    return jsonify(data)

@app.route('/api/forecast/<city>', methods=['GET'])
def get_forecast(city):
    weather_facade = WeatherServiceFacade()
    data = weather_facade.get_forecast(city)
    return jsonify(data)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # Verificação simples (em produção usar bcrypt e banco de dados)
    if data.get('username') == 'a' and data.get('password') == '1':
        return jsonify({'token': 'fake-jwt-token', 'user': {'username': 'admin'}})
    return jsonify({'error': 'Credenciais inválidas'}), 401

# WebSocket
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('subscribe_weather')
def handle_subscribe_weather(data):
    city = data.get('city')
    # Simula atualizações periódicas
    while True:
        socketio.sleep(10)  # Atualiza a cada 10 segundos
        weather_facade = WeatherServiceFacade()
        data = weather_facade.get_weather_data(city)
        socketio.emit('weather_update', data)

if __name__ == '__main__':
    socketio.run(app, debug=True)