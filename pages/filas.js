"use client";
// import '@/styles/globals.css';
import "../styles/product.module.css";
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios"; // Certifique-se de ter o axios importado.
import Sidebar from "@/components/PersistentDrawerRight";
import { useAuth } from "@/hooks/useAuth";
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
// import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-plugin-datalabels";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";

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

import Styles from "../styles/product.module.css";
import { OverviewLatestOrders } from "./FilasCrm/usuariosDaFila";
import InfoFilas from "./FilasCrm/InfoFila";
import InfoMailingComponent from "./FilasCrm/inforDiscador";
import WaveChart from "./FilasCrm/graficLineChamadas";

export default function PieChartComponent(props) {
  useAuth();

  const [data, setData] = useState([]);
  const [ramais, setRamais] = useState([]); // New state variable for ramais data
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedRamal, setSelectedRamal] = useState(null); // New state variable for selected ramal
  const [selectedFilaData, setSelectedFilaData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isMobile = useMediaQuery("(max-width: 600px)");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.10.125:3005/grafico");
        const jsonData = await response.json();
        setData(jsonData.json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Chame imediatamente ao montar

    const intervalId = setInterval(fetchData, 5000); // Chame a cada 5 segundos

    return () => clearInterval(intervalId); // Limpe o intervalo ao desmontar
  }, []);

  useEffect(() => {
    const fetchRamais = async () => {
      try {
        const response = await fetch("http://192.168.10.125:3005/ramais");
        const jsonData = await response.json();
        setRamais(jsonData);
      } catch (error) {
        console.error("Error fetching ramais:", error);
      }
    };

    fetchRamais(); // Chame imediatamente ao montar

    const intervalId = setInterval(fetchRamais, 10000); // Chame a cada 5 segundos

    return () => clearInterval(intervalId); // Limpe o intervalo ao desmontar
  }, []);

  const handleChartClick = (codFila) => {
    setSelectedChart(codFila);
    const ramal = ramais.find((r) => r.CodFila === codFila);
    setSelectedRamal(ramal);

    const filaData = data.find((fila) => fila.CodFila === codFila);
    setSelectedFilaData(filaData); // Defina o selectedFilaData com base no CodFila selecionado
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        anchor: "end",
        formatter: function (value, context) {
          return value;
        },
      },
    },
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <>
     <Sidebar 
       selectedChart={selectedChart} 
       onBack={() => { setSelectedChart(null); setSelectedRamal(null); }}
       searchTerm={searchTerm}
       onSearchChange={handleSearchChange}
     />
      <div className={Styles.container}>
      {selectedChart === null ? (
    data
      .filter(fila => !searchTerm || fila.Descricao.includes(searchTerm))
      .map((fila) => (
            <div
              key={fila.CodFila}
              className={Styles.individualDiv}
              onClick={() => handleChartClick(fila.CodFila)}
            >
              <span style={{ fontFamily: "initial" }}>{fila.Descricao}</span>
              <h1 className={Styles.child}>{fila.UsuariosLogados}</h1>{" "}
              {/* Alteração aqui */}
              <Doughnut
                // style={{ marginTop: "30px" }}
                width={50}
                height={50}
                data={{
                  labels: fila.Status.map((status) => status.Descricao),
                  datasets: [
                    {
                      data: fila.Status.map((status) => status.Qtde),
                      backgroundColor: fila.Status.map((status) => status.Cor),
                    },
                  ],
                }}
                options={options}
              />
            </div>
          ))
        ) : (
          <>
            {/* <button onClick={() => { setSelectedChart(null); setSelectedRamal(null); }}>Back</button>
           */}
            <div></div>
            {data
              .filter((fila) => fila.CodFila === selectedChart)
              .map((fila) => (
                <div
                  key={fila.CodFila}
                  className={Styles.individualDiv}
                  style={{
                    width: isMobile ? "" : "20%",
                    maxHeight: "415px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontFamily: "initial" }}>
                    {fila.Descricao}
                  </span>
                  <h1 className={Styles.child}>{fila.UsuariosLogados}</h1>
                  <Doughnut
                    // style={{ marginLeft: " 30px" }}
                    width={50}
                    height={50}
                    data={{
                      labels: fila.Status.map((status) => status.Descricao),
                      datasets: [
                        {
                          data: fila.Status.map((status) => status.Qtde),
                          backgroundColor: fila.Status.map(
                            (status) => status.Cor
                          ),
                        },
                      ],
                    }}
                    options={options}
                  />
                </div>
              ))}
            {selectedRamal && (
              <div
                className={Styles.ramalInfo}
                style={{ width: isMobile ? "" : "70%" }}
              >
                <OverviewLatestOrders selectedFilaData={selectedFilaData} />
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ display: "flex",  flexDirection: isMobile?  "column" :  '', justifyContent:  isMobile ? '' :  "space-around",  alignItems:  isMobile ?  "center" :  ""}}>
  {selectedChart && (
    <InfoFilas codFila={selectedChart} style={{ height: "50%" }} />
  )}
  {selectedChart && <InfoMailingComponent codFila={selectedChart} />}
  {selectedChart && <WaveChart selectedCodFila={selectedChart} />}
</div>
    </>
  );
}
