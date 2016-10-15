/* GENERATED WITH CASTER */
// ID GENERATOR

function _idGenerator (params) {
  return Object.keys(params).sort().map( k => { return '/' + k + '/' + params[k] }).join()
}

/* MODEL DEFAULTS */
const defaultModel = {}

/* STREAM REDUCER STRUCTURE */
const defaultCollectionItem = {
  metas: {loaded: false, loading: false, error: false},
  model: {}
}

const defaultState = {
  collection: {},
  _id: _idGenerator
}

export default function reducer(state=defaultState, action) {

  switch (action.type) {
    case "FETCH_<%= uppercaseName %>": {
      const collection = {...state.collection}
      const _id = _idGenerator(action.payload.params)
      collection[_id] = !collection[_id]
                             ? {...defaultCollectionItem, model: Object.assign({}, defaultModel, action.payload.params)}
                             : {...collection[_id], metas: {...collection[_id].metas, loaded: false, loading: true} }

      return {
        ...state,
        collection
      }
    }
    case "FETCH_<%= uppercaseName %>_REJECTED": {
      // IF NOT FOUND
      const collection = {...state.collection}
      const _id = _idGenerator(action.payload.params)
      const <%= lowercaseName %> = {...collection[_id]}
      const metas = {...<%= lowercaseName %>.metas, loaded: false, loading:false, error: action.payload.data}
      collection[_id] = { metas }
      return {
        ...state,
        collection
      }
    }

    case "FETCH_<%= uppercaseName %>_FULFILLED": {
      const collection = {...state.collection}
      const _id = _idGenerator(action.payload.params)
      collection[_id] = {metas: {loaded:true, loading: false, error:false}, model: action.payload.data}
      return {
        ...state,
        collection
      }
    }

  }

  return state
}
