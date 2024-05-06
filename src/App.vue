<script setup>
import {ref} from "vue";
import {getAllFindResult, sendFile, sendReq} from "./assets/fun-axios.js";
import Modal from "./components/Modal.vue";
import {encode} from "./assets/encode.js";
import {jsToExcel} from "./assets/jsToExcel.js";


//修改端口号
const port = 14569
//修改几个教室的ip地址第三位
//1栋 3栋 5栋 6栋 7栋 8栋 9栋 10栋
//                 56 58             87
const ip3 = [56,58,87]
//修改超时时间
const timeout = 0
//修改服务器的功能
const funList = [
  "登录 /login password",
  "首页 /",
  "弹出信息框 /showInfo str",
  "网络信息 /network",
  "硬件信息 /deviceInfo",
  "远程关机 /shutdown time",
  "取消关机 /shutdown-cancel",
  "重启电脑 /restartPC",
  "截屏 /currentScreen",
  "调用摄像头 /transferRecord",
  "上传文件至下载目录 /transferToDownload",
  "上传文件至项目根目录 /transferToRoot",
  "运行cmd命令 /cmd command",
  "查看某路径的文件内容 /cat path",
  "更新程序 /updateMmm",
  "查看版本号 /version",
]
const classList = ref([])
const classListCheck = ref([])
let checkBool = false
const pathAndky = ref({
  path: "",
  keyAndValue: ""
})
const resList = ref([])
const imageContainerModalIsShow = ref(false)
const imageContainerModalData = ref("")
const tipsModalIsShow = ref(false)
const tipsModalIsData = ref("")
const isAddFile=ref(false)
const fileInfo=ref([])
function uploadFile(e){
  const target = e.target;
  fileInfo.value.push(target.files[0])
}
function deleteFilePre(key){
  fileInfo.value.splice(key,1)
}
async function send() {
  const ips = []
  const classNames = []
  let isAnyChosen = false
  for (let i = 0; i < classListCheck.value.length; ++i) {
    if (classListCheck.value[i] === true) {
      isAnyChosen = true
      break
    }
  }
  if (isAnyChosen === false) {
    tipsModalIsData.value = "你没有选择教室"
    tipsModalIsShow.value = true
    return
  }
  if (pathAndky.value.path === "") {
    tipsModalIsData.value = "你没有选择路径"
    tipsModalIsShow.value = true
    return
  }
  if (pathAndky.value.keyAndValue !== "" && !pathAndky.value.keyAndValue.includes(":")) {
    tipsModalIsData.value = "参数设置有问题"
    tipsModalIsShow.value = true
    return
  }
  for (let i = 0; i < classListCheck.value.length; ++i) {
    if (classListCheck.value[i]) {
      ips.push(classList.value[i].split(" ")[1])
      classNames.push(classList.value[i].split(" ")[0])
    }
  }
  if(pathAndky.value.path==='/login'){
    const psd=pathAndky.value.keyAndValue
    const psdEn=psd.split(":")[1]
    const psdEncode=encode(psdEn)
    pathAndky.value.keyAndValue=psd.split(":")[0]+":"+psdEncode
  }
  if (pathAndky.value.path==='/transferToDownload'||pathAndky.value.path==='/updateMmm'||pathAndky.value.path==='/transferToRoot'){
    if (fileInfo.value.length===0){
      tipsModalIsData.value = "请添加文件"
      tipsModalIsShow.value = true
      return
    }
    let data = await sendFile(ips, port, pathAndky.value.path,fileInfo.value, classNames)
    resList.value = []
    for (let i = 0; i < data.length; ++i) {
      resList.value.push({data: data[i].data, className: data[i].className})
    }
  }
  else{
    let data = await sendReq(ips, port, pathAndky.value.path, pathAndky.value.keyAndValue, classNames)
    resList.value = []
    for (let i = 0; i < data.length; ++i) {
      if ((pathAndky.value.path === '/currentScreen' ||pathAndky.value.path === '/transferRecord')&& data[i].data.length >= 10) {
        resList.value.push({className: data[i].className, src: "data:image/png;base64," + data[i].data})
      } else
        resList.value.push({data: data[i].data, className: data[i].className})
    }
  }
}
function choosePath(str) {
  isAddFile.value=false
  fileInfo.value=[]
  pathAndky.value.path = funListSplit(str, 1)
  let key = funListSplit(str, 2)
  if (key !== "")
    pathAndky.value.keyAndValue = key + ":"
  else
    pathAndky.value.keyAndValue = ""
  if (pathAndky.value.path==="/transferToDownload"||pathAndky.value.path==="/updateMmm"||pathAndky.value.path==="/transferToRoot")
    isAddFile.value=true
}

function funListSplit(str, num) {
  const split = str.split(" ");
  if (num >= split.length)
    return ""
  else return split[num]
}

async function findAll() {
  for (const value of ip3) {
    let data = await getAllFindResult(value, port, timeout)
    data = data.sort(sortFun)
    data = [...new Set(data)]
    classList.value.push(...data)
    console.log(ip3+"网段已经发现完毕")
  }
  for (let i = 0; i < classList.value.length; ++i)
    classListCheck.value.push(false)
}

function search() {
  tipsModalIsShow.value = true
  tipsModalIsData.value = "功能未开发完成"
}

function reverseCheckBool() {
  if (checkBool)
    for (let i = 0; i < classListCheck.value.length; ++i)
      classListCheck.value[i] = false
  else
    for (let i = 0; i < classListCheck.value.length; ++i)
      classListCheck.value[i] = true
  checkBool = !checkBool
}

function sortFun(a, b) {
    a=a.split(" ")[0]
    b=b.split(" ")[0]
    // 解析字符串并提取数字部分
    const [aNum1,bNum1] = a.split('-');
  
    const [aNum2,bNum2] = b.split('-');
  
    // 比较第一个数字
    if (aNum1 < aNum2) return -1;
    if (aNum1 > aNum2) return 1;
  
    // 如果第一个数字相同，则比较第二个数字
    if (bNum1 < bNum2) return -1;
    if (bNum1 > bNum2) return 1;
  
    // 如果两个数字都相同，则按原始顺序排序
    return 0;
  }

  function toExcel(){
    if (classList.value.length===0||resList.value.length===0){
      tipsModalIsShow.value = true
      tipsModalIsData.value = "请选择班级,发送命令"
      return
    }
    jsToExcel(classList.value,resList.value)
  }

</script>

<template>

  <div id="class-container">
    <div class="fun-list">
      <button @click="findAll">发现</button>
      <button @click="reverseCheckBool">全选</button>
    </div>
    <div class="class-list">
      <div v-for="(item,key) in classList" :id="key+'class'">
        <div>{{ item.split(" ")[0] }}</div>
        <div>{{ item.split(" ")[1] }}</div>
        <input type="checkbox" class="check-box" @click="classListCheck[key]=!classListCheck[key]"
          v-model="classListCheck[key]">
      </div>
    </div>
  </div>

  <div id="command-container">
    <div class="fun-list">
      <div class="InputContainer">
        <input placeholder="Search.." id="input" class="input" name="text" type="text">
      </div>
      <button @click="search">搜索</button>
    </div>
    <div class="command-list">
      <button v-for="(item,key) in funList" :id="key+'command'" @click="choosePath(item)">
        <label class="command-name">{{ funListSplit(item, 0) }}&nbsp;&nbsp;&nbsp;</label>
        <label class="command-path">{{ funListSplit(item, 1) }}&nbsp;&nbsp;&nbsp;</label>
        <label class="command-args">{{ funListSplit(item, 2) }}</label>
      </button>
    </div>
    <div id="detail">
      <div class="InputContainer">
        <input placeholder="输入路径" id="input" class="input" name="text" type="text" v-model="pathAndky.path">
      </div>
      <div class="detail-list">
        <div class="InputContainer">
          <input placeholder="key1:value1" class="input" name="text" type="text" v-model="pathAndky.keyAndValue">
        </div>
      </div>
      <div v-if="isAddFile" style="padding-top: 5px;padding-left: 40px">
        <label class="addFileLabel" for="addFileBtn" style="margin-left: 5px">添加文件</label>
        <input id="addFileBtn" type="file"  class="addFileBtn" @change="uploadFile($event)">
        <div style="margin-top: 5px;overflow-y: auto;height: 100px">
          <span v-for="(item,key) in fileInfo" style="margin-right:10px;border: silver solid 1px;border-radius: 10px;padding: 1px 5px 1px 5px">
            <label>{{item.name}}</label>
            <label @click="deleteFilePre(key)">&nbsp;&nbsp;×</label>
          </span>
        </div>
      </div>
<!--      填充元素-->
      <div class="undo"></div>
      <div class="detail-button">
        <button @click="send">发送</button>
      </div>
    </div>
  </div>

  <div id="res-container">
    <div class="fun-list">
      <button @click="toExcel">导出为Excel</button>
      <a id="download"></a>
    </div>
    <div class="res-list">
      <div v-for="item in resList">
        <label>{{ item?.className }}</label>
        <label>{{ item?.data }}</label>
        <img :src="item?.src" alt="" @click="imageContainerModalData=item?.src;imageContainerModalIsShow=true"/>
      </div>
    </div>
  </div>
  <modal v-show="tipsModalIsShow" @click="tipsModalIsShow=false">
    <label
        style="width: 30%;height: 25%;background-color: white;border-radius: 8px;  font-size: 18px;font-weight: 600;padding: 10px">{{
        tipsModalIsData
      }}!!!</label>
  </modal>
  <Modal v-show="imageContainerModalIsShow" @click="imageContainerModalIsShow=false">
    <img :src="imageContainerModalData" alt="" style="width: 95%;height: 95%">
  </Modal>
</template>
