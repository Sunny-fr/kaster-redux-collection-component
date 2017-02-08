import React from 'react'
import { fetchAll, fetchOne, flatten, reset, remove, interpolate } from '../actions/<%= lowercaseName %>Actions'


export class AbstractComponent extends React.Component {
  render () {
    if (this.gotError()) return null
    if (!this.isLoaded()) return  (<p>loading</p>)
    return (<div>loaded (you should do something with your view :) )</div>)
  }
}

export class AbstractCollectionComponent extends AbstractComponent {

  remove = (data) => {
    this.props.dispatch(remove(data))
  }

  fetch = () => {
    this.props.dispatch(fetchAll())
  }

  getCollection() {
    return flatten(this.props.collection)
  }

  isLoaded (){
    return this.props.collectionLoaded
  }

  componentWillMount (){
    if (!this.isLoaded()) this.fetch()
  }
  componentWillUnmount() {
    this.props.dispatch(reset())
  }
}

export class AbstractModelComponent extends AbstractComponent {

    fetch = (params) => {
        console.log('fetch', params.name)
        this.props.dispatch(fetchOne(params))
    }

    _getModel(newProps) {
        const props = newProps || this.props
        return this.isNew(props) ? props.tempModel : props.collection[this.getKey(props)]
    }

    isNew(props) {
        return !this.getKey(props)
    }

    /** CHANGE VALUES HERE **/
    getParams(props){
        const { prop1, prop2, prop3} = props || this.props
        return { prop1, prop2, prop3}
    }

    getKey(props){
        return interpolate(null, this.getParams(props || this.props))
    }

    getModel(props) {
        return this._getModel(props).model
    }

    getMetas(prop, newProps) {
        if (!this._getModel(newProps)) return null;
        return prop ? this._getModel(newProps).metas[prop] : this._getModel(newProps).metas
    }

    gotError(props) {
        return !!this.getMetas('error', props || this.props)
    }

    isFetching(props){
        return this.getMetas('fetching', props)
    }

    isLoaded(props) {
        return !(!this._getModel(props) || !this.getMetas('loaded', props))
    }

    canUpdate(_props){
        const props = _props || this.props
        //console.log(this.getKey(props),'is new',this.isNew(props), 'is loaded',this.isLoaded(props), 'is fetching', this.isFetching(props), 'issued',  this.gotError(props))
        return !this.isNew(props) && !this.isLoaded(props) && !this.isFetching(props) && !this.gotError(props)
    }

    componentWillReceiveProps(props) {
        if (this.canUpdate(props)) this.fetch(this.getParams(props))
    }

    componentWillMount() {
        if (this.canUpdate()) this.fetch(this.getParams())
    }
}


//REQUIRED FOR EACH COMPONENT
// export default connect((store) => {
//   return {
//     tempModel: store.<%= lowercaseName %>.temp,
//     collectionLoaded: store.<%= lowercaseName %>.loaded,
//     collection: store.<%= lowercaseName %>.collection
//   }
// })(YOUR_COMPONENT)
