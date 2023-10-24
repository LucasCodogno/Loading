import React, { useEffect, useState } from "react";
import axios from "axios";
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

const statusMap = {
  Disponível: "success",
};

export const OverviewLatestOrders = ({ selectedFilaData, sx }) => {
  const [ramais, setRamais] = useState([]);
  const [data, setData] = useState([]);
  const [avatars, setAvatars] = useState([]); // Novo estado para armazenar os avatares
//   console.log(avatars);

  useEffect(() => {
    const fetchRamais = async () => {
      try {
        const response = await axios.get("http://192.168.10.125:3005/ramais");
        setRamais(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
      }
    };

    fetchRamais();
    const intervalId = setInterval(fetchRamais, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await axios.get(
          "http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%202"
        );
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
      }
    };

    fetchServerInfo();
    const intervalId = setInterval(fetchServerInfo, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get("http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%202"); // Substitua por sua URL real
        setAvatars(response.data);
      } catch (error) {
        console.error("Erro ao buscar os avatares:", error);
      }
    };

    fetchAvatars();
  }, []);

  const codFila = selectedFilaData?.CodFila;
  const filteredRamais = codFila
    ? ramais.filter((ramal) => ramal.CodFila === codFila)
    : [];
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Card sx={sx}>
      <CardHeader
      
        title={`Lista de Ramais - ${selectedFilaData?.Descricao || ""}`}
      />
      <div
        className="scrollbar-container"
        style={{ overflowY: "auto", maxHeight:  isMobile ?  "300px" :  '' }}
      >
        {isMobile ? (
      <Box className="list-view">
      {filteredRamais.map((ramal) => {
        const avatar = avatars.find((avatar) => avatar.login_name === ramal.Login);
        return (
            <div
            key={ramal.Ramal}
            style={{
              // height:  '390px',
              padding: "10px",
              margin: "10px 0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
           backgroundColor: [ramal.Cor] 
            }}
          >
           <div style={{ flex: 1 }}>
            <div style={{display:  'flex', alignItems:  ' center'}}>

             <Avatar
              src={avatar ? `data:image/jpeg;base64,${avatar.foto}` : undefined}
              alt="Avatar"
              style={{ marginRight: "10px" }}
              /> {ramal.Login}
              </div>
             {/* <p><strong>Ramal:</strong>  {ramal.Ramal}</p>
             <p><strong>Cód. Fila:</strong> {ramal.CodFila}</p>
             <p><strong>Usuário:</strong> {ramal.NomeUsuario}</p>
             <p><strong>Tempo:</strong> {ramal.Tempo}</p>
             <p  ><strong>Status:</strong> {ramal.DescStatus}</p> */}
           </div>
         </div>
      );
    })}
     </Box>
     
      
        ) : (
          <Box className="table-view" sx={{ minWidth: 800,    height:  '390px', }}>
            {/* Render your table view content here */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Ramal</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Cód. Fila</TableCell>
                  {/* <TableCell>Desc. Fila</TableCell> */}
                  <TableCell>Usuário</TableCell>
                  <TableCell>Tempo</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRamais.map((ramal) => {
                  const avatar = avatars.find(
                    (avatar) => avatar.login_name === ramal.Login
                  );
                  return (
                    <TableRow
                      hover
                      key={ramal.Ramal}
                      style={{ backgroundColor: [ramal.Cor] }}
                    >
                      <TableCell>
                        {avatar ? (
                          <Avatar
                            src={`data:image/jpeg;base64,${avatar.foto}`}
                            alt="Avatar"
                            width="40"
                          />
                        ) : (
                          <Avatar alt="Avatar Padrão" width="40" />
                        )}
                      </TableCell>
                      <TableCell>{ramal.Ramal}</TableCell>
                      <TableCell>{ramal.Login}</TableCell>
                      <TableCell>{ramal.CodFila}</TableCell>
                      {/* <TableCell>{ramal.DesFila}</TableCell> */}
                      <TableCell>{ramal.NomeUsuario}</TableCell>
                      <TableCell>{ramal.Tempo}</TableCell>
                      <TableCell>
                        <div className="tooltip-container">
                          {/* <span className="tooltip">{ramal.DescStatus}</span> */}
                          <span>{ramal.DescStatus}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </div>
      <Divider />
      {/*  */}
    </Card>
  );
};
