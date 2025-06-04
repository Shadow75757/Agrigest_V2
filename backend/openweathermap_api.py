import requests


def get_current_weather(city, api_key):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=pt"
    print(f"[OpenWeatherMap] Requesting: {url}")  # Print full API path
    response = requests.get(url)
    print(f"[OpenWeatherMap] Response: {response.text}")  # Print raw response
    data = response.json()

    if response.status_code == 200 and 'main' in data:
        return {
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'wind_speed': data['wind']['speed'],
            'wind_direction': data['wind'].get('deg', 0),
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],
            # Add these if you want to avoid frontend errors:
            'temp_max': data['main'].get('temp_max', '--'),
            'temp_min': data['main'].get('temp_min', '--'),
            'precipitation': data.get('rain', {}).get('1h', 0),
            'soil_humidity': None  # OpenWeatherMap doesn't provide this
        }
    else:
        # Return error as JSON
        return {'error': data.get('message', 'Unknown error')}


def get_weather_forecast(city, api_key):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=pt"
    print(f"[OpenWeatherMap] Requesting: {url}")  # Print full API path
    response = requests.get(url)
    print(f"[OpenWeatherMap] Response: {response.text}")  # Print raw response
    return response.json()
