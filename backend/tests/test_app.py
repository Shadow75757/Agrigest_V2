"""
Unit tests for the Agrigest backend application.

This module contains tests for:
- ConfigManager singleton behavior
- WeatherServiceFacade data retrieval
- Login API endpoint

Uses pytest and Flask's test client.
"""

import pytest
from backend.app import app, WeatherServiceFacade, ConfigManager

# Provides a Flask test client for API endpoint testing.


@pytest.fixture
def client():
    """
    Provides a Flask test client for API endpoint testing.

    This fixture configures the Flask app for testing and yields a test client
    that can be used to simulate HTTP requests to the application.

    :return: The test client for the Flask app.
    :rtype: FlaskClient

    This function sets the Flask app to testing mode and yields a test client
    instance, allowing tests to interact with the API endpoints as if they were
    real HTTP clients.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Ensures ConfigManager implements the singleton pattern.


def test_config_manager_singleton():
    """
    Ensures ConfigManager implements the singleton pattern.

    This test creates two instances of ConfigManager and asserts that both
    references point to the same object, confirming the singleton behavior.

    :return: None

    The function checks that multiple instantiations of ConfigManager return
    the same object, ensuring the singleton design pattern is correctly
    implemented.
    """
    instance1 = ConfigManager()
    instance2 = ConfigManager()
    # Both instances should be the same object
    assert instance1 is instance2

# Verifies WeatherServiceFacade returns correct weather data using a mocked API call.


def test_weather_facade(client, mocker):
    """
    Verifies WeatherServiceFacade returns correct weather data using a mocked API call.

    This test mocks the weather API call to return predefined data and checks
    that the WeatherServiceFacade returns the expected result.

    :param client: Flask test client (unused in this test).
    :type client: FlaskClient
    :param mocker: Pytest-mock fixture for mocking functions.
    :type mocker: pytest_mock.MockerFixture
    :return: None

    The function patches the weather API call to return mock data, then checks
    that the WeatherServiceFacade returns the same data, ensuring correct
    integration with the mocked API.
    """
    mock_data = {'temperature': 20}
    # Mock the weather API call to return mock_data
    mocker.patch('backend.openweathermap_api.get_current_weather',
                 return_value=mock_data)

    facade = WeatherServiceFacade()
    result = facade.get_weather_data('Porto')
    # The result should match the mocked data
    assert result == mock_data

# Checks that a successful login returns a token in the response.


def test_login_success(client):
    """
    Checks that a successful login returns a token in the response.

    This test sends a POST request to the login endpoint with valid credentials
    and asserts that the response contains a token and has HTTP 200 status.

    :param client: Flask test client used to send HTTP requests.
    :type client: FlaskClient
    :return: None

    The function verifies that a valid login attempt returns a response with
    status code 200 and includes a token in the JSON payload.
    """
    response = client.post('/api/login', json={
        'username': 'a',
        'password': '1'
    })
    # Should return HTTP 200 and a token in the response
    assert response.status_code == 200
    assert 'token' in response.json
