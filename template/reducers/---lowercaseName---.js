/* GENERATED WITH CASTER */
/* <%= uppercaseName %> REDUCER STRUCTURE */

const default<%= capitalizeName %> = {
  metas: {loaded: false, fetching: false, valid: false, saving: false, deleting:false, forward: false},
  model: {}
}

const defaultState = {
  collection: {},
  temp: {metas: {...default<%= capitalizeName %>.metas, loaded:true}, model:{...default<%= capitalizeName %>.model}},
  fetching: false,
  fetched: false,
  error: null,
}

function mapModels(list) {
  return list.reduce((prev, current) => {
    prev[current.id] = Object.assign({}, default<%= capitalizeName %>, {
    model: current,
    metas: {...default<%= capitalizeName %>.metas, loaded: true, valid: true}
})
  return prev
}, {})
}


export default function reducer(state = defaultState, action) {

  function previousItem(key) {
    const collection = {...state.collection}
    return collection[key]
  }

  function update(item, key) {
    const collection = {...state.collection}
    collection[key] = item
    return collection
  }


  switch (action.type) {

    case "RESET_<%= uppercaseName %>S" : {
      return {...defaultState}
    }

    case "FETCH_<%= uppercaseName %>S": {
      return {...state, fetching: true}
    }

    case "FETCH_<%= uppercaseName %>S_FULFILLED": {
      return {...state, fetching: false, fetched: true, collection: mapModels(action.payload.data)}
    }

    case "FETCH_<%= uppercaseName %>S_REJECTED": {
      return {...state, fetching: false, fetched: false, error: action.payload.error}
    }

    case "FETCH_<%= uppercaseName %>": {
      const newState = {...state}
      const key = action.payload.params.id
      if (!state.collection[key]) {
        newState.collection[key] = {...default<%= capitalizeName %>, metas: {...default<%= capitalizeName %>.metas, fetching: true}}
      } else {
        newState.collection[key] = Object.assign({}, newState.collection[key], {
              metas: {
                  ...default<%= capitalizeName %>.metas,
            fetching: true
      }
      })
      }
      return newState
    }

    case "FETCH_<%= uppercaseName %>_REJECTED": {
      const collection = {...state.collection}
      const key = action.payload.params.id
        collection[key] = {metas: {loaded: false, fetching: false, valid: false, error: action.payload.error}, model:{...default<%= capitalizeName %>.model}}
        return {
          ...state,
          collection
    }
    }

    case "FETCH_<%= uppercaseName %>_FULFILLED": {
      const collection = {...state.collection}
      const key = action.payload.params.id
      collection[key] = {metas: {loaded: true, fetching: false, valid: true}, model: action.payload.data}
      return {
          ...state,
          collection
    }
    }

    case "RESET_TEMP" : {
      return {...state,temp:{metas: {...default<%= capitalizeName %>.metas, loaded:true}, model:{...default<%= capitalizeName %>.model}}}
    }

    case "EDIT_<%= uppercaseName %>": {
      const key = action.payload.data.id
      if (!key) {
        //model is new
        return {
            ...state,
            temp: {...state.temp, model: action.payload.data}
      }
      } else {
        const collection = {...state.collection}
        collection[key].model = action.payload.data
        return {
            ...state,
            collection
      }
      }
    }

    case "SAVE_<%= uppercaseName %>": {
      const key = action.payload.data.id
      const prev = !key ? state.temp : previousItem(key)
      const updated = {  ...prev, metas: {  ...prev.metas, saving: true } }
      if (!key) {
        //model is new
        return { ...state, temp: updated }
      } else {
        const collection = update(updated, key)
        return { ...state, collection }
      }
    }

    case "SAVE_<%= uppercaseName %>_REJECTED": {
      const key = action.payload.data.id
      const prev = !key ? state.temp : previousItem(key)
      const updated = { ...prev, metas: { ...prev.metas, error: action.payload.error, saving: false } }
      if (!key) {
        //model is new
        return { ...state, temp: updated }
      }else {
        const collection = update(updated, key)
        return {
            ...state,
            collection
      }
      }
    }

    case "SAVE_<%= uppercaseName %>_FULFILLED": {
      const key = action.payload.params.id
      const prev = !key ? state.temp : previousItem(key)
      const updated = { ...prev, metas: { ...prev.metas, saving: false, forward: !key }, model: action.payload.data }
      if (!key) {
        //model is new
        return { ...state, temp: updated }
      } else {
        const collection = update(updated, key)
        return {
            ...state,
            collection
      }
      }
    }

    case "DELETE_<%= uppercaseName %>": {
      const key = action.payload.data.id
      const prev = previousItem(key)
      const updated = {  ...prev, metas: {  ...prev.metas, deleting: true } }
      const collection = update(updated, key)
      return { ...state, collection }
    }

    case "DELETE_<%= uppercaseName %>_REJECTED": {
      const key = action.payload.data.id
      const prev = previousItem(key)
      const updated = { ...prev, metas: { ...prev.metas, error: action.payload.error, deleting: false } }
      const collection = update(updated, key)
      return {
          ...state,
          collection
    }
    }

    case "DELETE_<%= uppercaseName %>_FULFILLED": {
      const key = action.payload.params.id
      const collection = {...state.collection}
      delete collection[key]
      return {
          ...state,
          collection
    }
    }


    default:
      return state

  }

}
