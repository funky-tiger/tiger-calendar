/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CalendarNormal from './components/CalendarNormal/index'
import CalendarScroll from './components/CalendarScroll/index'
import { CalendarProps, CalendarState } from './index.interface'
import styles from './index.module.less'

class Calendar extends Component<CalendarProps, CalendarState> {
    constructor(props: CalendarProps) {
        super(props)
        this.state = {}
    }
    static defaultProps: CalendarProps = {
        type: 'normal',
    }

    static CalendarNormal = CalendarNormal
    static CalendarScroll = CalendarScroll

    render() {
        const { type } = this.props
        return (
            <View>
                {type === 'normal' && 
                    <View className={styles.calendarPage}>
                        <CalendarNormal {...this.props} />
                    </View>
                }
                {type === 'scroll' && 
                    <View className={styles.calendarPage}>
                        <CalendarScroll {...this.props} />
                    </View>
                }
            </View>
        )
    }
}

export default Calendar
