import axios from 'axios'
import config from 'config'

const url_item = config.paths.<%= lowercaseName %>.item
const url_list = config.paths.<%= lowercaseName %>.list

export function flatten(node) {
    return Object.keys(node).map(nodeName => node[nodeName].model)
}

export function interpolate(str, params) {
    const keys = Object.keys(params);
    return keys.reduce((prev, current) => {
        return prev.replace(new RegExp('{' + current + '}'), params[current])
    }, str || keys.map(v => '{' + v + '}').join(':'))
}


/** EDITING **/

export function edit(data) {
    return function (dispatch) {
        dispatch({type: 'EDIT_<%= uppercaseName %>', payload: {data}})
    }
}

/** SINGLE ITEM **/
/*
 FETCH ONE
 @params: Object, set of params to enhance urls
 */
export function fetchOne(params) {
    return function (dispatch) {
        dispatch({type: "FETCH_<%= uppercaseName %>", payload: {params}})
        const url = interpolate(url_item, params)
        axios.get(url).then(response => {
            dispatch({type: "FETCH_<%= uppercaseName %>_FULFILLED", payload: {data: response.data, params}})
        }).catch((error) => {
            dispatch({type: "FETCH_<%= uppercaseName %>_REJECTED", payload: {error, params}})
        })
    }
}

/*
 SAVE
 */
export function save(data, params) {
    return function (dispatch) {
        dispatch({type: 'SAVE_<%= uppercaseName %>', payload: {data}})
        const method = data.id ? 'put' : 'post'
        const url = interpolate(url_item, params)
        axios[method](url, data).then(response => {
            dispatch({type: "SAVE_<%= uppercaseName %>_FULFILLED", payload: {params: data, data: response.data}})
        }).catch((error) => {
            dispatch({type: "SAVE_<%= uppercaseName %>_REJECTED", payload: {error, data}})
        })
    }
}

/*
 REMOVE
 */
export function remove(data, params) {
    return function (dispatch) {
        dispatch({type: 'DELETE_<%= uppercaseName %>', payload: {data}})
        const url = interpolate(url_item, params)
        axios.delete(url).then(response => {
            dispatch({type: "DELETE_<%= uppercaseName %>_FULFILLED", payload: {params: data, data: response.data}})
        }).catch((error) => {
            dispatch({type: "DELETE_<%= uppercaseName %>_REJECTED", payload: {error, data}})
        })
    }
}


/** LISTS **/
/*
 FETCH LIST
 */
export function fetchAll() {
    return function (dispatch) {
        const url = url_list
        dispatch({type: 'FETCH_<%= uppercaseName %>S', payload: {}})
        axios.get(url)
            .then((response) => {
                dispatch({type: 'FETCH_<%= uppercaseName %>S_FULFILLED', payload: {data: response.data}})
            })
            .catch((error) => {
                dispatch({type: 'FETCH_<%= uppercaseName %>S_REJECTED', payload: {error}})
            })
    }
}

export function reset() {
    return function (dispatch) {
        dispatch({type: 'RESET_<%= uppercaseName %>S'})
    }
}

export function resetTemp() {
    return function (dispatch) {
        dispatch({type: 'RESET_TEMP'})
    }
}
