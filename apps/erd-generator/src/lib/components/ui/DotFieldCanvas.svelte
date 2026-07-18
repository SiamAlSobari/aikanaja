<script lang="ts">
	import { onMount } from 'svelte';

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	onMount(() => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;
		let width = 0;
		let height = 0;

		function resize() {
			if (!canvasEl) return;
			width = canvasEl.width = canvasEl.offsetWidth;
			height = canvasEl.height = canvasEl.offsetHeight;
		}

		resize();
		window.addEventListener('resize', resize);

		let localMouse = { x: -1000, y: -1000 };

		function handleMouseMove(e: MouseEvent) {
			if (!canvasEl) return;
			const rect = canvasEl.getBoundingClientRect();
			localMouse.x = e.clientX - rect.left;
			localMouse.y = e.clientY - rect.top;
		}

		function handleMouseLeave() {
			localMouse.x = -1000;
			localMouse.y = -1000;
		}

		window.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);

		const spacing = 32;
		const dotSize = 1.5;
		const mouseRadius = 140;

		function draw() {
			if (!ctx || !canvasEl) return;
			ctx.clearRect(0, 0, width, height);

			const cols = Math.ceil(width / spacing) + 1;
			const rows = Math.ceil(height / spacing) + 1;

			for (let c = 0; c < cols; c++) {
				for (let r = 0; r < rows; r++) {
					const x = c * spacing;
					const y = r * spacing;

					const dx = localMouse.x - x;
					const dy = localMouse.y - y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					let targetX = x;
					let targetY = y;
					let scale = 1.0;
					let alpha = 0.4;
					let currentColor = '249, 115, 22';

					if (dist < mouseRadius) {
						const factor = 1 - dist / mouseRadius;
						const ease = factor * factor;

						const force = ease * 14;
						targetX = x - (dx / (dist || 1)) * force;
						targetY = y - (dy / (dist || 1)) * force;

						scale = 1.0 + ease * 1.5;
						alpha = 0.4 + ease * 0.5;

						const red = Math.round(249 + (255 - 249) * ease);
						const green = Math.round(115 + (62 - 115) * ease);
						const blue = Math.round(22 + (0 - 22) * ease);
						currentColor = `${red}, ${green}, ${blue}`;
					}

					ctx.beginPath();
					ctx.arc(targetX, targetY, dotSize * scale, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(${currentColor}, ${alpha})`;
					ctx.fill();
				}
			}

			animationFrameId = requestAnimationFrame(draw);
		}

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	});
</script>

<canvas
	bind:this={canvasEl}
	class="absolute inset-0 w-full h-full pointer-events-none block z-0"
></canvas>
