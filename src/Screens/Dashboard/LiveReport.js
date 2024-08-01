/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Button, Container, Row, Col, Label,
    Modal, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';

import axios from 'axios';
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Baseurl } from "../../Services/BaseUrl";

var machineNames = [
];

export default function LiveReport() {

    const location = useLocation();
    console.log(location);
    const [IsLoadingCompleted, setIsLoadingCompleted] = React.useState(false)
    const [TabelData, setTabelData] = React.useState([]);
    const [MachineID, setMachineID] = React.useState(null);
    const [machines, setMachines] = React.useState([]);
    const [machinesData, setMachinesData] = React.useState([]);
    const [classItem, setClassItem] = React.useState({ Id: 0, subclassType: "", description: "", subclasses: [] });
    const [modal, setModal] = React.useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [IsDataFound, setIsDataFound] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedMachineId, setselectedMachineId] = React.useState(MachineID);
    const [machineDDLValue, setMachineDDLValue] = React.useState(MachineID);
    const [subclassData, setSubClassData] = React.useState([]);
    const [ImageModelPath, setImageModelPath] = useState('');

    const [SelectedMachines, setSelectedMachines] = useState([{
        "id": 0,
        "machineType": "Select All",
        "description": "SelectAll"
    }]);

    const [stats, setStats] = React.useState({
        "uploaded_total_count": 0,
        "QC_pending": 0,
        "valid_data_after_QC": 0,
        "invalid_data_after_QC": 0,

    })


    const fetchSelectDropdownData = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        var machinesArray = SESSIONDATA.machine_access;
        console.log("machinesArray", machinesArray)
        machineNames = machinesArray.map(x => { return { 'value': x.id, 'label': x.machineType } });
        var machineIds = [machineNames[0].value];
        // // for (let index = 0; index < machinesArray.length; index++) {
        // //   const element = machinesArray[index];
        // //   machineIds.push(element.id);
        // // }
        setMachineSelected(machineNames);
        setMachineDDLValue(machineNames[0].value);

        fillClassesData(machineIds);
    };

    const [HideNext, setHideNext] = useState(false);

    useEffect(() => {
        console.log('Live report screen start event...')
        fillMachinesDataFromSession();
        loadStats();
    }, []);

    const loadStats = () => {
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${Baseurl}/liveValidationStats`,
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        };

        axios.request(config)
            .then(result => {
                console.log(result.data);
                setStats(result.data);
            })
            .catch(error => console.log('error', error));

    }

    const fillMachinesDataFromSession = (isdefault = true, pageNum = 1) => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        setMachinesData([]);
        // var arr = [{
        //     "id": 0,
        //     "machineType": "Select All",
        //     "description": "SelectAll"
        // }];
        // var machinesArray = arr.concat(SESSIONDATA.machine_access);
        // console.log('arr data = ', machinesArray);
        setMachinesData(SESSIONDATA.machine_access);
        setMachineID([]);
        if (isdefault) {
            setSubClassData([SESSIONDATA.machine_access[0].id]);
        }
        setPageNum(1);
        setSelectedMachines([]);
        setMachineDDLValue(SESSIONDATA.machine_access[0].id);
        filltabledata([SESSIONDATA.machine_access[0].id]);
        setIsLoadingCompleted(true);
    }

    const handleMachineChange = (e) => {
        const { name, value } = e.target;
        console.log("dropdown value : " + value);
        setMachineID(value);
        setIsLoadingCompleted(false);
        filltabledata(value);
        loadStats();
        //call fetch api with machin id : value
        setIsLoadingCompleted(false);
        filltabledata(value);
    }

    const refreshData = (e) => {
        const { name, value } = e.target;
        console.log("dropdown value : " + value + '   name:' + name);
        setMachineDDLValue(value);
        // fillClassesData([value]);


        loadStats();


        setPageNum(1);
        filltabledata([value], 1);
    }

    // const fillMachinesData = () => {
    //     var token = localStorage.getItem('TOKEN');
    //     console.log('TOKEN', token);
    //     let config = {
    //         method: 'get',
    //         maxBodyLength: Infinity,
    //         url: '`${Baseurl} /machinedropdown',
    //         headers: {
    //             'Authorization': 'Bearer ' + token,
    //         }
    //     };
    //     axios.request(config)
    //         .then(result => {
    //             setMachinesData([]);
    //             loadStats();
    //             setMachinesData(result.data);
    //             setMachineID(result.data[0].id);
    //             filltabledata(result.data[0].id);
    //             // fill classes drop down, you have to get all classes data need new API
    //         })
    //         .catch(error => console.log('error', error));
    // }


    const filltabledata = (MachineIDs, pageNumber = 1) => {
        setHideNext(false);
        setPageNum(pageNumber);
        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        var data = JSON.stringify({
            "pageSize": 10,
            "machineId": MachineIDs,
            "pageNum": pageNumber
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/liveReport`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(result => {
                setTabelData([]);
                console.log('table data result:', result.data)
                setTabelData(result.data);
                if (result.data.total_records) {
                    // var pageresult=118-120=-2
                    var pageresult = result.data.total_records - (pageSize * pageNumber);
                    console.log('pageresult : ', pageresult);
                    if (pageresult <= 0) {
                        setHideNext(true);
                    }
                }

                if (result.data) {
                    setIsLoadingCompleted(true);
                    if (result.data.length > 0) {
                        setIsDataFound(true);
                        setTabelData(result.data);
                    }
                    else {
                        setIsDataFound(false);
                        setTabelData([]);
                    }
                }
                setIsLoadingCompleted(true);
                setModal(false);
                console.log('live Report Result:', result.data);
            })
            .catch(error => console.log('error', error));
    }


    const getSelectedMachineIds = () => {
        //loadStats();
        var array = SelectedMachines.slice();
        var ids = [];
        array.forEach(element => ids.push(element.id));
        return ids;
    }

    const getIds = (array) => {
        var ids = [];
        array.forEach(element => ids.push(element.id));
        return ids;
    }

    const onSelectMachines = (list, item) => {
        loadStats();
        if (item.id === 0) {
            var sM = machinesData.slice();
            setSelectedMachines(sM);
            filltabledata([]);
            return;
        }
        var sMachines = SelectedMachines.slice();
        sMachines.push(item);
        setSelectedMachines(sMachines);
        console.log('getIds Machines:', getIds(sMachines));
        setPageNum(1);
        filltabledata(getIds(sMachines), 1);
    }
    const onRemoveMachines = (list, item) => {
        var sMachines = SelectedMachines.slice();
        console.log('sMachines:', sMachines);
        var boolResult = removeById(sMachines, item.id);
        setSelectedMachines(sMachines);
        console.log('sMachines:', sMachines);
        if (item.id === 0 || (sMachines.length === 1 && sMachines[0].id === 0)) {
            setSelectedMachines([]);
            setTabelData([]);
            setIsDataFound(false);
            setPageNum(0);
        }
        else {
            setPageNum(1);
            filltabledata(getIds(sMachines), 1);
        }
    }

    const removeById = (arr, id) => {
        const requiredIndex = arr.findIndex(el => {
            return el.id === id;
        });
        if (requiredIndex === -1) {
            return false;
        };
        return !!arr.splice(requiredIndex, 1);
    };

    const nextPage = () => {
        var pageNumber = pageNum + 1;
        setPageNum(pageNumber);
        filltabledata(getSelectedMachineIds(), pageNumber);
    }

    const backPage = () => {
        var pageNumber = 1;
        if (pageNum >= 1)
            pageNumber = pageNum - 1;
        setPageNum(pageNumber);
        setHideNext(false);
        filltabledata(getSelectedMachineIds(), pageNumber);
    }
    const rowClick = (index) => {
        setRowIndex(index);
    }
    const handleClick = (imagePath) => {
        setImageModelPath(imagePath);
        setIsExpanded(!isExpanded);
    };


    const ImageModel = (props) => {
        return (
            <Container style={{ backgroundColor: "white" }}>
                <Row>
                    <Col>
                        <Modal isOpen={isExpanded} toggle={toggleModal} size="lg">
                            <ModalBody>
                                <img src={ImageModelPath}
                                    style={{ width: isExpanded ? '100%' : 'auto', height: 400 }} />
                            </ModalBody>
                            <ModalFooter>
                                <Button title='Close' onClick={() => toggleModal()} style={{ backgroundColor: "#438a5e" }}>OK</Button>
                            </ModalFooter>
                        </Modal >
                    </Col>
                </Row>
            </Container>)
    }



    const toggleModal = () => {
        setIsExpanded(!isExpanded);
    };

    if (!IsLoadingCompleted)
        return <Spinner></Spinner>

    return (
        <div style={{ backgroundColor: "#F5F5F5", height: "100%", margin: 0, position: "fixed", width: "100%" }}>
            <div md="8" style={{ backgroundColor: "#F5F5F5", marginLeft: "320px" }}>
                <h5 style={{
                    fontFamily: "initial",
                    color: "#438a5e", marginRight: "700px", backgroundColor: "#D7EDDB",
                    marginBottom: "10px", marginTop: "10px", marginLeft: "10%",
                    fontWeight: "Bold"
                }}>Live Report</h5>
            </div>
            <div className='row'>
                <div className='col-md-2' style={{ marginLeft: 30 }}>

                    <div>
                        <Label
                            for="machine"
                            style={{
                                fontFamily: "initial", color: "black",
                                marginTop: "40px",marginBottom:10
                            }}>
                            Select Machine Name:
                        </Label>
                    </div>

                    <div>

                        <select value={machineDDLValue} style={{ width: "70%", marginTop: "1px", marginLeft: "30px", height: 40 }} onChange={(e) => refreshData(e)} >
                            {machinesData.map((item, index) => {
                                return <option key={index} value={item.id}>{item.machineType}</option>
                            })}
                        </select>
                        {/* <Multiselect
                                    options={machinesData} // Options to display in the dropdown
                                    selectedValues={SelectedMachines} // Preselected value to persist in dropdown
                                    onSelect={onSelectMachines} // Function will trigger on select event
                                    onRemove={onRemoveMachines} // Function will trigger on remove event
                                    displayValue="machineType"
                                    showCheckbox={true}
                                    hidePlaceholder={true}
                                    placeholder="Select the Machine" /> */}
                    </div>

                </div>
                <div className='col-md-7'>

                    <div style={{ marginBottom: 10, paddingLeft: "600px" }}>
                        {console.log('UI pageNum:', pageNum)}

                        {pageNum == 1 ? <>Current page: 1 </> : <></>}
                        {pageNum > 1 ? <>Current page: {pageNum}
                            <Button color="primary" onClick={() => backPage()} style={{ marginLeft: "10px", background: "gray" }}>
                                <BsChevronLeft />
                            </Button></> : <></>}
                        {IsDataFound && !HideNext ? <Button color="primary" onClick={() => nextPage()} style={{ marginLeft: 20, background: "gray" }}>
                            <BsChevronRight />
                        </Button> : <></>}
                    </div>

                    <div style={{ height: 470, overflow: "scroll", overflowX: "auto", }} s>
                        <table class="table table-fixedheader table-bordered  table-responsive" >

                            <thead className="sticky-top top-0" style={{ marginTop: "-20px" }}>
                                <tr style={{ backgroundColor: "#438a5e" }}>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Id
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Image Path
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Machine
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Class
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Subclass
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Image Size (KB)
                                    </th>
                                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                                        Uploaded By
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isExpanded && (
                                    <ImageModel />
                                )}

                                {TabelData != null && TabelData.length > 0 ? TabelData.map((item, index) => {
                                    return (
                                        <tr className="table-warning" key={index} style={{ overflow: "hidden" }}>
                                            <td scope="row" style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.id}
                                            </td>
                                            <td style={{ backgroundColor: "white" }}>
                                                <img src={`${Baseurl}/` + item.image_path}
                                                    height={50} width={50} alt=""
                                                    onClick={() => handleClick(`${Baseurl}/` + item.image_path)}
                                                />
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.machine_name}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.class_name}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.subclass_name}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.image_size}
                                            </td>
                                            <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                {item.uploaded_by}
                                            </td>
                                            {/* <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                        {item.class}
                                                    </td>
                                                    <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                        {item.accuracy}
                                                    </td>
                                                    <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                        {item.distance}
                                                    </td>
                                                    <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                                                        {item.date}
                                                    </td> */}
                                        </tr>

                                    )
                                }) : <tr><td colSpan={12} className="text-center" style={{ fontFamily: "initial", color: "red" }}><b>Data not available</b></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );

}
