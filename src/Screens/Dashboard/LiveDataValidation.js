/* eslint-disable */

import React, { useEffect, useState } from 'react';
import {
  Button, Col,
} from 'reactstrap';
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { BsFillEyeFill } from "react-icons/bs";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Box from "@mui/material/Box";
import { Baseurl } from "../../Services/BaseUrl";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

var machineNames = [
];
var classNames = [
];
var subclassNames = [
];
var validationNames = [
  { "value": "Pending", label: "Pending" },
  { "value": "valid", label: "valid" },
  { "value": "invalid_manual", label: "invalid_manual" },
  { "value": "invalid_prep", label: "invalid_prep" },
  { "value": "invalid_model", label: "invalid_model" },
  { "value": "all", label: "all" }
];

export default function LiveDataValidation() {

  const [machineSelected, setMachineSelected] = useState([]);
  const [classSelected, setClassSelected] = useState([]);
  const [subClassSelected, setSubClassSelected] = useState([]);
  const [validationSelected, setValidationSelected] = useState([]);
  const [IsLoadingCompleted, setIsLoadingCompleted] = React.useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [TypeOfData, setTypeOfData] = React.useState("pending");
  const [SubclassID, setSubclassID] = React.useState(null);
  const [ClassID, setClassID] = React.useState(null);
  const [MachineID, setMachineID] = React.useState(null);
  const [pageSize, setpageSize] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [TabelDataone, setTabelDataone] = useState([]);
  const [TabelData, setTabelData] = React.useState([]);
  const [IsDataFound, setIsDataFound] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rowDataInModal, setRowDataInModal] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [role, setRole] = useState();
  const [showView, setShowView] = useState(true);
  const [machineDDLValue, setMachineDDLValue] = React.useState(MachineID);
  const [stats, setStats] = React.useState({
    "uploaded_total_count": 0,
    "uploaded_validated_count": 0,
    "uploaded_pending_count": 0,
    "valid_data_count": 0,
    "invalid_data_count": 0,
    "uploaded_image_count": 0,
    "uploaded_annotation_count": 0
  })

  const [SelectedMachines, setSelectedMachines] = useState([{
    "id": 0,
    "machineType": "Select All",
    "description": "SelectAll"
  }]);
  const [SelectedClass, setSelectedClass] = useState([{
    "id": 0,
    "classType": "Select All",
    "description": "SelectAll"
  }]);
  const [SelectedSubclass, setSelectedSubclass] = useState([{
    "id": 0,
    "subclassType": "Select All",
    "description": "SelectAll"
  }]);

  const [HideNext, setHideNext] = useState(false);

  var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
  useEffect(() => {
    setValidationSelected(validationNames);
    fetchSelectDropdownData();
    loadStats();

    console.log('This is session data from useffect', SESSIONDATA);
    if (SESSIONDATA.modify_access == 1) {
      setShowView(false);
    }

  }, []);

  // Function to handle row click
  const rowClick = (index) => {
    const selectedRow = TabelDataone[index];
    setRowData(selectedRow);
    setEditedData(selectedRow);
    setModalVisible(true);
    setRowDataInModal(TabelDataone[index]);
    AnnotationData(TabelDataone[index]);
  };
  const handleEditData = (event, field) => {
    const { value } = event.target;
    setEditedData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  const handleSaveData = () => {
    console.log('Edited Data:', editedData);
    // Close the modal after saving
    setModalVisible(false);
  };

  // Function to handle model prediction
  const handleModelPrediction = () => {
    // Extract the necessary values from rowData
    const machineId = rowData.machineId;
    const classId = rowData.classId;
    const subclassId = rowData.subclassId;


    // console.log('Machine ID:', machineId);
    // console.log('Class ID:', classId);
    // console.log('Subclass ID:', subclassId);
  };
  // url: `${Baseurl}/liveValidationStats`,

  const loadStats = (selectedMachineId) => {
    var token = localStorage.getItem('TOKEN');
  if (selectedMachineId == null) {
    selectedMachineId = 1;
  }

  console.log(selectedMachineId, "machine value default as one");
  var data = JSON.stringify({
    "machineId": selectedMachineId,
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${Baseurl}/liveValidationStats`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    data: data
  };
  axios.request(config)
    .then(result => {
      console.log(result.data, "11111111111111111111111");
      setStats(result.data);
    })
    .catch(error => console.log('error', error));
  }

  const fetchSelectDropdownData = () => {
    var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    var machinesArray = SESSIONDATA.machine_access;
    //console.log("machinesArray", machinesArray)
    machineNames = machinesArray.map(x => { return { 'value': x.id, 'label': x.machineType } });
    var machineIds = [machineNames[0].value];

    setMachineSelected(machineNames);
    setMachineDDLValue(machineNames[0].value);

    fillClassesData(machineIds);
  };

  const fillClassesData = (MachineIDs, isdefault = true, pageNum = 1) => {
    var token = localStorage.getItem('TOKEN');
    //console.log('TOKEN', token);
    if (MachineIDs == null) {
      MachineIDs = [];
    }
    var data = JSON.stringify({
      "machineId": MachineIDs
    });
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


        if (result.data != undefined && result.data.length > 0) {
          //console.log("class data", result.data);
          var classArray = result.data;
          classNames = classArray.map(x => { return { 'value': x.id, 'label': x.classType } });

          if (isdefault) {
            setClassSelected(classNames);
          }
          var ClassIDs = [];
          for (let index = 0; index < classArray.length; index++) {
            const element = classArray[index];
            ClassIDs.push(element.id);
          }
          filltabledata(MachineIDs, ClassIDs, [], TypeOfData, 1);
          if (MachineIDs.length > 0) {
            fillSubClassesData(MachineIDs, ClassIDs);
          }
          else {
            setClassSelected([]);
            setSubClassSelected([]);
            setTabelDataone([]);
          }
        }
        else {
          setClassSelected([]);
          setSubClassSelected([]);
          setTabelDataone([]);
        }
      })
      .catch(error => console.log('error', error));
  }


  const fillSubClassesData = (MachineIDs, ClassIDs, isdefault = true, pageNum = 1) => {
    var token = localStorage.getItem('TOKEN');
    //console.log('TOKEN', token);
    if (MachineIDs == null) {
      MachineIDs = [];
    }
    var data = JSON.stringify({
      "machineId": MachineIDs
    });
    if (ClassIDs == null) {
      ClassIDs = [];
    }

    var data = JSON.stringify({ "classId": ClassIDs, "machineId": MachineIDs });
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
        //setTabelData([]);
        //setSubClassData([]);
        if (result.data != undefined && result.data.length > 0) {
          //console.log("subclassdata", result.data);
          var subclassArray = result.data;
          subclassNames = subclassArray.map(x => { return { 'value': x.id, 'label': x.subclassType } });;
          setSubClassSelected(subclassNames);
          if (isdefault) {
            setSubClassSelected(subclassNames);
          }

          var SubClassIDs = [];
          for (let index = 0; index < subclassNames.length; index++) {
            const element = subclassNames[index];
            SubClassIDs.push(element.value);
          }
          //console.log("machineSelected", machineSelected);


          filltabledata(MachineIDs, ClassIDs, SubClassIDs, "pending", 1);


        } else {
          setSubClassSelected([]);
          var SubClassIDs = [];
          setTabelData([]);
          // setMachineID(0);
          subclassNames = [];
          setSubclassID([]);
        }
      })
      .catch(error => console.log('error', error));
  }


  const onValidationDropdownchangeone = (event) => {
    // console.log("event is", event)

    // setValidationSelected(event);
    // console.log("validation", validationSelected);
    // var validationIds = [];
    // event.forEach(element => validationIds.push(element.value));

    // var type = "";
    // if (event.length == validationNames.length) {
    //   type = "all";
    // }
    // else {
    //   type = validationIds[0];
    // }

    // setTypeOfData(type);
    // if (getSelectedMachineIds().length > 0 && getSelectedClassIds().length > 0 && getSelectedSubClassIds().length > 0) {

    //   filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), type); //fill tabel data
    // }
    // else {
    //   setIsLoadingCompleted(true);
    //   alert('Please Select Machine, Class and Subclass');
    // }


    const { name, value } = event.target;
    console.log("dropdown value : " + value + '   name:' + name);
    setValidationSelected(value);
    setTypeOfData(value);
    if (getSelectedMachineIds().length > 0 && getSelectedClassIds().length > 0 && getSelectedSubClassIds().length > 0) {

      filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), value); //fill tabel data
    }
    else {
      setIsLoadingCompleted(true);
      alert('Please Select Machine, Class and Subclass');
    }
  }



  const handleValidChange = (e) => {
    //const { name, value } = e.target;
    setIsLoadingCompleted(false);
    setModal(false);
    // console.log(value,"------------")
    setValidationSelected(e);
    if (getSelectedMachineIds().length > 0 && getSelectedClassIds().length > 0 && getSelectedSubClassIds().length > 0) {
      filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), validationSelected[0].value); //fill tabel data
    }
    else {
      setIsLoadingCompleted(true);
      alert('Please Select Machine, Class and Subclass');
    }
  }

  const filltabledata = (MachineIDs, ClassIDs, SubclassIDs, TypeOfData, pageNumber = 1) => {
    setHideNext(false);
    setPageNum(pageNumber);

    if (MachineIDs.length === 0) {
      MachineIDs = [0];
      setValidationSelected([]);
      setTabelDataone([]);
      return;
    }
    if (MachineIDs.length == 1 && MachineIDs[0] === 0) {
      MachineIDs = [];

    }

    if (ClassIDs.length == 1 && ClassIDs[0] === 0) {
      ClassIDs = [];
      setValidationSelected(validationNames);
    }

    if (SubclassIDs.length == 1 && SubclassIDs[0] === 0) {
      SubclassIDs = [];
      setValidationSelected(validationNames);
    }

    var token = localStorage.getItem('TOKEN');
    console.log('TOKEN', token);
    var data = JSON.stringify({
      "machineId": MachineIDs,
      "classId": ClassIDs,
      "subclassId": SubclassIDs,
      "typeOfData": TypeOfData,
      "pageNum": pageNumber,
      "pageSize": pageSize
    });

    console.log('Validation Get Page API PayLoad:', data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Baseurl}/livevalidationGetPage`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios.request(config)
      .then(result => {

        console.log('table data result:', result.data)
        setTabelDataone(result.data.data)

        console.log('TabelDataone', result.data)
        if (result.data) {
          setIsLoadingCompleted(true);
          if (result.data.total_records) {
            // var pageresult=118-120=-2
            var pageresult = result.data.total_records - (pageSize * pageNumber);
            console.log('pageresult : ', pageresult);
            if (pageresult <= 0) {
              setHideNext(true);
            }
          }

          if (result.data.data.length > 0) {
            setIsDataFound(true);
            setTabelData(result.data.data);
            setTabelDataone(result.data.data)

          }
          else {
            setIsDataFound(false);
            setTabelData([]);
            setTabelDataone([]);
          }
        }
        else {
          setIsDataFound(false);
          setTabelData([]);
          setTabelDataone([]);
        }
      })
      .catch(error => console.log('error', error));
  }


  const onMachineDropdownchangeone = (event) => {
    setMachineSelected(event);
    var machineIds = [];
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      machineIds.push(element.value);
    }
    console.log('MACHINE SELECTED', event);
    setValidationSelected(validationNames);

    fillClassesData(machineIds);
  }

  const refreshData = (e) => {
    const { value } = e.target;
    console.log("dropdown value : " + value + '   name:' + name);
    setMachineDDLValue(value);
    fillClassesData([value]);
    setMachineID(value);
    loadStats(value);
    setValidationSelected("pending");
    // const { value } = e.target;
  //   console.log("dropdown value : " + value + '   name:' + name);
  //   setMachineDDLValue(value);
  //   fillClassesData([value]);
  //  setMachineID(value);
  //  loadStats(value);
  }


  const [editvalidation_status, seteditvalidation_status] = useState("pending");

  const Validsubmit = () => {
    var token = localStorage.getItem('TOKEN');
    console.log('TOKEN', token);
    console.log(editedData, "edited data ............")
    if (editedData.validation_status == "QC_PENDING") {
      seteditvalidation_status()
    }

    if (!editedData.comments) {
      editedData.comments = '';
    }

    var data = JSON.stringify({
      "id": editedData.id,
      "imagePath": editedData.image_path,
      "comments": editedData.comments,
      "dataSource": "live",
      "sel_ip": editedData.validation_status,
      "imageSize": editedData.image_size,
      "annotationPath": editedData.annotation_path,
      "val_type": 'valid',
      "user_name": SESSIONDATA.user_name
    });
    console.log('Validsubmit PayLoad:', data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Baseurl}/livePostEdit`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios.request(config)
      .then(result => {
        console.log('table data result:', result.data)
        if (result.status == 200) {
          alert(result.data.message)
        }
        window.location.reload()
        filltabledata([], [], [], "pending", 1);
      })
      .catch(error => console.log('error', error));
  };

  const Invalidsubmit = () => {

    if (editedData.comments == null || editedData.comments == undefined || editedData.comments == "") {
      return alert('Please enter the Comments');
    }
    var token = localStorage.getItem('TOKEN');
    console.log('TOKEN', token);
    console.log(editedData, "edited data ............")
    if (editedData.validation_status == "QC_PENDING") {
      seteditvalidation_status()
    }
    //   if(editedData.comments == ''){
    //     return alert('Please enter the Comments');
    // }

    if (!editedData.comments) {
      editedData.comments = '';
    }
    var data = JSON.stringify({
      "id": editedData.id,
      "imagePath": editedData.image_path,
      "comments": editedData.comments,
      "dataSource": editedData.data_source,
      "sel_ip": editedData.validation_status,
      "imageSize": editedData.image_size,
      "annotationPath": editedData.annotation_path,
      "val_type": "invalid",
      "user_name": SESSIONDATA.user_name
    });
    console.log('Invalidsubmit PayLoad:', data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Baseurl}/livePostEdit`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios.request(config)
      .then(result => {
        console.log('table data result:', result.data)
        if (result.status == 200) {
          alert(result.data.message)
        }
        window.location.reload()
      })
      .catch(error => console.log('error', error));
  }
  //Pendingsubmit
  const Pendingsubmit = () => {
    var token = localStorage.getItem('TOKEN');
    console.log('TOKEN', token);
    console.log(editedData, "edited data ............")
    if (editedData.validation_status == "QC_PENDING") {
      seteditvalidation_status()
    }
    if (!editedData.comments) {
      editedData.comments = '';
    }
    var data = JSON.stringify({
      "id": editedData.id,
      "imagePath": editedData.image_path,
      "comments": editedData.comments,
      "dataSource": editedData.data_source,
      "sel_ip": editedData.validation_status,
      "imageSize": editedData.image_size,
      "annotationPath": editedData.annotation_path,
      "val_type": "pending",
      "user_name": SESSIONDATA.user_name
    });
    console.log('Pendingsubmit PayLoad:', data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Baseurl}/livePostEdit`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios.request(config)
      .then(result => {
        console.log('table data result:', result.data)
        if (result.status == 200) {
          alert(result.data.message)
        }
        window.location.reload()
      })
      .catch(error => console.log('error', error));
  }


  const onClassDropdownchangeone = (event) => {

    if (event.length > 0) {
      setClassSelected(event);
      var machineIds = [];
      for (let index = 0; index < machineSelected.length; index++) {
        const element = machineSelected[index];
        machineIds.push(element.value);
      }
      var ClassIDs = [];
      for (let index = 0; index < event.length; index++) {
        const element = event[index];

        ClassIDs.push(element.value);
      }
      console.log(machineSelected)

      //filltabledata(MachineIDs, ClassIDs, [], TypeOfData, 1);
      fillSubClassesData(machineIds, ClassIDs);
    }
    else {
      setTabelDataone([]);
      setClassSelected([]);
      setSubClassSelected([]);
      subclassNames = [];

    }

  }

  const onSubClassDropdownchangeone = (event) => {

    //alert(event.length);
    if (event.length > 0) {
      setSubClassSelected(event);

      var machineIds = [];
      for (let index = 0; index < machineSelected.length; index++) {
        const element = machineSelected[index];
        machineIds.push(element.value);
      }
      var classIDs = [];
      for (let index = 0; index < classSelected.length; index++) {
        const element = classSelected[index];
        classIDs.push(element.value);
      }
      var subClassIds = [];
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        subClassIds.push(element.value);
      }
      filltabledata(machineIds, classIDs, subClassIds, TypeOfData, 1);
    }
    else {
      setTabelDataone([]);
      setSubClassSelected([]);
    }
  }


  const [modal, setModal] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const toggle = (item) => {
    setModal(!modal);
    setRowData(item);
    setEditedData(item);
    setModalVisible(true);
    setRowDataInModal(item);
    AnnotationData(item);
  };

  const nextPage = () => {
    var pageNumber = pageNum + 1;
    setPageNum(pageNumber);
    filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), TypeOfData, pageNumber);
  }

  const backPage = () => {
    var pageNumber = 1;
    if (pageNum >= 1) {
      pageNumber = pageNum - 1;
      setPageNum(pageNumber);
    }
    setHideNext(false);
    filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), TypeOfData, pageNumber);
  }

  const getSelectedMachineIds = () => {
    console.log("getselected machines", machineSelected);
    var ids = [];
    machineSelected.forEach(element => ids.push(element.value));
    return ids;
  }

  const getSelectedClassIds = () => {
    console.log("getselected machines", classSelected);
    var ids = [];
    classSelected.forEach(element => ids.push(element.value));
    return ids;
  }
  const getSelectedSubClassIds = () => {
    console.log("getselected machines", subClassSelected);
    var ids = [];
    subClassSelected.forEach(element => ids.push(element.value));
    return ids;

  }

  const getIds = (array) => {
    var ids = [];
    array.forEach(element => ids.push(element.id));
    return ids;
  }
  const modalCallBack = () => {

    var pageNumber = pageNum + 1;
    setPageNum(pageNumber);
    filltabledata(getSelectedMachineIds(), getSelectedClassIds(), getSelectedSubClassIds(), TypeOfData, pageNumber);
  }

  const AnnotationData = (item) => {
    console.log('AnnotationData ITEM:', item);

    var token = localStorage.getItem('TOKEN');

    var data = JSON.stringify({
      "id": item.id,
      "dataSource": "live",
      "typeOfData": "pending",

    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Baseurl}/dataValidAnnot`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then(response => {
        // console.log("Base64 : ", response.data.image_base64);

        if (response.data.status != 200) {

        }
        if (response.data.image_path != undefined && response.data.image_path != null && response.data.image_path.length > 0) {
          setEditedData((history) => ({ ...history, image_path: response.data.image_path }));

        }

      })
      .catch(error => console.log('error', error));

  }


  return (
    <div div className="mt-0" style={{ backgroundColor: "#F5F5F5", overflow: 'hidden', height: "100%", margin: 0, position: "fixed", width: "100%" }}>
      <h5 style={{
        fontFamily: "initial", fontWeight: "Bold", color: "#438a5e", backgroundColor: "#D7EDDB", marginBottom: "10px",
        marginTop: 10, marginRight: "600px", marginLeft: "370px"
      }}>Live Data Validation</h5>

<div className='row'>
        <div className='col-md-2' style={{ marginLeft: "5%" }}></div>
        <div className='col-md-8'>
          <div className='row'>
            {/* Valid after card */}
            <div className='col-md-3' style={{ marginRight: "40px" }}>
              <div class="card border-left-warning shadow h-1 py-0">
                <div class="card-body">
                  {/* <TbChartPie2 style={{ marginLeft: "-150px", marginBottom: "-50px", color: "#1ED7E3 ", width: "20px", height: "20px" }} /> */}
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1"
                    tag="h6" align-item="start" style={{ color: "black", marginTop: "-1px" }}>
                    Valid After QC
                  </div>

                  {/* <span className="h5 font-weight-bold mb-0" style={{ color: "black" }}>
                    {stats.valid_data_after_QC}
                  </span> */}

                  <div >
                  <p style={{fontSize:12,}}>Images Count : <strong style={{fontSize:16}}>{stats.valid_data_after_QC}</strong></p>
                  </div>
                  <div style={{marginTop:"-10px"}}>
                    <p style={{fontSize:12,}}>Objects Count :  <strong style={{fontSize:16}}>{stats.valid_data_after_QC_objs}</strong></p>
                  </div>

                </div>
              </div>
            </div>
            {/* Invalid after card */}
            <div className='col-md-3' style={{ marginRight: "40px" }}>
              <div class="card border-left-warning shadow h-1 py-0">
                <div class="card-body">
                 
                  <div className="text-xs font-weight-bold text-dangerous text-uppercase mb-1"
                    tag="h6" align-item="start" style={{ color: "red", fontFamily: "initial", marginTop: "-1px", marginLeft: "-14px" }}>
                    InValid After QC
                  </div>

                  {/* <span className="h5 font-weight-+--bold mb-0 align-item-start" style={{ color: "black", textAlign: "center" }}>
                    {stats.invalid_data_after_QC}
                  </span> */}
                  <div >
                  <p style={{fontSize:12,}}>Images Count : <strong  style={{fontSize:16}}>{stats.invalid_data_after_QC}</strong></p>
                  </div>
                  <div style={{marginTop:"-10px"}}>
                    <p style={{fontSize:12,}}>Objects Count :  <strong  style={{fontSize:16}}>{stats.invalid_data_after_QC_objs}</strong></p>
                  </div>


                </div>
              </div>
            </div>
           
            <div className='col-md-3'>
              <div class="card border-left-warning shadow h-1 py-0">
                <div class="card-body">
                 
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1"
                    tag="h6" align-item="start" style={{ color: "orange", fontFamily: "initial" }}
                  >
                    QC Pending
                  </div>
                  {/* <span className="h5 font-weight-+--bold mb-0 align-item-start" style={{ color: "black" }}>
                    {stats.QC_pending}
                  </span> */}
                  <div >
                  <p style={{fontSize:12,}}>Images Count : <strong  style={{fontSize:16}}>{stats.QC_pending}</strong></p>
                  </div>
                  <div style={{marginTop:"-10px"}}>
                    <p style={{fontSize:12,}}>Objects Count :  <strong  style={{fontSize:16}}>{stats.QC_pending_objs}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div className='row' >
        <Col sm={2} style={{ marginBottom: "50px", width: "900", borderColor: 'green', marginTop: "54px", overflow: "scroll", marginTop: "-110px", height: "1000", marginLeft: "10px", marginBottom: "20px" }}>

          <Box className="mt-3" style={{ marginTop: 20, width: "90%", marginLeft: "0px", height: 40, marginLeft: 10 }}>
            <h6 className="selectvendorid"> Select Machine </h6>


            <select value={machineDDLValue} style={{ width: "100%", marginTop: "1px", marginLeft: "0px", height: 40 }} onChange={(e) => refreshData(e)} >
              {machineNames.map((item, index) => {
                return <option key={index} value={item.value}>{item.label}</option>
              })}
            </select>

          </Box>
          <br></br>
          <Box style={{ marginTop: 20, width: "90%", marginLeft: "0px", height: 40, marginLeft: 10 }}>

            <h6 className="selectvendorid"> Select Class </h6>
            <MultiSelect
              options={classNames}
              value={classSelected}
              onChange={onClassDropdownchangeone}
              labelledBy="Select"
              style={{ marginTop: 20 }}
            />
          </Box>
          <br></br>
          <Box style={{ marginTop: 20, width: "90%", marginLeft: "0px", height: 40, marginLeft: 10 }}>
            <h6 className="selectvendorid"> Select Subclass </h6>
            <MultiSelect
              options={subclassNames}
              value={subClassSelected}
              onChange={onSubClassDropdownchangeone}
              labelledBy="Select"
              style={{ marginTop: 20, width: "80%" }}
            />
          </Box>
          <br></br>
          <Box style={{ marginTop: 20, width: "90%", marginLeft: "0px", height: 40, marginLeft: 10 }}>
            <h6 className="selectvendorid"> Select Validation </h6>
            {/* <MultiSelect
              options={validationNames}
              value={validationSelected}
              onChange={onValidationDropdownchangeone}
              labelledBy="Select"
              disableCheckbox // Disable the checkboxes
              style={{ marginTop: 20 }}
            /> */}
            <select value={validationSelected} style={{ width: "100%", marginTop: "1px", marginLeft: "0px", height: 40 }} onChange={(e) => onValidationDropdownchangeone(e)} >
              {validationNames && validationNames.map((item, index) => {
                return <option key={index} value={item.value}>{item.label}</option>
              })}
            </select>
          </Box>

        </Col>

        <Col >

          {TabelDataone != null && TabelDataone.length > 0 ? <div style={{ fontFamily: "initial",marginLeft: "20%", }}>
            {console.log('UI pageNum:', pageNum)}
            {pageNum == 1 ? <>Current page: 1 </> : <></>}
            {pageNum > 1 ? <>Current page: {pageNum}
              <Button onClick={() => backPage()} style={{ marginLeft: "10px", background: "gray" }}>
                <BsChevronLeft />
              </Button></> : <></>}
            {IsDataFound && !HideNext ? <Button onClick={() => nextPage()} style={{ marginLeft: "10px", background: "gray" }}>
              <BsChevronRight />
            </Button> : <></>}
          </div> : <></>}

          <br></br>


          <div className='col-md-8'>
            <div style={{
              height: 410, backgroundColor: '#fff', overflow: "scroll", position: "sticky", width: "108%",
              marginLeft: "10px",marginTop:"-20px"
            }}>
              <table class="table table-fixedheader table-bordered  table-responsive">
                <thead style={{ position: "sticky", top: "0" }}>
                  <tr style={{ backgroundColor: "#438a5e" }}>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      Id
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      Machines Type
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      Class Type
                    </th>

                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      SubClasess Type
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      Images
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      <>QC By</> : <>Uploaded By</>
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      Uploded Time
                    </th>
                    <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                      status
                    </th>
                    {showView == true ?
                      <th style={{ fontFamily: "initial", color: "white", textAlign: "left", backgroundColor: "#438a5e" }}>
                        View
                      </th> : <></>}

                  </tr>
                </thead>
                <tbody >
                  {TabelDataone != null && TabelDataone.length > 0 ? TabelDataone.map((item, index) => {
                    return (
                      <tr className="table-warning" key={index} >
                        <td scope="row" style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                          {item.id}
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
                          <img src={`${Baseurl}/` + item.image_path} height={50} width={50} alt="" />
                        </td>

                        <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                          {item.user_name}

                        </td>
                        <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                          {item.upload_time}

                        </td>
                        <td style={{ fontFamily: "initial", backgroundColor: "white", textAlign: "left" }}>
                          {item.validation_status}

                        </td>





                        {showView == true ?
                          <td style={{ fontFamily: "initial", backgroundColor: "white" }}>
                            <Button color="warning" onClick={() => toggle(item)} size="sm">
                              <BsFillEyeFill />
                            </Button></td> : <></>}

                        &nbsp;



                      </tr>
                    )
                  })
                    : <tr>
                      <td colSpan={12} className="text-center" style={{ fontFamily: "initial", color: "red", marginLeft: "400px" }}><b>Data not available</b></td>
                    </tr>
                  }
                </tbody>
              </table>

              <Modal isOpen={modalVisible} toggle={() => setModalVisible(!modalVisible)} style={{ maxWidth: 800, width: 800 }}>
                <ModalHeader toggle={() => setModalVisible(!modalVisible)} >Row Details</ModalHeader>
                <ModalBody>
                  {/* Display the row data here */}
                  {editedData && (
                    <div>

                      <div className='row'>
                        <div className='col-md-6'>
                          <img src={"http://192.168.100.11:7000/" + editedData.image_path} height={300} width={300} alt="" />
                        </div>
                        <div className='col-md-6' >

                          <div>
                            <p>
                              Machine Type:
                              <input
                                type="text"
                                value={editedData.machine_name}
                                onChange={(event) => handleEditData(event, 'machine_name')}
                                style={{ marginLeft: 43, width: 220, borderRadius: 5 }}
                                readOnly
                              />
                            </p>
                          </div>

                          <p>
                            Select Class Name:
                            <input
                              type="text"
                              value={editedData.class_name}
                              onChange={(event) => handleEditData(event, 'class_name')}
                              style={{ marginLeft: 12, width: 220, borderRadius: 5 }}
                              readOnly
                            />
                          </p>

                          <p>
                            Subclasses:
                            <input
                              type="text"
                              value={editedData.subclass_name}
                              onChange={(event) => handleEditData(event, 'subclass_name')}
                              style={{ marginLeft: 65, width: 220, borderRadius: 5 }}
                              readOnly
                            />
                          </p>
                          <p>
                            Comments:
                            <textarea
                              type="text"

                              onChange={(event) => handleEditData(event, 'comments')}
                              style={{ marginLeft: 65, width: 220, borderRadius: 5 }}
                            />
                          </p>

                          {rowDataInModal.validation_status == 'invalid_manual' ? <>
                            <button onClick={Validsubmit} style={{ background: "green", color: "white", width: 80, borderRadius: 5, marginTop: 10 }}>
                              Valid</button>
                            <button onClick={Pendingsubmit} style={{ background: "red", color: "white", width: 80, borderRadius: 5, marginLeft: 70 }}>
                              Pending</button></> : <></>}

                              {rowDataInModal.validation_status == 'invalid_prep' ? <>
                            <button onClick={Validsubmit} style={{ background: "green", color: "white", width: 80, borderRadius: 5, marginTop: 10 }}>
                              Valid</button>
                            <button onClick={Pendingsubmit} style={{ background: "red", color: "white", width: 80, borderRadius: 5, marginLeft: 70 }}>
                              Pending</button></> : <></>}

                              {rowDataInModal.validation_status == 'invalid_model' ? <>
                            <button onClick={Validsubmit} style={{ background: "green", color: "white", width: 80, borderRadius: 5, marginTop: 10 }}>
                              Valid</button>
                            <button onClick={Pendingsubmit} style={{ background: "red", color: "white", width: 80, borderRadius: 5, marginLeft: 70 }}>
                              Pending</button></> : <></>}

                          {rowDataInModal.validation_status == 'valid' ? <>
                            <button onClick={Invalidsubmit} style={{ background: "Orange", color: "white", width: 80, borderRadius: 5, marginTop: 10 }}>
                              Invalid</button>
                            <button onClick={Pendingsubmit} style={{ background: "red", color: "white", width: 80, borderRadius: 5, marginLeft: 70 }}>
                              Pending</button></> : <></>}

                          {rowDataInModal.validation_status == 'pending' ? <>
                            <button onClick={Validsubmit} style={{ background: "green", color: "white", width: 80, borderRadius: 5, marginTop: 10 }}>
                              Valid</button>
                            <button onClick={Invalidsubmit} style={{ background: "Orange", color: "white", width: 80, borderRadius: 5, marginLeft: 70 }}>
                              Invalid</button></> : <></>}


                        </div>
                      </div>

                      {/* Add more properties as needed */}
                    </div>
                  )}
                </ModalBody>
              </Modal>

            </div>


          </div>

        </Col>
      </div>

    </div >
  )
}