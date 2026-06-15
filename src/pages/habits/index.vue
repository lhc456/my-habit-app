<template>
	<view class="container">
		<view class="header">
			<text class="title">习惯管理</text>
			<view class="add-btn" @click="showAddDialog = true">
				<wd-icon name="add-circle" size="28" color="#7ec699"></wd-icon>
			</view>
		</view>
		
		<view class="habit-list" v-if="allHabits.length > 0">
			<view 
				v-for="item in allHabits" 
				:key="`${item.catIndex}-${item.habitIndex}`"
				class="swipe-container"
			>
				<view class="swipe-actions">
					<view class="swipe-action edit" @click.stop="onSwipeEdit(item.catIndex, item.habitIndex)">编辑</view>
					<view class="swipe-action delete" @click.stop="onSwipeDelete(item.catIndex, item.habitIndex)">删除</view>
				</view>
				<view 
					class="habit-row"
					:class="{ swiped: swipedCat === item.catIndex && swipedIdx === item.habitIndex }"
					@touchstart="onTouchStart($event, item.catIndex, item.habitIndex)"
					@touchend="onTouchEnd($event, item.catIndex, item.habitIndex)"
					@click="onRowClick(item.catIndex, item.habitIndex)"
				>
					<view class="habit-row-icon" :style="{ backgroundColor: item.habit.color }">
						<wd-icon :name="item.habit.icon" size="24" color="#fff"></wd-icon>
					</view>
					<view class="habit-row-info">
						<text class="habit-row-name">{{ item.habit.name }}</text>
					</view>
					<view class="habit-row-meta">
						<text class="habit-row-count">{{ item.habit.count || 0 }}次</text>
						<view class="habit-row-tag" :class="item.habit.type === 'timer' ? 'timer' : 'quick'">
							{{ item.habit.type === 'timer' ? '计时' : '快速' }}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="empty-tip" v-else>
			<wd-icon name="read" size="48" color="#ddd"></wd-icon>
			<text class="empty-text">暂无习惯，点击右上角添加</text>
		</view>
		
		<view class="dialog-mask" v-if="showAddDialog" @click="closeDialog">
			<view class="dialog" @click.stop>
				<view class="dialog-header">
					<text class="dialog-title">{{ editingIndex.cat >= 0 ? '编辑习惯' : '添加习惯' }}</text>
					<view class="dialog-close" @click="closeDialog">
						<wd-icon name="close" size="18" color="#999"></wd-icon>
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
								<wd-icon name="clock" size="24" :color="formData.type === 'timer' ? '#7ec699' : '#ccc'"></wd-icon>
								<text>计时习惯</text>
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<text class="form-label">图标</text>
						<view class="icon-grid">
							<view 
								v-for="icon in iconOptions" 
								:key="icon.id"
								class="icon-item"
								:class="{ active: formData.icon === icon.value }"
								:style="{ borderColor: formData.icon === icon.value ? '#7ec699' : 'transparent' }"
								@click="formData.icon = icon.value"
							>
								<wd-icon :name="icon.value" size="28" :color="formData.icon === icon.value ? '#7ec699' : icon.color"></wd-icon>
								<text class="icon-label">{{ icon.label }}</text>
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<text class="form-label">颜色</text>
						<!-- <view class="color-preview" :style="{ backgroundColor: formData.color }">
							<text class="color-preview-text">{{ formData.color }}</text>
						</view> -->
						<view class="color-grid">
							<view 
								v-for="color in colorOptions" 
								:key="color"
								class="color-item"
								:class="{ active: formData.color === color }"
								:style="{ backgroundColor: color }"
								@click="formData.color = color"
							>
								<wd-icon v-if="formData.color === color" name="check" size="18" color="#fff"></wd-icon>
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
								<wd-icon :name="cat.icon" size="20" :color="formData.category === index ? '#7ec699' : cat.color"></wd-icon>
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
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/store/modules/habits'
import WdIcon from 'wot-design-uni/components/wd-icon/wd-icon.vue'

const store = useHabitsStore()

onMounted(() => {
	store.loadHabits()
})

// 扁平化所有习惯
const allHabits = computed(() => {
	const result = []
	store.categories.forEach((cat, catIndex) => {
		cat.habits.forEach((habit, habitIndex) => {
			result.push({ habit, catIndex, habitIndex })
		})
	})
	return result
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
	{ id: 1, label: '打卡', value: 'check', color: '#7ec699' },
	{ id: 2, label: '喝水', value: 'gift', color: '#a8d8d8' },
	{ id: 3, label: '书籍', value: 'books', color: '#c4b5fd' },
	{ id: 4, label: '运动', value: 'heart', color: '#ffb6c1' },
	{ id: 5, label: '冥想', value: 'tips', color: '#b5a8e6' },
	{ id: 6, label: '日记', value: 'edit', color: '#f9e5b5' },
	{ id: 7, label: '番茄钟', value: 'clock', color: '#ffd6a5' },
	{ id: 8, label: '刷牙', value: 'like', color: '#a8d8c9' },
	{ id: 9, label: '宠物', value: 'star', color: '#f5a8c9' },
	{ id: 10, label: '浇花', value: 'cloud', color: '#a8d8d8' },
	{ id: 11, label: '音乐', value: 'sound', color: '#d4b5f0' },
	{ id: 12, label: '技能', value: 'chart-bar', color: '#c4b5fd' },
	{ id: 13, label: '待办', value: 'note', color: '#f0d67d' },
	{ id: 14, label: '休息', value: 'chat', color: '#c9f0d4' },
	{ id: 15, label: '咖啡', value: 'help', color: '#ffb6c1' },
	{ id: 16, label: '星星', value: 'flag', color: '#f9e5b5' },
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

// 左滑手势
const swipedCat = ref(-1)
const swipedIdx = ref(-1)
let touchStartX = 0
let preventClick = false

const onTouchStart = (e, catIdx, idx) => {
	touchStartX = e.touches[0].clientX
	preventClick = false
}

const onTouchEnd = (e, catIdx, idx) => {
	const deltaX = e.changedTouches[0].clientX - touchStartX
	const isSwiped = swipedCat.value === catIdx && swipedIdx.value === idx
	
	if (deltaX < -50) {
		// 左滑 → 打开操作按钮
		swipedCat.value = catIdx
		swipedIdx.value = idx
		preventClick = true
	} else if (isSwiped) {
		// 已展开时点击 → 关闭
		swipedCat.value = -1
		swipedIdx.value = -1
		preventClick = true
	} else {
		swipedCat.value = -1
		swipedIdx.value = -1
	}
}

const onRowClick = (catIdx, idx) => {
	if (preventClick) {
		preventClick = false
		return
	}
	uni.navigateTo({
		url: `/pages/habits/detail?catIndex=${catIdx}&habitIndex=${idx}`
	})
}

const onSwipeEdit = (catIdx, idx) => {
	swipedCat.value = -1
	swipedIdx.value = -1
	editHabit(catIdx, idx)
}

const onSwipeDelete = (catIdx, idx) => {
	swipedCat.value = -1
	swipedIdx.value = -1
	deleteHabit(catIdx, idx)
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	height: 100%;
	overflow-y: auto;
	box-sizing: border-box;
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

// 左滑容器
.swipe-container {
	position: relative;
	overflow: hidden;
	border-radius: 16rpx;
	
	& + & {
		margin-top: 2rpx;
	}
}

.swipe-actions {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	
	.swipe-action {
		width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26rpx;
		font-weight: bold;
		
		&.edit {
			background: #7ec699;
		}
		
		&.delete {
			background: #ff6b6b;
			border-radius: 0 16rpx 16rpx 0;
		}
	}
}

// 习惯行
.habit-row {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	padding: 24rpx 20rpx;
	background: #fff;
	border-radius: 16rpx;
	transition: transform 0.3s ease;
	
	&.swiped {
		transform: translateX(-240rpx);
	}
}

.habit-row-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
	border: 3rpx solid rgba(0, 0, 0, 0.08);
}

.habit-row-info {
	flex: 1;
	min-width: 0;
}

.habit-row-name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.habit-row-meta {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex-shrink: 0;
	margin-left: 16rpx;
}

.habit-row-count {
	font-size: 22rpx;
	color: #999;
}

.habit-row-tag {
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	font-weight: bold;
	
	&.quick {
		background: rgba(126, 198, 153, 0.12);
		color: #7ec699;
	}
	
	&.timer {
		background: rgba(139, 124, 245, 0.12);
		color: #8b7cf5;
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
	display: flex;
	flex-direction: column;
}

.dialog-header {
	flex-shrink: 0;
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
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
	overflow-x: hidden;
	
	// 自定义滚动条
	&::-webkit-scrollbar {
		width: 6rpx;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 3rpx;
	}
	&::-webkit-scrollbar-thumb {
		background: #ddd;
		border-radius: 3rpx;
	}
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
	padding: 28rpx 20rpx;
	border: 3rpx solid #eee;
	border-radius: 16rpx;
	font-size: 28rpx;
	background: #f9f9f9;
	box-sizing: border-box;
	
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
	overflow: hidden;
}

.icon-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 8rpx;
	border: 3rpx solid transparent;
	border-radius: 16rpx;
	gap: 8rpx;
	min-width: 0;
	background: #fafafa;
	transition: all 0.2s;
	
	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
	}
}

.icon-label {
	font-size: 20rpx;
	color: #999;
}

.color-preview {
	height: 48rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	transition: background-color 0.3s;
}

.color-preview-text {
	font-size: 22rpx;
	color: #fff;
	font-weight: bold;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.color-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 20rpx;
	justify-items: center;
}

.color-item {
	width: 68rpx;
	height: 68rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid transparent;
	transition: transform 0.2s, border-color 0.2s;
	
	&.active {
		border-color: #333;
		transform: scale(1.15);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
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
	padding: 22rpx;
	border: 3rpx solid #eee;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 26rpx;
	color: #666;
	background: #fafafa;
	transition: all 0.2s;
	
	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
		color: #7ec699;
	}
}

.dialog-footer {
	flex-shrink: 0;
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
