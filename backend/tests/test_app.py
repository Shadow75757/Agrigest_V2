import pytest
from app import app, WeatherServiceFacade, ConfigManager

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_config_manager_singleton():
    instance1 = ConfigManager()
    instance2 = ConfigManager()
    assert instance1 is instance2

def test_weather_facade(client, mocker):
    mock_data = {'temperature': 20}
    mocker.patch('openweathermap_api.get_current_weather', return_value=mock_data)
    
    facade = WeatherServiceFacade()
    result = facade.get_weather_data('lisbon')
    assert result == mock_data

def test_login_success(client):
    response = client.post('/api/login', json={
        'username': 'a',
        'password': '1'
    })
    assert response.status_code == 200
    assert 'token' in response.json