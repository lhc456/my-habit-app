<template>
	<view class="container">
		<view class="header">
			<text class="title">习惯管理</text>
			<view class="add-btn" @click="showAddDialog = true">
				<wd-icon name="circle-plus" size="32" color="#7ec699"></wd-icon>
			</view>
		</view>
		
		<view class="category-section" v-for="(category, catIndex) in store.categories" :key="catIndex">
			<view class="category-header">
				<view class="category-title">
					<view class="category-icon" :style="{ backgroundColor: category.color }">
						<wd-icon :name="category.icon" size="24" color="#fff"></wd-icon>
					</view>
					<text class="category-text">{{ category.name }}</text>
				</view>
				<text class="category-count">{{ category.habits.length }}个习惯</text>
			</view>
			
			<view class="habit-list" v-if="category.habits.length > 0">
				<view 
					v-for="(habit, habitIndex) in category.habits" 
					:key="habitIndex"
					class="habit-item"
					@longpress="editHabit(catIndex, habitIndex)"
				>
					<view class="habit-card" :style="{ backgroundColor: habit.color }">
						<view class="habit-icon-wrap">
							<wd-icon :name="habit.icon" size="40" color="#fff"></wd-icon>
							<text class="habit-initial">{{ habit.name.charAt(0) }}</text>
						</view>
						<text class="habit-name">{{ habit.name }}</text>
						<view class="habit-type-tag" :class="habit.type === 'timer' ? 'timer' : 'quick'">
							{{ habit.type === 'timer' ? '计时' : '快速' }}
						</view>
						<view class="delete-btn" @click.stop="deleteHabit(catIndex, habitIndex)">
							<wd-icon name="close" size="20" color="#fff"></wd-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="empty-tip" v-else>
				<wd-icon name="inbox" size="60" color="#ddd"></wd-icon>
				<text class="empty-text">暂无习惯，点击右上角添加</text>
			</view>
		</view>
		
		<view class="dialog-mask" v-if="showAddDialog" @click="closeDialog">
			<view class="dialog" @click.stop>
				<view class="dialog-header">
					<text class="dialog-title">{{ editingIndex.cat >= 0 ? '编辑习惯' : '添加习惯' }}</text>
					<view class="dialog-close" @click="closeDialog">
						<wd-icon name="close" size="24" color="#666"></wd-icon>
					</view>
				</view>
				
				<view class="dialog-content">
					<view class="form-item">
						<text class="form-label">习惯名称</text>
						<input 
							class="form-input" 
							v-model="formData.name" 
							placeholder="请输入习惯名称"
							maxlength="10"
						/>
					</view>
					
					<view class="form-item">
						<text class="form-label">习惯类型</text>
						<view class="type-selector">
							<view 
								class="type-item" 
								:class="{ active: formData.type === 'quick' }"
								@click="formData.type = 'quick'"
							>
								<wd-icon name="check" size="24" :color="formData.type === 'quick' ? '#7ec699' : '#ccc'"></wd-icon>
								<text>快速打卡</text>
							</view>
							<view 
								class="type-item" 
								:class="{ active: formData.type === 'timer' }"
								@click="formData.type = 'timer'"
							>
								<wd-icon name="timer" size="24" :color="formData.type === 'timer' ? '#7ec699' : '#ccc'"></wd-icon>
								<text>计时习惯</text>
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<text class="form-label">图标</text>
						<view class="icon-grid">
							<view 
								v-for="icon in iconOptions" 
								:key="icon.value"
								class="icon-item"
								:class="{ active: formData.icon === icon.value }"
								@click="formData.icon = icon.value"
							>
								<wd-icon :name="icon.value" size="28" :color="formData.icon === icon.value ? '#7ec699' : '#666'"></wd-icon>
								<text class="icon-label">{{ icon.label }}</text>
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<text class="form-label">颜色</text>
						<view class="color-grid">
							<view 
								v-for="color in colorOptions" 
								:key="color"
								class="color-item"
								:class="{ active: formData.color === color }"
								:style="{ backgroundColor: color }"
								@click="formData.color = color"
							>
								<wd-icon v-if="formData.color === color" name="check" size="20" color="#fff"></wd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<text class="form-label">所属分类</text>
						<view class="category-selector">
							<view 
								v-for="(cat, index) in store.categories" 
								:key="index"
								class="category-item"
								:class="{ active: formData.category === index }"
								@click="formData.category = index"
							>
								<wd-icon :name="cat.icon" size="20" :color="formData.category === index ? '#7ec699' : '#666'"></wd-icon>
								<text>{{ cat.name }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="dialog-footer">
					<view class="btn btn-cancel" @click="closeDialog">取消</view>
					<view class="btn btn-confirm" @click="saveHabit">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHabitsStore } from '@/store/modules/habits'

const store = useHabitsStore()

onMounted(() => {
	store.loadHabits()
})

const showAddDialog = ref(false)
const editingIndex = ref({ cat: -1, index: -1 })

const formData = ref({
	name: '',
	icon: 'check',
	color: '#7ec699',
	type: 'quick',
	category: 0
})

const iconOptions = [
	{ label: '打卡', value: 'check' },
	{ label: '喝水', value: 'cup' },
	{ label: '书籍', value: 'book-open' },
	{ label: '运动', value: 'running' },
	{ label: '冥想', value: 'meditation' },
	{ label: '日记', value: 'calendar' },
	{ label: '番茄钟', value: 'tomato' },
	{ label: '刷牙', value: 'tooth' },
	{ label: '宠物', value: 'dog' },
	{ label: '浇花', value: 'water-drop' },
	{ label: '音乐', value: 'music' },
	{ label: '技能', value: 'chart-bar' },
	{ label: '待办', value: 'pen' },
	{ label: '休息', value: 'chat' },
	{ label: '咖啡', value: 'coffee' },
	{ label: '星星', value: 'star' },
]

const colorOptions = [
	'#7ec699', '#ffb6c1', '#c4b5fd', '#a8d8d8', 
	'#f9e5b5', '#a8d8c9', '#ffd6a5', '#b5a8e6',
	'#f5a8c9', '#f0d67d', '#d4b5f0', '#c9f0d4'
]

const editHabit = (catIndex, index) => {
	const habit = store.categories[catIndex].habits[index]
	formData.value = {
		name: habit.name,
		icon: habit.icon,
		color: habit.color,
		type: habit.type,
		category: catIndex
	}
	editingIndex.value = { cat: catIndex, index: index }
	showAddDialog.value = true
}

const deleteHabit = (catIndex, index) => {
	uni.showModal({
		title: '提示',
		content: '确定删除这个习惯吗？',
		success: (res) => {
			if (res.confirm) {
				store.deleteHabit(catIndex, index)
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500
				})
			}
		}
	})
}

const closeDialog = () => {
	showAddDialog.value = false
	editingIndex.value = { cat: -1, index: -1 }
	formData.value = {
		name: '',
		icon: 'check',
		color: '#7ec699',
		type: 'quick',
		category: 0
	}
}

const saveHabit = () => {
	if (!formData.value.name) {
		uni.showToast({
			title: '请输入习惯名称',
			icon: 'none',
			duration: 1500
		})
		return
	}
	
	if (editingIndex.value.cat >= 0) {
		store.updateHabit(editingIndex.value.cat, editingIndex.value.index, {
			name: formData.value.name,
			icon: formData.value.icon,
			color: formData.value.color,
			type: formData.value.type
		})
	} else {
		store.addHabit(formData.value.category, {
			name: formData.value.name,
			icon: formData.value.icon,
			color: formData.value.color,
			type: formData.value.type
		})
	}
	
	uni.showToast({
		title: '保存成功',
		icon: 'success',
		duration: 1500
	})
	
	closeDialog()
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	min-height: 100vh;
	background: linear-gradient(180deg, #f5f9f7 0%, #fff 100%);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	margin-bottom: 30rpx;
	background: #fff;
	border-radius: 20rpx;
	border: 3rpx solid #7ec699;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #7ec699;
}

.add-btn {
	padding: 10rpx;
}

.category-section {
	margin-bottom: 40rpx;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 0 10rpx;
}

.category-title {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.category-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid #333;
}

.category-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.category-count {
	font-size: 24rpx;
	color: #999;
}

.habit-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.habit-item {
	width: calc(33.33% - 14rpx);
}

.habit-card {
	position: relative;
	border-radius: 24rpx;
	padding: 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	border: 3rpx solid #333;
	box-shadow: 4rpx 4rpx 0 #333;
	transition: transform 0.2s;
	
	&:active {
		transform: scale(0.95);
	}
}

.habit-icon-wrap {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border: 3rpx solid rgba(255, 255, 255, 0.5);
}

.habit-initial {
	position: absolute;
	font-size: 50rpx;
	font-weight: bold;
	color: #fff;
	opacity: 0.4;
}

.habit-name {
	font-size: 26rpx;
	color: #fff;
	text-align: center;
	font-weight: bold;
	text-shadow: 2rpx 2rpx 0 rgba(0, 0, 0, 0.1);
}

.habit-type-tag {
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	font-weight: bold;
	border: 2rpx solid #fff;
	
	&.quick {
		background: rgba(255, 255, 255, 0.4);
		color: #fff;
	}
	
	&.timer {
		background: #fff;
		color: #333;
	}
}

.delete-btn {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background: rgba(255, 100, 100, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx solid #fff;
	
	&:active {
		transform: scale(0.9);
	}
}

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
	gap: 20rpx;
}

.empty-text {
	font-size: 26rpx;
	color: #999;
}

.dialog-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.dialog {
	width: 90%;
	max-height: 80vh;
	background: #fff;
	border-radius: 32rpx;
	overflow: hidden;
	border: 4rpx solid #7ec699;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	background: #f5f9f7;
	border-bottom: 2rpx solid #eee;
}

.dialog-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #7ec699;
}

.dialog-close {
	padding: 10rpx;
}

.dialog-content {
	padding: 30rpx;
	max-height: 60vh;
	overflow-y: auto;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 16rpx;
	display: block;
}

.form-input {
	width: 100%;
	padding: 20rpx;
	border: 3rpx solid #ddd;
	border-radius: 16rpx;
	font-size: 28rpx;
	background: #f9f9f9;
	
	&:focus {
		border-color: #7ec699;
		background: #fff;
	}
}

.type-selector {
	display: flex;
	gap: 20rpx;
}

.type-item {
	flex: 1;
	padding: 24rpx;
	border: 3rpx solid #ddd;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	font-size: 26rpx;
	color: #666;
	
	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
		color: #7ec699;
	}
}

.icon-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16rpx;
}

.icon-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx;
	border: 3rpx solid #eee;
	border-radius: 16rpx;
	gap: 8rpx;
	
	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
	}
}

.icon-label {
	font-size: 20rpx;
	color: #666;
}

.color-grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 16rpx;
}

.color-item {
	width: 100%;
	aspect-ratio: 1;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #eee;
	transition: transform 0.2s;
	
	&.active {
		border-color: #333;
		transform: scale(1.1);
	}
	
	&:active {
		transform: scale(0.9);
	}
}

.category-selector {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.category-item {
	padding: 20rpx;
	border: 3rpx solid #ddd;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 26rpx;
	color: #666;
	
	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
		color: #7ec699;
	}
}

.dialog-footer {
	display: flex;
	padding: 20rpx 30rpx 30rpx;
	gap: 20rpx;
}

.btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 40rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	border: 3rpx solid #333;
}

.btn-cancel {
	background: #fff;
	color: #666;
}

.btn-confirm {
	background: #7ec699;
	color: #fff;
}
</style>
