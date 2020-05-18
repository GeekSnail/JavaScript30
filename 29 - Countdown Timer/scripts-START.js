const leftTime = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("button.timer__button");
/**
 * 倒计时 leftTime显示剩余时间，endTime显示结束时间
 * buttons点击增加计时，更新剩余时间
 */
let timer; //定时器

function clickAction(e) {
  updateTimer(parseInt(this.dataset.time));
}

function updateTimer(seconds) {
  clearInterval(timer);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  endTime.textContent = new Date(then).toLocaleString();

  timer = setInterval(() => {
    const left = Math.round((then - Date.now()) / 1000);
    if (left < 0) {
      clearInterval(timer);
      return;
    } else {
      displayTimeLeft(left);
    }
  }, 1000);
}

function displayTimeLeft(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  leftTime.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

updateTimer(0);
// buttons绑定点击事件
buttons.forEach((btn) => btn.addEventListener("click", clickAction));
//监听表单提交事件
document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  updateTimer(this.minutes.value * 60); //更新倒计时
  this.reset(); //重置表单
});
