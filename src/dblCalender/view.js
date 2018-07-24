import React from "react";
import { Link, Style } from "react-imvc/component";
import Layout from "../component/Layout";
import Calendar from "./component/Calendar";

//import * as utl from "../utl"
import moment from "moment"



export default function View({ state, handler }) {
   
    const { dateNow, startDate, endDate, calenderClass } = state
   

    const getGoCldItemClassName = (date, dateNow, startDate) => {
    //获取去程日历每个item的类名，参数类型为字符串

        let _date = moment(date)
        let _dateNow = moment(dateNow)
        let _startDate = moment(startDate)



        let className = 'cui_calendar_item cui_cld_day_havetxt'
      
        if(_date.diff(_dateNow, 'days')<0 || _date.diff(_dateNow.add(365, 'days'), 'days')>0){
            className = `${className} cui_cld_invalid cui_cld_daypass`
        }else{
            className = `${className} cui_cld_valid`
            if(_date.isSame(startDate)){
                className = `${className} checked_start`
            }
        }
        return className
                
    }


    const getbackCldItemClassName = (date, dateNow, startDate, endDate) => {
        //获取返程日历每个item的类名，参数类型为字符串

        let _date = moment(date)
        let _dateNow = moment(dateNow)
        let _startDate = moment(startDate)
        let _endDate = moment(endDate)
    

        let className = 'cui_calendar_item cui_cld_day_havetxt'
       
        if(_date.diff(_startDate, 'days')<0 || _date.diff(_dateNow.add(365, 'days'), 'days')>0){//询问结束date是从今天起365还是从去程日期起365天
            className = `${className} cui_cld_invalid cui_cld_daypass`
        }else{
            className = `${className} cui_cld_valid`
            if(_date.isSame(_startDate)){
                className = `${className} checked_start`
            }
            if(_date.isSame(_endDate)){
                className = `${className} checked_back`
            }
            if(_date.isAfter(_startDate) && _date.isBefore(_endDate)){
                className = `${className} checked_middle`
            }
        }
        return className
                
    }

    let dateOptions = dateOptions? dateOptions: {}
    if(calenderClass){
        //去程日历
        //日历显示几个月，从哪天到哪天，由今天的日期来定
        //eg： 去程 今天2018 7-23  2018-7-1 ———2019-7-31        13个月
        let _dateNow = moment(dateNow)
        let goCldStartTime = `${_dateNow.year()}-${_dateNow.month()+1}-${1}`
        goCldStartTime = moment(goCldStartTime)

        let goCldEndTimeDaysInMonth = moment(`${_dateNow.year()+1}-${_dateNow.month()+1}`).daysInMonth()
        let goCldEndTime = moment(`${_dateNow.year()+1}-${_dateNow.month()+1}-${goCldEndTimeDaysInMonth}`)

        
        
        
        while(!goCldStartTime.isAfter(goCldEndTime)){
            
            dateOptions[goCldStartTime.format('YYYY-MM-DD')] = {
                className: getGoCldItemClassName(goCldStartTime.format('YYYY-MM-DD'), dateNow, startDate )
            }
            goCldStartTime.add(1, 'days')
        }


        

    }else{
        //返程日历
        //eg： 返程 从去(2018-7-26)开始 2018-7-1 ———2019-8-30       14个月
        let _startDate = moment(startDate)
        let backCldStartTime = `${_startDate.year()}-${_startDate.month()+1}-${1}`
        backCldStartTime = moment(backCldStartTime)

        let backCldEndTime
        if(backCldStartTime.month() != 11){      
            let backCldEndTimeDaysInMonth = moment(`${_startDate.year()+1}-${_startDate.month()+2}`).daysInMonth()
            backCldEndTime = moment(`${_startDate.year()+1}-${_startDate.month()+2}-${backCldEndTimeDaysInMonth}`)
        }else{
            let backCldEndTimeDaysInMonth = 31
            backCldEndTime = moment(`${_startDate.year()+2}-${1}-${backCldEndTimeDaysInMonth}`)

        }

        while(!backCldStartTime.isAfter(backCldEndTime)){
            
            dateOptions[backCldStartTime.format('YYYY-MM-DD')] = {
                className: getbackCldItemClassName(backCldStartTime.format('YYYY-MM-DD'), dateNow, startDate, endDate)
            }
            backCldStartTime.add(1, 'days')
        }


       
    }  

    return(
        
        <Layout>
            <Style name="main" />
            <Style name="other" />
            <Style name="base" />
            
            <div style = {{ display: calenderClass?'block':'none' }} className = {2}>
                <Calendar displayMonthNum = {13}  dateOptions= {dateOptions} >
                </Calendar> 
            </div>
            <div style = {{ display: calenderClass?'none':'block'}} className = {2}>
                 <Calendar displayMonthNum = {14}  dateOptions= {dateOptions} >
                 </Calendar> 
            </div>
        </Layout>
        

    ) 

   
    

}