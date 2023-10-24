// InfoMailingComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InfoMailingComponent = ({ codFila }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.10.125:3010/exec?comando=dbo.ProcDiscAvanti_InfoMailing%20@codfila=${codFila}`);
        setData(response.data[0]);
      } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
      }
    };

    fetchData(); // Chame imediatamente ao montar

    const intervalId = setInterval(fetchData, 10000); // Chame a cada 5 segundos

    return () => clearInterval(intervalId); // Limpe o intervalo ao desmontar
  }, [codFila]);

  if (!data) return <div>Carregando...</div>;

  return (
    <>
 
    <div>
      <p>Total: {data.Total}</p>
      <p>Telefones Disponíveis: {data.TelefonesDisponiveis}</p>
      <p>Não Trabalhados: {data.NaoTrabalhados}</p>
      <p>Tentando Ligar: {data.TentandoLigar}</p>
      <p>Finalizados: {data.Finalizados}</p>
      <p>Renitência: {data.Renitencia}</p>
      </div>
      <div>
      <p>Descarte CTI: {data.DescarteCTI}</p>
      <p>TMA: {data.TMA}</p>
      <p>TME: {data.TME}</p>
      <p>TMP: {data.TMP}</p>
      <p>TMPA: {data.TMPA}</p>
    </div>
    </>
  );
};

export default InfoMailingComponent;
