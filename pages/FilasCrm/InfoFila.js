// ResumoStatusComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InfoFilas = ({ codFila }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.10.125:3010/exec?comando=dbo.ProcDiscAvanti_ResumoStatus%20@CodFila=${codFila}`);
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
      {/* Renderize os dados conforme necessário */}
      <p>Completadas: {data.Completadas}</p>
      <p>Não Completadas: {data.NaoCompletadas}</p>
      <p>Descartes: {data.Descartes}</p>
      <p>Atendidas: {data.Atendidas}</p>
      <p>NaoAtendidas: {data.NaoAtendidas}</p>
      <p>AtendEletronico: {data.AtendEletronico}</p>
      </div>
      <div>
        
      <p>DescarteUsuario: {data.DescarteUsuario}</p>
      <p>DescarteCTI: {data.DescarteCTI}</p>
      <p>Ocupadas: {data.Ocupadas}</p>
      <p>TelefoneErrado: {data.TelefoneErrado}</p>
      <p>Falhas: {data.Falhas}</p>
      <p>SemRota: {data.SemRota}</p>
      {/* ... e assim por diante para os outros campos */}
    </div>
    </>
  );
};

export default InfoFilas;
