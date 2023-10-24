'use client'
import React, { useEffect, useState, useCallback } from "react";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, TextField, Modal, Button } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/PersistentDrawerRight";
import cloneDeep from 'lodash/cloneDeep';

export default function Contato() {
  useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [orders, setOrders] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(null);

  const handleIconClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  const handleApiCall = useCallback(async (value) => {
    const apiUrl = `http://192.168.10.125:3010/exec?comando=${value}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        console.log("API call success");
        return data;
      } else {
        console.error("API call failed");
        return null;
      }
    } catch (error) {
      console.error("API call error:", error);
      return null;
    }
  }, []);

  const handleOperationClick = async (operationCmd) => {
    await handleApiCall(operationCmd);  // Realiza a chamada à API para executar a operação
    
    // Após a operação, fazemos uma chamada para buscar novamente os dados atualizados
    const data = await handleApiCall("exec%20dbo.ProcListarJobs_React");
    
    if (data) {
      const updatedJobsMap = {};
      data.forEach((order) => {
        updatedJobsMap[order["Nome"]] = order;
      });
      
      setJobsMap(updatedJobsMap); // Atualiza o mapa de jobs
      setSelectedJob(updatedJobsMap[selectedJob["Nome"]]); // Atualiza o job selecionado
    }
  };
  

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.10.125:3010/exec?comando=exec%20dbo.ProcListarJobs_React");
        const data = await response.json();
        setOrders(data);
        const jobsMap = {};
        data.forEach((order) => {
          jobsMap[order["Nome"]] = order;
        });
        setJobsMap(jobsMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setIsLoading(false);
      }
    };
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredJobs = Object.values(jobsMap).filter((job) => job["Nome"].toLowerCase().includes(searchTerm.toLowerCase()));
  const getCellColor = (isActive) => (isActive ? "green" : "red");
  const tableCellStyle = { padding: "2px", fontSize: "14px" };
  return (
    <>
        <Sidebar />
        <Card style={{ margin: "0px" }}>
            <TextField
                fullWidth
                variant="outlined"
                label="Pesquisar por Nome do Job"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "16px" }}
            />
            {isLoading ? (
                <Box>
                    {/* Placeholder para quando estiver carregando os dados */}
                </Box>
            ) : (
                <Box>
                    {windowWidth && windowWidth < 600 ? (
                        <Box>
                            {filteredJobs.map((order, index) => (
                                <Box 
                                    key={index}
                                    padding="10px"
                                    borderBottom="1px solid #ddd"
                                    onClick={() => handleIconClick(order)}
                                >
                                    {order["Nome"].length > 20
                                        ? `${order["Nome"].slice(0, 40)}...`
                                        : order["Nome"]}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={tableCellStyle}>Nome do Job</TableCell>
                                    <TableCell style={tableCellStyle}>Última Execução</TableCell>
                                    <TableCell style={tableCellStyle}>Próxima Execução</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredJobs.map((order, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell style={tableCellStyle} onClick={() => handleIconClick(order)}>
                                            {order["Nome"]}
                                        </TableCell>
                                        <TableCell style={tableCellStyle}>
                                            {order["Dt_Ultima_Execucao"]}
                                        </TableCell>
                                        <TableCell style={tableCellStyle}>
                                            {order["Dt_Proxima_Execucao"]}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            )}
        </Card>

        <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="job-detail-modal"
        >
            <Box 
                style={{
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%', 
                    maxWidth: '500px',
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
            >
                {selectedJob && (
                    <>
                        <h2 style={{ color: getCellColor(selectedJob["Ativo"] === 1) }}>{selectedJob["Nome"]}</h2>
                        <p><strong>Ativo:</strong> {selectedJob["Ativo"] ? "Sim" : "Não"}</p>
                        <p><strong>Executando:</strong> {selectedJob["Executando"] ? "Sim" : "Não"}</p>

                        {selectedJob["Ativo"] === 1 ? (
                            <Button onClick={() => handleOperationClick(selectedJob["CmdDesabilitarJob"], "Ativo")}>Desabilitar</Button>
                        ) : (
                            <Button onClick={() => handleOperationClick(selectedJob["CmdHabilitarJob"], "Ativo")}>Habilitar</Button>
                        )}
                        
                        {selectedJob["Executando"] === 1 ? (
                            <Button onClick={() => handleOperationClick(selectedJob["CmdPararJob"], "Executando")}>Parar</Button>
                        ) : (
                            <Button onClick={() => handleOperationClick(selectedJob["CmdIniciarJob"], "Executando")}>Iniciar</Button>
                        )}

                        <Box style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" onClick={handleCloseModal}>Salvar</Button>
                            <Button variant="outlined" onClick={handleCloseModal}>Sair</Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    </>
);


}
