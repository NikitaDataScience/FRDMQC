/* eslint-disable */
// import logo from './logo.svg';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Button, Container, Badge, Row, Col, FormGroup, Form, Input, Label, Table, InputGroup } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Spinner } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import PropTypes from 'prop-types';
//import AddRows from '../../AddRows';
// import '../index.css';
import { useLocation, Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FcPlus } from "react-icons/fc";
import axios from 'axios';
import { TiPlus } from "react-icons/ti";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { Baseurl } from "../../Services/BaseUrl";


export default function ClassTest(props) {
    const location = useLocation();
    console.log(location);
    var MachineID = new URLSearchParams(location.search).get('id');
    if (MachineID === null) MachineID = 1;
    const [selectedMachineId, setselectedMachineId] = React.useState(MachineID);
    const [machinesData, setMachinesData] = React.useState([]);
    const [classes, setClasses] = React.useState([]);
    const [machines, setMachines] = React.useState([]);
    const [classData, setClassData] = React.useState();
    const [classItem, setClassItem] = React.useState({
        Id: 0, classType: "", description: "", subclasses: [],
        created_date: "", modified_date: "", created_by: "", modified_by: ""
    });
    const [modal, setModal] = React.useState(false);
    const [rowIndex, setRowIndex] = React.useState(0);
    const [ShowProgress, SetShowProgress] = React.useState(false);

    //const toggle = () => setModal(!modal);

    const [ModalData, setModalData] = React.useState({
        id: 0,
        classType: "",
        description: "",
        modified_by: "",

    });

    const [classItemErrors, setClassItemErrors] = React.useState({
        ClassTypeError: '',
        descriptionError: '',
    });

    const toggle = () => {
        setModal(!modal);
    }
    const loadModalData = (item) => {
        setModalData({ id: item.id, classType: item.classType,
             description: item.description, modified_by: item.modified_by });
    }

    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    useEffect(() => {
        console.log('classes load event...')
        SetShowProgress(true);
        fillMachinesDataFromSession();
        //fillMachinesData(); // fill machines drop down
        fillClassesData(MachineID); // fill classesData state for table 
        SetShowProgress(false);


    }, []);

    const fillMachinesDataFromSession = () => {
        
        console.log('SESSIONDATA:', SESSIONDATA.user_name);
        setMachinesData([]);
        setMachinesData(SESSIONDATA.machine_access);
        setMachines(SESSIONDATA.machine_access);
        setselectedMachineId(SESSIONDATA.machine_access[0].id);
        //fillClassesData(SESSIONDATA.machine_access[0].id);
        // fillSubClassesData(SESSIONDATA.machine_access[0].id);
    }




    const fillMachinesData = () => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${Baseurl}/machinedropdown`,
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        };
        axios.request(config)
            .then(result => {
                console.log(result.data);
                setMachinesData(result.data);
                setMachines(result.data);
            })
            .catch(error => console.log('error', error));
    }

    const fillClassesData = (MachineID) => {

        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);


        var array = [parseInt(MachineID)];
        var data = JSON.stringify({

            "machineId": array
        });


        SetShowProgress(true);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/classdropdown`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                console.log(result.data);

                setClassData(result.data);
            })
            .catch(error => console.log('error', error))
            .finally(res => { SetShowProgress(false); });
    }

    const addClassItem = () => {

        if (classItem.classType === '') {
            setClassItemErrors((history) => ({ ...history, ClassTypeError: '* Please Enter Class' }));
            return;


        }

        if (classItem.description === '') {
            setClassItemErrors((history) => ({ ...history, descriptionError: '* Please Enter Description' }));
            return;
        }

        saveData(classItem);
    }

    // const removeItem = (index) => {
    //     setClassData(
    //         classData.filter(a => a.id !== index)
    //     );
    // }

    const saveData = (data) => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        // if (machineDDLValue <= 0 ||  data.classType === "" || data.description === "") {
        //     alert("Please enter all data.");
        //     return;
        // }

        var data = JSON.stringify({
            "machineIdName": selectedMachineId.toString(),
            "classIdName": data.classType,
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
                console.log('post result', result.data);
                setClassItem({ Id: 0, classType: "", description: "", subclasses: [], created_by: "" });
                if (result.data.status === 200) {
                    // setClassItem((history) => ({ ...history, classType: "" }));
                    // setClassItem((history) => ({ ...history, description: "" }));
                    alert(result.data.message);
                   //loadSession();
                 //  fillMachinesDataFromSession();
                   fillClassesData(selectedMachineId); // fill classesData state for table 
                }
                else {
                    alert(`Status: ${result.data.message}`);
                    // alert("Duplicate value");
                    //alert("Error : " + result.message);
                }
            })
            .catch(error => console.log('error', error));
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
            case 'className':
                setModal(true);
                setModalData((history) => ({ ...history, classType: value }));
                break;
            case 'classDescriptions':
                setModal(true);
                setModalData((history) => ({ ...history, description: value }));
                break;
            default:
                break;
        }

    }

    const handleDropdown = (e) => {
        const { name, value } = e.target;
        console.log("dropdown value : " + value);
        setselectedMachineId(value);
        //call fetch api with machin id : value
        fillClassesData(value); // fill classesData state for table 

    }

    const rowClick = (index) => {
        setRowIndex(index);

    }

    const submitData = (validation) => {

        if (!validation) {
            toggle();
            setModal(false);
            return;
        }


        if (ModalData.classType === '') {
            return alert('Please enter the Class Title');
        }


        if (ModalData.description === '') {
            return alert('Please enter the Description');
        }



        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);


        var payload = {
            "name": ModalData.classType,
            "description": ModalData.description,
            "id": ModalData.id,
            "modified_by": SESSIONDATA.user_name
        };

        var data = JSON.stringify(payload);
        console.log("SUBMIT POST ModalData PAYLOAD" + data);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/updateclass`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                alert(result.data.message);
                toggle();
                modalCallBack(selectedMachineId);
                return;
            })
            .catch(error => console.log('error', error));
    }
    const modalCallBack = (value) => {
        toggle();
        fillClassesData(value);
       
    }


    return (
        <div style={{ backgroundColor: "#F5F5F5", height: "100%", margin: 0, position: "fixed", width: "100%" }}>

            <Row>
                <Col md="2" style={{ backgroundColor: "#F5F5F5", marginLeft: "20px" }}>

                    <tr >
                        <td >

                            <h6
                                for="classTitle"

                                style={{
                                    fontFamily: "initial", color: "green", marginTop: "75px",
                                    marginLeft: "20px", fontWeight: "bold", fontSize: "20px"
                                }}
                            >

                                <TiPlus /> Select Machine Name :


                            </h6>
                        </td>
                    </tr>

                    <tr >
                        <td>
                            <select value={selectedMachineId} onChange={e => handleDropdown(e)}
                                style={{ width: "90%", fontFamily: "initial", marginLeft: "30px", height: 40 }}>
                                {machines != null && machines.map((item) => {
                                    return <option value={item.id}>{item.machineType}</option>;
                                    // (<option value={item.id}>{item.machineType}</option>)
                                })}
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <h6
                                for="classTitle"

                                style={{
                                    fontFamily: "initial", color: "black", marginTop: "20px",
                                    marginRight: "-90px", color: "green", marginLeft: "20px", fontWeight: "bold",
                                    fontSize: "20px"
                                }}
                            >

                                <TiPlus style={{ marginRight: "5px" }} />Add New Class
                            </h6>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Label
                                for="classTitle"

                            >
                                <h6 style={{ fontFamily: "initial", color: "black", marginTop: "20px", marginLeft: "1px", marginRight: "60px" }}> Enter Class Name:</h6>
                            </Label>
                        </td>
                    </tr>
                    <tr >
                        <td>
                            <Input
                                id="classTitle"
                                name="classTitle"
                                type="text"
                                value={classItem.classType}
                                onChange={e => handleInput(e)}

                                style={{ marginLeft: "30px" }}
                            />
                            {classItemErrors.ClassTypeError.length > 0 ? <p style={{ color: "red" }}>
                                {classItemErrors.ClassTypeError}
                            </p> : <></>}
                        </td>
                    </tr>

                    <tr >
                        <td>
                            <Label
                                for="classDescription"
                            >
                                <h6 style={{ fontFamily: "initial", color: "black", marginRight: "60px", marginTop: "20px" }}>Class Description:</h6>
                            </Label>
                        </td>
                    </tr>
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
                            {classItemErrors.descriptionError.length > 0 ? <p style={{ color: "red" }}>
                                {classItemErrors.descriptionError}
                            </p> : <></>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button color='success' onClick={() => addClassItem()}
                                style={{
                                    backgroundColor: "linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%)",
                                    fontWeight: "Bold", textAlign: "middle", marginTop: "20px", marginLeft: "50px", height: 40, width: 100

                                }}>
                                Save
                            </Button>
                        </td>
                    </tr>


                    {/* </CardBody>
                    </Card> */}
                </Col>
                <Col md="7" style={{ marginLeft: "2%", marginTop: "1px" }}>
                    <h5 style={{
                        fontFamily: "initial",
                        color: "#438a5e", marginRight: "660px", backgroundColor: "#D7EDDB",
                        marginBottom: "10px", marginTop: "10px", marginLeft: "1px",
                        fontWeight: "Bold"
                    }}>Class Management</h5>


<div style={{ height: 540, position: "sticky", width: "100%", overflow: "scroll" }}>
    <Table striped hover>
        <thead className="sticky-top top-0" style={{ marginTop: "-20px" }}>
        <tr style={{ backgroundColor: "#438a5e" }}>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Id

                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", backgroundColor: "#438a5e" }}>
                                        Machine Name
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Class Type
                                    </th>

                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Class Description
                                    </th>

                                    <th style={{ fontFamily: "initial", color: "white", backgroundColor: "#438a5e" }}>
                                        Modified By
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Modified Date
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Created By
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Created Date
                                    </th>

                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Edit
                                    </th>
                                    {/* <th style={{ fontFamily: "initial", color: "white", textAlign: "left" ,backgroundColor: "#438a5e" }}>
                                        Add New SubClass
                                    </th> */}
                                </tr>

        </thead>

        <tbody>
        {classData != null && classData.length > 0 ? classData.map((item, index) => {
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
                        {item.machine_name}
                        </td>
                        <td style={{ fontFamily: "initial", textAlign: "left" }}>
                        {item.classType}
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
                            Update Class Details</ModalHeader>
                        <ModalBody style={{ marginLeft: "70px" }}>
                            <Label
                                for="class"
                                sm={4} style={{ fontWeight: "bold", fontFamily: "initial", marginTop: "-20px" }}
                            >
                                Class Type
                            </Label>

                            <Input
                                name="className"
                                type="text"
                                value={ModalData.classType}
                                defaultValue={ModalData.classType}
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
                                name="classDescriptions"
                                type="text"
                                value={ModalData.description}
                                defaultValue={ModalData.description}
                                onChange={(e) => handleInput(e)}
                                style={{ fontFamily: 'initial', width: '80%' }}
                            />
                            <Button style={{ backgroundColor: "green", fontFamily: "initial", marginTop: "20px", marginLeft: "70px" }}
                                onClick={() => submitData(true)}>
                                Update
                            </Button>{' '}
                            {/* <button className="btn btn-outline-success my-2 my-sm-0" type="submit"   onClick={() => submitData(true)}
                             style={{  marginTop: "40px", marginLeft: "60px" }}> Update</button>{' '}
                            <button className="btn btn-outline-danger my-2 my-sm-0" type="submit" onClick={toggle}
                             style={{  marginTop: "40px", marginLeft: "60px" }}>Cancel</button> */}
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

