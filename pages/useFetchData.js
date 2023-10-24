import { useState, useEffect } from 'react';

export const useFetchData = (url, interval) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
    const fetchDataInterval = setInterval(fetchData, interval);

    return () => clearInterval(fetchDataInterval);
  }, [url, interval]);

  return data;
};
