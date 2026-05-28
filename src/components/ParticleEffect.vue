<template>
	<view class="particle-container" v-if="show">
		<view 
			v-for="(particle, index) in particles" 
			:key="index"
			class="particle"
			:style="particle.style"
		></view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	color: { type: String, default: '#7ec699' }
});

const emit = defineEmits(['complete']);

const show = ref(true);
const particles = ref([]);

onMounted(() => {
	const particleCount = 20;
	const colors = [
		props.color,
		'#ffb6c1',
		'#c4b5fd',
		'#a8d8d8',
		'#f9e5b5',
		'#ffd6a5'
	];
	
	for (let i = 0; i < particleCount; i++) {
		const angle = (Math.PI * 2 * i) / particleCount;
		const velocity = 50 + Math.random() * 80;
		const tx = Math.cos(angle) * velocity;
		const ty = Math.sin(angle) * velocity;
		const size = 4 + Math.random() * 8;
		const rotation = Math.random() * 360;
		
		particles.value.push({
			style: {
				left: props.x + 'px',
				top: props.y + 'px',
				width: size + 'px',
				height: size + 'px',
				backgroundColor: colors[Math.floor(Math.random() * colors.length)],
				borderRadius: Math.random() > 0.5 ? '50%' : '2px',
				'--tx': tx + 'px',
				'--ty': ty + 'px',
				'--rotation': rotation + 'deg',
				animation: `particleExplode 0.6s ease-out forwards`
			}
		});
	}
	
	setTimeout(() => {
		show.value = false;
		emit('complete');
	}, 700);
});
</script>

<style lang="scss" scoped>
.particle-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 9999;
}

.particle {
	position: absolute;
	opacity: 0;
	transform: translate(0, 0) rotate(0deg);
	animation: particleExplode 0.6s ease-out forwards;
}

@keyframes particleExplode {
	0% {
		opacity: 1;
		transform: translate(0, 0) scale(1) rotate(0deg);
	}
	50% {
		opacity: 0.8;
	}
	100% {
		opacity: 0;
		transform: translate(var(--tx), var(--ty)) scale(0.3) rotate(var(--rotation));
	}
}
</style>
