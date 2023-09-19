<script>
	export let left = 40;
	export let top = 0;
	
	let moving = false;
	
	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}
	
	function onMouseUp() {
		moving = false;
	}
// 	$: console.log(moving);
</script>

<style>
	.draggable {
		user-select: none;
		cursor: move;
		border: solid 1px gray;
		position: absolute;
	}
</style>

<section on:mousedown={onMouseDown} style="left: {left === 40 ? '10%' : `${left}px`}; top: {top === 0 ? '10%' : `${top}px`};" class="draggable">
	<slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />