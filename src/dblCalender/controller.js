import Controller from 'react-imvc/controller'
import * as Model from './model'
import View from './view'

export default class Home extends Controller {
   

    preload = {
        main: "/css/main.css",
        other: "/css/other.css",
        base: "/css/base.css"
      };
    Model = Model;
    View = View;

}

