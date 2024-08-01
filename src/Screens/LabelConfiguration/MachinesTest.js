/* eslint-disable */
import React, { useEffect, navigation, useState } from 'react';
import { Button, Container, Row, Col, FormGroup, Form, Input, Label, Table, InputGroup, } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, } from 'reactstrap';
import { TiPlus } from "react-icons/ti";
import '../../index.css';
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { FcPlus } from "react-icons/fc";
import { initial } from 'lodash';
import axios, { Axios } from 'axios';
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { Baseurl } from "../../Services/BaseUrl";


export default function MachinesTest(props) {
    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    const location = useLocation();
    const [classItem, setClassItem] = React.useState({
        Id: 0, classType: "", description: "", subclasses: [],
        created_date: "", modified_date: "", created_by: "", modified_by: ""
    });
    const [modal, setModal] = React.useState(false);
    const [ModalData, setModalData] = React.useState({
        id: 0,
        machineType: '',
        description: '',
        modified_by: 'SESSIONDATA.user_name',
    });
    const [machineTableData, setMachineTableData] = React.useState(); // this is for Table machine data

    const [classItemErrors, setClassItemErrors] = React.useState({
        machineTypeError: '',
        descriptionError: ''
    });

    const [rowIndex, setRowIndex] = React.useState(0);
    const [machinesData, setMachinesData] = React.useState([]); // machines dropdown
    const [ShowProgress, SetShowProgress] = React.useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    const loadModalData = (item) => {
        setModalData({
            id: item.id, machineType: item.machineType,
            description: item.description, created_by: item.modified_by
        });
    }
    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    useEffect(() => {
        console.log('machines load event...')

        SetShowProgress(true);
        fillMachinesDataFromSession();
        // loadMachinesData();
    }, []);

    const fillMachinesDataFromSession = () => {
        SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        console.log('SESSIONDATA:', SESSIONDATA.user_name);

        setMachinesData([]);
        setMachinesData(SESSIONDATA.machine_access);

        setMachineTableData(SESSIONDATA.machine_access);
        //setClassData(SESSIONDATA.machine_access[0].id);

    }


    const addClassItem = () => {



        if (classItem.classType == '') {
            //return alert('Please enter Machine');
            setClassItemErrors((history) => ({ ...history, machineTypeError: '* Please Enter Machine' }));
        }
        if (classItem.description == '') {
            //return alert('Please enter Description');
            setClassItemErrors((history) => ({ ...history, descriptionError: '* Please enter Description' }));
            return;
        }


        saveData(classItem);

    }

    const saveData = (data) => {

        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        var data = JSON.stringify({
            "machineIdName": data.classType,
            "classIdName": "",
            "subClassName": "",
            "description": data.description,
            "created_by": SESSIONDATA.user_name,
            "created_date": data.created_date
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/insertlabels`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                console.log('post result', result);
                setClassItem({ Id: 0, classType: "", description: "", subclasses: [], created_by: "" });
                if (result.data.status === 200) {
                    alert(result.data.message);
                    loadSession();
                    fillMachinesDataFromSession();
                }
                else {
                    alert(`Status: ${result.data.message}`);
                }
            })
            .catch(error => console.log('error', error));
    }

    const submitData = (validation) => {

        if (!validation) {
            toggle();
            setModal(true);
            return;
        }


        if (ModalData.machineType == '') {
            return alert('Please enter the Machine Type');
        }


        if (ModalData.description == '') {
            return alert('Please enter the Description');
        }



        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);


        var payload = {
            "name": ModalData.machineType,
            "description": ModalData.description,
            "id": ModalData.id,
            "modified_by": SESSIONDATA.user_name
        };

        var data = JSON.stringify(payload);
        console.log("SUBMIT POST ModalData PAYLOAD" + data);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/updatemachine`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                alert(result.data.message);
                loadSession();
                toggle();
                modalCallBack();
               
                return;
            })
            .catch(error => console.log('error', error));
    }

    const loadSession = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWRtaW4iLCJleHAiOjE2Nzg4NjkwMzh9.JXWz7eHgDWuWtD6VAHBEQVyRBfFhbnMqfvnhKFORyok");
        var raw = JSON.stringify({
            "email": localStorage.getItem('USERNAME'),
            "password": localStorage.getItem('PASSWORD')
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${Baseurl}/loginuser`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('post result', result);
                if (result && result.Status === 200) {
                    localStorage.setItem('TOKEN', result.token);
                    localStorage.setItem('SESSIONDATA', JSON.stringify(result));
                    localStorage.setItem('sessionstart', new Date());

                    fillMachinesDataFromSession();
                } else {
                    alert("Invalid User Credentials");
                }

            })
            .catch(error => {
                var er = error;
                alert('error', error);
            }
            );
    }

    const modalCallBack = () => {
        toggle();
        fillMachinesDataFromSession();
    }

    const rowClick = (index) => {
        setRowIndex(index);
    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'classTitle':
                setClassItem((history) => ({ ...history, classType: value }));
                break;
            case 'classDescription':
                setClassItem((history) => ({ ...history, description: value }));
                break;
            case 'machineName':
                setModalData((history) => ({ ...history, machineType: value }));
                break;
            case 'machineDescription':
                setModalData((history) => ({ ...history, description: value }));
                break;
            default:
                break;
        }
    };




    return (
        <div style={{ backgroundColor: "#F5F5F5", height: "100%", margin: 0, position: "fixed", width: "100%" }}>

            <Row>
                <Col md="2" style={{ backgroundColor: "#F5F5F5", marginLeft: "20px" }}>


                    {/* <Card style={{ marginBottom: "50px", borderColor: 'green', marginTop: "60px" }}>
                        <CardBody> */}

                    <tr >
                        <td >

                            <h6
                                for="classTitle"

                                style={{
                                    fontFamily: "initial", color: "green", marginTop: "75px",
                                    marginLeft: "20px", fontWeight: "bold", fontSize: "20px"
                                }}
                            >

                                <TiPlus /> Add New Machine

                            </h6>
                        </td>
                    </tr>

                    <tr>
                        <td>

                        <Label
                                for="classTitle">
                                <h6 style={{ fontFamily: "initial", color: "black", marginRight: "40px", marginTop: "20px", fontFamily: "initial" }}> Enter Machine Type :</h6>
                            </Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Input
                                id="classTitle"
                                name="classTitle"
                                addClassItem type="text"
                                value={classItem.classType}
                                onChange={e => handleInput(e)}
                                style={{ marginLeft: "30px", borderBlockEnd: "green" }}
                            />

                            {classItemErrors.machineTypeError.length > 0 ? <p style={{ color: "red", fontFamily: "initial" }}>
                                {classItemErrors.machineTypeError}
                            </p> : <></>}
                        </td>
                    </tr>


                    <td>
                        <tr>
                            <Label
                                for="classDescription"

                            >
                                <h6 style={{ fontFamily: "initial", color: "black", marginTop: "20px", marginLeft: "30px", marginRight: "40px", fontFamily: "initial" }}> Machine Description :</h6>
                            </Label>
                        </tr>
                    </td>

                    <tr>
                        <td>
                            <Input
                                id="classDescription"
                                name="classDescription"
                                type="text"
                                value={classItem.description}
                                onChange={e => handleInput(e)}
                                style={{ marginLeft: "30px", height: 60 }}
                            />
                            {classItemErrors.descriptionError.length > 0 ? <p style={{ color: "red", fontFamily: "initial" }}>
                                {classItemErrors.descriptionError}
                            </p> : <></>}

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button color='success' onClick={() => addClassItem()} style={{
                                backgroundColor: "linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%)", fontFamily: "initial", textAlign: "middle"
                                , marginTop: "40px", marginLeft: "40px", height: 40, width: 100, fontWeight: "bold"
                            }}>
                                Save
                            </Button>

                        </td>
                    </tr>
                    {/* 
                        </CardBody>
                    </Card> */}
                </Col>
                <Col md="7" style={{ marginLeft: "3%", marginTop: "1px" }}>
                    <h5 style={{
                        fontFamily: "initial",
                        color: "#438a5e", marginRight: "660px", backgroundColor: "#D7EDDB",
                        marginBottom: "10px", marginTop: "10px", marginLeft: "1px",
                        fontWeight: "Bold",
                    }}>Machine Management</h5>

<div style={{ height: 540, position: "sticky", width: "100%", overflow: "scroll" }}>
    <Table striped hover>
        <thead className="sticky-top top-0" style={{ marginTop: "-20px" }}>
            <tr style={{ backgroundColor: "#438a5e" }} >
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Id</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Machine Type</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Machine Description</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Modified By</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Modified Date</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Created By</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Created Date</th>
                <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>Edit</th>
            </tr>
        </thead>

        <tbody>
            {machineTableData != null && machineTableData.length > 0 ? machineTableData.map((item, index) => {
                const rowClass = index % 2 === 0 ? 'table-row-even' : 'table-row-odd';
                return (
                    <tr 
                        key={index} 
                        onClick={() => rowClick(index)} 
                        // className={rowClass} 
                        className='tr1'
                    >
                        <th className='th1' scope="row" style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.id}
                        </th>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.machineType}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.description}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.modified_by}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.modified_date}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.created_by}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            {item.created_date}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                            <Button color="warning" onClick={() => {
                                toggle();
                                loadModalData(item);
                            }} size="sm">
                                <BsPencilFill />
                            </Button>
                        </td>
                    </tr>
                )
            }) : 
            <tr>
                <td colSpan={8} className="text-center" style={{ fontFamily: "initial", color: "red" }}>
                    <b>Data not available</b>
                </td>
            </tr>}
        </tbody>
    </Table>
</div>




                    <div>

                        <Modal funk={true} isOpen={modal} toggle={toggle}>
                            <ModalHeader toggle={toggle} style={{
                                fontFamily: "initial", backgroundColor: "#438a5e",
                                color: "white"
                            }}>
                                Update Machine Details</ModalHeader>
                            <ModalBody style={{ marginLeft: "70px" }}>
                                <Label
                                    for="machine"
                                    sm={4} style={{ fontWeight: "bold", fontFamily: "initial", marginTop: "-20px" }}
                                >
                                    Machine Type
                                </Label>

                                <Input
                                    name="machineName"
                                    type="text"
                                    value={ModalData.machineType}
                                    defaultValue={ModalData.machineType}
                                    onChange={(e) => handleInput(e)}
                                    style={{ fontFamily: 'initial', width: '80%' }}
                                />


                                <Label
                                    for="exampleText"
                                    sm={3} style={{ fontFamily: "initial", marginTop: "30px", fontWeight: "bold" }}
                                >
                                    Description:
                                </Label>
                                <Input
                                    name="machineDescription"
                                    type="textarea"
                                    value={ModalData.description}
                                    defaultValue={ModalData.description}
                                    onChange={(e) => handleInput(e)}
                                    style={{ fontFamily: 'initial', width: '80%' }}
                                />
                                <Button style={{ backgroundColor: "green", fontFamily: "initial", marginTop: "20px", marginLeft: "70px" }}
                                    onClick={() => submitData(true)}>
                                    Update
                                </Button>{' '}
                                <Button style={{ backgroundColor: "red", fontFamily: "initial", marginTop: "20px", marginLeft: "60px" }}
                                    onClick={toggle}>
                                    Cancel
                                </Button>
                            </ModalBody>
                            {/* <ModalFooter>
                                
                            </ModalFooter> */}
                        </Modal>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

