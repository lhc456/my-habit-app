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
		
		<view 
			v-for="(category, catIndex) in store.categories" 
			:key="catIndex"
			class="time-section"
		>
			<view class="section-header">
				<view class="section-title">
					<text class="section-text">{{ category.name }}</text>
				</view>
				<wd-icon name="arrow-up" size="20"></wd-icon>
			</view>
			
			<view class="habit-grid">
				<view 
					v-for="(habit, habitIndex) in category.habits" 
					:key="habitIndex"
					class="habit-card"
					:class="{ 'shake': habit.shaking, 'fade-out': habit.fading }"
					@click="toggleCheck(catIndex, habitIndex, catIndex === 0 ? 'any' : 'other', $event)"
				>
					<view class="icon-circle" :style="{ backgroundColor: habit.color }">
						<wd-icon :name="habit.icon" size="28" color="#fff"></wd-icon>
						<text class="habit-initial">{{ habit.name.charAt(0) }}</text>
					</view>
					<text class="habit-name">{{ habit.name }}</text>
					<text v-if="catIndex !== 0" class="habit-status" :class="{ 'completed': habit.checked }">
						{{ habit.checked ? '已完成' : '未完成' }}
					</text>
				</view>
			</view>
		</view>
		
		<view class="empty-tip" v-if="store.categories.length === 0">
			<wd-icon name="inbox" size="80" color="#ddd"></wd-icon>
			<text class="empty-text">暂无习惯，去添加吧~</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHabitsStore } from '@/store/modules/habits'
import ParticleEffect from '@/components/ParticleEffect.vue'

const store = useHabitsStore()

const particleEffect = ref({
	show: false,
	x: 0,
	y: 0,
	color: '#7ec699'
})

onMounted(() => {
	store.loadHabits()
})

const toggleCheck = (catIndex, habitIndex, type, event) => {
	const habit = store.categories[catIndex].habits[habitIndex]
	
	if (type === 'any') {
		if (!habit.checked) {
			const touch = event.touches?.[0] || event.detail || {}
			particleEffect.value = {
				show: true,
				x: touch.clientX || touch.pageX || window.innerWidth / 2,
				y: touch.clientY || touch.pageY || window.innerHeight / 2,
				color: habit.color
			}
			
			habit.shaking = true
			
			setTimeout(() => {
				habit.shaking = false
				habit.fading = true
				
				setTimeout(() => {
					store.deleteHabit(catIndex, habitIndex)
				}, 500)
			}, 500)
			
			uni.vibrateShort({
				success: () => {},
				fail: () => {}
			})
		}
	} else {
		if (habit.type === 'quick') {
			store.checkHabit(catIndex, habitIndex)
		} else {
			uni.navigateTo({
				url: `/pages/pomodoro/index?habit=${encodeURIComponent(JSON.stringify(habit))}`
			})
		}
	}
}
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
	
	&.shake {
		animation: shake 0.5s ease;
	}
	
	&.fade-out {
		animation: fadeOut 0.5s ease forwards;
	}
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	10%, 30%, 50%, 70%, 90% { transform: translateX(-10rpx); }
	20%, 40%, 60%, 80% { transform: translateX(10rpx); }
}

@keyframes fadeOut {
	from {
		opacity: 1;
		transform: scale(1);
	}
	to {
		opacity: 0;
		transform: scale(0.8);
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
	position: relative;
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

.habit-initial {
	position: absolute;
	font-size: 48rpx;
	font-weight: bold;
	color: #fff;
	opacity: 0.3;
}

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
	gap: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>
