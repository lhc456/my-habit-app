<template>
	<view class="container">
		<view class="user-info">
			<view class="avatar">
				<wd-icon name="user" size="60" color="#fff"></wd-icon>
			</view>
			<view class="user-detail">
				<text class="nickname">未登录</text>
				<text class="desc">点击登录账号</text>
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-item">
				<wd-icon name="chart-bar" size="40" color="#7ec699"></wd-icon>
				<text class="menu-text">数据统计</text>
				<wd-icon name="arrow-right" size="32" color="#ccc"></wd-icon>
			</view>
			<view class="menu-item">
				<wd-icon name="trophy" size="40" color="#ffd6a5"></wd-icon>
				<text class="menu-text">成就徽章</text>
				<wd-icon name="arrow-right" size="32" color="#ccc"></wd-icon>
			</view>
			<view class="menu-item">
				<wd-icon name="alarm-clock" size="40" color="#a8d8d8"></wd-icon>
				<text class="menu-text">提醒设置</text>
				<wd-icon name="arrow-right" size="32" color="#ccc"></wd-icon>
			</view>
			<view class="menu-item">
				<wd-icon name="setting" size="40" color="#c4b5fd"></wd-icon>
				<text class="menu-text">设置</text>
				<wd-icon name="arrow-right" size="32" color="#ccc"></wd-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	min-height: 100vh;
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

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	margin-left: 20rpx;
}
</style>
