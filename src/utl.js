////工具函数

//判断两个日期之间的前后关系和相隔时间
//date1,date2:"2017-2-3"
//返回相隔的天数，若为负则后面日期在前
 export const defineDateReletion = (date1, date2) =>{
    let a_date1 = date1.split("-");
    let a_date2 = date2.split("-");

    let d_date1 = new Date();
    d_date1.setUTCFullYear(a_date1[0], a_date1[1] - 1, a_date1[2]);
    let d_date2 = new Date();
    d_date2.setUTCFullYear(a_date2[0], a_date2[1] - 1, a_date2[2]);
    let unix_date1 = d_date1.getTime();
    let unix_date2 = d_date2.getTime();
    //let dif = unix_date2 - unix_date1;
    let i = 0
    for (var k = unix_date1; k <= unix_date2;) {
        i++
        k = k + 24 * 60 * 60 * 1000;
    }

    return i-1
}
