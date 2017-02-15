import React from 'react'
import {fetchAll, fetchOne, flatten, reset, remove, interpolate} from '../actions/<%= lowercaseName %>Actions'


export class AbstractComponent extends React.Component {
    render() {
        if (this.gotError()) return null
        if (!this.isLoaded()) return (<p>loading</p>)
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

    isLoaded() {
        return this.props.collectionLoaded
    }

    componentWillMount() {
        if (!this.isLoaded()) this.fetch()
    }

    componentWillUnmount() {
        this.props.dispatch(reset())
    }
}

export class AbstractModelComponent extends AbstractComponent {

    /** OVERRIDE / REWRITE HERE **/
    getParams = (props) => {
        const { prop1, prop2, prop3} = props || this.props
        return !prop1 || !prop2 || !prop3 ? null : { prop1, prop2, prop3}
    }


    /* ACTIONS */

    fetch = (params) => {
        this.props.dispatch(fetchOne(params))
    }

    /* ACTIONS */

    _getModel(newProps) {
        const props = newProps || this.props
        return this.isNew(props) ? props.tempModel : props.collection[this.getKey(props)]
    }

    isNew(props) {
        return !this.getKey(props)
    }

    getKey(props){
        const params = this.getParams(props || this.props)
        return !params ? null : interpolate(null, params)
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


export class AbstractFormModelComponent extends AbstractModelComponent {

    componentDidUpdate() {
        /** OVERRIDE / REWRITE HERE **/
        if (this.props.forward) {
            this.resetTempModel()
            const {prop1, prop2, prop3} = this.getModel()
            // DO SOMETHING HERE navigate/to/prop1/prop2/prop3
        }
    }

    constructor(props) {
        super(props)
        this.silentState = {
            edited: {} // Not pristines :-)
        }
    }

    /* ACTIONS */

    edit = (model) => {
        this.props.dispatch(update(model, this.getParams()))
    }

    submit = () => {
        const model = this.getModel()
        const params = this.getParams() || this.getParams(model)
        this.props.dispatch(save(model, params))
    }

    resetTempModel = () => {
        this.props.dispatch(resetTemp())
    }

    /* ACTIONS */

    setSilentState = (data) => {
        this.silentState = Object.assign({}, this.silentState, data)
    }

    changeProp = (prop, value) => {
        this.setPristine(prop)
        this.edit({[prop]: value})
    }

    setPristine(prop) {
        const edited = {
            ...this.silentState.edited,
            [prop]: true
        }
        this.setSilentState({edited})
    }

    getEditedStatus = (prop) => {
        return prop ? this.silentState.edited[prop] : this.silentState.edited
    }

}