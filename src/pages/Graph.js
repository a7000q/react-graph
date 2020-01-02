import React from "react";
import { getGraph, addPoint, updateEdgeValue, updateEdge, addEdge, deleteEdge, deletePoint, buildRoute } from "../axios/Requests";

import TGraph from "react-graph-vis";

class Graph extends React.Component{

    state = {
        graph: "",
        graph_data: {
            nodes: [],
            edges: []
        },
        edge: {
            editMode: "none"
        },
        route: []
    };

    componentDidMount(){
        this.getAndSetGraph();
    }

    clickAddPoint = () => {
        let name = this.refs.newPointInput.value;
        addPoint(this.state.graph.id, name).then((response) => {
            this.refs.newPointInput.value = "";
            this.getAndSetGraph();
        });
    }

    clickBuildRoute = () => {
        let start = this.refs.startInput.value;
        let end = this.refs.endInput.value;

        buildRoute(start, end).then((response) => {
            this.setState({route: response.data});
        });

        console.log(start, end)
    }

    resultRoute = () => {
        if (this.state.route.length == 0)
            return "";

        if (this.state.route.error)
            return (
                 <div>
                   <h3>Результат</h3>
                   {this.state.route.error}
                 </div>
            );

        let route = this.state.route;

        return (
            <div>
                <h3>Результат</h3>
                <b>Сумма {route.sum}</b> <br/><hr/>
                {route.path.map((point) => {
                    return (
                        <b key={point.id}>{point.name} </b>
                    );
                })}
            </div>
        );
    }

    getAndSetGraph = () => {
        let graph_id = this.props.match.params.id;

        getGraph(graph_id).then((data) => {
            this.setState({
                graph: data.data
            });

            let graph_data = {
                nodes: [],
                edges: []
            };

            this.state.graph.points.map((point) => {
                graph_data.nodes.push({
                    id: point.id,
                    label: point.name
                });
            });

            this.state.graph.edges.map((edge) => {
                graph_data.edges.push({
                    id: edge.id,
                    from: edge.from_point_id,
                    to: edge.to_point_id,
                    label: edge.value.toString()
                });
            });

            this.setState({
                graph_data: graph_data
            });

            console.log(graph_data);

        }).catch((error) => {
            window.location.assign('/');
        });
    }

    setEditMode = (edges) => {
        if (edges.length == 1) {
            this.setState({edge: {editMode: "block"}});
            let edge_id = edges[0];

            let edge = this.state.graph_data.edges.find(item => item.id == edge_id);
            this.setState({edge: {value: edge.label, data: edge}});
        }
        else
            this.setState({edge: {editMode: "none"}});


    }

    events = {
        selectNode: (event) => {
            console.log(event);
        },
        selectEdge: (event) => {
            //this.state.network.enableEditMode();
            this.setEditMode(event.edges);
            console.log(event)
        },
        deselectEdge: (event) => {
            this.setEditMode(event.edges);
        }
    };

    eventHandlerEdge = (e) => {
        this.setState({
            edge: {
                value:  e.target.value,
                data: this.state.edge.data
            }
        });
    }

    setEdgeValue = () => {
        let edge_id = this.state.edge.data.id;
        let value = this.state.edge.value;

        updateEdgeValue(edge_id, value).then(() => {
            this.getAndSetGraph();
            this.setEditMode([]);
        });
    }


    render(){

        const options = {
            layout: {
                hierarchical: true
            },
            clickToUse: true,
            interaction: { hover: true , navigationButtons: true},
            manipulation: {
                enabled: true,
                addNode: false,
                addEdge: (data, callback) => {
                    addEdge(this.state.graph.id, data.from, data.to).then(() => {
                        this.getAndSetGraph();
                    });
                },
                editEdge:  (data, callback) => {
                    updateEdge(data.id, {
                        from_point_id: data.from,
                        to_point_id: data.to
                    }).then(() => {
                        this.getAndSetGraph();
                    });
                },
                deleteEdge: (data, callback) => {
                    deleteEdge(data.edges[0]).then(() => {
                        this.getAndSetGraph();
                        this.setEditMode([]);
                    });
                },
                deleteNode: (data, callback) => {
                    deletePoint(data.nodes[0]).then(() => {
                        this.getAndSetGraph();
                    });
                },
                initiallyActive: true,
                controlNodeStyle: {
                    shape:'dot',
                    size:6,
                    color: {
                        background: '#ff0000',
                        border: '#3c3c3c',
                        highlight: {
                            background: '#07f968',
                            border: '#3c3c3c'
                        }
                    },
                    borderWidth: 2,
                    borderWidthSelected: 2
                }
            },
            edges: {
                color: "#000000",
                scaling:{
                    label: true
                },
                smooth: {
                    enabled: true,
                    type: "curvedCW"
                }
            },
            nodes: {
                shape: "circle"
            },
            height: "1000px",
            physics: {
                stabilization: false,
                barnesHut: {
                    springLength: 200
                }
            }
        };

        return (
            <div>

                <h2>Граф {this.state.graph.name}</h2>

                <div style={{marginBottom: "10px", display: "block"}}><a href="/">Назад</a></div>
                <div style={{marginBottom: "10px"}}>
                    <input type="text" ref="newPointInput"/>
                    <button onClick={this.clickAddPoint}>Добавить вершину</button>
                </div>
                <div style={{position: "absolute", marginTop: "50px", right: "30px", zIndex: 1 }}>
                    <h3>Маршрут</h3>
                    <div style={{marginBottom: "10px"}}>
                        <b>Старт </b>
                        <select ref="startInput">
                            {this.state.graph_data.nodes.map((node) => {
                                return (
                                    <option key={node.id} value={node.id}>{node.label}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <b>Финиш </b>
                        <select ref="endInput">
                            {this.state.graph_data.nodes.map((node) => {
                                return (
                                    <option key={node.id} value={node.id}>{node.label}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <button onClick={this.clickBuildRoute}>Построить</button>
                    </div>
                    {this.resultRoute()}
                </div>
                <div>
                    <div style={
                        {width: "500px", height: "100px", position: "absolute", display: this.state.edge.editMode, marginTop: "50px", marginLeft: "10px", zIndex: 1}
                    }>
                        <b>Значение</b> <input type="text" value={this.state.edge.value} onChange={(e) => this.eventHandlerEdge(e)}/>
                        <button onClick={this.setEdgeValue}>Сохранить</button>
                    </div>
                    <TGraph
                        graph={this.state.graph_data}
                        options={options}
                        events={this.events}
                        getNetwork={network => {
                            this.setState({network: network});
                        }}

                    />
                </div>
            </div>
        );
    }
}

export default Graph;