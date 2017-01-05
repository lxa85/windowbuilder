import React, { Component, PropTypes } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Layout from '../react-flex-layout/react-flex-layout'
import LayoutSplitter from '../react-flex-layout/react-flex-layout-splitter'

import RepToolbar from "./RepToolbar";
import DataField from 'components/DataField'

import RepTabularSection from './RepTabularSection'

import DumbLoader from '../DumbLoader'

import classes from './RepMaterialsDemand.scss'


export default class RepMaterialsDemand extends Component {

  static propTypes = {
    _obj: PropTypes.object,
    _acl: PropTypes.string.isRequired,

    handleSave: PropTypes.func.isRequired,
    handleRevert: PropTypes.func.isRequired,
    handleMarkDeleted: PropTypes.func.isRequired,
    handlePrint: PropTypes.func.isRequired,
    handleAddRow: PropTypes.func.isRequired,
    handleDelRow: PropTypes.func.isRequired
  }

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  constructor(props, context) {

    super(props, context);

    const {$p} = context
    const {_obj} = props
    const class_name = _obj._manager.class_name + ".specification"

    $p.cat.scheme_settings.get_scheme(class_name)
      .then(this.handleSchemeChange)

  }

  state = {}

  handleSave = () => {
    this.props._obj.calculate()
      .then(() => {
        this.refs.specification.setState({groupBy: []})
        //this.forceUpdate()
      })
  }

  handlePrint = () => {

  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {
    this.setState({
      scheme,
      columns: scheme.columns()
    })
  }

  render() {

    const {props, state, handleSave, handlePrint, handleSchemeChange} = this
    const { _obj, height, width, handleClose } = props
    const {columns, scheme} = state

    if (!scheme) {
      return <DumbLoader title="Чтение настроек компоновки..."/>

    }
    else if (!_obj) {
      return <DumbLoader title="Чтение объекта данных..."/>

    }
    else if (!columns || !columns.length) {
      return <DumbLoader title="Ошибка настроек компоновки..."/>

    }

    return (

      <div>

        <RepToolbar
          handleSave={handleSave}
          handlePrint={handlePrint}
          handleClose={handleClose}

          _obj={_obj}

          scheme={scheme}
          handleSchemeChange={handleSchemeChange}
        />

        <div className={classes.cont} style={{width: width - 20, height: height - 50}}>

          <RepTabularSection
            _obj={_obj}
            _tabular="specification"
            ref="specification"
            minHeight={height - 60}
            scheme={scheme}
          />

        </div>

      </div>

    );
  }
}

