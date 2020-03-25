const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

//点击切换视频播放状态
function togglePlay() {
  video.paused ? video.play() : video.pause();
}
video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);

//图标切换 用视频本身的播放状态来判断
function updateButton() {
  toggle.textContent = this.paused ? "►" : "❚ ❚";
}
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

//快进/快退 修改currentTime属性
function skip() {
  video.currentTime += parseFloat(this.dataset.skip); // dataset属性 字符串
}
skipButtons.forEach(btn => btn.addEventListener("click", skip));

//音量volume / 播放速度playbackRate
function handleRangeUpdate() {
  video[this.name] = this.value;
}
// ranges.forEach(r => r.addEventListener("change", handleRangeUpdate)); //change事件只在 blur，也就是元素失去焦点的时候才会触发
// ranges.forEach(r => r.addEventListener("mousemove", handleRangeUpdate));
ranges.forEach(r => r.addEventListener("input", handleRangeUpdate));

//进度条操作 根据当前播放时间调节进度条 currentTime / duration
//progress__filled 元素是一个 flex 定位的元素，改变其 flex-basis 的百分比值可以调节它所占父元素的宽度
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}
video.addEventListener("timeupdate", handleProgress);

// 点击进度条设置播放时间 currentTime
function scrub(e) {
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
}
progress.addEventListener("click", scrub);

//进度条拖动设置播放时间
let mousedown = false;
progress.addEventListener("mousedown", e => (mousedown = true));
progress.addEventListener("mousemove", e => mousedown && scrub(e));
progress.addEventListener("mouseup", e => (mousedown = false));
