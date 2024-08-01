/* eslint-disable */
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Imagecollection from "../Screens/ImageCollection/Imagecollection";
import SourceDataValidation from "../Screens/Dashboard/SourceDataValidation";
import SourceReport from "../Screens/Dashboard/SourceReport";
import LiveReport from "../Screens/Dashboard/LiveReport";
import LiveDataValidation from "../Screens/Dashboard/LiveDataValidation";
import MachinesTest from "../Screens/LabelConfiguration/MachinesTest";
import HistoricalModelReport from "../Screens/Dashboard/HistoricalModelReport";
import ConsolidatedDataStats from "../Screens/Dashboard/ConsolidatedDataStats";
import Login from "../Screens/Login/Login";
import LiveModelReport from "../Screens/Dashboard/LiveModelReport";
import SubclassTest from "../Screens/LabelConfiguration/SubclassTest";
import ClassTest from "../Screens/LabelConfiguration/ClassTest";
import Home from "../Screens/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function RootStack() {

  const location = useLocation();
  console.log('location:', location);

  return (
    <div >
      <Routes path="">
      <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/imagecollection" element={<Imagecollection />} />
        <Route path="/SourceDataValidationnew" element={<SourceDataValidation />} />
        <Route path="/sourcereport" element={<SourceReport />} />
        <Route path="/liveSourceDataValidation" element={<LiveDataValidation />} />
        <Route path="/livereport" element={<LiveReport />} />
        <Route path="/HistoricalModelReport" element={<HistoricalModelReport />} />
        <Route path="/ConsolidatedDataStats" element={<ConsolidatedDataStats />} />
        <Route path="/LiveModelReport" element={<LiveModelReport />} />
        <Route path="/MachinesTest" element={<MachinesTest />} />
        <Route path="/ClassTest" element={<ClassTest />} />
        <Route path="/SubclassTest" element={<SubclassTest />} />
      </Routes>
    </div>
  );
}

