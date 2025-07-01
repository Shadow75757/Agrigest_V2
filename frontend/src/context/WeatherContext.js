import React, { createContext, useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/storageService';


/**
 * This WeatherProvider component is like a smart container for all weather-related stuff.
 * 
 * It keeps track of:
 * - `weather`: the current weather info, starting by checking if we've saved any before in the browser.
 * - `suggestions`: helpful farming tips based on the weather and the crop you care about.
 * - `history`: a list of past weather checks or searches you've made, also saved from before if any.
 * - `loading`: a flag that tells us when we're waiting for new weather data to come in.
 * - `user`: info about the logged-in user, starts empty because no one is logged in yet.
 * - `socket`: a connection for real-time updates (like if the weather changes suddenly).
 * - `location`: what place and crop we're focused on, starting with Porto, Portugal, and growing vines.
 * 
 * Basically, this component holds all the important weather and farming data in one place, 
 * keeps it updated, and makes it easy to share with any part of the app that needs it.
 */

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(loadFromLocalStorage('weather') || null);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(loadFromLocalStorage('history') || []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({
    country: 'portugal',
    city: 'Porto',
    crop: 'vine'
  });

  /**
 * Effect hook that triggers whenever location.city changes.
 * Fetches weather data from backend API for the selected city,
 * updates weather state, saves data locally,
 * emits a socket event to subscribe to updates,
 * generates farming suggestions based on crop and weather,
 * and handles loading states and errors.
 */

useEffect(() => {
  const handler = setTimeout(() => {
    const loadData = async () => {
      setLoading(true);

      const urlsToTry = [
        `http://192.168.1.198:5000/api/weather/${location.city}`,
        `http://192.168.1.198:5173/api/weather/${location.city}`,
      ];

      let weatherData = null;

      for (const url of urlsToTry) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          weatherData = await response.json();

          if (socket) {
            socket.emit('subscribe_weather', { city: location.city });
          }

          break;
        } catch (error) {
          console.warn(`Fetch failed at ${url}:`, error);
        }
      }

      if (weatherData) {
        setWeather(weatherData);
        saveToLocalStorage('weather', weatherData);
        const farmingSuggestions = generateSuggestions(location.crop, weatherData);
        setSuggestions(farmingSuggestions);
      } else {
        console.error("Failed to load weather data from all endpoints.");
        setWeather(null);
        setSuggestions([]);
      }

      setLoading(false);
    };

    loadData();
  }, 300); // espera 300ms após digitação

  return () => clearTimeout(handler); // limpa timeout se o usuário digitar novamente
}, [location.city]);


  useEffect(() => {
    if (weather) {
      const farmingSuggestions = generateSuggestions(location.crop, weather);
      setSuggestions(farmingSuggestions);
    }
  }, [location.crop, weather]);

  const generateSuggestions = (crop, weatherData) => {
    if (!weatherData) return [];

    const suggestions = [];


    /**
 * Generates agricultural suggestions based on weather data and crop type.
 *
 * This block checks important weather conditions like precipitation,
 * humidity, temperature, and wind speed to provide practical
 * recommendations for irrigation management, disease prevention,
 * frost risk, protection against strong winds, and optimal harvest conditions.
 *
 * It also includes crop-specific rules (vine, olive, corn, tomato, rice, wheat, etc.),
 * giving tailored advice on risks and care for each plant type.
 *
 * The goal is to turn raw weather data into actionable, useful tips for farmers,
 * assigning each suggestion a priority level (high, medium, low) to aid decision-making.
 *
 * In short: based on current weather and the crop, this code builds a list of suggestions
 * to help manage farming efficiently and reduce risks.
 */


    // Irrigação
    if (typeof weatherData.precipitation === 'number') {
      if (weatherData.precipitation < 2) {
        suggestions.push({
          type: 'irrigation',
          title: 'Irrigação',
          description: 'Precipitação muito baixa. Aumentar irrigação em 20%.',
          priority: 'high'
        });
      } else if (weatherData.precipitation >= 10) {
        suggestions.push({
          type: 'irrigation',
          title: 'Irrigação',
          description: 'Previsão de chuva significativa. Reduzir irrigação em 20%.',
          priority: 'medium'
        });
      }
    }

    // Doenças
    if (typeof weatherData.humidity === 'number') {
      if (weatherData.humidity > 85) {
        suggestions.push({
          type: 'disease',
          title: 'Prevenção de Doenças',
          description: 'Alta umidade detectada. Monitorar sinais de fungos e aplicar fungicida preventivo.',
          priority: 'high'
        });
      } else if (weatherData.humidity >= 60) {
        suggestions.push({
          type: 'disease',
          title: 'Prevenção de Doenças',
          description: 'Umidade moderada. Monitorar regularmente.',
          priority: 'medium'
        });
      } else {
        suggestions.push({
          type: 'disease',
          title: 'Prevenção de Doenças',
          description: 'Umidade baixa. Baixo risco de fungos.',
          priority: 'low'
        });
      }
    }

    // Geada
    if (typeof weatherData.temperature === 'number') {
      if (weatherData.temperature <= 2) {
        suggestions.push({
          type: 'frost',
          title: 'Risco de Geada',
          description: 'Temperatura próxima ou abaixo de 0°C. Proteger cultivos sensíveis.',
          priority: 'high'
        });
      }
    }

    // Ventos fortes
    if (typeof weatherData.wind_speedSpeed === 'number') {
      if (weatherData.wind_speedSpeed >= 40) {
        suggestions.push({
          type: 'wind',
          title: 'Ventos Fortes',
          description: 'Ventos intensos previstos. Verifique estufas e estruturas de suporte.',
          priority: 'high'
        });
      } else if (weatherData.wind_speedSpeed >= 25) {
        suggestions.push({
          type: 'wind',
          title: 'Ventos Moderados',
          description: 'Ventos moderados. Verificar suportes de plantas sensíveis.',
          priority: 'medium'
        });
      }
    }

    // Colheita
    if (
      typeof weatherData.precipitation === 'number' &&
      typeof weatherData.temperature === 'number'
    ) {
      if (weatherData.precipitation === 0 && weatherData.temperature >= 20 && weatherData.temperature <= 30) {
        suggestions.push({
          type: 'harvest',
          title: 'Colheita',
          description: 'Clima seco e temperatura amena. Condições ideais para colheita.',
          priority: 'medium'
        });
      }
    }

    // Sugestões específicas por cultura
    // Videira (vine)
    if (crop === 'vine') {
      if (typeof weatherData.humidity === 'number' && weatherData.humidity > 85) {
        suggestions.push({
          type: 'vine-fungus',
          title: 'Videira: Risco de Míldio',
          description: 'Alta umidade favorece míldio. Monitorar e aplicar fungicida se necessário.',
          priority: 'high'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'vine-cold',
          title: 'Videira: Frio',
          description: 'Temperaturas baixas podem atrasar o desenvolvimento da videira.',
          priority: 'medium'
        });
      }
    }

    // Oliveira (olive)
    if (crop === 'olive') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature >= 32 && weatherData.precipitation < 1) {
        suggestions.push({
          type: 'olive-irrigation',
          title: 'Oliveira: Estresse Hídrico',
          description: 'Calor intenso e pouca chuva. Avaliar irrigação suplementar.',
          priority: 'medium'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 5) {
        suggestions.push({
          type: 'olive-cold',
          title: 'Oliveira: Frio',
          description: 'Temperaturas baixas podem afetar a floração da oliveira.',
          priority: 'medium'
        });
      }
    }

    // Milho (corn)
    if (crop === 'corn') {
      if (typeof weatherData.wind_speed === 'number' && weatherData.wind_speed > 45) {
        suggestions.push({
          type: 'corn-wind',
          title: 'Milho: Risco de Acamamento',
          description: 'Ventos fortes podem derrubar plantas de milho. Avaliar medidas de suporte.',
          priority: 'high'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 15) {
        suggestions.push({
          type: 'corn-cold',
          title: 'Milho: Frio',
          description: 'Temperaturas baixas podem atrasar a germinação do milho.',
          priority: 'medium'
        });
      }
    }

    // Tomate (tomato)
    if (crop === 'tomato') {
      if (typeof weatherData.humidity === 'number' && weatherData.humidity > 85) {
        suggestions.push({
          type: 'tomato-blight',
          title: 'Tomate: Risco de Requeima',
          description: 'Alta umidade favorece requeima. Reforce inspeções e aplique fungicida.',
          priority: 'high'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 12) {
        suggestions.push({
          type: 'tomato-cold',
          title: 'Tomate: Frio',
          description: 'Temperaturas baixas podem atrasar o crescimento do tomateiro.',
          priority: 'medium'
        });
      }
    }

    // Arroz (rice)
    if (crop === 'rice') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 5) {
        suggestions.push({
          type: 'rice-water',
          title: 'Arroz: Baixa Água',
          description: 'Arroz precisa de muita água. Garanta irrigação adequada.',
          priority: 'high'
        });
      }
    }

    // Trigo (wheat)
    if (crop === 'wheat') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 30) {
        suggestions.push({
          type: 'wheat-heat',
          title: 'Trigo: Calor Excessivo',
          description: 'Temperaturas altas podem prejudicar o trigo. Considere irrigação extra.',
          priority: 'medium'
        });
      }
    }

    // Batata (potato)
    if (crop === 'potato') {
      if (typeof weatherData.humidity === 'number' && weatherData.humidity > 85) {
        suggestions.push({
          type: 'potato-disease',
          title: 'Batata: Risco de Míldio',
          description: 'Alta umidade favorece míldio em batatas. Redobre a atenção e aplique fungicida preventivo.',
          priority: 'high'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 30) {
        suggestions.push({
          type: 'potato-heat',
          title: 'Batata: Calor Excessivo',
          description: 'Temperaturas acima de 30°C podem reduzir a produtividade da batata.',
          priority: 'medium'
        });
      }
    }

    // Alface (lettuce)
    if (crop === 'lettuce') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 28) {
        suggestions.push({
          type: 'lettuce-heat',
          title: 'Alface: Calor Excessivo',
          description: 'Alface sofre com calor acima de 28°C. Irrigue mais e colha cedo.',
          priority: 'high'
        });
      }
      if (typeof weatherData.humidity === 'number' && weatherData.humidity < 50) {
        suggestions.push({
          type: 'lettuce-humidity',
          title: 'Alface: Baixa Umidade',
          description: 'Baixa umidade pode causar folhas amargas. Aumente a irrigação.',
          priority: 'medium'
        });
      }
    }

    // Morango (strawberry)
    if (crop === 'strawberry') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'strawberry-irrigation',
          title: 'Morango: Solo Úmido',
          description: 'Morangos precisam de solo úmido. Aumente a irrigação em mais 5%.',
          priority: 'high'
        });
      }
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 30) {
        suggestions.push({
          type: 'strawberry-heat',
          title: 'Morango: Calor Excessivo',
          description: 'Temperaturas acima de 30°C podem prejudicar morangos. Considere sombreamento.',
          priority: 'medium'
        });
      }
    }

    // Cenoura (carrot)
    if (crop === 'carrot') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 28) {
        suggestions.push({
          type: 'carrot-heat',
          title: 'Cenoura: Calor Excessivo',
          description: 'Calor intenso pode afetar o desenvolvimento das raízes.',
          priority: 'medium'
        });
      }
    }

    // Cebola (onion)
    if (crop === 'onion') {
      if (typeof weatherData.humidity === 'number' && weatherData.humidity > 80) {
        suggestions.push({
          type: 'onion-disease',
          title: 'Cebola: Risco de Doenças',
          description: 'Alta umidade pode favorecer doenças fúngicas em cebolas.',
          priority: 'high'
        });
      }
    }

    // Couve (cabbage)
    if (crop === 'cabbage') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 28) {
        suggestions.push({
          type: 'cabbage-heat',
          title: 'Couve: Calor Excessivo',
          description: 'Couve prefere clima ameno. Proteja do calor intenso.',
          priority: 'medium'
        });
      }
    }

    // Melão (melon)
    if (crop === 'melon') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation > 10) {
        suggestions.push({
          type: 'melon-water',
          title: 'Melão: Excesso de Água',
          description: 'Evite encharcamento para não prejudicar os frutos.',
          priority: 'medium'
        });
      }
    }

    // Melancia (watermelon)
    if (crop === 'watermelon') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'watermelon-irrigation',
          title: 'Melancia: Irrigação',
          description: 'Melancia precisa de solo úmido, especialmente na frutificação.',
          priority: 'high'
        });
      }
    }

    // Feijão (beans)
    if (crop === 'beans') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 15) {
        suggestions.push({
          type: 'beans-cold',
          title: 'Feijão: Frio',
          description: 'Temperaturas baixas podem atrasar a germinação do feijão.',
          priority: 'medium'
        });
      }
    }

    // Soja (soy)
    if (crop === 'soy') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'soy-irrigation',
          title: 'Soja: Irrigação',
          description: 'Soja precisa de água suficiente na floração e enchimento de grãos.',
          priority: 'high'
        });
      }
    }

    // Girassol (sunflower)
    if (crop === 'sunflower') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 35) {
        suggestions.push({
          type: 'sunflower-heat',
          title: 'Girassol: Calor Excessivo',
          description: 'Calor extremo pode afetar a produção de sementes.',
          priority: 'medium'
        });
      }
    }

    // Amendoim (peanut)
    if (crop === 'peanut') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation > 10) {
        suggestions.push({
          type: 'peanut-water',
          title: 'Amendoim: Excesso de Água',
          description: 'Evite encharcamento para não prejudicar o desenvolvimento das vagens.',
          priority: 'medium'
        });
      }
    }

    // Alho (garlic)
    if (crop === 'garlic') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'garlic-cold',
          title: 'Alho: Frio',
          description: 'Alho prefere temperaturas amenas para bom desenvolvimento.',
          priority: 'medium'
        });
      }
    }

    // Pimentão (pepper)
    if (crop === 'pepper') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 15) {
        suggestions.push({
          type: 'pepper-cold',
          title: 'Pimentão: Frio',
          description: 'Temperaturas baixas podem atrasar o crescimento do pimentão.',
          priority: 'medium'
        });
      }
    }

    // Berinjela (eggplant)
    if (crop === 'eggplant') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'eggplant-cold',
          title: 'Berinjela: Frio',
          description: 'Berinjela prefere clima quente para frutificação.',
          priority: 'medium'
        });
      }
    }

    // Espinafre (spinach)
    if (crop === 'spinach') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 28) {
        suggestions.push({
          type: 'spinach-heat',
          title: 'Espinafre: Calor Excessivo',
          description: 'Espinafre prefere clima fresco. Proteja do calor intenso.',
          priority: 'medium'
        });
      }
    }

    // Brócolis (broccoli)
    if (crop === 'broccoli') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 25) {
        suggestions.push({
          type: 'broccoli-heat',
          title: 'Brócolis: Calor Excessivo',
          description: 'Brócolis prefere clima ameno. Calor pode prejudicar a formação das cabeças.',
          priority: 'medium'
        });
      }
    }

    // Abóbora (pumpkin)
    if (crop === 'pumpkin') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'pumpkin-irrigation',
          title: 'Abóbora: Irrigação',
          description: 'Abóbora precisa de solo úmido, especialmente na frutificação.',
          priority: 'high'
        });
      }
    }


    // Pepino (cucumber)
    if (crop === 'cucumber') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'cucumber-cold',
          title: 'Pepino: Frio',
          description: 'Pepino prefere clima quente. Temperaturas baixas podem atrasar o crescimento.',
          priority: 'medium'
        });
      }
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'cucumber-irrigation',
          title: 'Pepino: Irrigação',
          description: 'Pepino precisa de irrigação regular, especialmente em períodos secos.',
          priority: 'high'
        });
      }
    }

    // Ervilha (peas)
    if (crop === 'peas') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 25) {
        suggestions.push({
          type: 'peas-heat',
          title: 'Ervilha: Calor Excessivo',
          description: 'Ervilha prefere clima ameno. Calor intenso pode reduzir a produção.',
          priority: 'medium'
        });
      }
    }

    // Grão de Bico (chickpea)
    if (crop === 'chickpea') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation > 10) {
        suggestions.push({
          type: 'chickpea-water',
          title: 'Grão de Bico: Excesso de Água',
          description: 'Evite encharcamento, pois grão de bico é sensível ao excesso de água.',
          priority: 'medium'
        });
      }
    }

    // Cevada (barley)
    if (crop === 'barley') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 30) {
        suggestions.push({
          type: 'barley-heat',
          title: 'Cevada: Calor Excessivo',
          description: 'Temperaturas altas podem afetar o enchimento dos grãos de cevada.',
          priority: 'medium'
        });
      }
    }

    // Aveia (oat)
    if (crop === 'oat') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 28) {
        suggestions.push({
          type: 'oat-heat',
          title: 'Aveia: Calor Excessivo',
          description: 'Aveia prefere clima fresco. Calor pode reduzir o rendimento.',
          priority: 'medium'
        });
      }
    }

    // Sorgo (sorghum)
    if (crop === 'sorghum') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'sorghum-irrigation',
          title: 'Sorgo: Irrigação',
          description: 'Sorgo é tolerante à seca, mas irrigação pode aumentar a produtividade.',
          priority: 'medium'
        });
      }
    }

    // Mandioca (cassava)
    if (crop === 'cassava') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'cassava-cold',
          title: 'Mandioca: Frio',
          description: 'Mandioca prefere clima quente. Frio pode atrasar o desenvolvimento.',
          priority: 'medium'
        });
      }
    }

    // Batata Doce (sweetpotato)
    if (crop === 'sweetpotato') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 20) {
        suggestions.push({
          type: 'sweetpotato-cold',
          title: 'Batata Doce: Frio',
          description: 'Batata doce cresce melhor em temperaturas acima de 20°C.',
          priority: 'medium'
        });
      }
    }

    // Maçã (apple)
    if (crop === 'apple') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature > 30) {
        suggestions.push({
          type: 'apple-heat',
          title: 'Maçã: Calor Excessivo',
          description: 'Calor intenso pode afetar a qualidade dos frutos da maçã.',
          priority: 'medium'
        });
      }
    }

    // Pêra (pear)
    if (crop === 'pear') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'pear-cold',
          title: 'Pêra: Frio',
          description: 'Temperaturas baixas podem atrasar a floração da pêra.',
          priority: 'medium'
        });
      }
    }

    // Pêssego (peach)
    if (crop === 'peach') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 12) {
        suggestions.push({
          type: 'peach-cold',
          title: 'Pêssego: Frio',
          description: 'Pêssego é sensível a geadas tardias. Proteja as flores se necessário.',
          priority: 'medium'
        });
      }
    }

    // Ameixa (plum)
    if (crop === 'plum') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'plum-cold',
          title: 'Ameixa: Frio',
          description: 'Ameixa pode ter floração prejudicada por frio intenso.',
          priority: 'medium'
        });
      }
    }

    // Laranja (orange)
    if (crop === 'orange') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'orange-cold',
          title: 'Laranja: Frio',
          description: 'Laranja é sensível a baixas temperaturas. Proteja contra geadas.',
          priority: 'medium'
        });
      }
    }

    // Limão (lemon)
    if (crop === 'lemon') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 10) {
        suggestions.push({
          type: 'lemon-cold',
          title: 'Limão: Frio',
          description: 'Limão é sensível a frio e geadas. Proteja as plantas.',
          priority: 'medium'
        });
      }
    }

    // Banana (banana)
    if (crop === 'banana') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'banana-cold',
          title: 'Banana: Frio',
          description: 'Bananeira prefere clima quente. Frio pode atrasar o crescimento.',
          priority: 'medium'
        });
      }
    }

    // Abacaxi (pineapple)
    if (crop === 'pineapple') {
      if (typeof weatherData.precipitation === 'number' && weatherData.precipitation < 2) {
        suggestions.push({
          type: 'pineapple-irrigation',
          title: 'Abacaxi: Irrigação',
          description: 'Abacaxi precisa de irrigação regular em períodos secos.',
          priority: 'high'
        });
      }
    }

    // Uva (grape)
    if (crop === 'grape') {
      if (typeof weatherData.humidity === 'number' && weatherData.humidity > 85) {
        suggestions.push({
          type: 'grape-fungus',
          title: 'Uva: Risco de Fungos',
          description: 'Alta umidade favorece doenças fúngicas em uvas. Monitore e aplique fungicida.',
          priority: 'high'
        });
      }
    }

    // Manga (mango)
    if (crop === 'mango') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'mango-cold',
          title: 'Manga: Frio',
          description: 'Mangueira prefere clima quente. Frio pode prejudicar a frutificação.',
          priority: 'medium'
        });
      }
    }

    // Mamão (papaya)
    if (crop === 'papaya') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 18) {
        suggestions.push({
          type: 'papaya-cold',
          title: 'Mamão: Frio',
          description: 'Mamão é sensível a baixas temperaturas. Proteja as plantas.',
          priority: 'medium'
        });
      }
    }

    // Abacate (avocado)
    if (crop === 'avocado') {
      if (typeof weatherData.temperature === 'number' && weatherData.temperature < 15) {
        suggestions.push({
          type: 'avocado-cold',
          title: 'Abacate: Frio',
          description: 'Abacateiro prefere clima ameno a quente. Frio pode afetar a produção.',
          priority: 'medium'
        });
      }
    }

    return suggestions;
  };

  /**
   * Updates the current location state by merging new location data.
   *
   * @param {Object} newLocation - Partial location data to update (e.g., country, city, crop).
   */
  const updateLocation = (newLocation) => {
    setLocation(prev => ({ ...prev, ...newLocation }));
  };

  /**
   * Performs user login by sending credentials to the backend API.
   *
   * Sends a POST request with the provided credentials,
   * then sets the user state if login is successful.
   *
   * @param {Object} credentials - The user's login credentials (e.g., username and password).
   * @returns {Promise<boolean>} - Returns true if login succeeds, otherwise false.
   */
 const login = async (credentials) => {
    try {
      const response = await fetch('http://192.168.1.198:5173/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);  // Save logged-in user data to state
        return true;
      }
      return false;  // Login failed (wrong credentials, etc)
    } catch (error) {
      console.error("Login error:", error);  // Log any network or unexpected errors
      return false;
    }
  };

  /**
   * Logs out the current user by clearing the user state.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * The main context provider component for weather and user data.
   *
   * It provides state and functions related to weather info, suggestions,
   * user authentication, location data, and loading state,
   * making them accessible to child components via context.
   */
  return (
    <WeatherContext.Provider
      value={{
        weather,
        suggestions,
        history,
        loading,
        location,
        user,
        updateLocation,
        login,
        logout
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}