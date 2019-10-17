import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
// import { Calendar } from "../../components";
import { Calendar } from "tiger-calendar";
import styles from "./index.module.less";

interface State {}
interface Props {}
export default class Index extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: "首页"
  };

  handleSelectDay = date => {
    console.log("clicked-date:", date);
  };

  render() {
    return (
      <View className={styles.main}>
        <Calendar
          type="normal"
          onSelectDay={this.handleSelectDay}
          // 年月标题样式
          titleOpt={{
            template: "Ayear Bmonth",
            style: {
              color: "rgba(51, 51, 51, 1)",
              fontSize: "28rpx",
              textAlign: "center",
              fontFamily: "PingFangSC-Medium"
            }
          }}
          // 周末标题配置
          weekOpt={{
            // 周末标题文字和样式
            data: ["日", "一", "二", "三", "四", "五", "六"],
            style: {
              color: "rgba(153, 153, 153, 1)",
              fontSize: "28rpx",
              fontFamily: "PingFang-SC-Medium"
            }
          }}
          // 天的样式主题配置
          dayOpt={{
            // 天的默认样式
            defaultStyle: {
              color: "#999",
              fontSize: "28rpx",
              fontFamily: "PingFang-SC-Medium"
            },
            // 今天的样式
            todayStyle: {
              width: "48rpx",
              height: "48rpx",
              lineHeight: "48rpx",
              textAlign: "center",
              borderRadius: "24rpx",
              color: "rgba(0, 182, 186, 1)",
              border: "1rpx solid rgba(0, 182, 186, 1)",
              backgroundColor: "#fff",
              fontSize: "28rpx",
              fontFamily: "PingFang-SC-Medium"
            },
            // 天的当前月样式
            currentMonthStyle: {
              color: "rgba(51, 51, 51, 1)",
              fontSize: "28rpx",
              fontFamily: "PingFang-SC-Medium",
              fontWeight: "bold"
            },
            // 天的点击样式
            clickedStyle: {
              width: "48rpx",
              height: "48rpx",
              borderRadius: "24rpx",
              backgroundColor: "rgba(0, 182, 186, 1)",
              color: "#fff",
              fontSize: "28rpx",
              fontFamily: "PingFang-SC-Medium"
            }
          }}
          dotOpt={[
            { color: "#00B6BA", date: "2019-9-25" },
            { color: "red", date: "2019-10-25" }
          ]}
        />
      </View>
    );
  }
}
