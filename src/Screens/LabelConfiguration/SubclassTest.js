/* eslint-disable */
// import logo from './logo.svg';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Button, Container, Row, Col, FormGroup, Form, Input, Label, Table, InputGroup } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from 'reactstrap';
//import AddRows from '../../AddRows';
import { useLocation } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FcPlus } from "react-icons/fc";
import axios from 'axios';
import { TiPlus } from "react-icons/ti";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs"
import { Baseurl } from "../../Services/BaseUrl";

export default function SubclassTest(props) {

    const location = useLocation();
    console.log(location);
    let ClassID = new URLSearchParams(location.search).get('id');
    let MachineID = new URLSearchParams(location.search).get('machineId');
    console.log('Sub CLasses Paramereters ClassID:', ClassID);
    console.log('Sub CLasses Paramereters MachineID:', MachineID);

    if (MachineID == null) MachineID = 1;
    if (ClassID == null) ClassID = 13;

    const [machinesData, setMachinesData] = React.useState([]);
    const [subclasses, setSublasses] = React.useState([]);
    const [classes, setClasses] = React.useState([]);
    const [machines, setMachines] = React.useState([]);
    const [ages, setAges] = React.useState([]);
    const [classData, setClassData] = React.useState();
    const [subclassData, setSubClassData] = React.useState();
    const [classItem, setClassItem] = React.useState({
        Id: 0, classType: "", description: "", subclasses: [],
        created_date: "", modified_date: "", created_by: "", modified_by: ""
    });
    const [modal, setModal] = React.useState(false);
    const [rowIndex, setRowIndex] = React.useState(0);
    const [machineDDLValue, setMachineDDLValue] = React.useState(MachineID);

    const [classDDLValue, setClassDDLValue] = React.useState(ClassID);
    const [ShowProgress, SetShowProgress] = React.useState(false);


    //const toggle = () => setModal(!modal);

    const [ModalData, setModalData] = React.useState({
        id: 0,
        subclassType: "",
        description: "",
        modified_by: "",
    });

    const [classItemErrors, setClassItemErrors] = React.useState({
        subclassTypeeError: '',
        descriptionError: ''
    });

    const toggle = () => {
        setModal(!modal);
    }
    const loadModalData = (item) => {
        setModalData({
            id: item.id, subclassType: item.subclassType,
            description: item.description, modified_by: item.modified_by
        });
    }
    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    useEffect(() => {
        console.log('classes load event...')
        SetShowProgress(true);
        fillMachinesDataFromSession();
        // fillMachinesData(); // fill machines drop down



    }, []);


    const fillMachinesDataFromSession = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        console.log('SESSIONDATA:', SESSIONDATA.user_name);

        setMachinesData([]);
        setMachinesData(SESSIONDATA.machine_access);
        setMachines(SESSIONDATA.machine_access);
        setMachineDDLValue(SESSIONDATA.machine_access[0].id);

        fillClassesData(SESSIONDATA.machine_access[0].id); // fill classes drop down, you have to get all classes data need new API
        // fillSubClassesData(ClassID); // fill table data t
        SetShowProgress(false);
    }

    const fillClassesData = (MachineID) => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);


        setClassData([]);
        setSubClassData([]);
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
                // result.unshift({
                //     "id": 0,
                //     "classType": "Please Select Class"
                // });
                console.log("Class Data:", result.data);
               
                if (result.data != undefined && result.data.length > 0) {
                    setClassData(result.data);
                    setClassDDLValue(result.data[0].id);
                    fillSubClassesData(result.data[0].id);
                }
                else {
                    setClassDDLValue(0);
                    fillSubClassesData([]);
                }

            })
            .catch(error => console.log('error', error));

    }

    const fillSubClassesData = (id) => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer " + token);
        setSubClassData([]);

        var data = JSON.stringify({
            "machineId": [parseInt(machineDDLValue)],
            "classId": [parseInt(id)]
        });

        // var requestOptions = {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: raw,
        //     redirect: 'follow'
        // };


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/subclassdropdown`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios.request(config)
            .then(result => {
                console.log(result.data);
                setSubClassData(result.data);
                console.log('subclasses', result.data);

            })
            .catch(error => console.log('error', error));
    }

    const addClassItem = () => {
        if (classItem.classType == '') {

            setClassItemErrors((history) => ({ ...history, subclassTypeeError: '* Please enter the Subclass' }));
            // return alert('Please enter Subclass')

        }

        if (classItem.description == '') {
            //return alert('Please enter Description');
            setClassItemErrors((history) => ({ ...history, descriptionError: '* Please enter the Description' }));
            return;
        }


        saveData(classItem);
    }

    const saveData = (data) => {

        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);

        if (machineDDLValue <= 0 || classDDLValue <= 0 || data.classType === "" || data.description === "") {
            alert("Please enter all data.");
            return;
        }

        var data = JSON.stringify({
            "machineIdName": machineDDLValue.toString(),
            "classIdName": classDDLValue.toString(),
            "subClassName": data.classType,
            "description": data.description,
            "created_by": SESSIONDATA.user_name,
            "created_date": data.created_date

        });

        // alert(data);

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
                    // setClassItem((history) => ({ ...history, subclassType: "" }));
                    // setClassItem((history) => ({ ...history, description: "" }));
                    // alert(result.data.message);
                    // alert(machineDDLValue);
                    // alert(classDDLValue);
                    // fillClassesData(machineDDLValue); // fill classes drop down, you have to get all classes data need new API
                    fillSubClassesData(classDDLValue); // fill table data t
                    //loadSession();
                    // fillMachinesDataFromSession();
                }
                else {

                    alert("Duplicate value");
                    // alert("Error : " + result.data.message);
                }
            })
            .catch(error => console.log('error', error));
    }

    const removeItem = (index) => {
        setClassData(
            classData.filter(a => a.id !== index)
        );
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
            case 'subclassName':
                setModal(true);
                setModalData((history) => ({ ...history, subclassType: value }));
                break;
            case 'subclassDescription':
                setModal(true);
                setModalData((history) => ({ ...history, description: value }));
                break;
            default:
                break;
        }

    }

    const rowClick = (index) => {
        setRowIndex(index);
        // alert(`Row Clicked ${index}`);
    }

    const refreshData = (e) => {
        const { name, value } = e.target;
        console.log("dropdown value : " + value);

        if (name === "machineddl") {
            setMachineDDLValue(value);
            fillClassesData(value);
        }

        if (name === "classddl") {
            setClassDDLValue(value);
            //call fetch api with machin id : value
            fillSubClassesData(value); // fill classesData state for table 
        }


    }

    const submitData = (validation) => {

        if (!validation) {
            toggle();
            setModal(false);
            return;
        }


        if (ModalData.subclassType == '') {
            return alert('Please enter the Subclass Title');
        }


        if (ModalData.description == '') {
            return alert('Please enter the Description');
        }

        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);


        var payload = {
            "name": ModalData.subclassType,
            "description": ModalData.description,
            "id": ModalData.id,
            "modified_by": SESSIONDATA.user_name
        };

        var data = JSON.stringify(payload);
        console.log("SUBMIT POST ModalData PAYLOAD" + data);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/updatesubclass`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                alert(result.data.message);
                // alert(machineDDLValue);
                //     alert(classDDLValue);
                toggle();
                modalCallBack(machineDDLValue);
                return;
            })
            .catch(error => console.log('error', error));
    }


    const modalCallBack = (machineDDLValue) => {
        toggle();
        fillClassesData(machineDDLValue);

    }

    return (
        <div div style={{ backgroundColor: "#F5F5F5", height: "100%", margin: 0, position: "fixed", width: "100%" }}>
            <Row>
                <Col Col md="2" style={{ backgroundColor: "#F5F5F5", marginLeft: "20px", marginTop: "30px" }}>
                    {/* <Card style={{ borderColor: 'green', marginTop: "60px" }}>
                        <CardBody> */}


                    <tr>
                        <td>
                            <Label
                                for="machine"

                                style={{
                                    fontFamily: "initial", color: "black", marginTop: "10px",
                                    marginLeft: "20px", marginRight: "40px"
                                }} >
                                Select Machine Name :

                            </Label>
                        </td>
                    </tr>

                    <tr >
                        <td>

                            <select value={machineDDLValue} style={{ width: "90%", marginTop: "1px", marginLeft: "30px", height: 40 }} onChange={(e) => refreshData(e)} name="machineddl">
                                {machines.map((item, index) => {
                                    return <option key={index} value={item.id}>{item.machineType}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Label
                                for="classes"
                                style={{ fontFamily: "initial", color: "black", marginTop: "20px", marginLeft: "5px", marginRight: "40px", }} >
                                Select Classes Name :
                            </Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select value={classDDLValue} style={{ width: "90%", height: 40, marginTop: "1px", marginLeft: "30px" }} onChange={(e) => refreshData(e)} name="classddl">
                                {classData != null && classData.map((item, index) => {
                                    return <option key={index} value={item.id}>{item.classType}</option>
                                })}
                            </select>
                        </td>
                    </tr>



                    <tr>
                        <td>
                            <Label
                                for="classTitle"
                                style={{
                                    fontFamily: "initial", color: "green", marginTop: "20px",
                                    marginRight: "-90px", fontWeight: "bold", fontSize: "20px"
                                }}
                            >

                                <TiPlus style={{ fontFamily: "initial", color: "green" }} />  Add New Subclass
                            </Label>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Label
                                for="classTitle"

                            >
                                <h6 style={{ fontFamily: "initial", color: "black", marginTop: "10px", marginRight: "30px" }}>
                                    Enter SubClass Name:</h6>
                            </Label>
                        </td>
                    </tr>
                    <tr>
                        <td>

                            <Input
                                id="classTitle"
                                name="classTitle"
                                type="text"
                                value={classItem.classType}
                                onChange={e => handleInput(e)}
                                style={{ marginLeft: "30px" }}
                            />
                            {classItemErrors.subclassTypeeError.length > 0 ? <p style={{ color: "red", fontFamily: "initial" }}>
                                {classItemErrors.subclassTypeeError}
                            </p> : <></>}
                        </td>
                    </tr>


                    <tr>
                        <td>
                            <Label
                                for="classDescription"

                            >

                                <h6 style={{ fontFamily: "initial", color: "black", marginTop: "20px", marginRight: "40px" }}> Subclass Description:</h6>
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
                            {classItemErrors.descriptionError.length > 0 ? <p style={{ color: "red", fontFamily: "initial" }}>
                                {classItemErrors.descriptionError}
                            </p> : <></>}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Button color='success' onClick={() => addClassItem()} style={{
                                backgroundColor: "linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%)",
                                fontFamily: "initial", textAlign: "middle", marginTop: "20px", marginLeft: "40px", marginBottom: "2px",
                                marginLeft: "50px", height: 40, width: 100, fontWeight: "bold"
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
                    }}>Subclass Management</h5>
                    <div style={{ height: 540, backgroundColor: '#F5F5F5', position: "sticky", width: "100%", overflow: "scroll" }}>
                        <table class="table table-fixedheader table-bordered  table-responsive">
                            <thead className="sticky-top top-0" style={{ marginTop: "-20px" }}>
                                <tr style={{ backgroundColor: "#438a5e" }}>
                                    <th style={{ fontFamily: "initial", color: "white", backgroundColor: "#438a5e" }}>
                                        Id
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        ClassName
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        SubClasess
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        SubClasses Description
                                    </th>

                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
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

                                </tr>
                            </thead>
                            <tbody>
                                {subclassData != null && subclassData.length > 0 ? subclassData.map((item, index) => {
                                    console.info('subclassData', subclassData);
                                    return (

                                        <tr tr className="table-warning" key={index} onClick={() => rowClick(index)}>
                                            <th scope="row" style={{ fontFamily: "initial", backgroundColor: "white" }}>
                                                {item.id}
                                            </th>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.class_name}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.subclassType}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.description}
                                            </td>

                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.modified_by}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.modified_date}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.created_by}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.created_date}
                                            </td>

                                            <td style={{ fontFamily: "initial", backgroundColor: "white" }}>
                                                <Button color="warning" onClick={() => {
                                                    toggle();
                                                    loadModalData(item);
                                                }} size="sm" >
                                                    <BsPencilFill />
                                                </Button>
                                                {/* <Button disabled color="danger" onClick={() => removeItem(item.id)} size="sm" style={{ fontFamily: "initial" }}>
                                                    <AiFillDelete />
                                                </Button> */}
                                                &nbsp;

                                            </td>

                                        </tr>

                                    )
                                }) : <tr><td colSpan={12} className="text-center" style={{ fontFamily: "initial", color: "red" }}><b>Data not available</b></td></tr>}


                            </tbody>
                        </table>
                    </div>

                    <div>

                    </div>

                    <div>

                        <Modal funk={true} isOpen={modal} toggle={toggle}>
                            <ModalHeader toggle={toggle} style={{
                                fontFamily: "initial", backgroundColor: "#438a5e",
                                color: "white"
                            }}>
                                Update Subclass Details</ModalHeader>
                            <ModalBody style={{ marginLeft: "70px" }}>
                                <Label
                                    for="subclass"
                                    sm={4} style={{ fontWeight: "bold", fontFamily: "initial", marginTop: "-20px" }}
                                >
                                    Subclass Type
                                </Label>

                                <Input
                                    name="subclassName"
                                    type="text"
                                    value={ModalData.subclassType}
                                    defaultValue={ModalData.subclassType}
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
                                    name="subclassDescription"
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