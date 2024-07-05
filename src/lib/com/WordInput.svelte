<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let message: string = '';

	// 传递之前检查消息格式是否为纯英文,是否为5个字符,若不是则不传递并且提示
	function sendMessage() {
		if (!/^[a-zA-Z]{5}$/.test(message)) {
			alert('请输入5个英文字母');
			return;
		}
		dispatch('message', message);
	}

	function handleKeydown(event: { key: string }) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}
</script>

<div class="uput">
	<!-- input绑定要发送的消息 -->
	<div>
		<input bind:value={message} placeholder="请输入单词" on:keydown={handleKeydown} />
	</div>
	<button class="btn uput-btn" on:click={sendMessage} on:keydown={handleKeydown}>提交</button>
</div>

<style>
	.uput {
		display: flex;
		align-items: center;
	}
	/* 圆角,选中后粉色阴影 */
	.uput input {
		width: 100%;
		padding: 0.5em;
		font-size: 1.5em;
		border-radius: 0.5em;
		border: 1px solid #ccc;
		color: #333;
	}
	/* 调整字体颜色黑色 */
	.uput input::placeholder {
		color: #d19b9b;
	}

	.uput input:focus {
		box-shadow: 0 0 0 2px #f99;
	}
	.uput-btn {
		margin-left: 1em;
		padding: 0.5em 1em;
		font-size: 1.5em;
		border-radius: 0.5em;
		background-color: #f99;
		color: white;
		border: none;
		cursor: pointer;
	}
</style>
