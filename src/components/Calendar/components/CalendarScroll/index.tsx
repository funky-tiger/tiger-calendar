/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CalendarProps, CalendarState, Objects } from '../../index.interface'
import styles from './index.module.less'

class CalendarScroll extends Component<CalendarProps, CalendarState> {
    constructor(props: CalendarProps) {
        super(props)
        this.state = {
            fistMonthDistance: 0, // 第一个月份与第二个月份的间隔
            timeRangeArr: [], // 时间范围
            empytGrids: [], // 空的占位符
            daysArr: [], // 每月的天数

            currentYear: -1, // 当前年
            currentMonth: -1, // 当前月
            currentDay: -1, // 当前日

            clickedYear: -1, // 点击年
            clickedMonth: -1, // 点击月
            clickedDay: -1, // 点击日

            scrollYear: -1, // 滑动到 年
            scrollMonth: -1, // 滑动到 月

            monthHeight: 0, // 每个月份的高度
            MonthDistanceArr: [], // 月份间隔距离
            isCheckedDot: false, // 天 的 点
        }
    }
    static defaultProps: CalendarProps = {
        type: 'normal',
        titleOpt: {
            template: 'Ayear Bmonth',
            style: {
                color: 'rgba(51, 51, 51, 1)',
                fontSize: '28rpx',
                textAlign: 'center',
                fontFamily: 'PingFangSC-Medium',
            },
        },
        weekOpt: { data: ['日', '一', '二', '三', '四', '五', '六'], style: {} },
        dayOpt: {
            // 天的默认样式
            defaultStyle: {
                color: '#999',
                fontSize: '28rpx',
                fontFamily: 'PingFang-SC-Medium',
            },
            // 天的当前月样式
            currentMonthStyle: {
                color: '#000',
                fontSize: '28rpx',
                fontFamily: 'PingFang-SC-Medium',
            },
            // 天的点击样式
            clickedStyle: {
                color: '#00B6BA',
                fontSize: '28rpx',
                fontFamily: 'PingFang-SC-Medium',
            },
            todayStyle: {
                color: '#999',
                fontSize: '28rpx',
                fontFamily: 'PingFang-SC-Medium',
            },
        },
        onSelectDay: () => {},
    }
    componentDidMount = () => {
        this.initDate()
        setTimeout(() => {
            this.checkDomInfo()
        }, 0)
    }

    initDate = () => {
        const date = new Date()
        const currentYear = date.getFullYear()
        const currentMonth = date.getMonth() + 1
        const currentDay = date.getDate()
        const timeRangeArr: Objects[] = this.checkMonthRange('init', currentYear, currentMonth) // 年月范围解析
        const allDays = this.getRangeTimeArr(timeRangeArr) // 天范围解析
        const empytGrids = this.checkEmptyDays(timeRangeArr[0]._year, timeRangeArr[0]._month) // 检测首月天 的占位符
        // let allDays = this.getMonthAllDays(currentYear, currentMonth); // 仅 获取当前月的天数
        this.setState({
            currentYear: currentYear,
            currentMonth: currentMonth,
            scrollYear: currentYear,
            scrollMonth: currentMonth,
            timeRangeArr,
            empytGrids,
            currentDay,
            daysArr: allDays,
        })
    }

    // 获取当前月的天数
    getMonthAllDays = (year, month) => {
        const _daysArr: number[] = []
        const thisMonthDays = this.checkMonthAllDays(year, month)
        for (let i = 1; i <= thisMonthDays; i++) {
            _daysArr.push(i)
        }
        return _daysArr
    }

    // 获取时间范围
    getRangeTimeArr = arr => {
        let _rangeAllDaysArr: Objects[] = []
        for (let i = 0; i < arr.length; i++) {
            const _allDays = this.getMonthAllDays(arr[i]._year, arr[i]._month)
            const dayArr = this.resolveDayRelationshop(_allDays, arr[i]._year, arr[i]._month)
            _rangeAllDaysArr = _rangeAllDaysArr.concat(dayArr)
        }
        return _rangeAllDaysArr
    }

    // 解析 天 月 年 之间的关系
    resolveDayRelationshop = (arr, year, month) => {
        const _arr: Objects[] = []
        for (let i = 0; i < arr.length; i++) {
            _arr.push({ day: arr[i], year, month })
        }
        return _arr
    }

    // 获取本月所有的天数
    checkMonthRange = (type, year, month) => {
        const _RangeArr: Objects[] = []
        // if (type === "init" || type === "scrollToUp") {
        if (type === 'scrollToUp') {
            if (month - 3 < 1) {
                _RangeArr.push({ _year: year - 1, _month: month - 3 + 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month - 3 })
            }

            if (month - 2 < 1) {
                _RangeArr.push({ _year: year - 1, _month: month - 2 + 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month - 2 })
            }

            if (month - 1 < 1) {
                _RangeArr.push({ _year: year - 1, _month: month - 1 + 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month - 1 })
            }
        }
        if (type === 'init') {
            _RangeArr.push({ _year: year, _month: month })
        }

        if (type === 'init' || type === 'scrollToDown') {
            if (month + 1 > 12) {
                _RangeArr.push({ _year: year + 1, _month: month + 1 - 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month + 1 })
            }

            if (month + 2 > 12) {
                _RangeArr.push({ _year: year + 1, _month: month + 2 - 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month + 2 })
            }

            if (month + 3 > 12) {
                _RangeArr.push({ _year: year + 1, _month: month + 3 - 12 })
            } else {
                _RangeArr.push({ _year: year, _month: month + 3 })
            }
        }

        return _RangeArr
    }

    // 获取本月所有的天数 <返回值 天数(0)>
    checkMonthAllDays = (year, month) => {
        return new Date(year, month, 0).getDate()
    }

    // 获取本月份的空占位符
    checkEmptyDays = (year, month) => {
        // firstDayOfWeek 获取该月份第一天是周几
        const firstDayOfWeek = this.getFirstDayWeekOfMonth(year, month)
        const empytGrids: number[] = []
        if (firstDayOfWeek > 0) {
            // 不是周日 有占位符
            for (let i = 0; i < firstDayOfWeek; i++) {
                empytGrids.push(i)
            }
            return empytGrids
        } else {
            // 周日 无占位符
            return []
        }
    }

    // 获取本月第一天是周几
    getFirstDayWeekOfMonth = (year, month) => {
        return new Date(Date.UTC(year, month - 1, 1)).getDay()
    }

    // 点击天
    handleClickDay = time => {
        const { onSelectDay } = this.props
        this.setState({
            scrollYear: time.year,
            scrollMonth: time.month,
            clickedYear: time.year,
            clickedMonth: time.month,
            clickedDay: time.day,
        })
        onSelectDay(time)
    }

    // 点击切换月份
    ToggleMonth = type => {
        const { currentYear, currentMonth } = this.state
        switch (type) {
            case 'prev':
                let newMonth_ = currentMonth - 1
                let newYear_ = currentYear
                if (newMonth_ < 1) {
                    newYear_ = currentYear - 1
                    newMonth_ = 12
                }
                this.getMonthAllDays(newYear_, newMonth_) // 获取该月的天数
                this.checkEmptyDays(newYear_, newMonth_) // 获取该月占位符
                this.setState({
                    currentYear: newYear_,
                    currentMonth: newMonth_,
                })
                break
            case 'next':
                let _newMonth = currentMonth + 1
                let _newYear = currentYear
                if (_newMonth > 12) {
                    _newYear = currentYear + 1
                    _newMonth = 1
                }
                this.getMonthAllDays(_newYear, _newMonth)
                this.checkEmptyDays(_newYear, _newMonth)
                this.setState({
                    currentYear: _newYear,
                    currentMonth: _newMonth,
                })
                break
            default:
                return
        }
    }

    checkHeight = arr => {
        // 获取每月1号元素距离顶部的高度
        const { timeRangeArr } = this.state
        const _arr: number[] = []
        for (let i = 0; i < timeRangeArr.length - 1; i++) {
            if (arr[i] && arr[i][0] && _arr.indexOf(arr[i][0].top) == -1) {
                _arr.push(arr[i][0].top)
            }
        }
        this.setState({
            MonthDistanceArr: _arr,
            fistMonthDistance: _arr[0],
        })
    }

    // 获取滚动元素Dom相关
    checkDomInfo = () => {
        const { timeRangeArr } = this.state
        const obj = Taro.createSelectorQuery().in(this.$scope)
        const _this = this
        for (let i = 0; i < timeRangeArr.length; i++) {
            obj.selectAll('#tiger' + timeRangeArr[i]._year + '' + timeRangeArr[i]._month + '1').boundingClientRect()
            obj.exec(rect => {
                if (rect.length >= timeRangeArr.length) {
                    if (rect.length !== 0) {
                        _this.checkHeight(rect)
                    }
                }
            })
        }
        obj.selectAll('#calendarView')
            .boundingClientRect(rect => {
                const viewHeight = rect[0].height
                const everyMonthHeight = viewHeight / timeRangeArr.length
                _this.setState({
                    monthHeight: Number(everyMonthHeight.toFixed(2)) + 5,
                })
            })
            .exec()
    }
    handleScrolltolower = () => {
        const { timeRangeArr } = this.state
        // 时间范围
        const _timeRangeArr = this.checkMonthRange(
            'scrollToDown',
            timeRangeArr[timeRangeArr.length - 1]._year,
            timeRangeArr[timeRangeArr.length - 1]._month,
        )
        // 天数数组
        const _allDays = this.getRangeTimeArr(_timeRangeArr) // 天范围解析
        this.setState(
            {
                timeRangeArr: this.state.timeRangeArr.concat(_timeRangeArr),
                daysArr: this.state.daysArr.concat(_allDays),
            },
            () => {
                this.checkDomInfo1(this.state.timeRangeArr.concat(_timeRangeArr))
            },
        )
    }

    // 获取滚动元素Dom相关
    checkDomInfo1 = timeRangeArr => {
        const obj = Taro.createSelectorQuery().in(this.$scope)
        // const obj = Taro.createSelectorQuery()
        const _this = this
        for (let i = 0; i < timeRangeArr.length; i++) {
            obj.selectAll('#tiger' + timeRangeArr[i]._year + '' + timeRangeArr[i]._month + '1').boundingClientRect()
            obj.exec(rect => {
                if (rect.length >= timeRangeArr.length) {
                    if (rect.length !== 0) {
                        _this.checktest(rect)
                    }
                }
            })
        }
    }

    checktest = arr => {
        const { timeRangeArr, fistMonthDistance } = this.state
        const _arr: number[] = []
        for (let i = 0; i < timeRangeArr.length - 1; i++) {
            if (arr[i] && arr[i][0] && _arr.indexOf(arr[i][0].top) == -1) {
                if (arr[0][0].top < 0) {
                    if (arr[i].length == 1) {
                        _arr.push(arr[i][0].top + fistMonthDistance + -arr[0][0].top)
                    } else {
                        _arr.push(arr[i][1].top + fistMonthDistance + -arr[0][0].top)
                    }
                } else {
                    _arr.push(arr[i][0].top)
                }
            }
        }
        this.setState({
            MonthDistanceArr: _arr,
        })
    }
    handleScrollStart = e => {
        // let current_y = e.changedTouches[0].clientY;
    }

    handleScrollEnd = e => {
        // let current_y = e.changedTouches[0].clientY;
    }
    handleScrollMove = e => {
        const { monthHeight, fistMonthDistance } = this.state
        const _this = this
        const obj = Taro.createSelectorQuery().in(this.$scope)
        obj.selectAll('#calendarView')
            .boundingClientRect(rect => {
                const _viewHeight = rect[0].height
                const _scrollHeight = -(rect[0].top - fistMonthDistance)
                _this.checkDateYearMonth(_scrollHeight)
                // console.log("元素的高度:", _viewHeight, "滚动的高度:", _scrollHeight);
                // console.log(
                //   "元素底部距底部的高度:",
                //   _viewHeight - monthHeight - _scrollHeight
                // );
                if (_viewHeight - monthHeight - _scrollHeight < 200) {
                    _this.throttle(_this.handleScrolltolower(), 1000, { leading: false })
                }
            })
            .exec()
    }

    // 检测当前滑动到某月
    checkDateYearMonth = scrollTop => {
        const { timeRangeArr, MonthDistanceArr } = this.state
        for (let i = 0; i < MonthDistanceArr.length; i++) {
            if (scrollTop < MonthDistanceArr[0]) {
                this.setState({
                    scrollYear: timeRangeArr[0]._year,
                    scrollMonth: timeRangeArr[0]._month,
                })
            } else if (scrollTop >= MonthDistanceArr[i] && scrollTop < MonthDistanceArr[i + 1]) {
                this.setState({
                    scrollYear: timeRangeArr[i + 1]._year,
                    scrollMonth: timeRangeArr[i + 1]._month,
                })
            } else if (scrollTop >= MonthDistanceArr[MonthDistanceArr.length - 1]) {
                this.setState({
                    scrollYear: timeRangeArr[timeRangeArr.length - 1]._year,
                    scrollMonth: timeRangeArr[timeRangeArr.length - 1]._month,
                })
            }
        }
    }
    checkTitle = (year, month) => {
        const { titleOpt } = this.props
        const str = titleOpt.template
            .replace(/year/g, '年')
            .replace(/month/g, '月')
            .split('')
            .map(item => {
                if (item === 'A') {
                    return year
                } else if (item === 'B') {
                    return month
                } else {
                    return item
                }
            })
        return str.join('')
    }
    render() {
        const { scrollYear, scrollMonth, empytGrids, daysArr } = this.state
        const { weekOpt, dayOpt } = this.props
        const scrollStyle = {
            height: '280rpx',
        }
        return (
            <View className={styles.calendarPage}>
                <View className={styles.canlendarBgView}>
                    <View className={styles.canlendarView}>
                        <View className={styles.dateTitle}>
                            <View className={styles.canlendarTopView}>
                                {/* <View className={styles.leftBgView} onClick={this.ToggleMonth.bind(this, 'prev')}>
                                    <View className={styles.leftView}>上一月</View>
                                </View> */}
                                <View className={styles.centerView}>{this.checkTitle(scrollYear, scrollMonth)}</View>
                                {/* <View className={styles.rightBgView} onClick={this.ToggleMonth.bind(this, 'next')}>
                                    <View className={styles.rightView}>下一月</View>
                                </View> */}
                            </View>
                            <View className={styles.weekBgView}>
                                {/* 周几大写 */}
                                {weekOpt.data.map((item, index) => {
                                    return (
                                        <View key={index} style={weekOpt.style} className={styles.weekView}>
                                            {item}
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        <View className={styles.scrollView} style={{ height: scrollStyle.height }}>
                            <View
                                id="calendarView"
                                onTouchMove={this.handleScrollMove}
                                onTouchStart={this.handleScrollStart}
                                onTouchEnd={this.handleScrollEnd}
                                className={styles.dateBgView}
                            >
                                {/* 空日期展位符 */}
                                {empytGrids.map(_item => {
                                    return <View key={_item} className={styles.dateEmptyView}></View>
                                })}

                                {daysArr.map((item, index) => {
                                    return (
                                        <View
                                            style={{}}
                                            id={'tiger' + item.year + '' + item.month + '' + item.day}
                                            key={index}
                                            className={styles.dateView}
                                            onClick={this.handleClickDay.bind(this, item)}
                                        >
                                            <View className={styles.datesViewBox}>
                                                <View
                                                    className={styles.datesView}
                                                    style={this.checkStyle(dayOpt, item.year, item.month, item.day)}
                                                >
                                                    <View className={styles.daystyle}>{item.day}</View>
                                                    <View className={styles.todaystyle}>今</View>
                                                    {/* {this.checkDay(item.year, item.month, item.day)} */}
                                                </View>
                                                <View
                                                    style={this.checkDot(item.year, item.month, item.day)}
                                                    className={styles.dot}
                                                ></View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    checkDot = (year, month, day): object => {
        const { isCheckedDot } = this.state
        const { dotOpt } = this.props

        const _arr = dotOpt.green.date.split('-')
        const _dotYear = _arr[0]
        const _dotMonth = _arr[1]
        const _dotDay = _arr[2]

        if (year == _dotYear && month == _dotMonth && day == _dotDay) {
            return { backgroundColor: dotOpt.green.color }
        }
        // if (!isCheckedDot) {
        //     for (let i = 0; i < dotArr.length; i++) {
        //         const _arr = dotArr[i].date.split('-')
        //         const _dotYear = _arr[0]
        //         const _dotMonth = _arr[1]
        //         const _dotDay = _arr[2]
        //         if (year == _dotYear && month == _dotMonth && day == _dotDay) {
        //             return { backgroundColor: dotArr[i].color }
        //         }
        //     }
        //     setTimeout(() => {
        //         // this.setState({ isCheckedDot: true })
        //     }, 1000)
        // }
    }

    checkStyle = (opt, year, month, day): object => {
        const {
            scrollYear,
            scrollMonth,
            clickedYear,
            clickedMonth,
            clickedDay,
            currentYear,
            currentMonth,
            currentDay,
        } = this.state
        if (
            currentYear === year &&
            currentMonth === month &&
            currentDay === day &&
            clickedYear === year &&
            clickedMonth === month &&
            clickedDay === day
        ) {
            return { ...opt.todayStyle, ...opt.clickedStyle }
        }
        if (currentYear === year && currentMonth === month && currentDay === day) {
            // return opt.todayStyle
            return { left: '-58rpx' }
        }
        if (clickedYear === year && clickedMonth === month && clickedDay === day) {
            return opt.clickedStyle
        }
        if (scrollYear === year && scrollMonth === month) {
            return opt.currentMonthStyle
        } else {
            return opt.defaultStyle
        }
    }

    checkDay = (year, month, day) => {
        const { currentYear, currentMonth, currentDay } = this.state
        if (currentYear === year && currentMonth === month && currentDay === day) {
            return '今'
        }
        return day
    }
    // 节流
    throttle = (func, wait, options) => {
        let pre = 0
        let timeout
        const now = Date.now()

        /* leading为false 把当前时间赋给上次时间pre */
        if (!options.leading) pre = now

        return function() {
            if (now - pre > wait) {
                if (timeout) {
                    clearTimeout(timeout)
                    timeout = null
                }
                func.apply(this, arguments)
                pre = now
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, wait - (now - pre))
            }
        }
        function later() {
            /* 如果leading为false 校正pre时间为0 */
            pre = options.leading === false ? 0 : Date.now()
            func.apply(this, arguments)
        }
    }
}

export default CalendarScroll
