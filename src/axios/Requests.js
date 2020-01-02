import axios from 'axios';

export const URL = "http://graph";

export const REQUEST_GRAPHS = "/graphs";
export const REQUEST_POINTS = "/points";
export const REQUEST_EDGES = "/edges";
export const REQUEST_BUILD_ROUTE = "/route/short-route";

export function getAllGraphs(){
    return axios.get(URL+REQUEST_GRAPHS);
}

export function deleteGraph(id) {
    return axios.delete(URL+REQUEST_GRAPHS+"/"+id);
}

export function addGraph(name) {
    return axios.post(URL+REQUEST_GRAPHS, {name: name});
}

export function getGraph(id) {
    return axios.get(URL+REQUEST_GRAPHS+"/"+id+"?expand=points,edges");
}

export function addPoint(graph_id, name) {
    return axios.post(URL+REQUEST_POINTS, {graph_id: graph_id, name: name});
}

export function updateEdgeValue(id, value) {
    return axios.put(URL+REQUEST_EDGES+"/"+id, {value: value});
}

export function updateEdge(id, data) {
    return axios.put(URL+REQUEST_EDGES+"/"+id, data);
}

export function addEdge(graph_id, from_point_id, to_point_id) {
    return axios.post(URL+REQUEST_EDGES, {graph_id: graph_id, from_point_id: from_point_id, to_point_id: to_point_id, value: 0});
}

export function deleteEdge(id) {
    return axios.delete(URL+REQUEST_EDGES+"/"+id);
}

export function deletePoint(id) {
    return axios.delete(URL+REQUEST_POINTS+"/"+id);
}

export function buildRoute(start, end) {
    return axios.post(URL+REQUEST_BUILD_ROUTE, {from_point_id: start, to_point_id: end});
}


