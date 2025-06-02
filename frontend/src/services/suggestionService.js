// Lógica para gerar sugestões agrícolas baseadas nos dados meteorológicos
export const fetchSuggestions = async (crop, weatherData) => {
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

      // Adicionar sugestões específicas por cultura
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

      resolve(baseSuggestions);
    }, 500);
  });
};