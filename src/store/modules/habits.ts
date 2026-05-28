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

	const loadHabits = () => {
		try {
			const stored = uni.getStorageSync('habits')
			if (stored) {
				categories.value = JSON.parse(stored)
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
					{ name: '醒来喝水', icon: 'cup', color: '#f5a8c9', type: 'quick' },
					{ name: '睡前刷牙', icon: 'tooth', color: '#a8d8c9', type: 'quick' },
					{ name: '背单词', icon: 'book-open', color: '#d4b5f0', type: 'timer' },
				]
			},
			{ 
				name: '起床之后', 
				icon: 'sunrise', 
				color: '#f9e5b5',
				habits: [
					{ name: '写日记', icon: 'calendar', color: '#a8d8c9', type: 'quick' },
					{ name: '写待办事项', icon: 'pen', color: '#f0d67d', type: 'quick' },
					{ name: '狗', icon: 'dog', color: '#f9e5b5', type: 'quick' },
				]
			},
			{ 
				name: '晨间习惯', 
				icon: 'coffee', 
				color: '#c9f0d4',
				habits: [
					{ name: '打坐冥想', icon: 'meditation', color: '#a8d8d8', type: 'quick' },
					{ name: '休息一下', icon: 'chat', color: '#c9f0d4', type: 'quick' },
					{ name: '使用番茄钟', icon: 'tomato', color: '#d4b5f0', type: 'timer' },
					{ name: '浇花', icon: 'water-drop', color: '#a8d8d8', type: 'quick' },
				]
			},
		]
		saveHabits()
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
		loadHabits,
		addHabit,
		updateHabit,
		deleteHabit,
		checkHabit,
		removeHabit,
		saveHabits
	}
})
