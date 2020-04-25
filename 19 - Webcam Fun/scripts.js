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
const snap = document.querySelector(".snap"); //audio
const img = document.querySelector("#myimg");
const slider = document.querySelector(".rgb");

const filter = {
  rmin: 0,
  rmax: 255,
  gmin: 0,
  gmax: 255,
  bmin: 0,
  bmax: 255
};

getVideo();
video.addEventListener("canplay", paintToCanvas);
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(mediaStream => {
      console.log(mediaStream);
      window.mediaStream = mediaStream;
      video.srcObject = mediaStream;
      video.onloadedmetadata = e => video.play();
    })
    .catch(console.error);
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = rgbSplit(pixels);

    const pos = { 0: "r", 1: "g", 2: "b" };
    console.log(filter, filter[0]);
    for (let i = 0; i < 3; i++) {
      for (let j = i; j < pixels.data.length; j += 4) {
        if (pixels.data[j] < filter[pos[i] + "min"]) {
          pixels.data[j] = filter[pos[i] + "min"];
        }
        if (pixels.data[j] > filter[pos[i] + "max"]) {
          pixels.data[j] = filter[pos[i] + "max"];
        }
      }
    }
    // put them back
    ctx.putImageData(pixels, 0, 0);
  });
}

// function rgbSplit(pixels) {
//   for (let i = 0; i < pixels.data.length; i += 4) {
//     pixels.data[i - 150] = pixels.data[i + 0]; // RED
//     pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
//     pixels.data[i - 550] = pixels.data[i + 2];
//   }
//   return pixels;
// }

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  // snap.play();

  originData = ctx.getImageData(0, 0, 300, 200);
  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" />`;
  strip.insertBefore(link, strip.firstChild);
}

// openWebCam();
// 1.申请调用 WebCam
function openWebCam() {
  navigator.getUserMedia(
    {
      audio: false,
      video: {
        width: 300,
        height: 200
      }
    },
    stream => {
      window.stream = stream;
      video.srcObject = stream;
      video.onloadedmetadata = e => video.play();
    },
    err => console.log(err)
  );
}
// 2.截图 takePhoto(), 将原始数据保留一份
// function takePhoto() {
//   ctx.drawImage(video, 0, 0, 300, 200);
//   originData = ctx.getImageData(0, 0, 300, 200);
// }
// 3.色彩过滤
slider.onchange = e => {
  //先将canvas恢复至原始截图
  // ctx.putImageData(originData, 0, 0);
  const target = e.target;
  console.log(target.name);
  //startPos表示操作像素点数据时的起点，从canvas获取到的像素数据每四个值表示一个像素点
  //例如滑块为红色，则只需要改变像素数组中第0,4,8......个元素的值。
  // const startPos = { r: 0, g: 1, b: 2 }[target.name[0]];
  //filterMin和filterMax表示相应的滤色范围上下限，若修改了红色滤色范围则取红色范围值。
  //若修改蓝色的滤色范围，则取蓝色。
  // let { min: filterMin, max: filterMax } = checkFilter(
  //   target.name,
  //   target.value
  // );
  filter[target.name] = Number(target.value);
  // let imgData = ctx.getImageData(0, 0, 300, 200);
  // 色彩过滤
  // for (let i = startPos, len = imgData.data.length; i < len; i += 4) {
  //   if (imgData.data[i] < filterMin) imgData.data[i] = filterMin;
  //   else if (imgData.data[i] > filterMax) imgData.data[i] = filterMax;
  // }
  // const pos = { 0: "r", 1: "g", 2: "b" };
  // for (let i = 0; i < 3; i++) {
  //   for (let j = i; j < imgData.data.length; j += 4) {
  //     if (imgData[j] < filter[pos[i] + "min"]) {
  //       imgData.data[i] = filter[pos[i] + "min"];
  //     }
  //     if (imgData[j] > filter[pos[i] + "max"]) {
  //       imgData.data[i] = filter[pos[i] + "max"];
  //     }
  //   }
  // }
  // ctx.putImageData(imgData, 0, 0);
};
/**
 * input[type=range] 上下值
 * @param {*} name: rmin|rmax | gmin|gmax | bmin|bmax
 * @param {*} value
 */
function checkFilter(name, value) {
  let _antiname = {
    rmin: "rmax",
    rmax: "rmin",
    gmin: "gmax",
    gmax: "gmin",
    bmin: "bmax",
    bmax: "bmin"
  }[name];
  filter[name] = value;
  //当下限值超过上限时，将两者对调
  return {
    min: Math.min(filter[name], filter[_antiname]),
    max: Math.max(filter[name], filter[_antiname])
  };
}
