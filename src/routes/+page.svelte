<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { gsap } from 'gsap';
	import { base } from '$app/paths';
	import {
		Modal,
		initializeStores,
		getModalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	initializeStores();

	const modalStore = getModalStore(); // 读取静态文本文件并随机target
	let CET4: string[] = [];
	let CET6: string[] = [];
	let KAOYAN: string[] = [];
	let ALL: string[] = [];
	let target = '';
	let selectV = '1';
	let BigSmall = '1';
	onMount(async () => {
		gsap.to('.container', { opacity: 1, duration: 0.5 });
		try {
			const response = await fetch(`${base}/words/CET4.txt`);
			const text = await response.text();

			// 将文件内容按行拆分并存储到数组中
			CET4 = text
				.split('\n')
				.map((word) => word.trim())
				.filter((word) => word.length > 0);
		} catch (error) {
			console.error('Failed to fetch words:', error);
		}
		try {
			const response = await fetch(`${base}/words/CET6.txt`);
			const text = await response.text();

			// 将文件内容按行拆分并存储到数组中
			CET6 = text
				.split('\n')
				.map((word) => word.trim())
				.filter((word) => word.length > 0);
		} catch (error) {
			console.error('Failed to fetch words:', error);
		}
		try {
			const response = await fetch(`${base}/words/KaoYan.txt`);
			const text = await response.text();

			// 将文件内容按行拆分并存储到数组中
			KAOYAN = text
				.split('\n')
				.map((word) => word.trim())
				.filter((word) => word.length > 0);
		} catch (error) {
			console.error('Failed to fetch words:', error);
		}
		try {
			const response = await fetch(`${base}/words/words_alpha.txt`);
			const text = await response.text();

			// 将文件内容按行拆分并存储到数组中
			ALL = text
				.split('\n')
				.map((word) => word.trim())
				.filter((word) => word.length > 0);
		} catch (error) {
			console.error('Failed to fetch words:', error);
		}
	});
	let currentRow: number = 0; // 当前激活的行索引
	let showButton = true;
	let win = false;
	let lose = false;
	let animate = false;
	// 在不同次数下完成的不同结束语
	let byebye = [
		'哇,一次就成功了,天选之子就是你喵',
		'看来今日有气运加身',
		'运气还不错哦',
		'推,推出来了,强大',
		'再试试,说不定下次更好哦',
		'做出来了也很不错了呢',
		'加油,下次一定可以的'
	];
	function change() {
		animate = true;
		showButton = false;
		lose = false;
		win = false;
		let select = parseInt(selectV);
		if (select === 1) {
			target = CET4[Math.floor(Math.random() * CET4.length)];
		} else if (select === 2) {
			target = CET6[Math.floor(Math.random() * CET6.length)];
		} else if (select === 3) {
			target = KAOYAN[Math.floor(Math.random() * KAOYAN.length)];
		} else {
			target = ALL[Math.floor(Math.random() * ALL.length)];
		}

		if (BigSmall === '1') target = target.toLowerCase();
		else target = target.toUpperCase();
		// target = ALL[Math.floor(Math.random() * ALL.length)];
	}
	// 校验函数，返回每个输入框的校验结果
	function validateLetter(rowIndex: number, colIndex: number): string {
		const letter = letters[rowIndex][colIndex];
		const targetLetter = target[colIndex];
		// console.log(letter, targetLetter);

		if (letter === targetLetter) {
			return 'green'; // 正确字母
		} else if (target.includes(letter)) {
			return 'orange'; // 字母存在但位置不对
		} else {
			return 'red'; // 错误字母
		}
	}

	// gsap
	function applyGsapAnimation(rowIndex: number, colIndex: number): void {
		const input = document.getElementById(`input-${rowIndex}-${colIndex}`);
		const color = validateLetter(rowIndex, colIndex);

		gsap.to(input, {
			backgroundColor: color,
			duration: 0.5
		});

		if (letters[rowIndex].every((_, index) => validateLetter(rowIndex, index) === 'green')) {
			win = true;
		} else if (currentRow === 5) {
			win = false;
			lose = true;
		}
	}
	// game函数,重置所有状态
	function game() {
		win = false;
		lose = false;
		letters = Array.from({ length: 6 }, () => ['', '', '', '', '']);
		currentRow = 0;
		showButton = true;
		animate = true;
	}

	afterUpdate(() => {
		if (animate) {
			if (showButton) {
				gsap.fromTo('.start', { opacity: 0 }, { opacity: 1, duration: 0.5 });
			} else {
				gsap.fromTo('.text', { opacity: 0 }, { opacity: 1, duration: 0.5 });
			}
		}
		animate = false;
	});

	// 定义一个二维数组，每组五个输入框，共六组
	let letters: string[][] = Array.from({ length: 6 }, () => ['', '', '', '', '']);

	// 处理输入事件
	function handleInput(event: Event, rowIndex: number, colIndex: number): void {
		const input = event.target as HTMLInputElement;

		if (BigSmall === '1') {
			const value = input.value.toLowerCase();
			// 只允许输入字母
			if (/^[a-z]$/.test(value)) {
				letters[rowIndex][colIndex] = value;
				// 自动跳到下一个输入框
				if (colIndex < 4) {
					const nextInput = document.getElementById(
						`input-${rowIndex}-${colIndex + 1}`
					) as HTMLInputElement;
					nextInput.focus();
				}

				// 检查是否当前行已全部填满
				if (letters[rowIndex].every((letter) => letter !== '')) {
					letters[rowIndex].forEach((_, colIndex) => {
						applyGsapAnimation(rowIndex, colIndex);
					});
					currentRow = rowIndex + 1; // 激活下一行
				}
			} else {
				letters[rowIndex][colIndex] = '';
			}
		} else {
			const value = input.value.toUpperCase();
			// 只允许输入字母
			if (/^[A-Z]$/.test(value)) {
				letters[rowIndex][colIndex] = value;
				// 自动跳到下一个输入框
				if (colIndex < 4) {
					const nextInput = document.getElementById(
						`input-${rowIndex}-${colIndex + 1}`
					) as HTMLInputElement;
					nextInput.focus();
				}

				// 检查是否当前行已全部填满
				if (letters[rowIndex].every((letter) => letter !== '')) {
					letters[rowIndex].forEach((_, colIndex) => {
						applyGsapAnimation(rowIndex, colIndex);
					});
					currentRow = rowIndex + 1; // 激活下一行
				}
			} else {
				letters[rowIndex][colIndex] = '';
			}
		}
	}

	// 投降函数
	function surrender() {
		win = false;
		lose = true;
		// 禁用所有输入框
		currentRow = 6;
	}

	// 处理按键事件
	function handleKeydown(event: KeyboardEvent, rowIndex: number, colIndex: number): void {
		// 处理退格键
		if (event.key === 'Backspace' && letters[rowIndex][colIndex] === '' && colIndex > 0) {
			const prevInput = document.getElementById(
				`input-${rowIndex}-${colIndex - 1}`
			) as HTMLInputElement;
			prevInput.focus();
		}
	}
	// rule函数
	function rule() {
		// console.log('rule');
		const modal: ModalSettings = {
			type: 'alert',
			title: 'Rule',
			body: '绿色表示对的字母对的位置,橙色表示对的字母错的位置,红色表示错误的字母,你有六次机会进行尝试猜出这个五个字母的单词,加油吧',
			buttonTextCancel: '已经完全理解了'
		};
		modalStore.trigger(modal);
	}
</script>

<Modal />
<div class="container">
	{#if showButton}
		<!-- 复选框用来控制词范围 -->
		<div class="start">
			<label class="label">
				<!-- <span>词典选择</span> -->
				<div class="rules">
					<button class="btn-xl btn-game btn btn-rules" on:click={rule}>RULE</button>
				</div>
				<select class="select" bind:value={BigSmall}>
					<option value="1">小写显示</option>
					<option value="2">大写显示</option>
				</select>
				<select class="select" bind:value={selectV}>
					<option value="1">四级</option>
					<option value="2">六级</option>
					<option value="3">研</option>
					<option value="4">ALL (会有一些奇奇怪怪的词汇)</option>
				</select>
			</label>
			<button class="btn-game btn btn-xl variant-filled-primary" on:click={change}>
				Wordle Game
			</button>
		</div>
	{/if}
	{#if !showButton}
		<ul class="text">
			{#if win}
				<li class="win-li">
					<div>{byebye[currentRow - 1]}</div>
					<button class="btn btn-g" on:click={game}> 再试一次吧 </button>
				</li>
			{/if}
			{#if lose}
				<li class="win-li">
					<div>很抱歉哦,这次失败了呢,答案是{target}</div>
					<!-- <div>{byebye[6]}</div> -->
					<button class="btn btn-g" on:click={game}> 再试一次吧 </button>
				</li>
			{/if}
			{#each letters as row, rowIndex}
				<li>
					<div class="input-box">
						{#each row as letter, colIndex}
							<input
								id={`input-${rowIndex}-${colIndex}`}
								type="text"
								maxlength="1"
								bind:value={letters[rowIndex][colIndex]}
								on:input={(event) => handleInput(event, rowIndex, colIndex)}
								on:keydown={(event) => handleKeydown(event, rowIndex, colIndex)}
								disabled={rowIndex !== currentRow}
							/>
						{/each}
					</div>
				</li>
			{/each}
			<button class="btn-surrender btn" on:click={surrender}> 投降喵,认输喵 </button>
		</ul>
	{/if}
</div>
<footer>
	<p>
		Wordle Game By <a href="https://sevmeowple.github.io" style="color:pink">SevMeowple </a>
		<button type="button" class="btn-github btn-icon variant-filled btn-icon-sm"
			><svg
				class="icon-github"
				viewBox="0 0 512 512"
				xml:space="preserve"
				xmlns="http://www.w3.org/2000/svg"
				enable-background="new 0 0 512 512"
				><path
					d="M256 32C132.3 32 32 134.8 32 261.7c0 101.5 64.2 187.5 153.2 217.9 11.2 2.1 15.3-5 15.3-11.1 0-5.5-.2-19.9-.3-39.1-62.3 13.9-75.5-30.8-75.5-30.8-10.2-26.5-24.9-33.6-24.9-33.6-20.3-14.3 1.5-14 1.5-14 22.5 1.6 34.3 23.7 34.3 23.7 20 35.1 52.4 25 65.2 19.1 2-14.8 7.8-25 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8 0 0 18.8-6.2 61.6 23.5 17.9-5.1 37-7.6 56.1-7.7 19 .1 38.2 2.6 56.1 7.7 42.8-29.7 61.5-23.5 61.5-23.5 12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 6.1 4 13.3 15.4 11C415.9 449.1 480 363.1 480 261.7 480 134.8 379.7 32 256 32z"
					fill-rule="evenodd"
					clip-rule="evenodd"
					fill="#ffa1a1"
					class="fill-000000"
				></path></svg
			></button
		>
	</p>
</footer>

<style>
	/* footer */
	footer {
		display: flex;
		justify-content: center; /* 水平居中 */
		align-items: center;
		height: 50px; /* 设置 footer 的高度 */
	}
	.icon-github {
		width: 100%;
		height: 100%;
	}
	/* footer-p,p中的字居中+垂直居中 */
	footer p {
		display: flex;
		align-items: center;
		text-align: center;
	}
	/* footer-btn,btn两端增加些许间隔 */
	footer button {
		margin: 0 10px;
	}
	/* start 页面中心,大小 */
	.start {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* size: 100px; */
		/* background-color: #ffa1a1; */
	}
	.label {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.select {
		margin: 10px;
	}
	.btn-surrender {
		width: 100%;
		margin-top: 20px;
		background-color: #ffa1a1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btn-game {
		margin-top: 20px;
		background-color: #ffa1a1;
	}
	.btn-g {
		background-color: #ffa1a1;
	}
	.text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* size: 100px; */
		/* background-color: #ffa1a1; */
	}
	.input-box {
		display: flex;
		gap: 10px;
		justify-content: center; /* 中心对齐 */
		margin-top: 20px;
	}
	.win-li {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 15px;
	}

	input {
		width: 50px; /* 调整宽度 */
		height: 50px; /* 调整高度 */
		font-size: 24px; /* 调整字体大小 */
		text-align: center; /* 文字居中 */
		border: 2px solid #ccc; /* 添加边框 */
		border-radius: 8px; /* 圆角 */
		color: rgb(5, 4, 6);
		transition:
			border-color 0.3s,
			box-shadow 0.3s; /* 添加过渡效果 */
	}

	input:focus {
		border-color: #ffa1a1; /* 聚焦时的边框颜色 */
		box-shadow: 0 0 8px rgba(255, 158, 218, 0.6); /* 聚焦时的阴影 */
		outline: none; /* 去掉默认的聚焦样式 */
	}

	/* rule */
	.rules {
		margin-bottom: 20px;
	}

	.btn-rules {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		background-color: #ffa1a1;
		border: none;
		padding: 10px;
		cursor: pointer;
	}
</style>
