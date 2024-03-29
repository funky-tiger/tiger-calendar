/* eslint-disable react/no-unused-state */
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { CalendarProps, CalendarState, Objects } from "../../index.interface";
import prevIcon from "../../image/back.png";
import nextIcon from "../../image/next.png";
import styles from "./index.module.less";

class CalendarNormal extends Component<CalendarProps, CalendarState> {
  constructor(props: CalendarProps) {
    super(props);
    this.state = {
      fistMonthDistance: 0, // 第一个月份与第二个月份的间隔
      empytGrids: [], // 空的占位符
      daysArr: [], // 每月的天数

      realYear: -1, // 真实年
      realMonth: -1, // 真实月
      realDay: -1, // 真实日

      currentYear: -1, // 当前年
      currentMonth: -1, // 当前月
      currentDay: -1, // 当前日

      clickedYear: -1, // 点击年
      clickedMonth: -1, // 点击月
      clickedDay: -1, // 点击日

      monthHeight: 0, // 每个月份的高度
      MonthDistanceArr: [], // 月份间隔距离
      isCheckedDot: false // 天 的 点
    };
  }
  static defaultProps: CalendarProps = {
    type: "normal",
    titleOpt: {
      template: "Ayear Bmonth",
      style: {
        color: "rgba(51, 51, 51, 1)",
        fontSize: "28rpx",
        textAlign: "center",
        fontFamily: "PingFangSC-Medium"
      }
    },
    weekOpt: { data: ["日", "一", "二", "三", "四", "五", "六"], style: {} },
    dayOpt: {
      // 天的默认样式
      defaultStyle: {
        color: "#999",
        fontSize: "28rpx",
        fontFamily: "PingFang-SC-Medium"
      },
      // 天的当前月样式
      currentMonthStyle: {
        color: "#000",
        fontSize: "28rpx",
        fontFamily: "PingFang-SC-Medium"
      },
      // 天的点击样式
      clickedStyle: {
        color: "#00B6BA",
        fontSize: "28rpx",
        fontFamily: "PingFang-SC-Medium"
      },
      todayStyle: {
        color: "#999",
        fontSize: "28rpx",
        fontFamily: "PingFang-SC-Medium"
      }
    },
    onSelectDay: () => {}
  };
  componentDidMount = () => {
    this.initDate();
  };

  initDate = () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    const timeRangeArr: Objects[] = this.checkMonthRange(
      currentYear,
      currentMonth
    ); // 年月范围解析
    this.getRangeTimeArr(timeRangeArr); // 天范围解析
    this.checkEmptyDays(currentYear, currentMonth); // 检测首月天 的占位符
    this.setState({
      currentYear: currentYear,
      currentMonth: currentMonth,
      currentDay,
      realYear: currentYear,
      realMonth: currentMonth,
      realDay: currentDay
    });
  };

  // 获取时间范围
  getRangeTimeArr = arr => {
    let _rangeAllDaysArr: Objects[] = [];
    for (let i = 0; i < arr.length; i++) {
      const _allDays = this.getMonthAllDays(arr[i]._year, arr[i]._month);
      const dayArr = this.resolveDayRelationshop(
        _allDays,
        arr[i]._year,
        arr[i]._month
      );
      _rangeAllDaysArr = _rangeAllDaysArr.concat(dayArr);
    }
    this.setState({ daysArr: _rangeAllDaysArr });
  };

  // 获取当前月的天数
  getMonthAllDays = (year, month) => {
    const _daysArr: number[] = [];
    const thisMonthDays = this.checkMonthAllDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      _daysArr.push(i);
    }
    return _daysArr;
  };

  // 解析 天 月 年 之间的关系
  resolveDayRelationshop = (arr, year, month) => {
    const _arr: Objects[] = [];
    for (let i = 0; i < arr.length; i++) {
      _arr.push({ day: arr[i], year, month });
    }
    return _arr;
  };

  // 获取本月所有的天数
  checkMonthRange = (year, month) => {
    const _RangeArr = [];
    _RangeArr.push({ _year: year, _month: month });
    return _RangeArr;
  };

  // 获取本月所有的天数 <返回值 天数(0)>
  checkMonthAllDays = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 获取本月份的空占位符
  checkEmptyDays = (year, month) => {
    // firstDayOfWeek 获取该月份第一天是周几
    const firstDayOfWeek = this.getFirstDayWeekOfMonth(year, month);
    const empytGrids: number[] = [];
    if (firstDayOfWeek > 0) {
      // 不是周日 有占位符
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
    }

    this.setState({ empytGrids });
  };

  // 获取本月第一天是周几
  getFirstDayWeekOfMonth = (year, month) => {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  };

  // 点击天
  handleClickDay = time => {
    const { onSelectDay } = this.props;
    this.setState({
      clickedYear: time.year,
      clickedMonth: time.month,
      clickedDay: time.day
    });
    onSelectDay(time);
  };

  // 点击切换月份
  ToggleMonth = type => {
    const { currentYear, currentMonth } = this.state;
    switch (type) {
      case "prev":
        let newMonth_ = currentMonth - 1;
        let newYear_ = currentYear;
        if (newMonth_ < 1) {
          newYear_ = currentYear - 1;
          newMonth_ = 12;
        }
        this.checkEmptyDays(newYear_, newMonth_); // 获取该月占位符
        const timeRangeArr: Objects[] = this.checkMonthRange(
          newYear_,
          newMonth_
        ); // 年月范围解析
        this.getRangeTimeArr(timeRangeArr); // 天范围解析
        this.setState({
          currentYear: newYear_,
          currentMonth: newMonth_
        });
        break;
      case "next":
        let _newMonth = currentMonth + 1;
        let _newYear = currentYear;
        if (_newMonth > 12) {
          _newYear = currentYear + 1;
          _newMonth = 1;
        }
        this.checkEmptyDays(_newYear, _newMonth);
        const timeRangeArr_: Objects[] = this.checkMonthRange(
          _newYear,
          _newMonth
        ); // 年月范围解析
        this.getRangeTimeArr(timeRangeArr_); // 天范围解析
        this.setState({
          currentYear: _newYear,
          currentMonth: _newMonth
        });
        break;
      default:
        return;
    }
  };

  checkTitle = (year, month) => {
    const { titleOpt } = this.props;
    const str = titleOpt.template
      .replace(/year/g, "年")
      .replace(/month/g, "月")
      .split("")
      .map(item => {
        if (item === "A") {
          return year;
        } else if (item === "B") {
          return month;
        } else {
          return item;
        }
      });
    return str.join("");
  };
  render() {
    const { currentYear, currentMonth, empytGrids, daysArr } = this.state;
    const { weekOpt, dayOpt } = this.props;
    const scrollStyle = {
      height: "280rpx"
    };
    return (
      <View className={styles.calendarPage}>
        <View className={styles.canlendarBgView}>
          <View className={styles.canlendarView}>
            <View className={styles.dateTitle}>
              <View className={styles.canlendarTopView}>
                <View
                  className={styles.leftBgView}
                  onClick={this.ToggleMonth.bind(this, "prev")}
                >
                  {/* <View className={styles.leftView}>上一月</View> */}
                  <Image className={styles.leftView} src={prevIcon} />
                </View>
                <View className={styles.centerView}>
                  {this.checkTitle(currentYear, currentMonth)}
                </View>
                <View
                  className={styles.rightBgView}
                  onClick={this.ToggleMonth.bind(this, "next")}
                >
                  <Image className={styles.rightView} src={nextIcon} />
                  {/* <View className={styles.rightView}>下一月</View> */}
                </View>
              </View>
              <View className={styles.weekBgView}>
                {/* 周几大写 */}
                {weekOpt.data.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={weekOpt.style}
                      className={styles.weekView}
                    >
                      {item}
                    </View>
                  );
                })}
              </View>
            </View>

            <View
              className={styles.scrollView}
              style={{ height: scrollStyle.height }}
            >
              <View id="calendarView" className={styles.dateBgView}>
                {/* 空日期展位符 */}
                {empytGrids.map(_item => {
                  return (
                    <View key={_item} className={styles.dateEmptyView}></View>
                  );
                })}

                {daysArr.map((item, index) => {
                  return (
                    <View
                      style={{}}
                      key={index}
                      className={styles.dateView}
                      onClick={this.handleClickDay.bind(this, item)}
                    >
                      <View className={styles.datesViewBox}>
                        <View
                          className={styles.datesView}
                          style={this.checkStyle(
                            dayOpt,
                            item.year,
                            item.month,
                            item.day
                          )}
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
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  checkDot = (year, month, day): object => {
    const { isCheckedDot } = this.state;
    const { dotOpt } = this.props;

    for (let i = 0; i < dotOpt.length; i++) {
      const _arr = dotOpt[i].date.split("-");
      const _dotYear = _arr[0];
      const _dotMonth = _arr[1];
      const _dotDay = _arr[2];

      if (year == _dotYear && month == _dotMonth && day == _dotDay) {
        return { backgroundColor: dotOpt[i].color };
      }
    }
  };

  checkStyle = (opt, year, month, day): object => {
    const {
      clickedYear,
      clickedMonth,
      clickedDay,
      realYear,
      realMonth,
      realDay,
      currentYear,
      currentMonth,
      currentDay
    } = this.state;
    if (
      realYear === year &&
      realMonth === month &&
      realDay === day &&
      clickedYear === year &&
      clickedMonth === month &&
      clickedDay === day
    ) {
      return { ...opt.todayStyle, ...opt.clickedStyle };
    }
    if (realYear === year && realMonth === month && realDay === day) {
      return { left: "-58rpx" };
    }
    if (clickedYear === year && clickedMonth === month && clickedDay === day) {
      return opt.clickedStyle;
    }
    if (currentYear === year && currentMonth === month) {
      return opt.currentMonthStyle;
    } else {
      return opt.defaultStyle;
    }
  };

  checkDay = (year, month, day) => {
    const { currentYear, currentMonth, currentDay } = this.state;
    if (currentYear === year && currentMonth === month && currentDay === day) {
      return "今";
    }
    return day;
  };
  // 节流
  throttle = (func, wait, options) => {
    let pre = 0;
    let timeout;
    const now = Date.now();

    /* leading为false 把当前时间赋给上次时间pre */
    if (!options.leading) pre = now;

    return function() {
      if (now - pre > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        func.apply(this, arguments);
        pre = now;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, wait - (now - pre));
      }
    };
    function later() {
      /* 如果leading为false 校正pre时间为0 */
      pre = options.leading === false ? 0 : Date.now();
      func.apply(this, arguments);
    }
  };
}

export default CalendarNormal;
