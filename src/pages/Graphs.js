import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { getAllGraphs, deleteGraph, addGraph } from "../axios/Requests";

class Graphs extends React.Component{
    state = {
        graphs: [],
        addInputValue: ""
    }

    getAndSetData = () => {
        getAllGraphs()
            .then(data => {
                let graphs = data.data;
                this.setState({graphs: graphs});
            })
    }

    componentDidMount() {
        this.getAndSetData();
    }

    clickDeleteGraph = (e, graph) => {
        deleteGraph(graph.id).then(() => {
            this.getAndSetData();
        })
    }

    clickAddGraph = () => {
        let name = this.refs.newGraphInput.value;
        addGraph(name).then(() => {
            this.refs.newGraphInput.value = "";
            this.getAndSetData();
        });
    }

    render(){
        return (
            <div style={{fontSize: "16pt"}}>
                <h1>Графы</h1>

                <div>
                    <input type="text" ref="newGraphInput"/>
                    <button onClick={this.clickAddGraph}>Добавить</button>
                </div>

                <ul>
                    {this.state.graphs.map((graph) => {
                        return (
                            <li key={graph.id}>
                                <a href={"/graph/" + graph.id}>{graph.name}</a>
                                <a href="#" style={{color: "red"}} onClick={(e) => this.clickDeleteGraph(e, graph)}><IoIosCloseCircle/></a>
                            </li>
                        );
                    })}
                </ul>
                <div>
                    <a href="https://github.com/a7000q/react-graph">Frontend source</a>
                    <br/>
                    <a href="https://github.com/a7000q/graph">Backend source</a>
                </div>
            </div>
        );
    }
}

export default Graphs;