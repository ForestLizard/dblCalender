import React from "react";
import { Link } from "react-imvc/component";
import Layout from "../component/Layout";

//import * as utl from "../utl"
import moment from "moment"



export default function View({ state, handler }) {
  

    let m = moment("2014-1-9")
    return(

        <div>
    
            {m.month()}
        </div>

    )
}