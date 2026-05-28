<template>
	<view class="container">
		<view class="header">
			<text class="title">今日习惯</text>
			<wd-icon name="message" size="24" color="#666"></wd-icon>
		</view>
		
		<!-- 任意时间 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">任意时间</text>
				</view>
				<wd-icon name="arrow-up" size="20"></wd-icon>
			</view>
			
			<view class="habit-grid">
				<view 
					v-for="(habit, index) in anyTimeHabits" 
					:key="index"
					class="habit-card"
					@click="toggleCheck(habit)"
				>
					<view class="icon-circle" :style="{ backgroundColor: habit.color }">
						<wd-icon :name="habit.icon" size="28" color="#fff"></wd-icon>
					</view>
					<text class="habit-name">{{ habit.name }}</text>
					<text class="habit-status" :class="{ 'completed': habit.checked }">
						{{ habit.checked ? '已完成' : '未完成' }}
					</text>
				</view>
			</view>
		</view>
		
		<!-- 起床之后 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">起床之后</text>
				</view>
				<wd-icon name="arrow-up" size="20"></wd-icon>
			</view>
			
			<view class="habit-grid">
				<view 
					v-for="(habit, index) in morningHabits" 
					:key="index"
					class="habit-card"
					@click="toggleCheck(habit)"
				>
					<view class="icon-circle" :style="{ backgroundColor: habit.color }">
						<wd-icon :name="habit.icon" size="28" color="#fff"></wd-icon>
					</view>
					<text class="habit-name">{{ habit.name }}</text>
					<text class="habit-status" :class="{ 'completed': habit.checked }">
						{{ habit.checked ? '已完成' : '未完成' }}
					</text>
				</view>
			</view>
		</view>
		
		<!-- 晨间习惯 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">晨间习惯</text>
				</view>
				<wd-icon name="arrow-up" size="20"></wd-icon>
			</view>
			
			<view class="habit-grid">
				<view 
					v-for="(habit, index) in dayHabits" 
					:key="index"
					class="habit-card"
					@click="toggleCheck(habit)"
				>
					<view class="icon-circle" :style="{ backgroundColor: habit.color }">
						<wd-icon :name="habit.icon" size="28" color="#fff"></wd-icon>
					</view>
					<text class="habit-name">{{ habit.name }}</text>
					<text class="habit-status" :class="{ 'completed': habit.checked }">
						{{ habit.checked ? '已完成' : '未完成' }}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 任意时间的习惯
const anyTimeHabits = ref([
	{ name: '练习新技能', icon: 'chart-bar', color: '#b5a8e6', checked: false },
	{ name: '醒来喝水', icon: 'cup', color: '#f5a8c9', checked: false },
	{ name: '睡前刷牙', icon: 'tooth', color: '#a8d8c9', checked: true },
	{ name: '背单词', icon: 'book-open', color: '#d4b5f0', checked: false },
]);

// 起床之后的习惯
const morningHabits = ref([
	{ name: '写日记', icon: 'calendar', color: '#a8d8c9', checked: false },
	{ name: '写待办事项', icon: 'pen', color: '#f0d67d', checked: false },
	{ name: '狗', icon: 'dog', color: '#f9e5b5', checked: false },
]);

// 晨间习惯
const dayHabits = ref([
	{ name: '打坐冥想', icon: 'meditation', color: '#a8d8d8', checked: false },
	{ name: '休息一下', icon: 'chat', color: '#c9f0d4', checked: false },
	{ name: '使用番茄钟', icon: 'tomato', color: '#d4b5f0', checked: false },
	{ name: '浇花', icon: 'water-drop', color: '#a8d8d8', checked: false },
]);

// 切换打卡状态
const toggleCheck = (habit) => {
	habit.checked = !habit.checked;
	// 添加简单的震动反馈
	uni.vibrateShort({
		success: () => {},
		fail: () => {}
	});
};
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
}

.time-section {
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	background-color: #f0f0f0;
	padding: 10rpx 20rpx;
	border-radius: 8rpx;
}

.section-text {
	font-size: 26rpx;
	color: #666;
}

.habit-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.habit-card {
	width: calc(25% - 15rpx);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 10rpx;
	transition: transform 0.2s ease;
	
	&:active {
		transform: scale(0.95);
	}
}

.icon-circle {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 16rpx;
	border: 3rpx solid #333;
	transition: all 0.3s ease;
}

.habit-name {
	font-size: 24rpx;
	color: #333;
	text-align: center;
	margin-bottom: 8rpx;
}

.habit-status {
	font-size: 20rpx;
	color: #999;
	text-align: center;
	
	&.completed {
		color: #7ec699;
		font-weight: bold;
	}
}
</style>
