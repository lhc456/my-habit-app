<template>
	<view class="container">
		<view class="user-info">
			<view class="avatar">
				<text>👤</text>
			</view>
			<view class="user-detail">
				<text class="nickname">未登录</text>
				<text class="desc">点击登录账号</text>
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-item">
				<text class="menu-icon"></text>
				<text class="menu-text">数据统计</text>
				<text class="arrow">›</text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">🏆</text>
				<text class="menu-text">成就徽章</text>
				<text class="arrow">›</text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">⏰</text>
				<text class="menu-text">提醒设置</text>
				<text class="arrow">›</text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">⚙️</text>
				<text class="menu-text">设置</text>
				<text class="arrow">›</text>
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

.avatar text {
	font-size: 60rpx;
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

.menu-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.arrow {
	font-size: 40rpx;
	color: #ccc;
}
</style>
