/* eslint-disable */
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select"
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import '../../components/LiveModelReport.css';
import { BsCardImage, BsMap, BsFileEarmarkImage, BsFillMapFill } from "react-icons/bs";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
import Box from "@mui/material/Box";
import { TbChartPie2 } from "react-icons/tb";
import { Baseurl } from "../../Services/BaseUrl";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function LiveModelReport() {

    const [selectMachine, setSelecteMachine] = useState([]);
    const [model, setModel] = useState([])
    const [selectedModel, setSelectedModel] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [objectiveGraph, setObjectiveGraph] = useState([])
    const [classificationGraph, setclassificationGraph] = useState([])
    const [mapGraph, setMapGraph] = useState([])
    const [preciRecallGraph, setPreciRecallGraph] = useState([])
    const [gpumemGraph, setGpumemGraph] = useState([])
    const [machine, setMachine] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState('');
    const [dataNotFound, setDataNotFound] = useState(false);

    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    useEffect(() => {
        //  machineId();
        fillMachinesDataFromSession();
    }, []);


    const fillMachinesDataFromSession = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        //console.log('SESSIONDATA:', SESSIONDATA.user_name);

        setMachine([]);
        setMachine(SESSIONDATA.machine_access);
        setSelectedMachine(SESSIONDATA.machine_access[0].id);
        // setMachineTableData(SESSIONDATA.machine_access);

    }

    const machineId = () => {
        var token = localStorage.getItem('TOKEN');
        //console.log('TOKEN', token);
        axios.get(`${Baseurl}/machinedropdowndash`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
            }).then(function (response) {
                // console.log(responce.data)
                if (response.status === 200) {
                    setMachine(response.data);
                    //console.log('response.data', response.data);

                    // Check if selectedMachine is already set, if not, set it to the first value
                    if (response.data.length > 0 && !selectedMachine) {
                        setSelectedMachine(response.data[0].value);
                    }
                }

            })

    }


    useEffect(() => {
        const mainData = () => {
            var token = localStorage.getItem('TOKEN');
            var data = {
                machineId: selectedMachine,
                modelName: selectedModel
            }
            var config = {
                method: "post",
                url: `${Baseurl}/livemodeldash`,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            console.log('API livemodeldash', config);
            axios(config).then(function (responce) {
                // console.log(responce)
                setCardData(responce.data)
                console.log(cardData, "888888888888888888888888888888888888888888888")

                setObjectiveGraph({
                    labels: responce.data.objectness_graph.map((item) => item.epoch),
                    datasets: [
                        {
                            type: 'bar',
                            label: "Train Objectiveness",
                            data: responce.data.objectness_graph.map((item) => item.train_objectness),
                            fill: true,
                            borderColor: "gray",
                            backgroundColor: "gray",
                        },
                        {
                            type: 'bar',
                            label: "Val Objectivenss",
                            data: responce.data.objectness_graph.map(item => item.val_objectness),
                            fill: true,
                            borderColor: "#2ECC71",
                            backgroundColor: "#2ECC71"
                        }
                    ],
                });
                setclassificationGraph({
                    labels: responce.data.classification_graph.map((item) => item.epoch),
                    datasets: [
                        {
                            label: "Train Classification",
                            data: responce.data.classification_graph.map((item) => item.train_classification),
                            fill: true,
                            borderColor: "gray",
                            backgroundColor: "gray",
                        },
                        {
                            label: "Val Classification",
                            data: responce.data.classification_graph.map(item => item.val_classification),
                            fill: true,
                            borderColor: "#2ECC71",
                            backgroundColor: "#2ECC71",
                        }
                    ],
                })
                setMapGraph({
                    labels: responce.data.map_graph.map((item) => item.epoch),
                    datasets: [
                        {
                            label: "Map 50",
                            data: responce.data.map_graph.map((item) => item.map_50),
                            fill: true,
                            borderColor: "gray",
                            backgroundColor: "gray",
                        },
                        {
                            label: "Map 50 90",
                            data: responce.data.map_graph.map(item => item.map_50_95),
                            fill: true,
                            borderColor: "#2ECC71",
                            backgroundColor: "#2ECC71",
                        }
                    ],
                })
                setPreciRecallGraph({
                    labels: responce.data.preci_recall_graph.map((item) => item.epoch),
                    datasets: [
                        {
                            label: "Model Precision",
                            data: responce.data.preci_recall_graph.map((item) => item.model_precision),
                            fill: true,
                            borderColor: "gray",
                            backgroundColor: "gray",
                        },
                        {
                            label: "Recall",
                            data: responce.data.preci_recall_graph.map(item => item.recall),
                            fill: true,
                            borderColor: "#2ECC71",
                            backgroundColor: "#2ECC71"
                        }
                    ],
                })

                console.log('GPU MEM Data')


            })

        }
        mainData()

    }, [selectedMachine, selectedModel])


    useEffect(() => {
        modelDash()
        function machineIds() {
            setSelecteMachine(selectedMachine.map((id) => id.value))
        }
    }, [])

    useEffect(() => {
        machineIds()
        modelDash()
        function machineIds() {
        }
    }, [selectedMachine]);

    const modelDash = () => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        var data = JSON.stringify({
            machineIds: selectedMachine,
        });
        var config = {
            method: "post",
            url: `${Baseurl}/modelnamedropdowndash`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        console.log('API modelnamedropdowndash', config);
        axios(config).then(function (responce) {
            console.log("res", responce.data)
            if (responce.status === 200) {
                setModel(responce.data)
                setSelectedModel(responce.data[0].value);
            }
        })
    }
    const handleDropdownChange = (event) => {
        setSelectedMachine(event.target.value);
    }



    return (
        <div className="mt-0" style={{ backgroundColor: "#F5F5F5", overflow: 'hidden', height: "100%", margin: 0, position: "fixed", width: "100%" }}>
            <h5
                style={{
                    fontFamily: "initial", fontWeight: "Bold", color: "#438a5e", backgroundColor: "#D7EDDB",
                    marginBottom: "10px", marginTop: 10, height: 30, width: "30%", marginLeft: "22%"
                }}>Live Model Report
            </h5>

            <Row style={{ width: "800", marginTop: "-15px" }}>
                <Col sm={2} >
                    <div style={{ marginBottom: "50px", borderColor: 'green', marginTop: "10%", height: 250, marginLeft: "10px", marginBottom: "20px" }}>
                        <Box className="mt-3">
                            <h6 className="selectvendorid"> Select Machine </h6>

                            <Select
                                style={{ width: "100%", height: 40, marginLeft: 10 }}
                                className="machine"
                                value={selectedMachine}
                                onChange={(f) => {
                                    setSelectedMachine(f.target.value);
                                }} >
                                {machine.map((item) => (<MenuItem value={item.id} > {item.machineType} </MenuItem>))}
                            </Select>
                        </Box>
                        <br></br>
                        <Box>
                            <h6 className="selectvendorid"> Select Model </h6>
                            <Select
                                style={{ width: "100%", height: 40, marginLeft: 10 }}
                                className="box"
                                value={selectedModel}
                                onChange={(f) => setSelectedModel(f.target.value)} >
                                {/* <MenuItem value={selectedMachine} disabled selected >Select Machine Type</MenuItem> */}
                                {model.map((item) => (<MenuItem value={item.value} > {item.label} </MenuItem>))}
                            </Select>
                        </Box>
                    </div>

                </Col>

                <Col style={{ marginTop: "20px", }}>

                    <Row style={{ marginLeft: "10px" }}>
                        <Col md="9" style={{
                            backgroundColor: "#F5F5F5", marginLeft: "-10px", marginTop: "20px",
                        }}>
                            <Row>
                                <Col style={{ marginRight: "10px", height: "50px", width: "180px" }}>
                                    <div class="card border-left-warning shadow h-5 py-2" style={{ Color: "green" }}>
                                        <div class="card-body" >
                                            <TbChartPie2 style={{ marginTop: "-50px", color: "#2405ed", width: "20px", height: "20px" }} />
                                            <div className="text-xs font-weight-bold  text-uppercase mb-1"
                                                tag="h6" align-item="start" style={{ color: "black", marginTop: "-20px", fontFamily: "initial", fontSize: 14 }}>
                                                F1 Score
                                            </div>

                                            <span className="h6 font-weight-bold mb-0" style={{ color: "black" }}>

                                                {cardData.f1_score}
                                            </span>

                                        </div>
                                    </div>
                                </Col>
                                <Col style={{ marginRight: "10px", height: "50px", width: "180px" }}>
                                    <div class="card border-left-warning shadow h-10 py-2">
                                        <div class="card-body">
                                            <BsFileEarmarkImage style={{ marginTop: "-50px", color: "#10bfcc", width: "20px", height: "20px" }} />
                                            <div className="text-sm font-weight-bold  text-uppercase mb-1"
                                                tag="h6" align-item="start" style={{ color: "black", marginTop: "-20px", fontFamily: "initial", fontSize: 14, marginLeft: "-23px", marginRight: "-20px" }}
                                            >
                                                Train Images
                                            </div>

                                            <span className="h6 font-weight-bold mb-0" style={{ color: "black" }}>

                                                {cardData.train_imgs}
                                            </span>

                                        </div>
                                    </div>
                                </Col>
                                <Col style={{ marginRight: "10px", height: "50px", width: "250px" }}>
                                    <div class="card border-left-warning shadow h-10 py-2">
                                        <div class="card-body">
                                            <BsCardImage style={{ marginTop: "-50px", color: "#b010b0", width: "20px", height: "20px" }} />
                                            <div className="text-xs font-weight-bold  text-uppercase mb-1"
                                                tag="h6" align-item="start" style={{ color: "black", marginTop: "-20px", marginLeft: "-22px", fontFamily: "initial", fontSize: 14 }}>
                                                Valid Images
                                            </div>
                                            <span className="h6 font-weight-bold mb-0" style={{ color: "black" }}>
                                                {cardData.valid_imgs}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col style={{ marginRight: "10px", height: "50px", width: "200px" }}>
                                    <div class="card border-left-warning shadow h-10 py-2">
                                        <div class="card-body">
                                            <BsMap style={{ marginTop: "-50px", color: "#d68315", width: "20px", height: "20px" }} />
                                            <div className="text-xs font-weight-bold  text-uppercase mb-1"
                                                tag="h6" align-item="start" style={{ color: "black", marginTop: "-20px", marginTop: "-20px", fontFamily: "initial", fontSize: 14 }}>
                                                Map 50
                                            </div>
                                            <span className="h6 font-weight-bold mb-0" style={{ color: "black" }}>
                                                {cardData.map_50}
                                            </span>

                                        </div>
                                    </div>
                                </Col>
                                <Col style={{ height: "50px", width: "200px" }}>
                                    <div class="card border-left-warning shadow h-10 py-2">
                                        <div class="card-body">
                                            <BsFillMapFill style={{ marginTop: "-50px", color: "green", width: "20px", height: "20px" }} />
                                            <div className="text-xs font-weight-bold  text-uppercase mb-1"
                                                tag="h6" align-item="start" style={{ color: "black", marginTop: "-20px", fontFamily: "initial", fontSize: 14 }}>
                                                Map 90
                                            </div>

                                            <span className="h6 font-weight-bold mb-0" style={{ color: "black" }}>

                                                {cardData.map_90}
                                            </span>

                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "70px", marginLeft: "-5px" }}>

                        <Col sm={3} style={{ marginRight: "10%" }}>
                            <center>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        textAlign: "center",
                                        height: "250px",
                                        width: "380px",

                                    }}
                                >
                                    {objectiveGraph && objectiveGraph.datasets && (
                                        <Line
                                            data={objectiveGraph}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: "top" },
                                                    title: { display: true, text: "Train vs val objectiveness​" },
                                                },
                                                scales: {
                                                    x: {
                                                        display: true,
                                                        title: {
                                                            display: true,
                                                            text: "Epochs",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                    y: {
                                                        display: true,
                                                        title: {
                                                            display: true,

                                                            text: "probability",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold"// Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </center>
                        </Col>

                        <Col sm={3} style={{
                            marginLeft: "60px", marginRight: "50px", height: "200px",
                            width: "400px"
                        }}>
                            <center>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        textAlign: "center",
                                        height: "200px",
                                        width: "400px",

                                    }}
                                >
                                    {classificationGraph && classificationGraph.datasets && (
                                        <Line
                                            data={classificationGraph}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: "top" },
                                                    title: { display: true, text: "Train vs val classification" },
                                                },
                                                scales: {
                                                    x: {
                                                        display: true,
                                                        title: {
                                                            display: true,
                                                            text: "Epochs",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                    y: {
                                                        display: true,
                                                        title: {
                                                            display: true,

                                                            text: "probability",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </center>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "-10px", marginLeft: "-5px" }}>

                        <Col sm={3} style={{ marginRight: "10%" }}>
                            <center>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        textAlign: "center",
                                        height: "250px",
                                        width: "380px",

                                    }}
                                >
                                    {mapGraph && mapGraph.datasets && (
                                        <Line
                                            data={mapGraph}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: "top" },
                                                    title: { display: true, text: "Map 50 vs map 90" },
                                                },
                                                scales: {
                                                    x: {
                                                        display: true,
                                                        title: {
                                                            display: true,
                                                            text: "Epochs",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                    y: {
                                                        display: true,
                                                        title: {
                                                            display: true,

                                                            text: "probability",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold"// Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </center>
                        </Col>

                        <Col sm={3} style={{
                            marginLeft: "60px", marginRight: "40px", height: "200px",
                            width: "400px"
                        }}>
                            <center>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        textAlign: "center",
                                        height: "200px",
                                        width: "400px",

                                    }}
                                >
                                    {preciRecallGraph && preciRecallGraph.datasets && (
                                        <Line
                                            data={preciRecallGraph}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: "top" },
                                                    title: { display: true, text: "Precision vs recall" },
                                                },
                                                scales: {
                                                    x: {
                                                        display: true,
                                                        title: {
                                                            display: true,
                                                            text: "Epochs",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                    y: {
                                                        display: true,
                                                        title: {
                                                            display: true,

                                                            text: "probability",
                                                            color: "#000", // Optional: Customize the title color
                                                            font: {
                                                                size: 10,
                                                                weight: "bold" // Optional: Customize the title font size
                                                                // Optional: Customize the title font weight
                                                            },
                                                            padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </center>
                        </Col>
                    </Row>
                </Col>
            </Row>

           
        </div >

    )
}
