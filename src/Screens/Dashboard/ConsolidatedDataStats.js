/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Baseurl } from "../../Services/BaseUrl";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from "chart.js";
import { CardBody, Label, Table } from 'reactstrap';

ChartJS.register( CategoryScale,LinearScale, PointElement,LineElement,Title,Tooltip,Legend);

const HomeScreen = () => {
    ///Machine dropdown
    const [MachineID, setMachineID] = React.useState([1]);
    const [machinesData, setMachinesData] = React.useState([]);
    const [statusMessage, setStatusMessage] = React.useState("");
    ///Class dropdown
    // Sub Class
    const [subClass, setSubClass] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totaldata, settotaldata] = useState("");
    const [rowIndex, setRowIndex] = React.useState(0);
    const [dropdownvalue, setdropdownvalue] = React.useState("1");
    useEffect(() => {
        console.log('image screen start event...')
        setStatusMessage("");
        fillMachinesDataFromSession();
    }, []);

    const fillMachinesDataFromSession = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        console.log(SESSIONDATA)
        setMachinesData(SESSIONDATA.machineType);
        setMachinesData(SESSIONDATA.machine_access);
        setMachineID(SESSIONDATA.machine_access[0].id);
        setTableData()
        DataStats(SESSIONDATA.machine_access[0].id);
        console.log(machinesData)
    }
    const rowClick = (index) => {
        setRowIndex(index);
    }

    const handleMachineChange = (e) => {
        const { value } = e.target;
        setMachineID(value);
        DataStats(value);
    };

    function DataStats(value) {
        const token = localStorage.getItem('TOKEN');
        const data = JSON.stringify({
            machineId: value,
        });
        const config = {
            method: "post",
            url: `${Baseurl}/dashdatastats`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                console.log('API response:', result.data);
                setTableData(result.data.table_data);
                settotaldata(result.data)
                console.log(totaldata, "122222222333333333333")
            })
            .catch(error => {
                console.error('API request error:', error);
            });


    }
    return (
        <Table style={{ backgroundColor: "#F5F5F5", overflow: 'hidden', height: "100%", margin: 0, position: "fixed" }}>
            <Row>
                <Col md="7" style={{ backgroundColor: "#F5F5F5", marginLeft: "50px", marginTop: "1px" }}>
                    <h5 style={{
                        fontFamily: "initial",
                        color: "#438a5e", marginRight: "520px", backgroundColor: "#D7EDDB",
                        marginBottom: "1px", marginTop: "10px", marginLeft: "40px",
                        fontWeight: "Bold"
                    }}>Consolidated Data Statistics</h5>
                </Col>
            </Row>
            <Row >
                <Col sm={2} style={{ marginLeft: "57%" }}>
                    <Label
                        for="machine"
                        style={{
                            fontFamily: "initial", color: "black", marginTop: "5px",
                            marginBottom: "-2px", font: "revert-layer", marginLeft: "-170px",backgroundColor: 'whitesmoke'
                        }}>
                        Select Machines :
                    </Label>
                    <select value={MachineID} onChange={handleMachineChange} style={{ width: "80%", height: 40, marginTop: "1px", fontFamily: "initial", marginLeft: "10px" }}>
                        {machinesData != null && machinesData.map((item, index) => {
                            return <option key={index} value={item.id}>{item.machineType}</option>
                        })}
                    </select>
                  
                </Col>

            </Row>
            <Table>
            </Table>
            <div>
                <Row >
                    <Col md={9} style={{  marginLeft: "30px" }}>
                        <div style={{ height: '500px', overflowY: 'scroll', position: "sticky" }}>
                            <table className="table table-fixedheader table-bordered  table-responsive" >
                                <thead style={{ backgroundColor: "#438a5e", position: "sticky", top: "0", fontSize: "20px" }}>
                                    <tr style={{ backgroundColor: "lightblue" }}>
                                        <th colspan="4" style={{ fontSize: "15px", marginLeft: "10px", backgroundColor: "#001f3f", color: "white" }}>
                                            Current Model
                                        </th>
                                        <th colspan="1"style={{ marginLeft: "30px", fontSize: "15px", marginLeft: "20px", backgroundColor: "#001f3f" , color: "white"}}>
                                            Upload
                                        </th>
                                        <th colspan="3" style={{ marginLeft: "30px", fontSize: "15px", backgroundColor: "#001f3f", color: "white" }}>
                                            Qc Validation
                                        </th>
                                        <th style={{ marginLeft: "30px", fontSize: "15px", backgroundColor: "#001f3f" , color: "white"}}>
                                            Live
                                        </th>
                                        <th colspan="3" style={{ marginLeft: "30px", fontSize: "15px", backgroundColor: "#001f3f" , color: "white"}}>
                                            Qc Validation
                                        </th>
                                    </tr>
                                    <tr className='tableth' style={{ color: "white" }}>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Machine</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}> Class</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Sub Class</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Current Images</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Upload Images</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Upload Qc Pending</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue"}}>Upload Valid</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue"}}>Upload Invalid</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Live image Count</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Live Qc Pending</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Live Valid</th>
                                        <th style={{ fontSize: "13px", backgroundColor: "lightblue" }}>Live Invalid</th>
                                        {/* <th className='fontth'>Annotations</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData != null && tableData.map((item, index) => {
                                        return (
                                            <tr className='table-warning' key={index} onClick={() => rowClick(index)}>
                                                <td >{item.machine_name}</td>
                                                <td>{item.class_name}</td>
                                                <td>{item.subclass_name}</td>
                                                <td>{item.total_model_images_trained}</td>
                                                <td>{item.upload_image_count}</td>
                                                <td>{item.upload_QC_pending}</td>
                                                <td>{item.upload_Valid}</td>
                                                <td>{item.upload_Invalid}</td>
                                                <td>{item.live_image_count}</td>
                                                <td>{item.live_QC_pending}</td>
                                                <td>{item.live_Valid}</td>
                                                <td>{item.live_Invalid}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tbody>
                                    <tr className='table-success'  >
                                        <td>{totaldata.total_machines}</td>
                                        <td>{totaldata.total_class}</td>
                                        <td>{totaldata.total_subclass}</td>
                                        <td>{totaldata.total_model_images_trained}</td>
                                        <td>{totaldata.total_upload_image}</td>
                                        <td>{totaldata.total_upload_QC_pending}</td>
                                        <td>{totaldata.total_upload_Valid}</td>
                                        <td>{totaldata.total_upload_Invalid}</td>
                                        <td>{totaldata.total_live_image}</td>
                                        <td>{totaldata.total_live_QC_pending}</td>
                                        <td>{totaldata.total_live_Valid}</td>
                                        <td>{totaldata.total_live_Invalid}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </div>
        </Table>
    )
}

export default HomeScreen
