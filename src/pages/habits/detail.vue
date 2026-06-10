<template>
	<view class="container">
		<!-- 习惯信息头部 -->
		<view class="habit-header">
			<view class="habit-icon" :style="{ backgroundColor: habit?.color }">
				<wd-icon :name="habit?.icon || 'check'" size="36" color="#fff"></wd-icon>
			</view>
			<view class="habit-info">
				<text class="habit-name">{{ habit?.name }}</text>
				<view class="habit-meta">
					<text class="habit-type">{{ habit?.type === 'timer' ? '计时习惯' : '快速打卡' }}</text>
					<text class="habit-count">共打卡 {{ habit?.count || 0 }} 次</text>
				</view>
			</view>
		</view>

		<!-- 月度统计 -->
		<view class="stats-section">
			<text class="section-title">月度打卡统计</text>

			<view class="chart-container" v-if="chartData.length > 0">
				<view class="chart-bars">
					<view
						v-for="item in chartData"
						:key="item.month"
						class="bar-col"
					>
						<view class="bar-label">{{ item.count }}</view>
						<view
							class="bar-fill"
							:style="{
								height: getBarHeight(item.count) + 'px',
								backgroundColor: habit?.color || '#7ec699'
							}"
						></view>
						<text class="bar-month">{{ formatMonth(item.month) }}</text>
					</view>
				</view>
			</view>

			<view class="chart-empty" v-else>
				<wd-icon name="chart-bar" size="48" color="#ddd"></wd-icon>
				<text class="empty-text">暂无打卡记录</text>
			</view>
		</view>

		<!-- 统计卡片 -->
		<view class="stats-cards" v-if="habit?.count > 0">
			<view class="stat-card">
				<text class="stat-value">{{ habit?.count || 0 }}</text>
				<text class="stat-label">总打卡</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ maxCount }}</text>
				<text class="stat-label">月最高</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ avgCount }}</text>
				<text class="stat-label">月均</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useHabitsStore } from '@/store/modules/habits'
import WdIcon from 'wot-design-uni/components/wd-icon/wd-icon.vue'

const store = useHabitsStore()
const habit = ref(null)
const monthlyStats = ref([])

onMounted(() => {
	store.loadHabits()
})

onLoad((options) => {
	const catIndex = parseInt(options.catIndex)
	const habitIndex = parseInt(options.habitIndex)

	if (store.categories[catIndex]?.habits[habitIndex]) {
		habit.value = store.categories[catIndex].habits[habitIndex]
		monthlyStats.value = store.getMonthlyStats(catIndex, habitIndex)
	}
})

// 图表数据：最近6个月
const chartData = computed(() => {
	const months = []
	const now = new Date()
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
		const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
		const found = monthlyStats.value.find(s => s.month === month)
		months.push({ month, count: found ? found.count : 0 })
	}
	return months
})

const maxCount = computed(() => {
	if (monthlyStats.value.length === 0) return 0
	return Math.max(...monthlyStats.value.map(s => s.count))
})

const avgCount = computed(() => {
	if (monthlyStats.value.length === 0) return 0
	const total = monthlyStats.value.reduce((sum, s) => sum + s.count, 0)
	return Math.round(total / monthlyStats.value.length)
})

const chartMax = computed(() => {
	const max = Math.max(...chartData.value.map(d => d.count), 1)
	return max
})

const getBarHeight = (count) => {
	if (count === 0) return 4
	return Math.max(20, (count / chartMax.value) * 200)
}

const formatMonth = (month) => {
	return month.substring(5) + '月'
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	min-height: 100vh;
	background: linear-gradient(180deg, #f5f9f7 0%, #fff 100%);
}

.habit-header {
	display: flex;
	align-items: center;
	padding: 30rpx;
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	border: 3rpx solid #eee;
}

.habit-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.habit-info {
	flex: 1;
}

.habit-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.habit-meta {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.habit-type {
	font-size: 24rpx;
	color: #7ec699;
	background: rgba(126, 198, 153, 0.1);
	padding: 4rpx 14rpx;
	border-radius: 12rpx;
}

.habit-count {
	font-size: 24rpx;
	color: #999;
}

.stats-section {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	border: 3rpx solid #eee;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 30rpx;
}

.chart-container {
	padding: 20rpx 0;
}

.chart-bars {
	display: flex;
	align-items: flex-end;
	justify-content: space-around;
	height: 280px;
	padding-bottom: 40rpx;
	border-bottom: 2rpx solid #eee;
}

.bar-col {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.bar-label {
	font-size: 22rpx;
	color: #666;
	margin-bottom: 8rpx;
	font-weight: bold;
}

.bar-fill {
	width: 48rpx;
	border-radius: 8rpx 8rpx 0 0;
	min-height: 4px;
	transition: height 0.5s ease;
}

.bar-month {
	font-size: 22rpx;
	color: #999;
	margin-top: 12rpx;
}

.chart-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
	gap: 16rpx;
}

.empty-text {
	font-size: 26rpx;
	color: #999;
}

.stats-cards {
	display: flex;
	gap: 20rpx;
}

.stat-card {
	flex: 1;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	border: 3rpx solid #eee;
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #7ec699;
}

.stat-label {
	font-size: 24rpx;
	color: #999;
}
</style>