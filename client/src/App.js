import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import DispatcherMapWrapper from "./DispatcherMap/Wrapper/Wrapper";
import MedicWrapper from "./Medic/Wrapper/Wrapper";




const App = () => {

  return (
    <div>
      <BrowserRouter>

        <Route path="/dispatchermap" exact component={DispatcherMapWrapper} />
        
        <Route path="/medical" exact component={MedicWrapper} />
        
      </BrowserRouter>
    </div>
  );
};

export default App;