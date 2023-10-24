'use client'


import React, { useState, useEffect } from "react";
import axios from "axios"; // Certifique-se de ter o axios importado.
import Sidebar from "@/components/PersistentDrawerRight";
import { useAuth } from "@/hooks/useAuth";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function Sobre(props) {
    useAuth();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [apiData, setApiData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [expandedImage, setExpandedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedImageTitle, setExpandedImageTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [windowWidth, setWindowWidth] = useState(null);

    const fetchApiData = async () => {
        try {
            const response = await axios.get("http://192.168.10.125:3010/exec?comando=ProcInfoServidorReact%202");
            setApiData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApiData();
        const interval = setInterval(fetchApiData, 20000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
    
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
    
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
    };

    const toggleImageSize = (imageSrc, title) => {
        setExpandedImage(imageSrc);
        setExpandedImageTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setExpandedImage(null);
        setExpandedImageTitle("");
    };

    const filteredItems = apiData.filter(customer => customer.login_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedItems = filteredItems.slice(startIndex, endIndex);

    const selectedAll = displayedItems.length > 0 && selected.length === displayedItems.length;
    const selectedSome = selected.length > 0 && selected.length < displayedItems.length;

    const renderList = () => {
        
        return (
            <List>
                <TextField
                    onFocus={false}
                    fullWidth
                    variant="outlined"
                    label="Pesquisar por Login..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "16px" }}
                />
                {displayedItems.map(customer => (
                    <ListItem key={customer.id} divider>
                        <ListItemAvatar>
                            <Avatar
                                onClick={() => toggleImageSize(`data:image/jpeg;base64,${customer.foto}`, customer.login_name)}
                                src={`data:image/jpeg;base64,${customer.foto}`}
                                alt={customer.login_name}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={customer.login_name}
                            secondary={
                                <>
                                    <Typography variant="subtitle2">{customer.host_name}</Typography>
                                    {`${customer.program_name}, ${customer.status}, ${customer.login_time}`}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <>
            <Sidebar/>
            <Card>
                <Box>
                {windowWidth < 600 ? (
                        renderList()
                    ) : (
                        <>
                            <TextField
                                onFocus={false}
                                fullWidth
                                variant="outlined"
                                label="Pesquisar por Host"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginBottom: "16px" }}
                            />
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                           
                                        </TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Host</TableCell>
                                        <TableCell>Program</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Login Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedItems.map(customer => {
                                        const isSelected = selected.includes(customer.id);
                                        return (
                                            <TableRow hover key={customer.id} selected={isSelected}>
                                                <TableCell padding="checkbox"></TableCell>
                                                <TableCell>
                                                    <Stack alignItems="center" direction="row" spacing={2}>
                                                        <Avatar
                                                            src={`data:image/jpeg;base64,${customer.foto}`}
                                                            alt={customer.login_name}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => toggleImageSize(`data:image/jpeg;base64,${customer.foto}`, customer.login_name)}
                                                        />
                                                        <Typography variant="subtitle2">{customer.login_name}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{customer.host_name}</TableCell>
                                                <TableCell>{customer.program_name}</TableCell>
                                                <TableCell>{customer.status}</TableCell>
                                                <TableCell>{customer.login_time}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </Box>
                <TablePagination
                    component="div"
                    count={apiData.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[8, 16, 24]}
                />
                <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md">
                    <DialogTitle>{expandedImageTitle}</DialogTitle>
                    <DialogContent>
                        <img src={expandedImage} alt="Expanded" style={{ width: "100%" }} />
                    </DialogContent>
                </Dialog>
            </Card>
        </>
    );
}
