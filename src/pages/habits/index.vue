<template>
	<view class="container">
		<view class="header">
			<text class="title">习惯管理</text>
			<wd-icon name="circle-plus" size="32" color="#333"></wd-icon>
		</view>
		
		<view class="habit-list">
			<view 
				v-for="(habit, index) in habits" 
				:key="index"
				class="habit-item"
				:style="{ backgroundColor: habit.color }"
			>
				<view class="habit-info">
					<text class="habit-name">{{ habit.name }}</text>
					<text class="habit-days">{{ habit.days }}天</text>
				</view>
				<text class="habit-label">共计坚持</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const habits = ref([
	{ name: '练习新技能', days: 7, color: '#b5a8e6' },
	{ name: '写日记', days: 5, color: '#a8d8c9' },
	{ name: '写待办事项', days: 5, color: '#f0d67d' },
	{ name: '醒来喝水', days: 8, color: '#f5a8c9' },
	{ name: '打坐冥想', days: 5, color: '#a8d8d8' },
	{ name: '休息一下', days: 6, color: '#c9f0d4' },
	{ name: '浇花', days: 4, color: '#7ec6c9' },
	{ name: '打卡', days: 4, color: '#ffb6c1' },
]);
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

.habit-list {
	margin-top: 20rpx;
}

.habit-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	border: 2rpx solid #333;
}

.habit-info {
	display: flex;
	flex-direction: column;
}

.habit-name {
	font-size: 32rpx;
	color: #333;
}

.habit-days {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-top: 10rpx;
}

.habit-label {
	font-size: 24rpx;
	color: #666;
}
</style>
