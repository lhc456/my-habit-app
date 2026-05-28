<template>
	<view class="container">
		<view class="timer-mode">
			<text class="mode-btn">正计时</text>
			<text class="mode-btn">倒计时</text>
			<text class="mode-btn active">番茄钟</text>
		</view>
		
		<view class="timer-display">
			<view class="circle">
				<text class="time">00:25</text>
			</view>
		</view>
		
		<view class="habit-icon">
			<view class="icon-circle">
				<text class="icon">📅</text>
			</view>
			<text class="habit-name">写日记</text>
		</view>
		
		<view class="start-btn">
			<text>开始</text>
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {}
	}
});
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx;
}

.timer-mode {
	display: flex;
	border: 2rpx solid #333;
	border-radius: 30rpx;
	overflow: hidden;
	margin-bottom: 80rpx;
}

.mode-btn {
	padding: 16rpx 32rpx;
	font-size: 28rpx;
	color: #333;
}

.mode-btn.active {
	background-color: #333;
	color: #fff;
}

.timer-display {
	display: flex;
	justify-content: center;
	margin-bottom: 60rpx;
}

.circle {
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	border: 4rpx solid #333;
	display: flex;
	justify-content: center;
	align-items: center;
}

.time {
	font-size: 80rpx;
	font-weight: bold;
}

.habit-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.icon-circle {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #a8d8c9;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 16rpx;
}

.icon {
	font-size: 50rpx;
}

.habit-name {
	font-size: 28rpx;
	color: #666;
}

.start-btn {
	width: 300rpx;
	height: 80rpx;
	background-color: #ff0060;
	border-radius: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.start-btn text {
	color: #fff;
	font-size: 32rpx;
}
</style>
