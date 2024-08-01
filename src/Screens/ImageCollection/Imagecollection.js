/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Button, Container, Row, Col, FormGroup, Form, Input, Label, Table, InputGroup, Card,
    CardBody, Alert
} from 'reactstrap';
import axios from 'axios';
import { IoIosCloseCircle } from "react-icons/io";
import { forEach } from 'lodash';
import { Baseurl } from "../../Services/BaseUrl";

export default function Imagecollection() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    console.log(location);
    const [IsLoadingCompleted, setIsLoadingCompleted] = React.useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = React.useState(null);
    const [machines, setMachines] = React.useState([]);
    const [machinesData, setMachinesData] = React.useState([]);
    const [classData, setClassData] = React.useState([]);
    const [subclassData, setSubClassData] = React.useState([]);
    const [classItem, setClassItem] = React.useState({ Id: 0, subclassType: "", description: "", subclasses: [] });
    const [SubclassID, setSubclassID] = React.useState([]);
    const [ClassID, setClassID] = React.useState([]);
    const [MachineID, setMachineID] = React.useState([]);
    const [classDDLValue, setClassDDLValue] = React.useState(0);
    const [statusMessage, setStatusMessage] = React.useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [filename, setFilename] = useState('');
    const [textFilename, setTextFilename] = useState('');
    const [resultText, setResultText] = useState('');
    // 👇 files is not an array, but it's iterable, spread to get an array of files
    const files = fileList ? [...fileList] : [];
    const [userName, setUserName] = useState('');

    useEffect(() => {
        console.log('image screen start event...')
        setStatusMessage("");
        fillMachinesDataFromSession();
    }, []);

    const fillMachinesDataFromSession = () => {
        var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
        console.log('SESSIONDATA:', SESSIONDATA.user_name);
        setUserName(SESSIONDATA.user_name);
        setMachinesData([]);
        setMachinesData(SESSIONDATA.machine_access);
        setMachineID(SESSIONDATA.machine_access[0].id);
        // fillClassesData(SESSIONDATA.machine_access[0].id);
        // fillSubClassesData(SESSIONDATA.machine_access[0].id);
    }

    const handleUploadClick = (e) => {
        if (fileList === null || fileList.length <= 0) {
            alert('Please select at least one image.');
            return;
        }

        if (files.length > 1000) {
            alert('Please select max of 1000 images');
            return false;
        }
        setIsLoading(true);

        var iserror = false;
        var txtMissingErrors = '';
        files.forEach((file, index) => {
            console.log(`FILE[${index}] SIZE = ${file.size}`);
            var mb = file.size / 1048576.0;
            if (mb > 20) {
                alert(`Image ${index} is bigger size, Please upload less than 20MB image`);
                iserror = true;
                return;
            }
            var filName = file.name;
            var fileNameWithoutExtension = removeExtension(filName);
            //check image file has respective text file with same name.
            // get text file from fileList array..
            var textfile = files.filter((f) => { return f.name === fileNameWithoutExtension + '.txt' })
            if (textfile[0] === undefined || textfile[0] === null) {
                txtMissingErrors = txtMissingErrors + `Image ${index}  annotation file is missing, Please upload annotation file also.`;
                iserror = true;
            }
        });

        if (txtMissingErrors.length > 0) {
            alert(txtMissingErrors);
            setFileList([]);
            setSelectedFile('');
            setIsLoading(false);
            return;
        }
        if (iserror) {
            setFileList([]);
            setSelectedFile('');
            setIsLoading(false);
            return;
        }
        
        if (MachineID === null) {
            alert('Please select Machine');
            return;
        }
        if (ClassID === null) {
            alert('Please select Class');
            return;
        }
        if (SubclassID === null) {
            alert('Please select Subclass');
            return;
        }

        var token = localStorage.getItem('TOKEN');
        console.log('TOKEN', token);
        //Create new FormData object and append file
        let data = new FormData();
        data.append("machineId", MachineID);
        data.append('user_name', userName)
        // data.append("classId", ClassID);
        // data.append("subclassId", SubclassID);
        files.forEach((file, i) => {
            data.append(`listImages`, file, file.name);
        });

        // 👇 Uploading the files using the fetch API to the server
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${Baseurl}/imageupload`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: data
        };
        axios.request(config)
            .then((result) => {
                setFileList([]);
                setStatusMessage(result.data.message);
                // alert(result.data.message);
                setSelectedFile('');
                setResultText(result.data.message)
                //fillMachinesDataFromSession(result.data[0].id);
                setMachinesData(result.data);
                // window.location.reload();
                if (result.status == 200) {
                    alert('Image Uploaded Sucessfully'+"   "+ fileList.length)
                    window.location.reload();
                }
                setIsLoading(false);
            })
            .catch((err) => console.error(err));

    };

    function removeExtension(filename) {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }



    const handleMachineChange = (e) => {
        const { name, value } = e.target;
        console.log("dropdown value : " + value);
        setMachineID(value);
        setFileList([]);
        //call fetch api with machin id : value
        // fillClassesData(value); // fill classesData state for table 

    }



    const handleFileChange = (e) => {
        setFileList(e.target.files);
        if (classItem.MachineID) {
            alert('Please ')
            return;
        }
    };

    function deleteFile(e) {
        setSelectedFile('');
        const s = files.filter((item, index) => index !== e);
        setFileList(s);

        files = s;
        console.log(s);
    }

    function clearImages() {
        setFileList([]);
        setSelectedFile('');
        setResultText('');
    }

    return (
        <div style={{ backgroundColor: "#F5F5F5", width: "100%" }}>
            <div style={{ marginLeft: "40%", width: "35%" }}>
                <h5 style={{
                    fontFamily: "initial",
                    color: "#438a5e", backgroundColor: "#D7EDDB",
                    marginBottom: "10px", marginTop: "10px",
                    fontWeight: "Bold",
                }}>Image Collection</h5>
            </div>

            <div  >
                <div style={{ marginBottom: "50px", borderColor: 'green', marginTop: "20px", }}>
                    <div>
                        <tr>
                            <td>
                                <Label
                                    for="machine"
                                    style={{ fontFamily: "initial", color: "black", marginTop: "1px", marginLeft: "40px" }}>
                                    Select Machine Name:
                                </Label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <select onChange={e => handleMachineChange(e)} style={{ width: "110%", height: 40, marginTop: "1px", marginRight: "20px", fontFamily: "initial", marginLeft: "40px" }}>
                                    {machinesData != null && machinesData.map((item, index) => {
                                        return <option key={index} value={item.id}>{item.machineType}</option>
                                    })}
                                </select>
                            </td>
                        </tr>

                    </div>
                </div>
            </div>

            <div >

                <input type="file" onChange={handleFileChange} multiple key={selectedFile} accept="image/png, image/jpeg,text/txt"
                    style={{ padding: 5, borderWidth: 1, borderColor: 'red', borderStyle: "solid", background: "white", fontFamily: "initial", marginBottom: "20px" }} />

                <div style={{ display: "flex", overflow: "scroll", marginLeft: "10px", }}>

                    {files && files.map((fl, index) => {
                        return (<div style={{ margin: 3 }}>
                            <h5 color='danger' class="delete-icon" onClick={() => deleteFile(index)} >
                                <IoIosCloseCircle style={{ color: "red", }} />
                            </h5>
                            <p>{fl.name}</p>
                            {fl.name.includes(".txt") ? <><p>{fl.name}</p></> : <img key={index} src={URL.createObjectURL(fl)} height="70" width="70" alt="Annotation" />}
                        </div>)
                    })}
                </div>

                {isLoading && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <button onClick={clearImages}
                    style={{
                        margin: 40, background: "Black", color: "white", fontFamily: "initial", backgroundColor: "red",
                        height: 40, width: 100, fontWeight: "bold"
                    }}>Clear</button>

            

                <button onClick={handleUploadClick}
                    style={{
                        margin: 40, background: "Black", color: "white", fontFamily: "initial", backgroundColor: "#438a5e",
                        height: 40, width: 100, fontWeight: "bold"
                    }}>Upload</button>
                {/* <h3>{resultText}</h3> */}
            </div>


            {/* <div className='row'>
           

           
            </div> */}
        </div>
    );
}

















// /* eslint-disable */
// import React, { useEffect, useState } from "react";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select"
// import axios from "axios";
// import { Row, Col } from "react-bootstrap";
// import { Line } from "react-chartjs-2";
// import '../../components/LiveModelReport.css';
// import { BsCardImage, BsMap, BsFileEarmarkImage, BsFillMapFill } from "react-icons/bs";

// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
// import Box from "@mui/material/Box";
// import { TbChartPie2 } from "react-icons/tb";
// import { Baseurl } from "../../Services/BaseUrl";
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// export default function LiveModelReport() {

//     const [selectMachine, setSelecteMachine] = useState([]);
//     const [model, setModel] = useState([])
//     const [selectedModel, setSelectedModel] = useState([]);
//     const [cardData, setCardData] = useState([]);
//     const [objectiveGraph, setObjectiveGraph] = useState([])
//     const [classificationGraph, setclassificationGraph] = useState([])
//     const [mapGraph, setMapGraph] = useState([])
//     const [preciRecallGraph, setPreciRecallGraph] = useState([])
//     const [gpumemGraph, setGpumemGraph] = useState([])
//     const [machine, setMachine] = useState([]);
//     const [selectedMachine, setSelectedMachine] = useState('');
//     const [dataNotFound, setDataNotFound] = useState(false);

//     var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
//     useEffect(() => {
//         //  machineId();
//         fillMachinesDataFromSession();
//     }, []);


//     const fillMachinesDataFromSession = () => {
//         var SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
//         //console.log('SESSIONDATA:', SESSIONDATA.user_name);

//         setMachine([]);
//         setMachine(SESSIONDATA.machine_access);
//         setSelectedMachine(SESSIONDATA.machine_access[0].id);
//         // setMachineTableData(SESSIONDATA.machine_access);

//     }

//     const machineId = () => {
//         var token = localStorage.getItem('TOKEN');
//         //console.log('TOKEN', token);
//         axios.get(`${Baseurl}/machinedropdowndash`,
//             {
//                 headers: {
//                     'Authorization': 'Bearer ' + token,
//                     'Content-Type': 'application/json'
//                 },
//             }).then(function (response) {
//                 // console.log(responce.data)
//                 if (response.status === 200) {
//                     setMachine(response.data);
//                     //console.log('response.data', response.data);

//                     // Check if selectedMachine is already set, if not, set it to the first value
//                     if (response.data.length > 0 && !selectedMachine) {
//                         setSelectedMachine(response.data[0].value);
//                     }
//                 }

//             })

//     }


//     useEffect(() => {
//         const mainData = () => {
//             var token = localStorage.getItem('TOKEN');
//             var data = {
//                 machineId: selectedMachine,
//                 modelName: selectedModel
//             }
//             var config = {
//                 method: "post",
//                 url: `${Baseurl}/livemodeldash`,
//                 headers: {
//                     'Authorization': 'Bearer ' + token,
//                     'Content-Type': 'application/json'
//                 },
//                 data: data
//             };
//             console.log('API livemodeldash', config);
//             axios(config).then(function (responce) {
//                 // console.log(responce)
//                 setCardData(responce.data)
//                 console.log(cardData, "888888888888888888888888888888888888888888888")

//                 console.log("checkkkkkkkkkkkkkkkkkkkkkkkkkkkk",responce.data.gpumem_graph.map((item) => item.gpu_mem))
//                 setGpumemGraph({
//                     labels: responce.data.gpumem_graph.map((item) => item.item.epoch),
//                     // labels: responce.data.gpumem_graph.map((item) => item.epoch),
//                     datasets: [
//                         {
//                             label: "GPU Mem",
//                             data: responce.data.gpumem_graph.map((item) => item.model_precision),
//                             // data: responce.data.gpumem_graph.map((item) => item.gpu_mem),
                            
//                             fill: true,
//                             borderColor: "gray",
//                             backgroundColor: "gray",
//                         },

//                     ],
//                 })
//             })

//         }
//         mainData()

//     }, [selectedMachine, selectedModel])


//     useEffect(() => {
//         modelDash()
//         function machineIds() {
//             setSelecteMachine(selectedMachine.map((id) => id.value))
//         }
//     }, [])

//     useEffect(() => {
//         machineIds()
//         modelDash()
//         function machineIds() {
//         }
//     }, [selectedMachine]);

//     const modelDash = () => {
//         var token = localStorage.getItem('TOKEN');
//         console.log('TOKEN', token);
//         var data = JSON.stringify({
//             machineIds: selectedMachine,
//         });
//         var config = {
//             method: "post",
//             url: `${Baseurl}/modelnamedropdowndash`,
//             headers: {
//                 'Authorization': 'Bearer ' + token,
//                 'Content-Type': 'application/json'
//             },
//             data: data
//         };
//         console.log('API modelnamedropdowndash', config);
//         axios(config).then(function (responce) {
//             console.log("res", responce.data)
//             if (responce.status === 200) {
//                 setModel(responce.data)
//                 setSelectedModel(responce.data[0].value);
//             }
//         })
//     }
//     const handleDropdownChange = (event) => {
//         setSelectedMachine(event.target.value);
//     }



//     return (

               

//                 <div  style={{ marginLeft: "2%" }}>
//                     <div >

//                         <div
//                             style={{
//                                 fontFamily: "sans-serif",
//                                 textAlign: "center",
//                             }}>
//                             {preciRecallGraph && preciRecallGraph.datasets && (
//                                 <Line
//                                     data={preciRecallGraph}
//                                     options={{
//                                         responsive: true,
//                                         plugins: {
//                                             legend: { position: "top" },
//                                             title: { display: true, text: "recall" },
//                                         },
//                                         scales: {
//                                             x: {
//                                                 display: true,
//                                                 title: {
//                                                     display: true,
//                                                     text: "Epochs",
//                                                     color: "#000", // Optional: Customize the title color
//                                                     font: {
//                                                         size: 10,
//                                                         weight: "bold"// Optional: Customize the title font size
//                                                         // Optional: Customize the title font weight
//                                                     },
//                                                     padding: { top: 10, bottom: 0 }, // Optional: Adjust the title padding
//                                                 },
//                                             },
//                                             y: {
//                                                 display: true,
//                                                 title: {
//                                                     display: true,

//                                                     text: "probability",
//                                                     color: "#000", // Optional: Customize the title color
//                                                     font: {
//                                                         size: 10,
//                                                         weight: "bold" // Optional: Customize the title font size
//                                                         // Optional: Customize the title font weight
//                                                     },
//                                                     padding: { left: 0, right: 10 }, // Optional: Adjust the title padding
//                                                 },
//                                             },
//                                         },
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//     )
// }






