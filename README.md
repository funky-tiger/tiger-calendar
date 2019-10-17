## 基于 Taro 小程序的自定义日历插件

### 使用方法

```js
1. /*安装*/ npm i tiger-calendar -S

2. /*引入*/ import { Calendar } from "tiger-calendar";

3. /*使用*/ <Calendar {...oprions} />
```

## API

##### type 日历类型

> 指定日历切换方式`<必填>`: 点击切换 || 滑动切换

> default: `normal` (点击切换)

- type: String
- value: 'normal' | 'scroll'
- example:

```js
<Calendar type="normal" />
```

##### titleOpt 年月标题配置

> 指定日历标题自定义配置`<可选>`

> default: `xxxx年 xx月`

- type: Object

- value: `{ template: Str, style: Object }`

  - template:

    > `"Ayear Bmonth"`
    > 最终渲染时会将`A和B`分别替换成`具体的时间`，`year和month`分别替换成`年和月`

  - style:
    > 指定日历标题的具体样式 请按照`react`中行内样式的书写方式

- example:

```js
<Calendar
  titleOpt={{
    template: "Ayear-Bmonth",
    style: {
      color: "rgba(51, 51, 51, 1)",
      fontSize: "28rpx",
      ...
    }
  }}
/>
```

##### weekOpt 七天周末标题配置

> 指定七天周末标题自定义配置`<可选>`

> default: `日, 一, 二, 三, 四, 五, 六`

- type: Object

- value: `{ data: Arr, style: Object }`

  - data:

    > `["日", "一", "二", "三", "四", "五", "六"]`
    > 提供一个`length`为`7`的一维数组

  - style:
    > 指定七天周末标题的具体样式 请按照`react`中行内样式的书写方式

- example:

```js
<Calendar
  weekOpt={{
    data: ["7", "1", "2", "3", "4", "5", "6"],
    style: {
      color: "rgba(153, 153, 153, 1)",
      fontSize: "28rpx",
      ...
    }
  }}
/>
```

##### dayOpt 天的样式配置

> 指定不同状态下天的自定义样式配置`<可选>`

> default: `20 21` <font color=#00b6ba >22</font>`23 24` <font color=#00b6ba >25</font> `26`

- type: Object

- value: `{ defaultStyle: Object, todayStyle: Object, currentMonthStyle: Object, clickedStyle: Object }`

  - defaultStyle:

    > `天` 的默认样式， 在没有任何状态下的样式显示状态
    > 按照`react`中行内样式的书写方式

  - todayStyle:

    > `今天` 的默认样式， `今天`特定状态下的样式显示状态
    > 按照`react`中行内样式的书写方式

  - currentMonthStyle:

    > `天`在`当前月`显示样式， 仅在 `scroll` 状态下有效
    > 按照`react`中行内样式的书写方式

  - clickedStyle:

    > `天` 的点击样式， `天`在点击后的样式显示状态
    > 按照`react`中行内样式的书写方式

- example:

```js
<Calendar
  dayOpt={{
      defaultStyle: {
        fontSize: "26rpx",
        ...
      },
      todayStyle: {
        color: "#fff",
        ...
      },
      currentMonthStyle: {
        fontSize: "25rpx",
        ...
      },
      clickedStyle: {
        color: "#fff",
        ...
      }
    }}
/>
```

##### dotOpt 标记点的配置

> 指定标记点的自定义配置`<可选>`

> default: `20`<font color=#00b6ba >.</font>`22 23`<font color=red >.</font>`25 26`<font color=blue >.</font>

- type: Arr

- value: `[{ color: Str, date: Str }, ...]`

  - color:

    > 指定`点`的颜色, 支持: `rgb 十六进制 颜色名`

  - date:
    > 指定`点`的日期 确定什么时间显示该`点`

- example:

```js
<Calendar
  dotOpt={[
    { color: "#00B6BA", date: "2019-9-25" },
    { color: "red", date: "2019-10-25" }
  ]}
/>
```

##### onSelectDay 天的点击事件

> `天`点击后的回调 参数是点击的时间对象 包含`{年, 月, 日}` `<可选>`

> default: `{day: 5, year: 2019, month: 10}`

- type: Func

- example:

```js
<Calendar
  onSelectDay={date => {
    console.log("clicked-date:", date);
  }}
/>
```

##### Tip

- 1. 仅测试小程序端 其他端没有进行测试
- 2. 目前仅支持 TS 项目

#### homepage

> https://github.com/funky-tiger/tiger-calendar/blob/master/README.md

#### issues

> https://github.com/funky-tiger/tiger-calendar/issues
