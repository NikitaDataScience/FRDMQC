/* eslint-disable */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Card, Col } from "react-bootstrap";
import '../../components/HistoricalModelreport.css'
import { Label, Table } from 'reactstrap';
import { Baseurl } from "../../Services/BaseUrl";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, } from "chart.js";
ChartJS.register(LineElement, Title, Tooltip, Legend, CategoryScale, BarElement, PointElement,);

var machineNames = [
];

const HistoricalScreen = () => {
    ///Machine dropdown
    const [selectedMachine, setSelectedMachine] = useState([]);
    const [selectMachine, setSelecteMachine] = useState([]);
    const [machine, setMachine] = useState([])
    const [rowIndex, setRowIndex] = React.useState(0);
    //Model Dropdown
    const [model, setModel] = useState(['1'])
    const [selectModel, setSelectModel] = useState([])
    // const [selectedModel, setSelectedModel] = useState([])
    //Model Version Dropdown
    const [modelVersionDrop, setModelVersionDrop] = useState([])
    const [selectModelVersion, setSelectModelVersion] = useState([])
    const [SelectedModelVersion, setSelectedVersion] = useState([])
    //Card Data
    const [cardData, setCardData] = useState([])
    //Table Data
    const [tableData, setTableData] = useState([])
    //version_f1_graph
    const [versionF1Graph, setVersionF1Graph] = useState([])
    const [versionMapGraph, setVersionMapGraph] = useState([])
    const [machineSelected, setMachineSelected] = useState([]);
    ///class_cnt_graph
    const [classCountGraph, setClassCountGraph] = useState([])



    const [SelectedMachines, setSelectedMachines] = useState([{
        "id": 0,
        "machineType": "Select All",
        "description": "SelectAll"
    }]);

    const machineId = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        var machinesArray = SESSIONDATA.machine_access;
        console.log("machinesArray", machinesArray)
        machineNames = machinesArray.map(x => { return { 'value': x.id, 'label': x.machineType } });
        var machineIds = [];
        for (let index = 0; index < machinesArray.length; index++) {
            const element = machinesArray[index];
            machineIds.push(element.id);
        }
        setMachineSelected(machineNames[0].value);
        //setModel(machineIds);
        // fillClassesData(machineIds);
        modelName(machineNames[0].value);
    }
    const onMachineDropdownchangeone = (event) => {
        // setMachineSelected(event);
        const selectedMachineValue = event.target.value;
        setMachineSelected(selectedMachineValue);
        var machineIds = [];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            machineIds.push(element.value);
        }
        modelName(selectedMachineValue);
    }




    const modelName = (machineId, isdefault = true) => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        //alert(machineId);
        var data = JSON.stringify({
            machineIds: machineId,
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
        axios.request(config)
            .then(result => {
                setModel([])
                //alert(JSON.stringify(result));
                //setSelectedModel([result.data[0].value]);
                if (result.data != undefined && result.data.length > 0) {
                    setModel(result.data)
                    console.log(model, "659+555844846549")
                }
                else {
                    setModel([1])
                }
            })
    }

    const [selectedModel, setSelectedModel] = useState([]);

    const modelVersion = (isdefault = true) => {

    }

    useEffect(() => {
        mainDataAPI()
    }, [selectMachine, selectModel, selectModelVersion, machineSelected, selectedModel])

    var mainDataAPI = () => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        const machineIdAsNumber = parseInt(machineSelected, 10);
        if (selectedModel == null) {
            selectedModel = 1
        }
        var data = JSON.stringify({
            "machineIds": machineIdAsNumber,
            "modelNames": selectedModel,
        })
        var config = {
            method: "post",
            url: `${Baseurl}/histmodeldash`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config).then(function (responce) {
            // console.log
            console.log(responce)
            setCardData(responce.data)
            setTableData(responce.data.table_data)

            setVersionF1Graph({
                labels: responce.data.version_f1_graph.map((item) => item.version_id),
                datasets: [
                    {
                        type: 'bar',
                        label: "Train Images",
                        data: responce.data.version_f1_graph.map((item) => item.train_imgs),
                        fill: true,
                        borderColor: "black",
                        backgroundColor: "lightblue",
                    },
                    {
                        type: 'bar',
                        label: "Valid Images",
                        data: responce.data.version_f1_graph.map(item => item.valid_imgs),
                        fill: true,
                        borderColor: "blue ",
                        backgroundColor: "#1FC6A6 "
                    },
                    {
                        type: 'line',
                        label: "F1 Score",
                        data: responce.data.version_f1_graph.map(item => item.f1_score),
                        fill: true,
                        borderColor: "purple",
                        backgroundColor: "purple ",
                        yAxisID: 'y1',
                    },
                    // {
                    //     type: 'line',
                    //     label: "Version Count",
                    //     data: responce.data.version_f1_graph.map(item => item.version_count),
                    //     fill: true,
                    //     borderColor: "Orange",
                    //     backgroundColor: "Orange",
                    //     // yAxisID: 'y2',
                    // },

                    
                ],
            })



            setVersionMapGraph({
                labels: responce.data.version_mAP_graph.map((item) => item.version_id),
                datasets: [
                    {
                        type: 'bar',
                        label: "Valid Images",
                        data: responce.data.version_mAP_graph.map((item) => item.valid_imgs),
                        fill: true,
                        borderColor: "#1FC6A6 ",
                        backgroundColor: "#1FC6A6 ",
                    },
                    // {
                    //     type: 'line',
                    //     label: "Valid Images",
                    //     data: responce.data.version_mAP_graph.map((item) => item.valid_imgs),
                    //     fill: true,
                    //     borderColor: "black",
                    //     backgroundColor: "black ",
                    // },
                    {
                        type: 'bar',
                        label: "Train Images",
                        data: responce.data.version_mAP_graph.map(item => item.train_imgs),
                        fill: true,
                        borderColor: "lightblue",
                        backgroundColor: "lightblue"
                    },

                    // {
                    //     type: 'line',
                    //     label: "Train Images",
                    //     data: responce.data.version_mAP_graph.map(item => item.train_imgs),
                    //     fill: true,
                    //     borderColor: "red",
                    //     backgroundColor: "red"
                    // },
                    {
                        type: 'line',
                        label: "Map 50",
                        data: responce.data.version_mAP_graph.map(item => item.map_50),
                        fill: true,
                        borderColor: "Orange",
                        backgroundColor: "Orange",
                        yAxisID: 'y1',
                    },
                    {
                        type: 'line',
                        label: "Map 90",
                        data: responce.data.version_mAP_graph.map(item => item.map_90),
                        fill: true,
                        borderColor: "purple",
                        backgroundColor: "purple",
                        yAxisID: 'y1',
                    }
                ],
            })

            setClassCountGraph({
                labels: responce.data.class_cnt_graph.map((item) => item.class_name),
                datasets: [
                    {
                        type: 'bar',
                        label: "Valid Images",
                        data: responce.data.class_cnt_graph.map((item) => item.class_count),
                        fill: true,
                        borderColor: "#1FC6A6 ",
                        backgroundColor: "#1FC6A6 ",
                    }

                ],
            })
            // (responce.data.version_f1_graph)
        })
    }

    useEffect(() => {
        machineId()
        machineIds()
        modelVersion()
        // modelName()  ---------------------- Model Dropdown full balck 
        // mainDataAPI()
        function machineIds() {
            setSelecteMachine(selectedMachine.map((id) => id.value))
        }
    }, [selectedMachine])

    // useEffect(() => {
    //     modelName()
    //     function modelName() {
    //         setSelectModel(selectedModel.map((id) => id.label))
    //     }
    // }, [selectedModel])

    useEffect(() => {
        modelVersionIds()
        function modelVersionIds() {
            setSelectModelVersion(SelectedModelVersion.map((id) => id.label))
        }
    }, [SelectedModelVersion])

    console.log("tableData", tableData)
    const rowClick = (index) => {
        setRowIndex(index);
    }

    return (
        <div style={{ backgroundColor: "#F5F5F5", overflow: 'hidden', height: "100%", margin: 0, position: "fixed" }}>
            <Row>
                <Col md="3" style={{ backgroundColor: "#F5F5F5", marginLeft: "40px", marginTop: "15px" }}>

                    <div style={{ marginTop: 40 }}>
                        <div style={{ width: 310 }}>
                            <div>
                                <Label
                                    for="machine"
                                    style={{
                                        fontFamily: "initial", color: "black", marginTop: "5px",
                                        marginLeft: "-130PX"
                                    }}>
                                    Select Machine Name:
                                </Label>
                            </div>
                            <tr>
                                <div>
                                    <select
                                        value={machineSelected}
                                        onChange={onMachineDropdownchangeone}
                                        style={{ width: "100%", height: 40 }}>
                                        <option > Select Machine</option>
                                        {machineNames.map((machine) => (
                                            <option key={machine.value} value={machine.value}>
                                                {machine.label}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </tr>
                            <tr>
                                <td>
                                    <Label
                                        for="classes"
                                        style={{ fontFamily: "initial", color: "black", marginTop: "20px", marginRight: "120PX" }} >
                                        Select Model
                                    </Label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {/* <MultiSelect
                                    className="multitext"
                                    options={model}
                                    value={selectedModel}
                                    onChange={setSelectedModel}
                                    labelledBy="Select"
                                /> */}
                                    <select
                                        value={selectedModel} // Use the first element of the array
                                        onChange={(event) => setSelectedModel([event.target.value])} // Convert to an array with one value
                                        style={{ width: "100%", height: 40 }}
                                    >
                                        {/* <option value="">Select Model</option> */}
                                        {model.map((model) => (
                                            <option key={model.value} value={model.value}>
                                                {model.label}
                                            </option>
                                        ))}
                                    </select>


                                </td>
                            </tr>
                        </div>

                    </div>

                </Col>

                <Col md="8" style={{ backgroundColor: "#F5F5F5", marginLeft: "-40px", marginTop: "1px" }}>
                    <h5 style={{
                        fontFamily: "initial",
                        color: "#438a5e", marginRight: "580px", backgroundColor: "#D7EDDB",
                        marginBottom: "10px", marginTop: "10px", marginLeft: "20px",
                        fontWeight: "Bold"
                    }}>Historical Model Report</h5>

                    <Table style={{ marginTop: 10 }}>
                        <Row style={{ marginLeft: "10px", marginTop: "10px" }}>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                <Card className="cardtext" style={{ marginLeft: "-30px" }}>
                                    <Card.Body style={{ marginLeft: "-20px", marginRight: "-20px" }}>
                                        <Card.Text style={{ marginTop: "-15px", fontFamily: "initial", }}>F1 Score</Card.Text>
                                        {/* 
                                        <Card.Text className="activeresponse" style={{ marginTop: "-10px", marginBottom: "-10px" }}>&nbsp;
                                            {cardData.f1_score}
                                        </Card.Text> */}

                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.f1_score}</h3>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* <div className="card">
                                    <div className="card-content">
                                        <p>F1 score</p>
                                    </div>


                                </div> */}
                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                {/* <div className="card">
                                    <div className="card-content">
                                        <p>Map 50</p>
                                    </div>
                                    <div className="card-header">
                                        <h3>{cardData.map_50}</h3>
                                    </div>

                                </div> */}
                                <Card className="cardtext" style={{ marginLeft: "-10px" }}>
                                    <Card.Body style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                        <Card.Text style={{ marginTop: "-15px", fontFamily: "initial", marginLeft: "-20px" }}>Map 50</Card.Text>
                                        {/* <Card.Text className="activeresponse" style={{ marginTop: "-10px", marginBottom: "-10px" }}>&nbsp;
                                            {cardData.map_50}
                                        </Card.Text> */}
                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.map_50}</h3>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                <Card className="cardtext" style={{ marginLeft: "-10px" }}>
                                    <Card.Body style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                        <Card.Text style={{ marginTop: "-15px", fontFamily: "initial", marginLeft: "-20px" }}>Map 90</Card.Text>
                                        {/* <Card.Text className="activeresponse" style={{ marginTop: "-10px", marginBottom: "-10px" }}>&nbsp;
                                            {cardData.map_90}
                                        </Card.Text> */}
                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.map_90}</h3>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* <div className="card">
                                    <div className="card-content">
                                        <p>Map 90</p>
                                    </div>
                                    

                                </div> */}
                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                <Card className="cardtext" style={{ marginLeft: "-10px" }}>
                                    <Card.Body style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                        <Card.Text style={{
                                            marginTop: "-15px", fontFamily: "initial",
                                            marginLeft: "-20px", textAlign: "center", marginRight: "-20px"
                                        }}>Train Images</Card.Text>

                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.train_imgs}</h3>
                                        </div>
                                        {/* <Card.Text className="activeresponse" style={{ marginTop: "-10px", marginBottom: "-10px" }}>&nbsp;
                                            {cardData.train_imgs}
                                        </Card.Text> */}
                                    </Card.Body>
                                </Card>

                                {/* <div className="card">
                                    <div className="card-content">
                                        <p>Train Images</p>
                                    </div>


                                </div> */}
                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                <Card className="cardtext" style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                    <Card.Body style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                        <Card.Text style={{
                                            marginTop: "-15px", fontFamily: "initial",
                                            marginLeft: "-20px", textAlign: "center", marginRight: "-20px"
                                        }}>Valid Images</Card.Text>
                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.valid_imgs}</h3>
                                        </div>
                                        {/* <Card.Text className="activeresponse" style={{ marginTop: "-10px", marginBottom: "-10px" }}>&nbsp;
                                            {cardData.valid_imgs}
                                        </Card.Text> */}
                                    </Card.Body>
                                </Card>

                                {/* <div className="card">
                                    <div className="card-content">
                                        <p style={{ marginLeft: "-8px" }}>Valid Image</p>
                                    </div>


                                </div> */}
                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>
                                <Card className="cardtext" style={{ marginLeft: "-20px" }}>
                                    <Card.Body>
                                        <Card.Text style={{
                                            marginTop: "-15px", fontFamily: "initial",
                                            marginLeft: "-20px", textAlign: "center", marginRight: "-20px"
                                        }}>Version Count</Card.Text>

                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.version_count}</h3>
                                        </div>

                                    </Card.Body>
                                </Card>

                            </Col>
                            <Col style={{ marginRight: "10px", marginLeft: "-10px" }}>

                                <Card className="cardtext" style={{ marginLeft: "-10px" }}>
                                    <Card.Body>
                                        <Card.Text style={{
                                            marginTop: "-15px", fontFamily: "initial",
                                            marginLeft: "-20px", textAlign: "center", marginRight: "-20px"
                                        }}>Class Count</Card.Text>

                                        <div className="card-header" style={{ marginBottom: "-15px" }}>
                                            <h3>{cardData.class_count}</h3>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col >
                                <div
                                    style={{ height: 200, overflow: "scroll", position: "sticky", }}>
                                    <table >
                                        <thead style={{ color: "white", position: "sticky", top: "0", marginTop: "-40px", height: 50, width: "fit-content" }}>
                                            <tr >
                                                <th style={{ fontSize: 13, }}> F1 Score</th>
                                                <th style={{ fontSize: 13, }}> Map 50</th>
                                                <th style={{ fontSize: 13 }}>Map 90</th>
                                                <th style={{ fontSize: 13 }}>Model Id</th>
                                                <th style={{ fontSize: 13 }}>Prcsn</th>
                                                <th style={{ fontSize: 13 }}>Recall</th>
                                                <th style={{ fontSize: 13 }}>Train Images</th>
                                                <th style={{ fontSize: 13 }}>Training Time</th>
                                                <th style={{ fontSize: 13 }}>Valid Images</th>
                                                <th style={{ fontSize: 13 }}>Version Id</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData != null && tableData.length > 0 ? tableData.map((item) => {
                                                return (
                                                    <tr>
                                                        <td>{item.f1_score}</td>
                                                        <td>{item.map_50.toFixed(4)}</td>
                                                        <td>{item.map_90.toFixed(4)}</td>
                                                        <td>{item.model_id}</td>
                                                        <td>{item.prcsn.toFixed(4)}</td>
                                                        <td>{item.recall.toFixed(4)}</td>
                                                        <td>{item.train_imgs}</td>
                                                        <td>{item.training_time}</td>
                                                        <td>{item.valid_imgs}</td>
                                                        <td>{item.version_id}</td>
                                                    </tr>
                                                )

                                            })
                                                : <tr>
                                                    <td colSpan={12} className="text-center" style={{ fontFamily: "initial", color: "red", marginLeft: "400px" }}><b>Data not available</b></td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>

                                </div>
                            </Col>
                        </Row>
                    </Table>
                </Col>


                <Row >

                    <Col sm={4} >
                    <center>
                    <div  style={{
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                    height: "500px",
                                    width: "400px",

                                }}>
                       
                            

                                {tableData.length > 0 ? versionF1Graph && versionF1Graph.datasets && (
                                 <Bar
                                 data={versionF1Graph}
                                 options={{
                                     responsive: true,
                                     plugins: {
                                         legend: { position: "top" },
                                         title: { display: true, text: "Train and Valid Images Count and Version Count" },
                                     },
                                     scales: {
                                         x: {
                                             display: true,
                                             title: {
                                                 display: true,
                                                 text: "Version ID",
                                                 color: "#000",
                                                 font: {
                                                     size: 10,
                                                     weight: "bold",
                                                 },
                                                 padding: { top: 10, bottom: 0 },
                                             },
                                         },
                                         y: {
                                             position: 'left', // Position the left y-axis for "Train Images"
                                             display: true,
                                             title: {
                                                 display: true,
                                                 text: "Train Images",
                                                 color: "black",
                                                 font: {
                                                     size: 10,
                                                     weight: "bold",
                                                 },
                                                 padding: { left: 0, right: 10 },
                                             },
                                         },
                                         y1: {
                                             position: 'right', // Position the right y-axis for "Valid Images"
                                             display: true,
                                             title: {
                                                 display: true,
                                                 text: "Valid Images",
                                                 color: "blue",
                                                 font: {
                                                     size: 10,
                                                     weight: "bold",
                                                 },
                                                 padding: { left: 0, right: 10 },
                                             },
                                         },
                                     },
                                 }}
                             />
                                ) : <b style={{color:"red",fontFamily:"inital",marginTop:"50px"}}>Data Not available</b>}

                                { }
                          
                        
                        </div>
                        </center>
                        
                       
                    </Col>
                    <Col sm={4}>
                        <center>
                            <div
                                style={{
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                    height: "400px",
                                    width: "400px",
                                }}
                            >
                                {tableData.length > 0 ? versionMapGraph && versionMapGraph.datasets && (
                                     <Bar
                                     data={versionMapGraph}
                                     options={{
                                         responsive: true,
                                         plugins: {
                                             legend: { position: "top" },
                                             title: { display: true, text: "Train and Valid Images of MAP-50 & MAP-90 by Version ID" },
                                         },
                                         scales: {
                                             x: {
                                                 display: true,
                                                 title: {
                                                     display: true,
                                                     text: "Version ID",
                                                     color: "#000",
                                                     font: {
                                                         size: 10,
                                                         weight: "bold",
                                                     },
                                                     padding: { top: 10, bottom: 0 },
                                                 },
                                             },
                                             y: {
                                                 display: true,
                                                 title: {
                                                     display: true,
                                                     text: "Train Images",
                                                     color: "#000", // Customize the title color
                                                     font: {
                                                         size: 10,
                                                         weight: "bold", // Customize the title font size
                                                     },
                                                     padding: { left: 0, right: 10 }, // Adjust the title padding
                                                 },
                                             },
                                             y1: { // This is the second y-axis for "Valid Images"
                                                 position: 'right', // Place the y-axis on the right side
                                                 display: true,
                                                 title: {
                                                     display: true,
                                                     text: "Valid Images",
                                                     color: "blue", // Customize the title color
                                                     font: {
                                                         size: 10,
                                                         weight: "bold", // Customize the title font size
                                                     },
                                                     padding: { left: 10, right: 0 }, // Adjust the title padding
                                                 },
                                             },
                                         },
                                     }}
                                 />
                                ) : <b style={{color:"red",fontFamily:"inital",marginTop:"50px"}}>Data Not available</b>}
                            </div>
                        </center>
                    </Col>
                    <Col sm={4}>
                        <center>
                            <div
                                style={{
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                    height: "400px",
                                    width: "400px",
                                }}
                            >
                                {tableData.length > 0 ? classCountGraph && classCountGraph.datasets && (
                                    <Bar
                                        style={{ height: 350 }}
                                        data={classCountGraph}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: "top" },
                                                title: { display: true, text: "Valid Images by class count​" },
                                            },
                                            scales: {
                                                x: {
                                                    display: true,
                                                    title: {
                                                        display: true,
                                                        text: "Class",
                                                        color: "#000", // Optional: Customize the title color
                                                        font: {
                                                            size: 10,
                                                            weight: "bold"// Optional: Customize the title font size
                                                            // Optional: Customize the title font weight
                                                        },
                                                        padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
                                                    },
                                                },
                                                y: {
                                                    display: true,
                                                    title: {
                                                        display: true,

                                                        text: "Train images",
                                                        color: "#000", // Optional: Customize the title color
                                                        font: {
                                                            size: 12,
                                                            weight: "bold" // Optional: Customize the title font size
                                                            // Optional: Customize the title font weight
                                                        },
                                                        padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                ): <b style={{color:"red",fontFamily:"inital",marginTop:"50px"}}>Data Not available</b>}
                            </div>
                        </center>
                    </Col>
                </Row>
            </Row>
        </div>
    )
}

export default HistoricalScreen