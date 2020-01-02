import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Graphs from "./pages/Graphs";
import Graph from "./pages/Graph";

function App() {

  return (
      <div style={{margin: "10px"}}>
        <Router>
          <Switch>
            <Route exact path='/' component={Graphs}/>
            <Route path='/graph/:id' component={Graph}/>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
