// 1.请求调用用户的网络摄像头;
// 2.在页面上展示来自webcam的数据流信息;
// 3.并允许用户保存展示的照片;
// 4.及使用滑块来改变图像的色彩
// 思路
// 1.调用navigator.getUserMedia()方法，若调用成功则返回数据流，若调用失败则在控制台打印相关信息;
// 2.成功调用网络摄像头后，将返回的数据对象绑定至video标签的srcObject属性(注意此处getUserMedia()方法成功调用时触发的回调函数中会传递一个stream对象,该对象直接赋值给video.src是没有作用的)，并当流数据开始传递时，视频自动播放;
// 3.点击takePhoto()函数时调用canvas绘图上下文中的drawImage()方法将视频中当前帧的图像绘制在canvas上，该方法第一个参数可以为图像或视频，其余参数与绘图区域尺寸相关(该方法有多种调用模式);
// 4.滤色：在全局中保存滤色范围的上下限，每次滑块数据发生改变后，使用canvas绘图上下文中的getImageData()获得画布上指定区域内各像素点的颜色数据，数据被保存在返回对象的data属性中，通过遍历修改像素色彩数组中的数据改变图像的表现，修改后调用putImageData()方法将像素点重新绘制在canvas上。
// 5.点击savePhoto()函数时调用canvas的toDataUrl()方法即可获得canvas中的图像数据，默认格式为png，也可修改为其他格式，生成的图像数据指定给img.src时即可预览图片;
// 6.在img标签外添加a标签，并为其添加download属性，当点击链接时，即可将生成的图片保存至本地。

const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
askWebCam();
// 1.申请调用 WebCam
function askWebCam() {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
        audio: false,
        video: {
          width: 300,
          height: 200,
        },
      },
      (stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
      },
      (err) => console.log(err)
    );
  } else console.log("this navigator doesn't support webcam!");
}
// 2.截图 takePhoto(), 将原始数据保留一份
function takePhoto() {
  ctx.drawImage(video, 0, 0, 300, 200);
  origindata = ctx.getImageData(0, 0, 300, 200);
}
// 3.色彩过滤
