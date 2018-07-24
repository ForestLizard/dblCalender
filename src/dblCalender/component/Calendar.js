/**
 * @author liaoyf
 * @notice 不要在此公共组件添加业务代码!
 * 如现有功能不能满足业务需求，添加扩展功能
 * @param props
 * onItemClick:(dateObj)=>{},//点击日历回调 dateObj.date
 * showFestive: true or false,//展示节假日 默认true
 * showWeekHead: true or false,//日历上的星期 默认true
 * startDate: "2017-10-09",//默认今天
 * endDate: "2018-10-09",//默认今天+365
 * displayMonthNum: 12,//展示几个月，默认12
 * customValidDate: false,//根据dateOptions的数据，定制化可点击日期,此时 endDate无效
 * showToday: true or false,//展示 今天、明天、后天 默认true
 * needFixedMonthHeader: true or false,//滚动时月份头固定，默认为true
 * anchorDate: "2018-02-20" //锚定日期, 为空则不锚定
 * dateOptions: {//扩展显示 用法见 example
 *  '2017-10-20':{
 *      isValid:true,//此属性 customValidDate 为true时生效
 *      className:'',//当前日期自定义class
 *      style:{}//支持不用class 直接写style
 *      subStr:'test', //[<span className="">123</span>],用数组传进来自定义的 subtitle
 *      //设置 subStr后 subText、subClass不生效
 *      subText:'test'//当前日期子标题 使用的是Span标签
 *      subClass:'',//子标题的class
 *  }
 * }
 */
import React from "react"
import classnames from 'classnames'
//公历节日
const solarHoliday = {
    "01-01": "元旦",
    "02-14": "情人节",
    "05-01": "劳动节",
    "06-01": "儿童节",
    "09-10": "教师节",
    "10-01": "国庆节",
    "12-25": "圣诞节"
}
const lunarHoliday = {
    "2018-02-15": "除夕",
    "2018-02-16": "春节",
    "2018-03-02": "元宵节",
    "2018-04-05": "清明",
    "2018-06-18": "端午节",
    "2018-08-17": "七夕",
    "2018-09-24": "中秋",
    "2018-10-17": "重阳",

    "2019-02-04": "除夕",
    "2019-02-05": "春节",
    "2019-02-19": "元宵",
    "2019-04-05": "清明",
    "2019-06-07": "端午",
    "2019-08-07": "七夕",
    "2019-09-13": "中秋节",
    "2019-10-07": "重阳"
}
const holidayInfoApi = 'https://m.ctrip.com/restapi/soa2/12378/json/getGeneralConfigData?key=Holiday'
const getIntervalDate = (startDate, displayMonthNum) => {
    const startObj = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const endObj = new Date(
        new Date(startObj).setMonth(startDate.getMonth() + displayMonthNum - 1)
    )
    let outPut = []
    while (endObj.getTime() - startObj.getTime() >= 0) {
        outPut.push({
            year: startObj.getFullYear(),
            month: startObj.getMonth() + 1
        })
        startObj.setMonth(startObj.getMonth() + 1)
    }
    return outPut
}
const format = date => {
    if(typeof date === 'string'){
        date = date.replace('-','/')
    }
    date = new Date(date)
    let monthStr = ("00" + (date.getMonth() + 1)).substr(-2)
    let dayStr = ("00" + date.getDate()).substr(-2)
    return `${date.getFullYear()}-${monthStr}-${dayStr}`
}
export const WeekHeader=()=>{
    const week = ["日", "一", "二", "三", "四", "五", "六"]
    return (
        <ul className="cldweek" style={{'overflow': 'visible'}}>
            {week.map((wk, key) => {
                return <li key={key}>{wk}</li>
            })}
        </ul>
    )
}
const scrollEvents = ['scroll', 'touchmove']
export default class Calendar extends React.PureComponent {
    static defaultProps = {
        onItemClick: () => {},
        showFestive: true,
        startDate: format(new Date()),
        endDate: format(new Date().setDate(new Date().getDate() + 365)),
        displayMonthNum: 12,
        showToday: true,
        showWeekHead: true,
        needFixedMonthHeader: true,
        anchorDate: '',
        dateOptions: {
            // '2017-10-20':{
            //     className:'',
            //     subStr:'test',
            //     style:{}
            // }
        }
    }
    constructor(props){
        super(props)
        this.state = {
            holidayInfo: {}
        }
        this.monthHeaders = [] //所有月份头DOM
        this.monthHeadersTop = [] //所有月份头距顶部的距离
        this.monthHeaderHeight = 0
        this.onCalendarScroll = this.onCalendarScroll.bind(this)
    }
    componentDidMount() {
        if(this.props.showFestive){ //获取节日及班休信息
            this.getHolidayInfo()
        }
        if(this.props.needFixedMonthHeader){ //需要月份头固定
            this.bindScrollEvent()
            this.computeMonthHeaderTop()
            this.initMonthHeaderFixed()
        }
        if(this.props.anchorDate){ //需要锚定到某个日期
            this.anchorDate()
        }
    }
    componentWillUnmount() {
        this.unbindScrollEvent()
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.needFixedMonthHeader){
            this.bindScrollEvent()
            this.computeMonthHeaderTop()
        } else {
            this.unbindScrollEvent()
        }
    }
    bindScrollEvent() {
        scrollEvents.forEach(event => {
            this.cldContent.removeEventListener(event, this.onCalendarScroll)
            this.cldContent.addEventListener(event, this.onCalendarScroll)
        })
    }
    unbindScrollEvent() {
        scrollEvents.forEach(event => {
            this.cldContent.removeEventListener(event, this.onCalendarScroll)
        })
    }
    onCalendarScroll() {
        const scrollTop = this.cldContent.scrollTop
        const monthHeadersTop = this.monthHeadersTop
        const length = monthHeadersTop.length
        for(let i = 0; i < length; i++){
            let height = monthHeadersTop[i]
            if(scrollTop >= height && (scrollTop < monthHeadersTop[i + 1] || i === length - 1)){
                if(scrollTop > monthHeadersTop[i + 1] - this.monthHeaderHeight){
                    this.fixedMonthHeader.style.top = (monthHeadersTop[i + 1] - this.monthHeaderHeight) - scrollTop + "px"
                } else {
                    this.fixedMonthHeader.style.top = 0
                }
                this.fixedMonthHeader.innerHTML = this.monthHeaders[i] && this.monthHeaders[i].innerHTML
                return
            }
        }
    }
    computeMonthHeaderTop() {
        this.monthHeaders = this.cldContent.getElementsByClassName("month_header") || []
        this.monthHeadersTop = []
        ;[].forEach.call(this.monthHeaders, (item) => {
            this.monthHeadersTop.push(item.offsetTop)
        })
    }
    initMonthHeaderFixed() {
        if(this.monthHeaders.length){
            let currentMonthHeader = this.monthHeaders[0]
            this.monthHeaderHeight = currentMonthHeader.scrollHeight
            this.fixedMonthHeader = currentMonthHeader.cloneNode(true)
            this.fixedMonthHeader.className = "cldmonth cldmonth_fixed"
            this.fixedMonthHeader.style.position = 'absolute'
            this.cldContent.parentNode.appendChild(this.fixedMonthHeader)
        }
    }
    anchorDate() {
        const anchorDateDom = this.cldContent.getElementsByClassName('anchorDate')[0]
        if(anchorDateDom){
            this.cldContent.scrollTop = anchorDateDom.offsetTop + anchorDateDom.parentNode.offsetTop - this.monthHeaderHeight
        }
    }
    getHolidayInfo() {
        fetch(holidayInfoApi).then(response => {
            response.text().then(responseText => {
                const responseData = JSON.parse(responseText)
                const configData = JSON.parse(responseData.rspJsonStr)
                const info = this.formatHolidayInfo(configData.configList[0])
                this.setState({
                    holidayInfo: info
                })
            }).catch(() => {})
        }).catch(() => {})
    }
    formatHolidayInfo(holidayData) {
        let result = {
            workDay: {},
            restDay: {},
            holiday: {}
        };
        const holidayContent = JSON.parse(holidayData.configContent)
        const holidayArr = holidayContent.Holiday
        holidayArr.forEach(item => {
            const { 'Year': year, 'HolidayList': holidayList } = item
            holidayList.forEach(holidayItem => {
                const {
                    'HolidayDay': holidayDay,
                    'HolidayCount': holidayCount,
                    'StartDay': startDay,
                    'EndDay': endDay,
                    'HolidayName': holidayName,
                    'WorkDay': workDay
                } = holidayItem

                holidayDay && (result.holiday[`${year}-${holidayDay.slice(0,2)}-${holidayDay.slice(-2)}`] = holidayName)
                if(workDay){
                    const workDayArr = workDay.split(',')
                    workDayArr.forEach(workDayItem => {
                        result.workDay[`${year}-${workDayItem.slice(0,2)}-${workDayItem.slice(-2)}`] = '班'
                    })
                }
                let tempDate = new Date(`${year}/${startDay.slice(0,2)}/${startDay.slice(-2)}`)
                const endDate = new Date(`${year}/${endDay.slice(0,2)}/${endDay.slice(-2)}`)
                while(tempDate.valueOf() <= endDate.valueOf() && holidayCount){
                    const monthStr = ('0' + (tempDate.getMonth() + 1)).slice(-2)
                    const dayStr = ('0' + tempDate.getDate()).slice(-2)
                    result.restDay[`${year}-${monthStr}-${dayStr}`] = "休"
                    tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1))
                }
            })
        })
        return result
    }
    handleClick = dayObj => e => {
        this.props.onItemClick(dayObj)
    }
    dealDays({ year, month }, props, todayObj) {
        const { holidayInfo = {} } = this.state;
        const { showFestive, startDate, endDate, anchorDate, dateOptions = {},customValidDate } = props
        const startDateTimeSpan = new Date(
            startDate.replace(/-/g, "/")
        ).getTime()
        const endDateTimeSpan = new Date(endDate.replace(/-/g, "/")).getTime()
        //当前月前面的空天数
        let emptyDays = new Date(year, month - 1, 1).getDay(),
            dayLists = []
        for (let i = 0; i < emptyDays; i++) {
            dayLists.push({ day: "" })
        }
        //当前月份的天数
        let days = new Date(year, month, 0).getDate()
        let monthStr = ("00" + month).substr(-2)
        for (let i = 1; i <= days; i++) {
            let date = `${year}-${monthStr}-${("00" + i).substr(-2)}`
            let nowTimeSpan = new Date(date.replace(/-/g, "/"))
            let day = todayObj[date] || i
            let option = dateOptions[date] || {}
            let supStr = ""
            let className = ""
            if (showFestive) { //节假日及班休信息
                if(Object.keys(holidayInfo).length){
                    supStr = holidayInfo.holiday[date] || holidayInfo.workDay[date] || holidayInfo.restDay[date] || ''
                    if(holidayInfo.workDay[date]){
                        className = "cld_working"
                    } else if(holidayInfo.restDay[date]){
                        className = "cld_holiday"
                    }
                } else {
                    supStr = solarHoliday[`${monthStr}-${("00" + i).substr(-2)}`] || lunarHoliday[date]
                }
            }
            if(date === anchorDate) className += " anchorDate"
            let isValid = true
            if(customValidDate){
                isValid = option.isValid
            }else{
                isValid = !(
                    nowTimeSpan < startDateTimeSpan ||
                    nowTimeSpan > endDateTimeSpan
                )
            }
            let dayObj = {
                date,
                day,
                supStr,
                isValid,
                option,
                className
            }
            dayLists.push(dayObj)
        }
        return dayLists
    }
    dealMonths(props) {
        let {
            startDate = "",
            displayMonthNum,
            showToday
        } = props
        let dateObj = new Date(startDate.replace(/-/g, '/'))
        let monthArr = getIntervalDate(dateObj, displayMonthNum)
        let todayObj = {}
        if (showToday) {
            const now = new Date(),
                day = new Date().getDate(),
                today = format(now),
                tomorrow = format(now.setDate(day + 1)),
                afterTomorrow = format(now.setDate(day + 2))
            todayObj = {
                [today]: "今天",
                [tomorrow]: "明天",
                [afterTomorrow]: "后天"
            }
        }
        return monthArr.map(res => {
            const { year, month } = res
            let dayLists = this.dealDays({ year, month }, props, todayObj)
            return {
                showMonth: `${year}年${month}月`,
                dayLists
            }
        })
    }
    getMonthView({ showMonth, dayLists }) {
        const monthTitle = (
            <h2 className="cldmonth month_header">
                {showMonth}
            </h2>
        )
        const daysDom = (
            <ul className="cui_cld_daybox" key={showMonth}>
                {dayLists.map((dayObj, key) => {
                    const { date, day, isValid, option = {}, supStr, className} = dayObj
                    let dayClass = classnames({
                        [option.className]: option.className,
                        cld_daypass: !isValid,
                        [className]: className === "cld_working" && !isValid ? '' : className
                    })
                    let style = option.style || {}
                    return (
                        <li
                            key={key}
                            onClick={isValid && this.handleClick(dayObj)}
                            className={dayClass}
                            style={style}
                        >
                            {supStr? <ins>{supStr}</ins> : null}
                            <em>{day}</em>
                            {option.subStr?option.subStr:<span className={option.subClass}>{option.subText}</span>}
                        </li>
                    )
                })}
            </ul>
        )
        return [monthTitle, daysDom]
    }
    render() {
        const monthInfos = this.dealMonths(this.props)
        return (
            <div className="dp_calendar" ref={(ele) => {this.calendar = ele}}>
                {this.props.showWeekHead && WeekHeader()}
                <div className="flex_column" style={{'position': 'relative'}}>
                    <section
                        className="cldunit"
                        style={{
                            'overflowY': 'auto',
                            'WebkitOverflowScrolling': 'touch',
                            'WebkitFlex': 1,
                            'flex': 1,
                        }}
                        ref={ ele => this.cldContent = ele}
                    >
                        {monthInfos.map(info => {
                            return this.getMonthView(info)
                        })}
                    </section>
                </div>
            </div>
        )
    }
}
