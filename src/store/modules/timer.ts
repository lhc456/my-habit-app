import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTimerHistoryStore } from './timerHistory'

export type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface LinkedHabit {
	name: string
	icon: string
	color: string
}

export interface TimerSession {
	id: string
	taskName: string
	linkedHabit: LinkedHabit | null
	mode: TimerMode
	status: TimerStatus

	// Duration settings (seconds)
	totalSeconds: number      // For countdown/pomodoro: work duration
	breakSeconds: number      // For pomodoro: break duration

	// Tracking timestamps (Date.now() in ms)
	startedAt: number | null       // When timer was first started
	lastResumeAt: number | null    // When timer was last resumed (null if paused)
	totalPausedMs: number          // Total accumulated paused time in ms

	// Pomodoro specific
	completedPomodoros: number
	isBreak: boolean

	// Records
	createdAt: number
	completedAt: number | null
}

const MAX_TIMERS = 10
const STORAGE_KEY = 'timer-sessions'

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export const useTimerStore = defineStore('timer', () => {
	const sessions = ref<TimerSession[]>([])

	// ─── Computed ───

	const activeSessions = computed(() =>
		sessions.value.filter(s => s.status !== 'completed')
	)

	const completedSessions = computed(() =>
		sessions.value.filter(s => s.status === 'completed')
	)

	const canCreateNew = computed(() =>
		sessions.value.length < MAX_TIMERS
	)

	// ─── Timer Calculation Helpers ───

	/**
	 * Calculate elapsed seconds for a session.
	 *
	 * elapsedMs = total time since started - total time paused.
	 * When running:  (now - startedAt) - totalPausedMs
	 * When paused:   totalPausedMs already stores elapsed ms at time of pause
	 * When idle/completed: 0
	 */
	function getElapsedSeconds(session: TimerSession): number {
		if (session.status === 'running') {
			// totalPausedMs stores accumulated elapsed time, add time since last resume
			const elapsedMs = session.totalPausedMs + (Date.now() - session.lastResumeAt!)
			return Math.max(0, Math.floor(elapsedMs / 1000))
		} else if (session.status === 'paused') {
			// At pause, totalPausedMs was updated to reflect all elapsed time
			return Math.floor(session.totalPausedMs / 1000)
		}
		return 0
	}

	/**
	 * Get remaining seconds (for countdown/pomodoro modes).
	 */
	function getRemainingSeconds(session: TimerSession): number {
		if (session.mode === 'stopwatch') return 0
		const elapsed = getElapsedSeconds(session)
		const total = session.isBreak ? session.breakSeconds : session.totalSeconds
		return Math.max(0, total - elapsed)
	}

	/**
	 * Get display time string (MM:SS)
	 */
	function getDisplayTime(session: TimerSession): string {
		if (session.mode === 'stopwatch') {
			return formatTime(getElapsedSeconds(session))
		}
		return formatTime(getRemainingSeconds(session))
	}

	function formatTime(totalSeconds: number): string {
		const mins = Math.floor(totalSeconds / 60)
		const secs = totalSeconds % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	/**
	 * Get progress as 0-1 (for countdown/pomodoro).
	 */
	function getProgress(session: TimerSession): number {
		if (session.mode === 'stopwatch') return 0
		const total = session.isBreak ? session.breakSeconds : session.totalSeconds
		if (total <= 0) return 0
		const elapsed = getElapsedSeconds(session)
		return Math.min(1, elapsed / total)
	}

	/**
	 * Check if a running timer has completed.
	 */
	function isCompleted(session: TimerSession): boolean {
		if (session.mode === 'stopwatch') return false
		if (session.status !== 'running') return false
		return getRemainingSeconds(session) <= 0
	}

	// ─── Actions ───

	function createSession(data: {
		taskName: string
		mode: TimerMode
		totalSeconds?: number
		breakSeconds?: number
		linkedHabit?: LinkedHabit | null
	}): TimerSession | null {
		if (sessions.value.length >= MAX_TIMERS) {
			uni.showToast({
				title: `最多只能有${MAX_TIMERS}个计时器`,
				icon: 'none',
				duration: 2000
			})
			return null
		}

		const session: TimerSession = {
			id: generateId(),
			taskName: data.taskName,
			linkedHabit: data.linkedHabit || null,
			mode: data.mode,
			status: 'idle',
			totalSeconds: data.totalSeconds || (data.mode === 'pomodoro' ? 25 * 60 : 25 * 60),
			breakSeconds: data.breakSeconds || 5 * 60,
			startedAt: null,
			lastResumeAt: null,
			totalPausedMs: 0,
			completedPomodoros: 0,
			isBreak: false,
			createdAt: Date.now(),
			completedAt: null,
		}

		sessions.value.push(session)
		saveToStorage()
		return session
	}

	function deleteSession(id: string) {
		const idx = sessions.value.findIndex(s => s.id === id)
		if (idx !== -1) {
			sessions.value.splice(idx, 1)
			saveToStorage()
		}
	}

	/**
	 * Start or resume a timer.
	 *
	 * On resume: we just set lastResumeAt = now.
	 * totalPausedMs is NOT changed because it represents total paused time
	 * accumulated BEFORE this resume. The running calculation uses
	 * totalPausedMs + (now - lastResumeAt) for elapsed.
	 */
	function startTimer(id: string) {
		const session = sessions.value.find(s => s.id === id)
		if (!session) return

		if (session.status === 'paused') {
			// Resume: record when we resumed
			session.lastResumeAt = Date.now()
			session.status = 'running'
		} else {
			// Fresh start
			session.startedAt = Date.now()
			session.lastResumeAt = Date.now()
			session.totalPausedMs = 0
			session.status = 'running'
		}
		saveToStorage()
	}

	/**
	 * Pause a running timer.
	 * Accumulate the time from lastResumeAt to now into totalPausedMs.
	 */
	function pauseTimer(id: string) {
		const session = sessions.value.find(s => s.id === id)
		if (!session || session.status !== 'running') return

		// Add time since last resume to total paused
		session.totalPausedMs += Date.now() - session.lastResumeAt!
		session.lastResumeAt = null
		session.status = 'paused'
		saveToStorage()
	}

/**
 * Mark timer as completed and record history.
 */
function completeTimer(id: string) {
	const session = sessions.value.find(s => s.id === id)
	if (!session) return

	// If still running, finalize the elapsed time
	if (session.status === 'running') {
		session.totalPausedMs += Date.now() - session.lastResumeAt!
		session.lastResumeAt = null
	}

	// Calculate elapsed seconds before marking completed
	const elapsedSeconds = Math.floor(session.totalPausedMs / 1000)
	const now = Date.now()

	session.status = 'completed'
	session.completedAt = now
	saveToStorage()

	// Record history
	const historyStore = useTimerHistoryStore()
	historyStore.addRecord({
		taskName: session.taskName,
		linkedHabit: session.linkedHabit ? { ...session.linkedHabit } : null,
		mode: session.mode,
		totalSeconds: session.totalSeconds,
		elapsedSeconds: Math.max(1, elapsedSeconds),
		isBreak: session.isBreak,
		completedPomodoros: session.completedPomodoros + (session.mode === 'pomodoro' && !session.isBreak ? 1 : 0),
		completedAt: now,
		sessionId: session.id,
	})
}

	/**
	 * Reset timer back to idle.
	 */
	function resetTimer(id: string) {
		const session = sessions.value.find(s => s.id === id)
		if (!session) return

		session.status = 'idle'
		session.startedAt = null
		session.lastResumeAt = null
		session.totalPausedMs = 0
		session.completedAt = null
		session.isBreak = false
		saveToStorage()
	}

	// ─── Pomodoro specific ───

	function completePomodoroPhase(id: string) {
		const session = sessions.value.find(s => s.id === id)
		if (!session || session.mode !== 'pomodoro') return

		if (session.isBreak) {
			// Break finished → start next work phase
			session.isBreak = false
			session.status = 'idle'
			session.startedAt = null
			session.lastResumeAt = null
			session.totalPausedMs = 0
		} else {
			// Work finished → go to break
			session.completedPomodoros++
			session.isBreak = true
			session.status = 'idle'
			session.startedAt = null
			session.lastResumeAt = null
			session.totalPausedMs = 0
		}
		saveToStorage()
	}

	// ─── Check for completion (call this periodically) ───

	function checkForCompletions(): TimerSession[] {
		const completed: TimerSession[] = []
		for (const session of sessions.value) {
			if (session.mode !== 'stopwatch' && session.status === 'running') {
				if (getRemainingSeconds(session) <= 0) {
					completed.push(session)
				}
			}
		}
		return completed
	}

	// ─── Persistence ───

	/** 旧图标名 → 新图标名映射（与 habits store 保持一致） */
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

	/** 迁移已存储 timer session 中的旧图标名 */
	function migrateIconNames() {
		let changed = false
		for (const session of sessions.value) {
			if (session.linkedHabit?.icon && iconMigrationMap[session.linkedHabit.icon]) {
				session.linkedHabit.icon = iconMigrationMap[session.linkedHabit.icon]
				changed = true
			}
		}
		if (changed) {
			saveToStorage()
			console.log('[Timer] 图标名迁移完成')
		}
	}

	function loadFromStorage() {
		try {
			const stored = uni.getStorageSync(STORAGE_KEY)
			if (stored) {
				sessions.value = JSON.parse(stored)
				migrateIconNames()
			}
		} catch (e) {
			console.error('Failed to load timer sessions:', e)
		}
	}

	function saveToStorage() {
		try {
			uni.setStorageSync(STORAGE_KEY, JSON.stringify(sessions.value))
		} catch (e) {
			console.error('Failed to save timer sessions:', e)
		}
	}

	return {
		// State
		sessions,
		// Computed
		activeSessions,
		completedSessions,
		canCreateNew,
		// Helpers
		getElapsedSeconds,
		getRemainingSeconds,
		getDisplayTime,
		getProgress,
		isCompleted,
		formatTime,
		// Actions
		createSession,
		deleteSession,
		startTimer,
		pauseTimer,
		completeTimer,
		resetTimer,
		completePomodoroPhase,
		checkForCompletions,
		loadFromStorage,
		saveToStorage,
	}
})
