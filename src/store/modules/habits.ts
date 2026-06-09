import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Habit {
	name: string
	icon: string
	color: string
	type: 'quick' | 'timer'
	checked?: boolean
	count?: number
}

export interface Category {
	name: string
	icon: string
	color: string
	habits: Habit[]
}

export const useHabitsStore = defineStore('habits', () => {
	const categories = ref<Category[]>([])
	const selectedHabit = ref<Habit | null>(null)

	const loadHabits = () => {
		try {
			const stored = uni.getStorageSync('habits')
			if (stored) {
				categories.value = JSON.parse(stored)
				migrateIconNames()
			} else {
				initDefaultHabits()
			}
		} catch (e) {
			initDefaultHabits()
		}
	}

	const initDefaultHabits = () => {
		categories.value = [
			{ 
				name: '任意时间', 
				icon: 'clock', 
				color: '#a8d8d8',
				habits: [
					{ name: '练习新技能', icon: 'chart-bar', color: '#b5a8e6', type: 'timer' },
					{ name: '醒来喝水', icon: 'gift', color: '#f5a8c9', type: 'quick' },
					{ name: '睡前刷牙', icon: 'heart', color: '#a8d8c9', type: 'quick' },
					{ name: '背单词', icon: 'books', color: '#d4b5f0', type: 'timer' },
				]
			},
			{ 
				name: '起床之后', 
				icon: 'star', 
				color: '#f9e5b5',
				habits: [
					{ name: '写日记', icon: 'edit', color: '#a8d8c9', type: 'quick' },
					{ name: '写待办事项', icon: 'note', color: '#f0d67d', type: 'quick' },
					{ name: '狗', icon: 'star', color: '#f9e5b5', type: 'quick' },
				]
			},
			{ 
				name: '晨间习惯', 
				icon: 'gift', 
				color: '#c9f0d4',
				habits: [
					{ name: '打坐冥想', icon: 'tips', color: '#a8d8d8', type: 'quick' },
					{ name: '休息一下', icon: 'chat', color: '#c9f0d4', type: 'quick' },
					{ name: '使用番茄钟', icon: 'clock', color: '#d4b5f0', type: 'timer' },
					{ name: '浇花', icon: 'cloud', color: '#a8d8d8', type: 'quick' },
				]
			},
		]
		saveHabits()
	}

	const iconMigrationMap: Record<string, string> = {
		// wd-icon 中不存在的 IconPark 图标名 → 有效的 wd-icon 名
		'cup': 'gift',
		'tooth': 'heart',
		'book-open': 'books',
		'pen': 'note',
		'dog': 'star',
		'meditation': 'tips',
		'tomato': 'clock',
		'water-drop': 'cloud',
		'running': 'heart',
		'music': 'sound',
		'coffee': 'gift',
		'sunrise': 'star',
		'alarm-clock': 'clock',
		'trophy': 'star',
		'fire': 'heart',
		'timer': 'clock',
		'inbox': 'read',
		'message': 'chat',
		'circle-plus': 'add-circle',
	}

	/** 迁移已存储习惯数据中的旧图标名 → 新图标名 */
	const migrateIconNames = () => {
		let changed = false
		for (const cat of categories.value) {
			// 迁移分类图标
			if (iconMigrationMap[cat.icon]) {
				cat.icon = iconMigrationMap[cat.icon]
				changed = true
			}
			// 迁移习惯图标
			for (const habit of cat.habits) {
				if (iconMigrationMap[habit.icon]) {
					habit.icon = iconMigrationMap[habit.icon]
					changed = true
				}
			}
		}
		if (changed) {
			saveHabits()
			console.log('[Habits] 图标名迁移完成')
		}
	}

	const saveHabits = () => {
		uni.setStorageSync('habits', JSON.stringify(categories.value))
	}

	const addHabit = (categoryIndex: number, habit: Habit) => {
		categories.value[categoryIndex].habits.push(habit)
		saveHabits()
	}

	const updateHabit = (categoryIndex: number, habitIndex: number, habit: Habit) => {
		categories.value[categoryIndex].habits.splice(habitIndex, 1, habit)
		saveHabits()
	}

	const deleteHabit = (categoryIndex: number, habitIndex: number) => {
		categories.value[categoryIndex].habits.splice(habitIndex, 1)
		saveHabits()
	}

	const checkHabit = (categoryIndex: number, habitIndex: number) => {
		const habit = categories.value[categoryIndex].habits[habitIndex]
		habit.checked = !habit.checked
		if (habit.checked) {
			habit.count = (habit.count || 0) + 1
		}
		saveHabits()
	}

	const removeHabit = (categoryIndex: number, habitIndex: number) => {
		categories.value[categoryIndex].habits.splice(habitIndex, 1)
		saveHabits()
	}

	return {
		categories,
		selectedHabit,
		loadHabits,
		addHabit,
		updateHabit,
		deleteHabit,
		checkHabit,
		removeHabit,
		saveHabits
	}
})
