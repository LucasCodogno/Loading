'use client'

import React, { useEffect, useRef, useState } from "react";
// import { useMediaQuery } from "react-responsive";
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
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import ArrowDropUpIcon from "@mui/icons-material/ArrowUpward";

import axios from "axios";

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
import HeaderInfo from './HeaderInfo';
import StatsInfo from './StatsInfo';
import { useFetchData } from './useFetchData';
import { useContext } from 'react';
import { useMediaQuery, Context as ResponsiveContext } from 'react-responsive';

const Page = () => {
  const responsiveContext = useContext(ResponsiveContext);
  const isMobile = responsiveContext.isMobile;
  // const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const [data, setData] = useState([]);
  const [Min, setMin] = useState(null);
  const [Max, setMax] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [sessoes, setSessoes] = useState(null);
  const [ERP, setErp] = useState(null);
  const [DEP, setDep] = useState(null);
  const [Outros, setOutros] = useState(null);
  const [Discador, setDiscador] = useState(null);
  const [MaxBackgroundColor, setMaxBackgroundColor] = useState(null);
  const [qtde, setQtde] = useState(null);
  const [usoCPU, setUsoCPU] = useState([]);
  const chartRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  // useEffect(() => {
  //   // This will run only on the client side
  //   const mobile = window.innerWidth <= 767;
  //   setIsMobile(mobile);
  // }, []);

  useEffect(() => {
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
  }, []);

  
  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%206"
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchInfoData = async () => {
    try {
      const infoResponse = await fetch(
        "http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%208"
      );
      const infoData = await infoResponse.json();
      setUsuarios(infoData[0].Usuarios);
      setSessoes(infoData[0].Sessoes);
      setErp(infoData[0].ERP);
      setDep(infoData[0].DEP);
      setOutros(infoData[0].Outros);
      setDiscador(infoData[0].Discador);
    } catch (error) {
      console.error("Erro ao buscar informações:", error);
    }
  };

  const fetchQtde = async () => {
    try {
      const response = await fetch(
        "http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%209"
      );
      const jsonData = await response.json();
      const qtde = jsonData[0].Qtde;
      setQtde(qtde);
    } catch (error) {
      console.error("Erro ao buscar a quantidade (Qtde):", error);
    }
  };

  useEffect(() => {
    async function fetchUsoCPU() {
      try {
        const response = await axios.get('http://192.168.10.125:3010/exec?comando=dbo.ProcInfoServidorReact%205');
        setUsoCPU(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsoCPU();
    const interval = setInterval(fetchUsoCPU, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateBarChartData = () => {
    return {
      labels: usoCPU.map((item) => item["Event Time"]),
      datasets: [
        {
          label: "SQL Server",
          data: usoCPU.map((item) => item["SQL Server"]),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          stack: "stack1",
        },
        {
          label: "Outros",
          data: usoCPU.map((item) => item["Outros"]),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          stack: "stack1",
        },
      ],
    };
  };

  useEffect(() => {
    fetchData();
    fetchInfoData();
    fetchQtde();

    const fetchDataInterval = setInterval(fetchData, 10000); // De 1000 para 10000

    const fetchInfoDataInterval = setInterval(fetchInfoData, 10000); // De 60000 para 10000

  const fetchQtdeInterval = setInterval(fetchQtde, 10000); // De 60000 para 10000

    return () => {
      clearInterval(fetchDataInterval);
      clearInterval(fetchInfoDataInterval);
      clearInterval(fetchQtdeInterval);
    };
  }, []);



  useEffect(() => {
    if (data.length > 0) {
      setMin(data[0].Min);
      const maxString = data[0].Max;
      const maxParts = maxString.split(" ");
      const maxPercentage = maxParts[0].replace("%", "");
      const maxTimeString = maxParts[1];
      setMax(maxString);

      if (data[0].Cor) {
        setMaxBackgroundColor(data[0].Cor);
      }
    }
  }, [data]);

  const last20Data = data.slice(-80);
  
  const chartData = {
    labels: last20Data.map(item => item.Hora),
    datasets: [
       
      {
        options: {
          animation: {
            duration: false,
          },
        },
        label: 'Valor do Contador',
        data: last20Data.map(item => item.Tick),
        fill: false,
        borderColor: '#615ea2',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0.1,
      },
      {
        type: 'line',
        label: 'Limite',
        borderColor: 'red',
        data: last20Data.map(item => item.Limite),
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  };
 
  const chartOptions = {
    animation: false,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: {
          line80: {
            type: 'line',
            yMin: 80,
            yMax: 80,
            borderColor: 'red',
            borderWidth: 20,
            borderDash: [5, 5],
          },
        },
      },
    },
    scales: {
      x: {
        offset: true,
        barPercentage: 0.1,
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };
  const handleOrientationChange = () => {
    window.location.replace(window.location.pathname);
  };

  useEffect(() => {
    fetchData();
    const fetchDataInterval = setInterval(fetchData, 1000);
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      clearInterval(fetchDataInterval);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const updateChartsOnResize = () => {
    if (!isMobile) {
      if (chartRef.current) {
        chartRef.current.data.labels = usoCPU.map((item) => item["Event Time"]);
        const barChartData = generateBarChartData();
        chartRef.current.data.datasets[0].data = barChartData.datasets[0].data;
        chartRef.current.data.datasets[1].data = barChartData.datasets[1].data;
        chartRef.current.update();
      }
    }
  };

  useEffect(() => {
    updateChartsOnResize();
    window.addEventListener("resize", updateChartsOnResize);
    return () => {
      window.removeEventListener("resize", updateChartsOnResize);
    };
  }, [isMobile, isPortrait, usoCPU]); // Adicione 'usoCPU' como dependência


  useEffect(() => {
    if (usoCPU.length > 0) {
      if (chartRef.current) {
        chartRef.current.data.labels = usoCPU.map((item) => item["Event Time"]);
        const barChartData = generateBarChartData(); // Chama a função para obter os dados do gráfico de barras
        chartRef.current.data.datasets[0].data = barChartData.datasets[0].data;
        chartRef.current.data.datasets[1].data = barChartData.datasets[1].data;
        chartRef.current.update();
      } else {
        createChart();
      }
    }
  }, [usoCPU]);

  const createChart = () => {
    const ctx = document.getElementById("cpuChart").getContext("2d");
    const barChartData = generateBarChartData(); // Chama a função para obter os dados do gráfico de barras
    const data = {
      labels: barChartData.labels,
      datasets: [
        {
          label: "SQL Server",
          data: barChartData.datasets[0].data,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          stack: "stack1",
        },
        {
          label: "Outros",
          data: barChartData.datasets[1].data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          stack: "stack1",
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
        x: {
          stacked: true,
        },
      },
    };
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
  };
  

  return (
    <div>
      <div style={{border: isMobile ? "solid 1px black" : "none", padding: "10px", borderRadius: "10px", marginTop:  "-40px"}}>
        <div style={{ display: "flex", alignItems: "center", height: "28px"  }}>
        <h1 style={{ marginRight: isMobile ? 20 : "40px", fontSize: "15px" }}>Servidor</h1>
          {/* <ArrowDropDownIcon color="primary" size="45px" /> */}
          <h1 style={{ marginRight: "40px", fontSize: "15px" }}>{Min}</h1>
          <ArrowDropUpIcon
            style={{
              marginLeft: "30px",
              color: MaxBackgroundColor,
              marginTop: "2px",
            }}
          />
          <h1 style={{ marginBottom: "29px" }}>
            <span
              className={`blinking`}
              style={{
                color: MaxBackgroundColor,
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              {data.length > 0 ? data[0].Max.split("%")[0] : ""}%
            </span>
            <span style={{ fontSize: "15px" }}>
              {data.length > 0 ? data[0].Max.split(" ")[1] : ""}
            </span>
          </h1>
        </div>


        

        <Line
          data={chartData}
          options={chartOptions}
          width={800}
          height={isMobile ?   500 : 100}
        />


        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "30px",
            marginTop: "10px",
            marginBottom: "0px",
            fontSize: "6px",
          }}
        >  {isMobile && isPortrait ?  
          <React.Fragment>
          <h1>Usuários:{usuarios}</h1>
          <h1>Sessões:{sessoes}</h1>
          <h1>Discador:{Discador}</h1>
          <h1>Espera:{qtde}</h1>
          </React.Fragment>


         
      :
      <React.Fragment>
      <h1>Usuários: {usuarios}</h1>
      <h1>Sessões: {sessoes}</h1>
      <h1>Discador: {Discador}</h1>
      <h1>Espera: {qtde}</h1>
      </React.Fragment>
        }
        </div> 
        {/* Usuários: {usuarios} Sessões: {sessoes} Discador: {Discador} Espera: {qtde}
        <Bar ref={chartRef} data={barChartData} options={options} width={800} height={isPortrait ? 500 : 200} />
       */}
      </div>
      <div style={{border: isMobile ? "solid 1px black" : "none" , padding: "4px", borderRadius: "10px"}}>
      <canvas id="cpuChart" width="950" height="300"   ></canvas>
      </div>    
    </div>
  );
};



export default Page;

