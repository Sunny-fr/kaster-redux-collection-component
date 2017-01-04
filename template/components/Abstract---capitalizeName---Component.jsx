import React from 'react'
import { fetchAll, fetchOne, flatten, reset, remove } from '../actions/<%= lowercaseName %>Actions'


export class AbstractComponent extends React.Component {
  render () {
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
    this.props.dispatch(fetchOne(params))
  }

  _getModel (newProps) {
    const props = newProps || this.props
    return this.isNew(props) ? props.tempModel : props.collection[this.getKey(props)]
  }

  isNew (props) {
    return !this.getKey(props)
  }

  getKey (props) {
    return props ? props.id : this.props.id
  }

  getModel () {
    return this._getModel().model
  }

  getMetas (prop, newProps) {
    if (!this._getModel(newProps)) return null;
    return prop ? this._getModel(newProps).metas[prop] :  this._getModel(newProps).metas
  }

  gotError(props) {
      return !!this.getMetas('error', props || this.props)
  }

  isLoaded(props) {
      return !(!this._getModel(props) || !this.getMetas('loaded', props))
  }

  componentWillReceiveProps(props) {
      if (!this.isNew(props) && !this.isLoaded(props) && !this.gotError(props)) this.fetch({name: this.getKey(props)})
  }

  componentWillMount() {
      if (!this.isNew() && !this.isLoaded() && !this.gotError()) this.fetch({name: this.getKey()})
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
