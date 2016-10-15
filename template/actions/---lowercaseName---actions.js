import axios from 'axios'
import config from 'config'

const url_item = config.paths.streams.stream
const url_list = config.paths.streams.list

/**
  FETCH ONE
  @params: Object, set of params to enhance urls
**/
export function fetch<%= capitalizeName %> (params) {
  return function (dispatch) {
    dispatch({type: "FETCH_<%= uppcaseName %>", payload: {params}})
    const url = url_item
    axios.get(url).then(response=>{
      dispatch({type: "FETCH_<%= uppcaseName %>_FULFILLED", payload: {data: response.data, params}})
    }).catch((error) => {
      dispatch({type: "FETCH_<%= uppcaseName %>_REJECTED", payload: {error, params}})
    })
  }
}

/**
  FETCH LIST
**/
export function fetch<%= capitalizeName %>s (type) {
  return function (dispatch) {
    const url = url_list.replace('{type}', type)
    dispatch({type: 'FETCH_<%= uppcaseName %>S', payload: {type}})
    axios.get(url)
      .then((response) => {
        dispatch({type: 'FETCH_<%= uppcaseName %>S_FULFILLED', payload: {data: response.data, type}})
      })
      .catch((error) => {
        dispatch({type: 'FETCH_<%= uppcaseName %>S_REJECTED', payload: {error, type}})
      })
  }
}
