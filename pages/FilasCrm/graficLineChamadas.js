import React, { useState, useEffect } from 'react';
import 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
Chart.register(...registerables);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WaveChart = ({ selectedCodFila }) => {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                fill: true,
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Defina como false para ocultar a legenda
            },
            title: {
                display: false,
                text: '',
            },
            datalabels: {
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'top',
                formatter: (value) => value,
            },
        },
    };
    
    
    useEffect(() => {
        // Função para buscar os dados da API e atualizar o estado
        const fetchData = async () => {
            try {
                if (selectedCodFila) {
                    // Crie a URL da API com base em selectedCodFila
                    const apiUrl = `http://192.168.10.125:3010/exec?comando=exec%20ProcDiscAvanti_QtdeDiscagem_React%20${selectedCodFila}`;
                    
                    // Faça a chamada à API usando a nova URL
                    const newData = await fetch(apiUrl);
                    const json = await newData.json();
                    if (!newData.ok) {
                        throw new Error(`HTTP error! Status: ${newData.status}`);
                    }
                    // Verifique se json não é null ou undefined antes de acessar seus campos
                    if (json && json[0]) {
                        // Atualize o estado com os novos dados
                        setData((prevState) => ({
                            ...prevState,
                            labels: Object.keys(json[0]).filter((key) => key.startsWith('Hr')),
                            datasets: [
                                {
                                    ...prevState.datasets[0],
                                    data: Object.values(json[0]).slice(3), // Ignora as primeiras três propriedades do objeto
                                },
                            ],
                        }));
                    } else {
                        console.error('Dados da API não encontrados ou vazios');
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados da API', error);
            }
        };
    
        // Execute a função fetchData a cada hora (3600000 ms)
        const intervalId = setInterval(fetchData, 3600000);
    
        // Chame fetchData imediatamente para buscar dados na montagem inicial do componente
        fetchData();
        console.log('selectedCodFila:', selectedCodFila);
        // Limpe o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, [selectedCodFila]);

    return (
        <div style={{ height: '300px' }}>
            <Bar height={300} width={300} options={options} data={data} />
        </div>
    );
};

export default WaveChart;
