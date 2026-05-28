<template>
	<view class="container">
		<view class="header">
			<text class="title">今日习惯</text>
			<wd-icon name="message" size="24" color="#666"></wd-icon>
		</view>
		
		<ParticleEffect 
			v-if="particleEffect.show"
			:x="particleEffect.x"
			:y="particleEffect.y"
			:color="particleEffect.color"
			@complete="particleEffect.show = false"
		/>
		
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
					@click="toggleCheck(habit, $event)"
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
					@click="toggleCheck(habit, $event)"
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
					@click="toggleCheck(habit, $event)"
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
import ParticleEffect from '@/components/ParticleEffect.vue';

const particleEffect = ref({
	show: false,
	x: 0,
	y: 0,
	color: '#7ec699'
});

const anyTimeHabits = ref([
	{ name: '练习新技能', icon: 'chart-bar', color: '#b5a8e6', checked: false, count: 0 },
	{ name: '醒来喝水', icon: 'cup', color: '#f5a8c9', checked: false, count: 0 },
	{ name: '睡前刷牙', icon: 'tooth', color: '#a8d8c9', checked: true, count: 1 },
	{ name: '背单词', icon: 'book-open', color: '#d4b5f0', checked: false, count: 0 },
]);

const morningHabits = ref([
	{ name: '写日记', icon: 'calendar', color: '#a8d8c9', checked: false, count: 0 },
	{ name: '写待办事项', icon: 'pen', color: '#f0d67d', checked: false, count: 0 },
	{ name: '狗', icon: 'dog', color: '#f9e5b5', checked: false, count: 0 },
]);

const dayHabits = ref([
	{ name: '打坐冥想', icon: 'meditation', color: '#a8d8d8', checked: false, count: 0 },
	{ name: '休息一下', icon: 'chat', color: '#c9f0d4', checked: false, count: 0 },
	{ name: '使用番茄钟', icon: 'tomato', color: '#d4b5f0', checked: false, count: 0 },
	{ name: '浇花', icon: 'water-drop', color: '#a8d8d8', checked: false, count: 0 },
]);

const toggleCheck = (habit, event) => {
	if (!habit.checked) {
		const touch = event.touches?.[0] || event.detail || {};
		particleEffect.value = {
			show: true,
			x: touch.clientX || touch.pageX || window.innerWidth / 2,
			y: touch.clientY || touch.pageY || window.innerHeight / 2,
			color: habit.color
		};
		
		habit.checked = true;
		habit.count = (habit.count || 0) + 1;
		
		uni.vibrateShort({
			success: () => {},
			fail: () => {}
		});
		
		uni.showToast({
			title: '打卡成功！',
			icon: 'success',
			duration: 1000
		});
	} else {
		habit.checked = false;
	}
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
