<template>
	<view class="container">
		<view class="header">
			<text class="title">习惯管理</text>
			<text class="add-btn">+</text>
		</view>
		
		<view class="habit-list">
			<!-- 示例数据 -->
			<view class="habit-item" style="background-color: #b5a8e6;">
				<view class="habit-info">
					<text class="habit-name">练习新技能</text>
					<text class="habit-days">7 天</text>
				</view>
				<text class="habit-label">共计坚持</text>
			</view>
			
			<view class="habit-item" style="background-color: #a8d8c9;">
				<view class="habit-info">
					<text class="habit-name">写日记</text>
					<text class="habit-days">5 天</text>
				</view>
				<text class="habit-label">共计坚持</text>
			</view>
			
			<view class="habit-item" style="background-color: #f0d67d;">
				<view class="habit-info">
					<text class="habit-name">写待办事项</text>
					<text class="habit-days">5 天</text>
				</view>
				<text class="habit-label">共计坚持</text>
			</view>
			
			<view class="habit-item" style="background-color: #f5a8c9;">
				<view class="habit-info">
					<text class="habit-name">醒来喝水</text>
					<text class="habit-days">8 天</text>
				</view>
				<text class="habit-label">共计坚持</text>
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
}

.title {
	font-size: 40rpx;
	font-weight: bold;
}

.add-btn {
	font-size: 50rpx;
	color: #333;
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
