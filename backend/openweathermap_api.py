import requests

def get_current_weather(city, api_key):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=pt"
    response = requests.get(url)
    data = response.json()
    
    if response.status_code == 200:
        return {
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'wind_speed': data['wind']['speed'],
            'wind_direction': data['wind'].get('deg', 0),
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        }
    return None

def get_weather_forecast(city, api_key):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=pt"
    response = requests.get(url)
    return response.json()