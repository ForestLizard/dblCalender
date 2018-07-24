import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './view'
//import * as utl from '../utl'

export default class Home extends Controller {
    Model = Model;
    View = View;

    /* componentWillCreate(){
        //计算时间间隔
        const state = this.store.getState()
        const { startDate, endDate } = state
        const ddr = utl.defineDateReletion

        CACULATEDATEDIF(ddr(startDate, endDate))

   } */
  
}
