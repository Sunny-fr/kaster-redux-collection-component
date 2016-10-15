import React from 'react'
import { fetch<%= capitalizeName %> } from '../actions/<%= lowercaseName =>Actions'
// your loader
export default class Abstract<%= capitalizeName %>Component extends React.Component {

  fetch = (params) => {
    this.props.dispatch(fetch<%= capitalizeName %>(params))
  }

  render () {
    if (!this.isLoaded()) return  (<p>loading</p>)
  }

  getArgs () {
    const { code, type } = this.props.params ? this.props.params : this.props
    return { code, type }
  }

  getKey () {
    return this.props._id(this.getArgs())
  }

  getModel () {
    return this.props.<%= lowercaseName =>[this.getKey()]
  }

  isLoaded (){
    const item = this.getModel()
    return !(!item || !item.metas.loaded)
  }

  componentWillMount (){
    if (!this.isLoaded()) this.fetch(this.getArgs())
  }

}


// REQUIRED FOR EACH COMPONENT
// export default connect((store) => {
//   return {
//     <%= lowercaseName =>: store.<%= lowercaseName =>.collection,
//     _id: store.<%= lowercaseName =>._id
//   }
// })(Abstract<%= capitalizeName %>Component)
