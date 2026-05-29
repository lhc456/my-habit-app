<template>
	<view class="container">
		<view class="timer-mode">
			<text class="mode-btn" :class="{ active: mode === 'countdown' }" @click="switchMode('countdown')">倒计时</text>
			<text class="mode-btn" :class="{ active: mode === 'timer' }" @click="switchMode('timer')">正计时</text>
			<text class="mode-btn" :class="{ active: mode === 'pomodoro' }" @click="switchMode('pomodoro')">番茄钟</text>
		</view>
		
		<view class="timer-display">
			<view class="circle" @click="toggleTimer">
				<text class="time">{{ displayTime }}</text>
			</view>
		</view>
		
		<view class="habit-icon">
			<view class="icon-circle" :style="{ backgroundColor: currentHabit?.color || '#a8d8c9' }">
				<wd-icon :name="currentHabit?.icon || 'calendar'" size="40" color="#fff"></wd-icon>
			</view>
			<text class="habit-name">{{ currentHabit?.name || '写日记' }}</text>
		</view>
		
		<view class="start-btn" :style="{ backgroundColor: isRunning ? '#ff6b8a' : '#7ec699' }" @click="toggleTimer">
			<text>{{ isRunning ? '暂停' : '开始' }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useHabitsStore } from '@/store/modules/habits';

const store = useHabitsStore();
const mode = ref('countdown');
const isRunning = ref(false);
const seconds = ref(25 * 60);
const initialSeconds = ref(25 * 60);
const currentHabit = ref(null);

let timer = null;

const displayTime = computed(() => {
	const mins = Math.floor(seconds.value / 60);
	const secs = seconds.value % 60;
	return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

onMounted(() => {
	currentHabit.value = store.selectedHabit;
});

const switchMode = (newMode) => {
	mode.value = newMode;
	isRunning.value = false;
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
	
	switch(newMode) {
		case 'countdown':
			seconds.value = 25 * 60;
			break;
		case 'timer':
			seconds.value = 0;
			break;
		case 'pomodoro':
			seconds.value = 25 * 60;
			break;
	}
	initialSeconds.value = seconds.value;
};

const toggleTimer = () => {
	if (isRunning.value) {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		isRunning.value = false;
	} else {
		isRunning.value = true;
		timer = setInterval(() => {
			if (mode.value === 'countdown' || mode.value === 'pomodoro') {
				if (seconds.value > 0) {
					seconds.value--;
				} else {
					if (timer) {
						clearInterval(timer);
						timer = null;
					}
					isRunning.value = false;
					uni.showToast({ title: '时间到！', icon: 'success' });
				}
			} else {
				seconds.value++;
			}
		}, 1000);
	}
};

onUnmounted(() => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
});
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx;
	min-height: 100vh;
}

.timer-mode {
	display: flex;
	border: 2rpx solid #333;
	border-radius: 30rpx;
	overflow: hidden;
	margin-bottom: 80rpx;
	
	.mode-btn {
		padding: 16rpx 32rpx;
		font-size: 28rpx;
		color: #333;
		transition: all 0.3s ease;
		
		&.active {
			background-color: #333;
			color: #fff;
		}
	}
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
	transition: all 0.3s ease;
	cursor: pointer;
	
	&:active {
		transform: scale(0.98);
	}
}

.time {
	font-size: 80rpx;
	font-weight: bold;
	color: #333;
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

.habit-name {
	font-size: 28rpx;
	color: #666;
}

.start-btn {
	width: 300rpx;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.3s ease;
	
	&:active {
		opacity: 0.8;
		transform: scale(0.95);
	}
	
	text {
		color: #fff;
		font-size: 32rpx;
	}
}
</style>
