creatWindcarTime();

/**
 * js替换html模版函数
 * @param dta
 * @param tmpl
 * @returns {XML|string|void|*}
 */
function formatTpl(data, tmpl) {
    // console.log(dta);
    return tmpl.replace(/{([-.a-z0-9A-Z_]{1,})}/ig, function (m, n) {
        var array = n.split('.');
        var temp  = data;
        if (typeof data == 'object') {
            for (var i in array) {
                temp = temp[array[i]]
            }
        }
        return temp;
    });
}

// 创建windcarTime
function creatWindcarTime() {
    var date      = [],
        curDate   = new Date().getUTC(),
        curYear   = curDate.getFullYear(),
        curMonth  = curDate.getMonth() * 1 + 1,
        dateArray = [];

    // 自动读取当月(包括当月)后,三个月数据
    for (var i = 0; i < 3; i++) {
        // 如果过了今年,自动跳到明年
        if (curMonth + i > 12) {
            curYear  = curYear + 1;
            curMonth = curMonth - 12;
        }
        dateArray.push({
            year : curYear,
            mouth: curMonth + i,
        });
    }

    dateArray.forEach(function (item) {
        date.push(getmouthDate(item.year, item.mouth));
    });


    var calendarHtml               = '';
    var windcarTimeCalendarTplHtml = $('#windcar-time-calendar-tpl').html();

    var tplHeader   = '<p class="item-title">{year}年{mouth}月</p><div class="content">',
        tplFooter   = '</div>',
        tplMain     = '',
        tplCalendar = mzTpl(windcarTimeCalendarTplHtml);

    date.forEach(function (item, index) {
        item.forEach(function (n, index) {
            tplMain += tplCalendar(n);
            // console.log(n)
            if (n.status == 'cur') {
                // 初始化当前天
                var curDate = new Date().getUTC();
                curDate.setMonth(n.month);
                curDate.setFullYear(n.year);
                curDate.setDate(n.date);
                todayTime    = curDate.getTime();
                curCheckTime = todayTime;
            }
        });
        calendarHtml += formatTpl({
            year : item[0].year,
            mouth: item[0].mouth,
        }, tplHeader) + tplMain + tplFooter;
        tplMain = '';
    });

    $('.windcar-calendar-content').append('<div class="windcar-time-item">' + calendarHtml + '</div>');
}

/**
 * 获取year年mouth月的天数
 */
function getmouthDayNum(year, mouth) {
    var date = new Date().getUTC();
    date.setFullYear(year);
    date.setMonth(mouth + 1, 0);
    date.setDate(0);
    return date.getDate();
}

/**
 * 得到year年val月所有日期(从当月开始)
 */
function getmouthDate(year, mouth) {
    var date      = new Date().getUTC();
    var currDay   = date.getDate();
    var currYear  = date.getFullYear();
    var currMonth = date.getMonth() * 1 + 1;
    var data      = [];
    var status    = -1;
    // 得到month这个月一共多少天
    var daysNum   = getmouthDayNum(year, mouth);
    date.setFullYear(year);
    date.setMonth(mouth - 1);

    for (var i = 1; i <= daysNum; i++) {
        date.setDate(i);
        var day = date.getDay();
        if (day != 0 && i == 1) {
            for (var k = 0; k < day; k++) {
                data.push({
                    year  : year,
                    mouth : mouth,
                    day   : -1,
                    date  : -1,
                    status: -1,
                });
            }
        }

        //i代表几号,currDay代表当天是几号,day代表是周几
        if (currYear == year && currMonth == mouth) {
            // 如果前几天
            if (i < currDay) {
                status = 'pre';
            } else if (i == currDay) {
                // 今天
                status       = 'cur';
                checkedIndex = dataIndex + 1;
            } else if (day == 0 || day == 6) {
                status = 'week';
            } else {
                status = 'next';
            }
        } else {
            status = 'next';
            if (day == 0 || day == 6) {
                status = 'week';
            }
        }

        data.push({
            year     : year,
            mouth    : mouth,
            day      : day,
            date     : date.getDate(),
            status   : status,
            dataIndex: ++dataIndex,
        });
    }
    return data;
}