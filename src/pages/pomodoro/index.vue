<template>
	<view class="container">
		<!-- ====== LIST VIEW ====== -->
		<template v-if="currentView === 'list'">
			<view class="header">
				<text class="title">番茄钟</text>
				<view class="header-actions">
					<text class="timer-count">{{ timerStore.sessions.length }}/10</text>
					<view class="add-btn" @click="openCreateDialog('')">
						<wd-icon name="add-circle" size="32" color="#7ec699"></wd-icon>
					</view>
				</view>
			</view>

			<!-- Running Timers Section -->
			<view v-if="runningTimers.length > 0" class="section">
				<text class="section-title">运行中</text>
				<view
					v-for="session in runningTimers"
					:key="session.id"
					class="swipe-wrap"
					@touchstart="onSwipeStart($event, session.id)"
					@touchmove="onSwipeMove($event, session.id)"
					@touchend="onSwipeEnd($event, session.id)"
					@touchcancel="onSwipeEnd($event, session.id)"
				>
					<view class="swipe-inner" :style="{ transform: 'translateX(-' + getSwipeOffset(session.id) + 'rpx)' }">
						<view class="timer-card running" @click="handleCardClick(session.id)">
							<view class="card-left">
								<view class="card-icon" :style="{ backgroundColor: session.linkedHabit?.color || '#a8d8c9' }">
									<wd-icon :name="session.linkedHabit?.icon || 'time'" size="28" color="#fff"></wd-icon>
								</view>
								<view class="card-info">
									<text class="card-task-name">{{ session.taskName }}</text>
									<text class="card-mode-tag">{{ getModeLabel(session.mode) }}{{ session.isBreak ? ' · 休息' : '' }}</text>
								</view>
							</view>
							<view class="card-right">
								<text class="card-time running-text">{{ getDisplayTime(session) }}</text>
								<view class="card-progress">
									<view class="progress-bar" :style="{ width: (getProgress(session) * 100) + '%' }"></view>
								</view>
							</view>
						</view>
						<view class="swipe-actions">
							<view class="swipe-btn swipe-btn-pause" @click.stop="pauseTimer(session.id)">
								<wd-icon name="pause" size="24" color="#fff"></wd-icon>
								<text>暂停</text>
							</view>
							<view class="swipe-btn swipe-btn-stop" @click.stop="stopTimer(session.id)">
								<wd-icon name="close" size="24" color="#fff"></wd-icon>
								<text>停止</text>
							</view>
							<view class="swipe-btn swipe-btn-delete" @click.stop="deleteTimer(session.id)">
								<wd-icon name="delete" size="24" color="#fff"></wd-icon>
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Paused Timers Section -->
			<view v-if="pausedTimers.length > 0" class="section">
				<text class="section-title">已暂停</text>
				<view
					v-for="session in pausedTimers"
					:key="session.id"
					class="swipe-wrap"
					@touchstart="onSwipeStart($event, session.id)"
					@touchmove="onSwipeMove($event, session.id)"
					@touchend="onSwipeEnd($event, session.id)"
					@touchcancel="onSwipeEnd($event, session.id)"
				>
					<view class="swipe-inner" :style="{ transform: 'translateX(-' + getSwipeOffset(session.id) + 'rpx)' }">
						<view class="timer-card paused" @click="handleCardClick(session.id)">
							<view class="card-left">
								<view class="card-icon" :style="{ backgroundColor: session.linkedHabit?.color || '#c4b5fd' }">
									<wd-icon :name="session.linkedHabit?.icon || 'time'" size="28" color="#fff"></wd-icon>
								</view>
								<view class="card-info">
									<text class="card-task-name">{{ session.taskName }}</text>
									<text class="card-mode-tag">{{ getModeLabel(session.mode) }}{{ session.isBreak ? ' · 休息' : '' }}</text>
								</view>
							</view>
							<view class="card-right">
								<text class="card-time paused-text">{{ getDisplayTime(session) }}</text>
							</view>
						</view>
						<view class="swipe-actions">
							<view class="swipe-btn swipe-btn-play" @click.stop="resumeTimer(session.id)">
								<wd-icon name="play" size="24" color="#fff"></wd-icon>
								<text>继续</text>
							</view>
							<view class="swipe-btn swipe-btn-stop" @click.stop="stopTimer(session.id)">
								<wd-icon name="close" size="24" color="#fff"></wd-icon>
								<text>停止</text>
							</view>
							<view class="swipe-btn swipe-btn-delete" @click.stop="deleteTimer(session.id)">
								<wd-icon name="delete" size="24" color="#fff"></wd-icon>
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Completed Timers Section -->
			<view v-if="completedTimers.length > 0" class="section">
				<view class="section-header">
					<text class="section-title">已完成</text>
					<text class="clear-btn" @click="clearCompleted">清除全部</text>
				</view>
				<view
					v-for="session in completedTimers"
					:key="session.id"
					class="swipe-wrap"
					@touchstart="onSwipeStart($event, session.id)"
					@touchmove="onSwipeMove($event, session.id)"
					@touchend="onSwipeEnd($event, session.id)"
					@touchcancel="onSwipeEnd($event, session.id)"
				>
					<view class="swipe-inner" :style="{ transform: 'translateX(-' + getSwipeOffset(session.id) + 'rpx)' }">
						<view class="timer-card completed" @click="handleCardClick(session.id)">
							<view class="card-left">
								<view class="card-icon" :style="{ backgroundColor: session.linkedHabit?.color || '#7ec699' }">
									<wd-icon :name="session.linkedHabit?.icon || 'time'" size="28" color="#fff"></wd-icon>
								</view>
								<view class="card-info">
									<text class="card-task-name">{{ session.taskName }}</text>
									<text class="card-completed-time">{{ formatCompletedTime(session.completedAt) }}</text>
								</view>
							</view>
							<view class="card-right">
								<text class="card-time completed-text">
									<wd-icon name="check" size="24" color="#7ec699"></wd-icon>
								</text>
							</view>
						</view>
						<view class="swipe-actions">
							<view class="swipe-btn swipe-btn-play" @click.stop="timerStore.resetTimer(session.id)">
								<wd-icon name="refresh" size="24" color="#fff"></wd-icon>
								<text>重置</text>
							</view>
							<view class="swipe-btn swipe-btn-stop" @click.stop="reopenTimer(session.id)">
								<wd-icon name="play" size="24" color="#fff"></wd-icon>
								<text>重开</text>
							</view>
							<view class="swipe-btn swipe-btn-delete" @click.stop="deleteTimer(session.id)">
								<wd-icon name="delete" size="24" color="#fff"></wd-icon>
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Empty State -->
			<view v-if="timerStore.sessions.length === 0" class="empty-tip">
				<wd-icon name="time" size="80" color="#ddd"></wd-icon>
				<text class="empty-text">还没有计时器</text>
				<text class="empty-desc">点击右上角 + 创建一个吧</text>
			</view>
		</template>

		<!-- ====== DETAIL VIEW ====== -->
		<template v-if="currentView === 'detail' && currentSession">
			<view class="detail-header">
				<view class="back-btn" @click="currentView = 'list'">
					<wd-icon name="arrow-left" size="28" color="#333"></wd-icon>
				</view>
				<view class="detail-title-area">
					<text class="detail-task-name">{{ currentSession.taskName }}</text>
				</view>
				<view class="detail-actions">
					<view class="detail-action-btn" @click="deleteTimer(currentSession.id)">
						<wd-icon name="delete" size="24" color="#ff6b8a"></wd-icon>
					</view>
				</view>
			</view>

			<!-- Linked Habit Info -->
			<view v-if="currentSession.linkedHabit" class="linked-habit-info">
				<view class="linked-habit-icon" :style="{ backgroundColor: currentSession.linkedHabit.color }">
					<wd-icon :name="currentSession.linkedHabit.icon" size="24" color="#fff"></wd-icon>
				</view>
				<text class="linked-habit-name">{{ currentSession.linkedHabit.name }}</text>
			</view>

			<!-- Big Timer -->
			<view class="timer-display">
				<view
					class="circle"
					:class="{
						'is-running': currentSession.status === 'running',
						'is-paused': currentSession.status === 'paused',
						'is-completed': currentSession.status === 'completed'
					}"
					@click="handleTimerClick"
				>
					<svg class="progress-ring" viewBox="0 0 200 200">
						<circle class="progress-bg" cx="100" cy="100" r="88" />
						<circle
							class="progress-fill"
							cx="100" cy="100" r="88"
							:style="progressStyle"
						/>
					</svg>
					<view class="time-container">
						<text class="time">{{ displayTime }}</text>
						<text class="time-status">{{ statusLabel }}</text>
					</view>
				</view>
			</view>

			<!-- Mode & Duration Info -->
			<view class="detail-mode-info">
				<text class="mode-label">{{ getModeLabel(currentSession.mode) }}</text>
				<text v-if="currentSession.mode !== 'stopwatch'" class="duration-label">
					{{ currentSession.isBreak ? '休息' : '专注' }}
					·
					{{ timerStore.formatTime(currentSession.isBreak ? currentSession.breakSeconds : currentSession.totalSeconds) }}
				</text>
				<text v-if="currentSession.mode === 'pomodoro' && currentSession.completedPomodoros > 0" class="pomodoro-count">
					已完成 {{ currentSession.completedPomodoros }} 个番茄
				</text>
			</view>

			<!-- Controls -->
			<view class="detail-controls">
				<!-- Idle / Paused: Start or Resume -->
				<view
					v-if="currentSession.status === 'idle' || currentSession.status === 'paused'"
					class="control-btn start-btn"
					@click="resumeTimer(currentSession.id)"
				>
					<wd-icon name="play" size="32" color="#fff"></wd-icon>
					<text>{{ currentSession.status === 'paused' ? '继续' : '开始' }}</text>
				</view>

				<!-- Running: Pause -->
				<view
					v-if="currentSession.status === 'running'"
					class="control-btn pause-big-btn"
					@click="pauseTimer(currentSession.id)"
				>
					<wd-icon name="pause" size="32" color="#fff"></wd-icon>
					<text>暂停</text>
				</view>

				<!-- Completed (pomodoro): Next Phase -->
				<view
					v-if="currentSession.status === 'completed' && currentSession.mode === 'pomodoro'"
					class="control-btn next-btn"
					@click="nextPomodoroPhase(currentSession.id)"
				>
					<wd-icon name="refresh" size="28" color="#fff"></wd-icon>
					<text>{{ currentSession.isBreak ? '开始专注' : '开始休息' }}</text>
				</view>

				<!-- Any non-idle state: Stop / Reset -->
				<view
					v-if="currentSession.status !== 'idle'"
					class="control-btn stop-big-btn"
					@click="stopTimer(currentSession.id)"
				>
					<wd-icon name="stop" size="28" color="#fff"></wd-icon>
					<text>{{ currentSession.status === 'completed' ? '重置' : '结束' }}</text>
				</view>
			</view>
		</template>

		<!-- ====== CREATE DIALOG ====== -->
		<view class="dialog-mask" v-if="showCreateDialog" @click="closeCreateDialog">
			<view class="dialog" @click.stop>
				<view class="dialog-header">
					<text class="dialog-title">{{ createForm.fromHabit ? '新建计时器' : '新建计时器' }}</text>
					<view class="dialog-close" @click="closeCreateDialog">
						<wd-icon name="close" size="24" color="#666"></wd-icon>
					</view>
				</view>

				<view class="dialog-content">
					<!-- Task Name -->
					<view class="form-item">
						<text class="form-label">任务名称</text>
						<input
							class="form-input"
							v-model="createForm.taskName"
							placeholder="输入任务名称"
							maxlength="20"
						/>
					</view>

					<!-- Timer Mode -->
					<view class="form-item">
						<text class="form-label">计时模式</text>
						<view class="mode-selector">
							<view
								v-for="mode in modeOptions"
								:key="mode.value"
								class="mode-option"
								:class="{ active: createForm.mode === mode.value }"
								@click="selectMode(mode.value)"
							>
								<wd-icon :name="mode.icon" size="22" :color="createForm.mode === mode.value ? '#7ec699' : '#999'"></wd-icon>
								<text>{{ mode.label }}</text>
							</view>
						</view>
					</view>

					<!-- Duration (for countdown & pomodoro) -->
					<view v-if="createForm.mode !== 'stopwatch'" class="form-item">
						<text class="form-label">时长</text>
						<view class="duration-picker">
							<view
								v-for="opt in durationOptions"
								:key="opt.value"
								class="duration-option"
								:class="{ active: createForm.totalSeconds === opt.value }"
								@click="createForm.totalSeconds = opt.value"
							>
								<text>{{ opt.label }}</text>
							</view>
						</view>
						<view class="custom-duration" v-if="!durationOptions.find(o => o.value === createForm.totalSeconds)">
							<text class="custom-duration-hint">自定义时长</text>
						</view>
					</view>

					<!-- Custom Duration Input -->
					<view v-if="createForm.mode !== 'stopwatch'" class="form-item">
						<text class="form-label">自定义分钟</text>
						<view class="custom-duration-input">
							<input
								class="form-input small-input"
								v-model.number="customMinutes"
								type="number"
								placeholder="分钟"
							/>
							<text class="unit">分钟</text>
						</view>
					</view>

					<!-- Link Habit -->
					<view class="form-item">
						<text class="form-label">关联习惯（可选）</text>
						<view v-if="habitsStore.categories.length > 0" class="habit-selector">
							<scroll-view scroll-y class="habit-scroll">
								<view
									v-for="(cat, catIdx) in habitsStore.categories"
									:key="catIdx"
								>
									<text class="habit-category-label">{{ cat.name }}</text>
									<view
										v-for="(habit, habitIdx) in cat.habits"
										:key="habitIdx"
										class="habit-option"
										:class="{ active: createForm.linkedHabit?.name === habit.name }"
										@click="selectHabit(habit)"
									>
										<view class="habit-option-icon" :style="{ backgroundColor: habit.color }">
											<wd-icon :name="habit.icon" size="20" color="#fff"></wd-icon>
										</view>
										<text>{{ habit.name }}</text>
										<wd-icon v-if="createForm.linkedHabit?.name === habit.name" name="check" size="18" color="#7ec699"></wd-icon>
									</view>
								</view>
							</scroll-view>
						</view>
						<view v-else class="no-habits-hint">
							<text>暂无习惯，先去添加吧</text>
						</view>
					</view>
				</view>

				<view class="dialog-footer">
					<view class="btn btn-cancel" @click="closeCreateDialog">取消</view>
					<view class="btn btn-confirm" @click="confirmCreate">确认创建</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useHabitsStore } from '@/store/modules/habits'
import { useTimerStore, type TimerSession, type TimerMode, type LinkedHabit } from '@/store/modules/timer'
import WdIcon from 'wot-design-uni/components/wd-icon/wd-icon.vue'

// ─── Stores ───
const timerStore = useTimerStore()
const habitsStore = useHabitsStore()

// ─── View State ───
const currentView = ref<'list' | 'detail'>('list')
const selectedSessionId = ref<string | null>(null)

// ─── Display refresh ───
const tick = ref(0)
let tickInterval: ReturnType<typeof setInterval> | null = null

// ─── Computed ───

const currentSession = computed<TimerSession | null>(() => {
	if (!selectedSessionId.value) return null
	return timerStore.sessions.find(s => s.id === selectedSessionId.value) || null
})

const displayTime = computed(() => {
	if (!currentSession.value) return '00:00'
	return timerStore.getDisplayTime(currentSession.value)
})

const displayProgress = computed(() => {
	if (!currentSession.value) return 0
	return timerStore.getProgress(currentSession.value)
})

const progressStyle = computed(() => {
	const p = displayProgress.value
	const circumference = 2 * Math.PI * 88
	const offset = circumference * (1 - p)
	return {
		strokeDasharray: `${circumference}`,
		strokeDashoffset: `${offset}`,
	}
})

const statusLabel = computed(() => {
	if (!currentSession.value) return ''
	switch (currentSession.value.status) {
		case 'idle': return '准备就绪'
		case 'running': return currentSession.value.isBreak ? '休息中' : '专注中'
		case 'paused': return '已暂停'
		case 'completed': return '已完成'
		default: return ''
	}
})

// ─── List view computed ───

const runningTimers = computed(() =>
	timerStore.sessions.filter(s => s.status === 'running')
)

const pausedTimers = computed(() =>
	timerStore.sessions.filter(s => s.status === 'paused')
)

const completedTimers = computed(() =>
	timerStore.sessions.filter(s => s.status === 'completed')
)

// ─── Mode options ───

const modeOptions = [
	{ label: '倒计时', value: 'countdown' as TimerMode, icon: 'hourglass' },
	{ label: '正计时', value: 'stopwatch' as TimerMode, icon: 'clock' },
	{ label: '番茄钟', value: 'pomodoro' as TimerMode, icon: 'time' },
]

const durationOptions = [
	{ label: '5分', value: 5 * 60 },
	{ label: '10分', value: 10 * 60 },
	{ label: '15分', value: 15 * 60 },
	{ label: '25分', value: 25 * 60 },
	{ label: '30分', value: 30 * 60 },
	{ label: '45分', value: 45 * 60 },
	{ label: '60分', value: 60 * 60 },
	{ label: '90分', value: 90 * 60 },
]

function getModeLabel(mode: TimerMode): string {
	const opt = modeOptions.find(o => o.value === mode)
	return opt?.label || mode
}

// ─── Create Dialog State ───

const showCreateDialog = ref(false)
const customMinutes = ref(5)

// Watch customMinutes to update totalSeconds
watch(customMinutes, (val) => {
	if (val > 0) {
		createForm.value.totalSeconds = val * 60
	}
})

interface CreateForm {
	taskName: string
	mode: TimerMode
	totalSeconds: number
	linkedHabit: LinkedHabit | null
	fromHabit: boolean
}

const createForm = ref<CreateForm>({
	taskName: '',
	mode: 'pomodoro',
	totalSeconds: 25 * 60,
	linkedHabit: null,
	fromHabit: false,
})

function resetCreateForm() {
	createForm.value = {
		taskName: '',
		mode: 'pomodoro',
		totalSeconds: 25 * 60,
		linkedHabit: null,
		fromHabit: false,
	}
	customMinutes.value = 5
}

function openCreateDialog(fromHabitTaskName?: string) {
	resetCreateForm()
	if (fromHabitTaskName) {
		createForm.value.taskName = fromHabitTaskName
		createForm.value.fromHabit = true
	}
	showCreateDialog.value = true
}

function closeCreateDialog() {
	showCreateDialog.value = false
	resetCreateForm()
}

function selectMode(mode: TimerMode) {
	createForm.value.mode = mode
	// Set default duration based on mode
	if (mode === 'pomodoro') {
		createForm.value.totalSeconds = 25 * 60
	} else if (mode === 'countdown') {
		createForm.value.totalSeconds = 25 * 60
	}
}

function selectHabit(habit: any) {
	if (createForm.value.linkedHabit?.name === habit.name) {
		createForm.value.linkedHabit = null
	} else {
		createForm.value.linkedHabit = {
			name: habit.name,
			icon: habit.icon,
			color: habit.color,
		}
		createForm.value.taskName = habit.name
	}
}

// Removed: custom minutes input handled by watch(customMinutes)

function confirmCreate() {
	if (!createForm.value.taskName.trim()) {
		uni.showToast({ title: '请输入任务名称', icon: 'none', duration: 1500 })
		return
	}

	const result = timerStore.createSession({
		taskName: createForm.value.taskName.trim(),
		mode: createForm.value.mode,
		totalSeconds: createForm.value.totalSeconds,
		linkedHabit: createForm.value.linkedHabit,
	})

	if (result) {
		uni.showToast({ title: '计时器已创建', icon: 'success', duration: 1000 })
		closeCreateDialog()

		// Automatically start the timer
		timerStore.startTimer(result.id)
		openDetail(result.id)
	}
}

// ─── Timer Actions ───

function openDetail(id: string) {
	selectedSessionId.value = id
	currentView.value = 'detail'
}

function resumeTimer(id: string) {
	timerStore.startTimer(id)
}

function pauseTimer(id: string) {
	timerStore.pauseTimer(id)
}

function stopTimer(id: string) {
	const session = timerStore.sessions.find(s => s.id === id)
	if (!session) return

	if (session.status === 'running' || session.status === 'paused') {
		uni.showModal({
			title: '结束计时',
			content: `确定结束「${session.taskName}」吗？`,
			success: (res) => {
				if (res.confirm) {
					timerStore.completeTimer(id)
					uni.showToast({ title: '计时已结束', icon: 'success', duration: 1000 })
				}
			}
		})
	} else if (session.status === 'completed') {
		timerStore.resetTimer(id)
	} else if (session.status === 'idle') {
		timerStore.deleteSession(id)
		currentView.value = 'list'
	}
}

function deleteTimer(id: string) {
	const session = timerStore.sessions.find(s => s.id === id)
	if (!session) return

	uni.showModal({
		title: '删除计时器',
		content: `确定删除「${session.taskName}」吗？`,
		success: (res) => {
			if (res.confirm) {
				timerStore.deleteSession(id)
				if (currentView.value === 'detail' && selectedSessionId.value === id) {
					currentView.value = 'list'
					selectedSessionId.value = null
				}
				uni.showToast({ title: '已删除', icon: 'success', duration: 1000 })
			}
		}
	})
}

function nextPomodoroPhase(id: string) {
	timerStore.completePomodoroPhase(id)
	// The session is now 'idle' with the next phase prepped
	// Auto-start the next phase
	timerStore.startTimer(id)
}

function reopenTimer(id: string) {
	timerStore.resetTimer(id)
	timerStore.startTimer(id)
	// Navigate to detail view to show the running timer
	if (currentView.value === 'list') {
		openDetail(id)
	}
}

function clearCompleted() {
	uni.showModal({
		title: '清除全部',
		content: '确定清除所有已完成的计时器吗？',
		success: (res) => {
			if (res.confirm) {
				const completed = timerStore.completedSessions
				completed.forEach(s => timerStore.deleteSession(s.id))
				uni.showToast({ title: '已清除', icon: 'success', duration: 1000 })
			}
		}
	})
}

function handleTimerClick() {
	if (!currentSession.value) return
	const s = currentSession.value
	if (s.status === 'idle' || s.status === 'paused') {
		resumeTimer(s.id)
	} else if (s.status === 'running') {
		pauseTimer(s.id)
	}
}

// ─── Check for Timer Completion ───

function checkAndNotifyCompletions() {
	const completed = timerStore.checkForCompletions()
	for (const session of completed) {
		timerStore.completeTimer(session.id)

		if (session.mode === 'pomodoro') {
			// Show different message based on what just finished
			if (session.isBreak) {
				showCompletionNotification(session, '休息结束！准备开始下一轮专注 ✨')
			} else {
				showCompletionNotification(session, `番茄完成！🍅 已完成 ${session.completedPomodoros + 1} 个`)
			}
		} else {
			showCompletionNotification(session, '时间到！⏰')
		}
	}
}

function showCompletionNotification(session: TimerSession, message: string) {
	// Play notification sound
	playNotificationSound()

	// Show dialog
	uni.showModal({
		title: '⏰ ' + message,
		content: `「${session.taskName}」已完成！`,
		confirmText: '知道了',
		showCancel: false,
		success: (res) => {
			if (session.mode === 'pomodoro' && session.status === 'completed') {
				// User acknowledged the pomodoro transition
				// The phase has already been transitioned in checkAndNotifyCompletions
			}
		}
	})
}

// ─── Notification Sound ───

// Shared AudioContext (created on first use, reused)
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
	if (audioCtx) return audioCtx
	try {
		const AudioCtor = (window as any).AudioContext || (window as any).webkitAudioContext
		if (!AudioCtor) return null
		audioCtx = new AudioCtor()
		return audioCtx
	} catch (e) {
		return null
	}
}

function playNotificationSound() {
	// Try uni-app vibration
	try {
		uni.vibrateLong({
			success: () => {},
			fail: () => {}
		})
	} catch (e) {
		// Ignore
	}

	// Play beeps using shared AudioContext
	const ctx = getAudioContext()
	if (!ctx) return

	try {
		const playBeep = (freq: number, startTime: number, duration: number) => {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			osc.connect(gain)
			gain.connect(ctx.destination)
			osc.frequency.value = freq
			osc.type = 'sine'
			gain.gain.setValueAtTime(0.4, startTime)
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
			osc.start(startTime)
			osc.stop(startTime + duration)
		}

		// Play 3 beeps (melodic: do-re-mi)
		playBeep(523, ctx.currentTime, 0.25)      // C5
		playBeep(659, ctx.currentTime + 0.3, 0.25) // E5
		playBeep(784, ctx.currentTime + 0.6, 0.5)  // G5 (longer)
	} catch (e) {
		// Audio not supported
	}
}

// ─── Format helpers ───

function formatCompletedTime(timestamp: number | null): string {
	if (!timestamp) return ''
	const date = new Date(timestamp)
	const h = date.getHours().toString().padStart(2, '0')
	const m = date.getMinutes().toString().padStart(2, '0')
	return `${h}:${m} 完成`
}

function getDisplayTime(session: TimerSession): string {
	return timerStore.getDisplayTime(session)
}

function getProgress(session: TimerSession): number {
	return timerStore.getProgress(session)
}

// ─── Check for habit link from today page ───

function checkForIncomingHabit() {
	if (habitsStore.selectedHabit) {
		const habit = habitsStore.selectedHabit
		openCreateDialog(habit.name)
		createForm.value.linkedHabit = {
			name: habit.name,
			icon: habit.icon,
			color: habit.color,
		}
		// Clear the selected habit
		habitsStore.selectedHabit = null
	}
}

// ─── Lifecycle ───

// On show (tab switch or mount)
onShow(() => {
	// Load data
	timerStore.loadFromStorage()
	habitsStore.loadHabits()

	// Check for incoming habit from today page (when switching tabs)
	checkForIncomingHabit()
})

onMounted(() => {
	// Initial load
	timerStore.loadFromStorage()
	habitsStore.loadHabits()

	// Check for incoming habit from today page
	checkForIncomingHabit()

	// Start tick interval for display updates
	tickInterval = setInterval(() => {
		tick.value++
		// Check for completion every second
		checkAndNotifyCompletions()
	}, 1000)
})

onUnmounted(() => {
	if (tickInterval) {
		clearInterval(tickInterval)
		tickInterval = null
	}
})

// ─── Swipe-to-Reveal ───

const maxSwipe = 260 // rpx - width for 3 action buttons
const swipeThreshold = maxSwipe * 0.4

const swipeOffsets = reactive<Record<string, number>>({})
const touchStarts = new Map<string, number>()
const swipeOpen = reactive<Record<string, boolean>>({})

function getSwipeOffset(id: string): number {
	return swipeOffsets[id] || 0
}

function isSwipeOpen(id: string): boolean {
	return !!swipeOpen[id]
}

function closeSwipe(id: string) {
	swipeOffsets[id] = 0
	swipeOpen[id] = false
}

function closeAllSwipes() {
	for (const id in swipeOffsets) {
		swipeOffsets[id] = 0
		swipeOpen[id] = false
	}
}

function onSwipeStart(e: TouchEvent, id: string) {
	closeAllSwipes()
	touchStarts.set(id, e.touches[0].clientX)
}

function onSwipeMove(e: TouchEvent, id: string) {
	const startX = touchStarts.get(id)
	if (startX === undefined) return

	const delta = startX - e.touches[0].clientX
	if (delta < 0) {
		swipeOffsets[id] = Math.max(0, (swipeOffsets[id] || 0) + delta)
	} else {
		swipeOffsets[id] = Math.min(maxSwipe, delta)
	}
}

function onSwipeEnd(e: TouchEvent, id: string) {
	const offset = swipeOffsets[id] || 0
	if (offset > swipeThreshold) {
		closeAllSwipes()
		swipeOffsets[id] = maxSwipe
		swipeOpen[id] = true
	} else {
		closeSwipe(id)
	}
	touchStarts.delete(id)
}

function handleCardClick(id: string) {
	if (isSwipeOpen(id)) {
		closeSwipe(id)
	} else {
		openDetail(id)
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	min-height: 100vh;
	background: linear-gradient(180deg, #f5f9f7 0%, #fff 100%);
}

// ─── Header ───

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	margin-bottom: 20rpx;
	background: #fff;
	border-radius: 20rpx;
	border: 3rpx solid #7ec699;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #7ec699;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.timer-count {
	font-size: 24rpx;
	color: #999;
}

.add-btn {
	padding: 10rpx;
}

// ─── Sections ───

.section {
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #666;
	margin-bottom: 16rpx;
	padding-left: 10rpx;
	display: block;
}

.clear-btn {
	font-size: 24rpx;
	color: #ff6b8a;
	padding: 8rpx 16rpx;
}

// ─── Swipe Wrapper ───

.swipe-wrap {
	overflow: hidden;
	position: relative;
	border-radius: 20rpx;
	margin-bottom: 16rpx;
	touch-action: pan-y;
}

.swipe-inner {
	display: flex;
	align-items: stretch;
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	will-change: transform;
}

.swipe-actions {
	display: flex;
	align-items: stretch;
	flex-shrink: 0;
	width: 260rpx;
}

.swipe-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
	color: #fff;
	font-size: 20rpx;
	transition: all 0.2s;

	&:active {
		opacity: 0.8;
	}

	&.swipe-btn-play {
		background: #7ec699;
	}

	&.swipe-btn-pause {
		background: #ffb6c1;
	}

	&.swipe-btn-stop {
		background: #c4b5fd;
	}

	&.swipe-btn-delete {
		background: #ff6b8a;
	}

	&:first-child {
		border-radius: 20rpx 0 0 20rpx;
	}

	&:last-child {
		border-radius: 0 20rpx 20rpx 0;
	}

	&:only-child {
		border-radius: 20rpx;
	}
}

// ─── Timer Cards ───

.timer-card {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: #fff;
	border-radius: 20rpx;
	border: 3rpx solid #e0e0e0;
	box-shadow: 4rpx 4rpx 0 #e0e0e0;
	transition: all 0.2s;
	position: relative;
	width: 100%;
	min-width: 100%;
	flex-shrink: 0;

	&:active {
		transform: scale(0.98);
	}

	&.running {
		border-color: #7ec699;
		box-shadow: 4rpx 4rpx 0 #7ec699;
	}

	&.paused {
		border-color: #c4b5fd;
		box-shadow: 4rpx 4rpx 0 #c4b5fd;
	}

	&.completed {
		border-color: #ddd;
		box-shadow: none;
		opacity: 0.8;
	}
}

.card-left {
	display: flex;
	align-items: center;
	flex: 1;
	gap: 16rpx;
	min-width: 0;
}

.card-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.card-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	min-width: 0;
}

.card-task-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-mode-tag {
	font-size: 20rpx;
	color: #999;
}

.card-completed-time {
	font-size: 20rpx;
	color: #999;
}

.card-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-right: 10rpx;
	gap: 8rpx;
}

.card-time {
	font-size: 36rpx;
	font-weight: bold;
	font-variant-numeric: tabular-nums;

	&.running-text {
		color: #7ec699;
	}

	&.paused-text {
		color: #c4b5fd;
	}

	&.completed-text {
		color: #7ec699;
	}
}

.card-progress {
	width: 100rpx;
	height: 8rpx;
	background: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #7ec699, #a8d8c9);
	border-radius: 4rpx;
	transition: width 0.3s ease;
}

// ─── Detail View ───

.detail-header {
	display: flex;
	align-items: center;
	padding: 20rpx 10rpx;
	margin-bottom: 20rpx;
}

.back-btn {
	padding: 10rpx;
	margin-right: 16rpx;
}

.detail-title-area {
	flex: 1;
}

.detail-task-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.detail-actions {
	display: flex;
	gap: 16rpx;
}

.detail-action-btn {
	padding: 10rpx;
}

// ─── Linked Habit ───

.linked-habit-info {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	margin-bottom: 30rpx;
}

.linked-habit-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.linked-habit-name {
	font-size: 28rpx;
	color: #666;
}

// ─── Timer Display ───

.timer-display {
	display: flex;
	justify-content: center;
	margin-bottom: 40rpx;
}

.circle {
	width: 420rpx;
	height: 420rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;

	&:active {
		transform: scale(0.97);
	}

	&.is-running {
		.time { color: #7ec699; }
	}

	&.is-paused {
		.time { color: #c4b5fd; }
	}

	&.is-completed {
		.time { color: #7ec699; }
	}
}

.progress-ring {
	position: absolute;
	width: 100%;
	height: 100%;
	transform: rotate(-90deg);
}

.progress-bg {
	fill: none;
	stroke: #f0f0f0;
	stroke-width: 6;
}

.progress-fill {
	fill: none;
	stroke: #7ec699;
	stroke-width: 6;
	stroke-linecap: round;
	transition: stroke-dashoffset 0.3s ease;
}

.time-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.time {
	font-size: 80rpx;
	font-weight: bold;
	color: #333;
	font-variant-numeric: tabular-nums;
}

.time-status {
	font-size: 24rpx;
	color: #999;
}

// ─── Mode Info ───

.detail-mode-info {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	margin-bottom: 50rpx;
	flex-wrap: wrap;
}

.mode-label {
	font-size: 26rpx;
	color: #666;
	background: #f5f5f5;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

.duration-label {
	font-size: 26rpx;
	color: #999;
}

.pomodoro-count {
	font-size: 24rpx;
	color: #7ec699;
	background: #f0faf3;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

// ─── Controls ───

.detail-controls {
	display: flex;
	justify-content: center;
	gap: 30rpx;
}

.control-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 24rpx 48rpx;
	border-radius: 40rpx;
	border: 3rpx solid #333;
	transition: all 0.2s;

	&:active {
		transform: scale(0.95);
	}

	text {
		font-size: 26rpx;
		font-weight: bold;
	}
}

.start-btn {
	background: #7ec699;
	text { color: #fff; }
	border-color: #7ec699;
}

.pause-big-btn {
	background: #ffb6c1;
	text { color: #fff; }
	border-color: #ffb6c1;
}

.next-btn {
	background: #c4b5fd;
	text { color: #fff; }
	border-color: #c4b5fd;
}

.stop-big-btn {
	background: #fff;
	text { color: #ff6b8a; }
	border-color: #ff6b8a;
}

// ─── Empty State ───

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
	gap: 20rpx;
}

.empty-text {
	font-size: 30rpx;
	color: #999;
	font-weight: bold;
}

.empty-desc {
	font-size: 26rpx;
	color: #bbb;
}

// ─── Dialog ───

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

// ─── Form ───

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

.small-input {
	width: 200rpx;
}

// ─── Mode Selector ───

.mode-selector {
	display: flex;
	gap: 16rpx;
}

.mode-option {
	flex: 1;
	padding: 20rpx;
	border: 3rpx solid #ddd;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #666;
	transition: all 0.2s;

	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
		color: #7ec699;
	}
}

// ─── Duration Picker ───

.duration-picker {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.duration-option {
	padding: 12rpx 24rpx;
	border: 3rpx solid #ddd;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #666;
	transition: all 0.2s;

	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
		color: #7ec699;
		font-weight: bold;
	}
}

.custom-duration {
	text-align: center;
	padding: 8rpx;
}

.custom-duration-hint {
	font-size: 22rpx;
	color: #999;
}

.custom-duration-input {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.unit {
	font-size: 26rpx;
	color: #666;
}

// ─── Habit Selector ───

.habit-selector {
	max-height: 300rpx;
}

.habit-scroll {
	max-height: 300rpx;
}

.habit-category-label {
	font-size: 22rpx;
	color: #999;
	padding: 8rpx 0;
	display: block;
}

.habit-option {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 16rpx;
	border: 2rpx solid #eee;
	border-radius: 12rpx;
	margin-bottom: 8rpx;
	font-size: 26rpx;
	color: #333;
	transition: all 0.2s;

	&.active {
		border-color: #7ec699;
		background: #f5f9f7;
	}
}

.habit-option-icon {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.no-habits-hint {
	padding: 20rpx;
	text-align: center;
	color: #999;
	font-size: 24rpx;
}
</style>
