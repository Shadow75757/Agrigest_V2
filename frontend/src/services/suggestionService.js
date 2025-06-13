// Logic to generate agricultural suggestions based on weather data and crop type
export const fetchSuggestions = async (crop, weatherData) => {
  // Returns a promise that resolves with an array of suggestion objects after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseSuggestions = [
        {
          type: 'irrigation',
          title: 'Irrigação',
          description: weatherData.precipitation < 5 ?
            'Aumentar irrigação em 20% devido à baixa precipitação.' :
            'Reduzir irrigação em 20% devido à previsão de chuva.',
          priority: weatherData.precipitation < 5 ? 'high' : 'medium'
        },
        {
          type: 'fertilization',
          title: 'Fertilização',
          description: 'Aplicar fertilizante nitrogenado após a próxima chuva para melhor absorção.',
          priority: 'high'
        },
        {
          type: 'pest_control',
          title: 'Controlo de Pragas',
          description: weatherData.humidity > 70 ?
            'Condições favoráveis para aparecimento de míldio. Aplicar preventivo.' :
            'Monitorar possíveis pragas devido às condições estáveis.',
          priority: weatherData.humidity > 70 ? 'high' : 'low'
        },
        {
          type: 'sun_exposure',
          title: 'Exposição Solar',
          description: weatherData.temperature > 25 ?
            'Plantas jovens devem receber sombra parcial nas horas de maior calor.' :
            'Exposição solar adequada nas condições atuais.',
          priority: 'low'
        }
      ];

      // Adds crop-specific suggestions depending on the crop type
      if (crop === 'vine') {
        baseSuggestions.push({
          type: 'pruning',
          title: 'Poda',
          description: 'Realizar poda de verão para melhorar a circulação de ar.',
          priority: 'medium'
        });
      } else if (crop === 'tomato') {
        baseSuggestions.push({
          type: 'support',
          title: 'Suporte',
          description: 'Verificar e ajustar suportes para os tomateiros.',
          priority: 'medium'
        });
      }

      // Resolves the promise with the complete suggestion list
      resolve(baseSuggestions);
    }, 500);
  });
};

/**
 * Generates agricultural suggestions based on the given crop and weather data.
 *
 * This function simulates asynchronous computation of farming recommendations,
 * considering factors like precipitation, humidity, and temperature to create
 * a list of suggestions such as irrigation adjustments, fertilization timing,
 * pest control measures, and sun exposure advice. It also adds crop-specific
 * tips for vines and tomatoes.
 *
 * :param crop: The type of crop (e.g., 'vine', 'tomato') for tailored suggestions.
 * :param weatherData: An object containing current weather measurements including precipitation, humidity, and temperature.
 * :return: A Promise that resolves to an array of suggestion objects, each containing type, title, description, and priority.
 */
