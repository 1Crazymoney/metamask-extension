import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Media from 'react-media'
import MenuBar from '../menu-bar'
import Button from '../../ui/button'
const h = require('react-hyperscript')

const SES = require('ses');


// /**
//  * React component which renders the given content into an iframe.
//  * Additionally an array of stylesheet urls can be passed. They will 
//  * also be loaded into the iframe.
//  */
// class IFrameContainer extends React.Component {

//   static propTypes = {
//     content: React.PropTypes.string.isRequired,
//     stylesheets: React.PropTypes.arrayOf(React.PropTypes.string),
//   };

//   /**
//    * Called after mounting the component. Triggers initial update of
//    * the iframe
//    */
//   componentDidMount() {
//     this._updateIframe()
//   }

//   componentDidUpdate() {
//     this._updateIframe()    
//   }

//   /**
//    * Updates the iframes content and inserts stylesheets.
//    * TODO: Currently stylesheets are just added for proof of concept. Implement
//    * and algorithm which updates the stylesheets properly.
//    */
//   _updateIframe() {
//     const iframe = this.refs.iframe;
//     const document = iframe.contentDocument;
//     document.body.innerHTML = this.props.content;
//   }

//   /**
//    * This component renders just and iframe
//    */
//   render() {
//     return <iframe ref="iframe"/>
//   }
// }





export default class PluginView extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    showDepositModal: PropTypes.func,
    history: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.paramValues = []
  }

  renderPluginButtons () {
    if (!this.props.selectedPluginScript){ return }
    let elements = []
    const pluginInterface = this.props.selectedPluginScript
    console.log(pluginInterface)

    for (var k = 0; k < pluginInterface.actions.length; k++){
      const index = k
      if (!this.paramValues[index]){
	this.paramValues.push([])
	console.log("def paramValues")
      }
      for (var i = 0; i < pluginInterface.actions[index].params.length; i++){
	const subIndex = i
	const param = pluginInterface.actions[index].params[subIndex]
	elements.push(h('input', {
	  key: "input" + index + subIndex,
	  className: 'customize-gas-input',
	  placeholder: param.name,
	  type: param.type,
	  onChange: e => {
	    console.log("changed")
	    this.paramValues[index][subIndex] = e.target.value
	  },
	}))

      }

      elements.push(<Button
		    key={"button"+k}
		    type="primary"
		    className="plugin-view__button"
		    onClick={() => {
		      console.log(this.paramValues[index])
		      pluginInterface.actions[index].call(...this.paramValues[index])
		    }}
		    >
		    {pluginInterface.actions[index].name}
		    </Button>)

    }
    return elements
  }

  renderSandboxedUi(){

    // Pass Purecomponent ?
    // create render function in hosted js

    const s = SES.makeSESRootRealm({consoleMode: 'allow', errorStackMode: 'allow', mathRandomMode: 'allow'});    
    return s.evaluate(this.props.selectedPluginScript.ui.call, {React, provider: this.provider, pluginApi: this.props.selectedPluginScript.pluginApi})
  }


  componentDidMount() {
  }

  render () {
    console.log("PROPS in plugin view", this.props)
    let html = ""
    if (this.props.selectedPluginScript){
      html = this.props.selectedPluginScript.ui.html
    }
    return (
	<div>
	<div> ----------------------------------------------------------------------------   Plugin view  -------------------------------------------------------------------------------  </div>
	<div> plugin uid: {this.props.selectedPluginUid}    </div>
	<div> Metamask generated UI    </div>	
	<div> {this.renderPluginButtons.bind(this)()} </div>

        <div id="pluginIframe" ref="pluginIframe">


	{this.renderSandboxedUi.bind(this)()}
        </div>

	</div>	
    )    
  }
}

//	<div dangerouslySetInnerHTML = {{ __html: html}} /> 
//	<IFrameContainer content={html}/>	
    //`<h1>Title</h1><button class="btn btn-primary">Test</button>`

