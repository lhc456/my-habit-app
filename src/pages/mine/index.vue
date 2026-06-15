<template>
	<view class="container">
		<!-- User Info -->
		<view class="user-info">
			<view class="avatar">
				<wd-icon name="user" size="32" color="#fff"></wd-icon>
			</view>
			<view class="user-detail">
				<text class="nickname">未登录</text>
				<text class="desc">点击登录账号</text>
			</view>
		</view>

		<!-- Timer Statistics -->
		<view v-if="hasData" class="stats-section">
			<view class="stats-header">
				<wd-icon name="chart-bar" size="22" color="#7ec699"></wd-icon>
				<text class="stats-title">今日专注统计</text>
				<text class="stats-date">{{ todayDate }}</text>
			</view>

			<!-- Stats Cards -->
			<view class="stats-cards">
				<view class="stat-card">
					<view class="stat-icon-wrap focus-icon">
						<wd-icon name="clock" size="22" color="#fff"></wd-icon>
					</view>
					<text class="stat-value">{{ formatMinutes(historyStore.todayFocusSeconds) }}</text>
					<text class="stat-label">专注时长</text>
				</view>
				<view class="stat-card">
					<view class="stat-icon-wrap check-icon">
						<wd-icon name="check" size="22" color="#fff"></wd-icon>
					</view>
					<text class="stat-value">{{ historyStore.todayCompletedCount }}</text>
					<text class="stat-label">今日完成</text>
				</view>
				<view class="stat-card">
					<view class="stat-icon-wrap pomodoro-icon">
						<wd-icon name="time" size="22" color="#fff"></wd-icon>
					</view>
					<text class="stat-value">{{ historyStore.todayPomodoroCount }}</text>
					<text class="stat-label">番茄完成</text>
				</view>
			</view>

			<!-- Streak Badge -->
			<view class="streak-badge">
				<wd-icon name="star" size="22" color="#ff6b35"></wd-icon>
				<text class="streak-text">连续打卡 <text class="streak-num">{{ historyStore.streakDays }}</text> 天</text>
			</view>

			<!-- Weekly Chart -->
			<view class="weekly-section">
				<text class="weekly-title">本周专注趋势</text>
				<view class="weekly-chart">
					<view
						v-for="(day, idx) in historyStore.weeklySummary"
						:key="idx"
						class="weekly-bar-wrap"
					>
					<view class="weekly-bar-track">
						<view class="weekly-bar-bg"></view>
						<view
							class="weekly-bar"
							:style="{ height: getBarHeight(day.focusSeconds) }"
						>
							<view class="weekly-bar-fill"></view>
						</view>
						<view v-if="day.count > 0" class="weekly-dot"></view>
					</view>
						<text class="weekly-label">{{ day.date }}</text>
						<view v-if="day.count > 0" class="weekly-dot"></view>
					</view>
				</view>
			</view>

			<!-- Recent Records -->
			<view v-if="historyStore.recentRecords.length > 0" class="recent-section">
				<text class="recent-title">最近完成</text>
				<view
					v-for="record in recentList"
					:key="record.id"
					class="recent-item"
				>
					<view class="recent-item-left">
						<view class="recent-icon" :style="{ backgroundColor: record.linkedHabit?.color || getModeColor(record.mode) }">
							<wd-icon :name="record.linkedHabit?.icon || getModeIcon(record.mode)" size="22" color="#fff"></wd-icon>
						</view>
						<view class="recent-info">
							<text class="recent-name">{{ record.taskName }}</text>
							<text class="recent-meta">
								{{ getModeLabel(record.mode) }}
								{{ record.isBreak ? '· 休息' : '' }}
								· {{ formatMinutes(record.elapsedSeconds) }}
							</text>
						</view>
					</view>
					<text class="recent-time">{{ formatTime(record.completedAt) }}</text>
				</view>
			</view>
		</view>

		<!-- No data state -->
		<view v-else class="no-data-section">
			<wd-icon name="clock" size="60" color="#ddd"></wd-icon>
			<text class="no-data-text">还没有计时记录</text>
			<text class="no-data-desc">去番茄钟完成一个计时吧</text>
		</view>

		<!-- Menu List -->
		<view class="menu-list">
			<view class="menu-item">
				<wd-icon name="star" size="26" color="#ffd6a5"></wd-icon>
				<text class="menu-text">成就徽章</text>
				<wd-icon name="arrow-right" size="20" color="#ccc"></wd-icon>
			</view>
			<view class="menu-item">
				<wd-icon name="clock" size="26" color="#a8d8d8"></wd-icon>
				<text class="menu-text">提醒设置</text>
				<wd-icon name="arrow-right" size="20" color="#ccc"></wd-icon>
			</view>
			<view class="menu-item">
				<wd-icon name="setting" size="26" color="#c4b5fd"></wd-icon>
				<text class="menu-text">设置</text>
				<wd-icon name="arrow-right" size="20" color="#ccc"></wd-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTimerHistoryStore } from '@/store/modules/timerHistory'
import WdIcon from 'wot-design-uni/components/wd-icon/wd-icon.vue'

const historyStore = useTimerHistoryStore()

// ─── Lifecycle ───

onMounted(() => {
	historyStore.loadFromStorage()
})

// Reload data every time the tab becomes visible
onShow(() => {
	historyStore.loadFromStorage()
})

// ─── Computed ───

const hasData = computed(() => historyStore.records.length > 0)

const todayDate = computed(() => {
	const now = new Date()
	return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
})

const recentList = computed(() => {
	return historyStore.recentRecords.slice(0, 10)
})

const maxFocusSeconds = computed(() => {
	const seconds = historyStore.weeklySummary.map(d => d.focusSeconds)
	return Math.max(...seconds, 1)
})

// ─── Helpers ───

function formatMinutes(seconds: number): string {
	if (seconds < 60) return `${seconds}秒`
	const mins = Math.floor(seconds / 60)
	if (mins < 60) return `${mins}分`
	const hours = Math.floor(mins / 60)
	const remainMins = mins % 60
	return remainMins > 0 ? `${hours}时${remainMins}分` : `${hours}时`
}

function formatTime(timestamp: number): string {
	const date = new Date(timestamp)
	const now = new Date()
	const isToday = date.toDateString() === now.toDateString()
	if (isToday) {
		const h = date.getHours().toString().padStart(2, '0')
		const m = date.getMinutes().toString().padStart(2, '0')
		return `${h}:${m}`
	}
	const month = date.getMonth() + 1
	const day = date.getDate()
	const h = date.getHours().toString().padStart(2, '0')
	const m = date.getMinutes().toString().padStart(2, '0')
	return `${month}/${day} ${h}:${m}`
}

function getModeColor(mode: string): string {
	switch (mode) {
		case 'pomodoro': return '#7ec699'
		case 'countdown': return '#c4b5fd'
		case 'stopwatch': return '#ffb6c1'
		default: return '#a8d8c9'
	}
}

function getModeIcon(mode: string): string {
	switch (mode) {
		case 'pomodoro': return 'time'
		case 'countdown': return 'hourglass'
		case 'stopwatch': return 'clock'
		default: return 'clock'
	}
}

function getModeLabel(mode: string): string {
	switch (mode) {
		case 'pomodoro': return '番茄钟'
		case 'countdown': return '倒计时'
		case 'stopwatch': return '正计时'
		default: return mode
	}
}

function getBarHeight(focusSeconds: number): string {
	const max = maxFocusSeconds.value
	const ratio = max > 0 ? focusSeconds / max : 0
	// Use rpx for reliable rendering: max bar height 120rpx, min 6rpx
	return `${Math.max(6, Math.round(ratio * 120))}rpx`
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	box-sizing: border-box;
	background: linear-gradient(180deg, #f5f9f7 0%, #fff 100%);
}

// ─── User Info ───

.user-info {
	display: flex;
	align-items: center;
	padding: 40rpx 20rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 16rpx;
	margin-bottom: 30rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background-color: rgba(255,255,255,0.3);
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 30rpx;
}

.user-detail {
	display: flex;
	flex-direction: column;
}

.nickname {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
}

.desc {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	margin-top: 10rpx;
}

// ─── Stats Section ───

.stats-section {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	border: 3rpx solid #e0e0e0;
	box-shadow: 4rpx 4rpx 0 #e0e0e0;
}

.stats-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 28rpx;
}

.stats-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.stats-date {
	font-size: 22rpx;
	color: #999;
}

// ─── Stats Cards ───

.stats-cards {
	display: flex;
	gap: 16rpx;
	margin-bottom: 28rpx;
}

.stat-card {
	flex: 1;
	background: #f9fafb;
	border-radius: 16rpx;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	border: 2rpx solid #f0f0f0;
	transition: all 0.2s;

	&:active {
		transform: scale(0.97);
	}
}

.stat-icon-wrap {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 4rpx;

	&.focus-icon {
		background: linear-gradient(135deg, #7ec699, #a8d8c9);
	}

	&.check-icon {
		background: linear-gradient(135deg, #c4b5fd, #a8d8d8);
	}

	&.pomodoro-icon {
		background: linear-gradient(135deg, #ff6b6b, #ffb6c1);
	}
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
}

.stat-label {
	font-size: 22rpx;
	color: #999;
}

// ─── Streak Badge ───

.streak-badge {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, #fff5f0, #fff8e6);
	border-radius: 40rpx;
	margin-bottom: 28rpx;
	border: 2rpx solid #ffe0c0;
}

.streak-text {
	font-size: 28rpx;
	color: #666;
}

.streak-num {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff6b35;
}

// ─── Weekly Chart ───

.weekly-section {
	margin-bottom: 28rpx;
}

.weekly-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.weekly-chart {
	display: flex;
	justify-content: space-between;
	align-items: stretch;
	padding: 0 10rpx;
	height: 140rpx;
	gap: 8rpx;
}

.weekly-bar-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6rpx;
	flex: 1;
	min-width: 0;
}

.weekly-bar-track {
	flex: 1;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: 4rpx;
}

.weekly-bar-bg {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100%;
	border-radius: 8rpx 8rpx 4rpx 4rpx;
	background: #f0f0f0;
}

.weekly-bar {
	width: 100%;
	border-radius: 8rpx 8rpx 4rpx 4rpx;
	transition: height 0.3s ease;
	position: relative;
	z-index: 1;
	min-height: 6rpx;
}

.weekly-bar-fill {
	width: 100%;
	height: 100%;
	border-radius: 8rpx 8rpx 4rpx 4rpx;
	background: linear-gradient(180deg, #7ec699, #a8d8c9);
}

.weekly-label {
	font-size: 20rpx;
	color: #999;
	flex-shrink: 0;
}

.weekly-dot {
	width: 10rpx;
	height: 10rpx;
	border-radius: 50%;
	background: #7ec699;
	position: absolute;
	top: -4rpx;
	right: -4rpx;
	z-index: 2;
}

// ─── Recent Records ───

.recent-section {
	margin-bottom: 8rpx;
}

.recent-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #666;
	margin-bottom: 16rpx;
	display: block;
}

.recent-item {
	display: flex;
	align-items: center;
	padding: 16rpx 12rpx;
	border-bottom: 2rpx solid #f5f5f5;
	transition: all 0.2s;

	&:last-child {
		border-bottom: none;
	}

	&:active {
		background: #f9f9f9;
	}
}

.recent-item-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex: 1;
	min-width: 0;
}

.recent-icon {
	width: 52rpx;
	height: 52rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.recent-info {
	display: flex;
	flex-direction: column;
	gap: 2rpx;
	min-width: 0;
}

.recent-name {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.recent-meta {
	font-size: 20rpx;
	color: #999;
}

.recent-time {
	font-size: 20rpx;
	color: #bbb;
	flex-shrink: 0;
	margin-left: 12rpx;
}

// ─── No Data State ───

.no-data-section {
	background: #fff;
	border-radius: 20rpx;
	padding: 80rpx 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 30rpx;
	border: 3rpx solid #e0e0e0;
}

.no-data-text {
	font-size: 30rpx;
	color: #999;
	font-weight: bold;
}

.no-data-desc {
	font-size: 26rpx;
	color: #bbb;
}

// ─── Menu List ───

.menu-list {
	background-color: #fff;
	border-radius: 16rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	margin-left: 20rpx;
}
</style>
