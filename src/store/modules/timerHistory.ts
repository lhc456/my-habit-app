import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TimerHistoryRecord {
	id: string
	taskName: string
	linkedHabit: { name: string; icon: string; color: string } | null
	mode: 'countdown' | 'stopwatch' | 'pomodoro'
	totalSeconds: number       // Planned duration
	elapsedSeconds: number     // Actual time spent
	isBreak: boolean           // For pomodoro: was this a break session
	completedPomodoros: number // For pomodoro: total pomodoros in this session
	completedAt: number        // Timestamp when completed
	sessionId: string          // Reference to original session
}

const STORAGE_KEY = 'timer-history-records'

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export const useTimerHistoryStore = defineStore('timerHistory', () => {
	const records = ref<TimerHistoryRecord[]>([])

	// ─── Computed ───

	/** Records for today (based on local date) */
	const todayRecords = computed(() => {
		const todayStart = getTodayStart()
		return records.value.filter(r => r.completedAt >= todayStart)
	})

	/** Total focus time in seconds for today */
	const todayFocusSeconds = computed(() => {
		return todayRecords.value
			.filter(r => !r.isBreak)
			.reduce((sum, r) => sum + r.elapsedSeconds, 0)
	})

	/** Number of completions today */
	const todayCompletedCount = computed(() => todayRecords.value.length)

	/** Number of pomodoro work completions today */
	const todayPomodoroCount = computed(() => {
		return todayRecords.value.filter(r => r.mode === 'pomodoro' && !r.isBreak).length
	})

	/** Streak: consecutive days with at least one completion */
	const streakDays = computed(() => {
		if (records.value.length === 0) return 0

		const dates = new Set<number>()
		for (const r of records.value) {
			const dayStart = getDayStart(r.completedAt)
			dates.add(dayStart)
		}

		const sortedDates = Array.from(dates).sort((a, b) => b - a)
		let streak = 0
		const today = getTodayStart()

		for (let i = 0; i < sortedDates.length; i++) {
			const expected = today - i * 86400000
			if (sortedDates[i] === expected) {
				streak++
			} else {
				break
			}
		}
		return streak
	})

	/** Recent records (last 20) */
	const recentRecords = computed(() => {
		return [...records.value]
			.sort((a, b) => b.completedAt - a.completedAt)
			.slice(0, 20)
	})

	/** Weekly summary: last 7 days focus seconds per day */
	const weeklySummary = computed(() => {
		const result: { date: string; focusSeconds: number; count: number }[] = []
		const today = getTodayStart()

		for (let i = 6; i >= 0; i--) {
			const dayStart = today - i * 86400000
			const dayEnd = dayStart + 86400000

			const dayRecords = records.value.filter(r =>
				r.completedAt >= dayStart && r.completedAt < dayEnd
			)

			const dateObj = new Date(dayStart)
			const month = dateObj.getMonth() + 1
			const day = dateObj.getDate()

			result.push({
				date: `${month}/${day}`,
				focusSeconds: dayRecords
					.filter(r => !r.isBreak)
					.reduce((sum, r) => sum + r.elapsedSeconds, 0),
				count: dayRecords.length,
			})
		}
		return result
	})

	// ─── Actions ───

	function addRecord(data: Omit<TimerHistoryRecord, 'id'>): TimerHistoryRecord {
		const record: TimerHistoryRecord = {
			...data,
			id: generateId(),
		}
		records.value.push(record)
		saveToStorage()
		return record
	}

	function clearAll() {
		records.value = []
		saveToStorage()
	}

	// ─── Persistence ───

	/** 旧图标名 → 新图标名映射 */
	const iconMigrationMap: Record<string, string> = {
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

	/** 迁移已存储 timer history 中的旧图标名 */
	function migrateIconNames() {
		let changed = false
		for (const record of records.value) {
			if (record.linkedHabit?.icon && iconMigrationMap[record.linkedHabit.icon]) {
				record.linkedHabit.icon = iconMigrationMap[record.linkedHabit.icon]
				changed = true
			}
		}
		if (changed) {
			saveToStorage()
			console.log('[TimerHistory] 图标名迁移完成')
		}
	}

	function loadFromStorage() {
		try {
			const stored = uni.getStorageSync(STORAGE_KEY)
			if (stored) {
				records.value = JSON.parse(stored)
				migrateIconNames()
			}
		} catch (e) {
			console.error('Failed to load timer history:', e)
		}
	}

	function saveToStorage() {
		try {
			uni.setStorageSync(STORAGE_KEY, JSON.stringify(records.value))
		} catch (e) {
			console.error('Failed to save timer history:', e)
		}
	}

	return {
		// State
		records,
		// Computed
		todayRecords,
		todayFocusSeconds,
		todayCompletedCount,
		todayPomodoroCount,
		streakDays,
		recentRecords,
		weeklySummary,
		// Actions
		addRecord,
		clearAll,
		loadFromStorage,
	}
})

// ─── Helpers ───

function getTodayStart(): number {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function getDayStart(timestamp: number): number {
	const date = new Date(timestamp)
	return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}
