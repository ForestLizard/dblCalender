export const initialState ={
    //initStartDate: {},
    //initEndDate: {} ,
    dateNow: '2018-7-24',
    startDate: '2018-7-26',
    endDate: '2018-8-9' ,
    calenderClass: false,//true—去程日历（默认），false——返程日历，
    departure:'',
    destination: '',
    dateDif: 1,
    dateDifMax: '365',//calenerClass为0——365天(默认)，1——30，
    //currentStartDate: {},
    //currentEndDate: {},
    currentTab: true,//true——start，false——end


}


export const SWITCHTAB = (state, newCurrentTab) => ({
    ...state,
    currentTab: newCurrentTab
})

//选择开始时间
export const SELECTSTARTDATE = (state, newStartDate) => ({
    ...state,
    startDate: newStartDate
})

//选择结束时间
export const SELECTENDDATE = (state, newEndDate) => ({
    ...state,
    startDate: newEndDate
})

export const CACULATEDATEDIF = (state, newDateDif) => ({
    ...state,
    dateDif: newDateDif
})
