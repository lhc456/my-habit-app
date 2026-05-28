<template>
	<view class="container">
		<view class="header">
			<text class="title">今日习惯</text>
			<text class="mail-icon">✉️</text>
		</view>
		
		<!-- 任意时间 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">任意时间</text>
				</view>
				<text class="arrow">^</text>
			</view>
			
			<view class="habit-grid">
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #b5a8e6;">
						<text>📊</text>
					</view>
					<text class="habit-name">练习新技能</text>
					<text class="habit-status">完成 1 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #f5a8c9;">
						<text>🥤</text>
					</view>
					<text class="habit-name">醒来喝水</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #a8d8c9;">
						<text>🦷</text>
					</view>
					<text class="habit-name">睡前刷牙</text>
					<text class="habit-status">完成 3 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #d4b5f0;">
						<text>📖</text>
					</view>
					<text class="habit-name">背单词</text>
					<text class="habit-status">完成 2 天</text>
				</view>
			</view>
		</view>
		
		<!-- 起床之后 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">起床之后</text>
				</view>
				<text class="arrow">^</text>
			</view>
			
			<view class="habit-grid">
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #a8d8c9;">
						<text>📅</text>
					</view>
					<text class="habit-name">写日记</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #f0d67d;">
						<text>✏️</text>
					</view>
					<text class="habit-name">写待办事项</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #f9e5b5;">
						<text>🐱</text>
					</view>
					<text class="habit-name">遛狗</text>
					<text class="habit-status">完成 0 天</text>
				</view>
			</view>
		</view>
		
		<!-- 晨间习惯 -->
		<view class="time-section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">晨间习惯</text>
				</view>
				<text class="arrow">^</text>
			</view>
			
			<view class="habit-grid">
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #a8d8d8;">
						<text>🧘</text>
					</view>
					<text class="habit-name">打坐冥想</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #c9f0d4;">
						<text></text>
					</view>
					<text class="habit-name">休息一下</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #d4b5f0;">
						<text>🍅</text>
					</view>
					<text class="habit-name">使用番茄钟</text>
					<text class="habit-status">完成 0 天</text>
				</view>
				
				<view class="habit-card">
					<view class="icon-circle" style="background-color: #a8d8d8;">
						<text>💧</text>
					</view>
					<text class="habit-name">浇花</text>
					<text class="habit-status">完成 0 天</text>
				</view>
			</view>
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
	padding: 20rpx;
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

.mail-icon {
	font-size: 40rpx;
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

.arrow {
	font-size: 28rpx;
	color: #333;
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
}

.icon-circle {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 16rpx;
	border: 2rpx solid #333;
}

.icon-circle text {
	font-size: 50rpx;
}

.habit-name {
	font-size: 24rpx;
	color: #333;
	text-align: center;
	margin-bottom: 8rpx;
}

.habit-status {
	font-size: 20rpx;
	color: #666;
	text-align: center;
}
</style>
