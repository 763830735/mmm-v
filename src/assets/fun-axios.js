import axios from 'axios'
function getAllFind(ip3,port,timeout){
    let urls = [];
    //urls.push("http://192.168."+"31.147"+":"+port+"/find")
     for (let x=1;x<255;++x) {
         urls.push("http://192.168."+ip3+"."+x+":"+port+"/find")
     }
    let requests = urls.map(url => axios.get(url,{
        timeout: timeout, // 默认值是 `0` (永不超时)
        }).then(response => {
        return { status: '200', data: ""+response.data.split(" ")[0]+" "+url.split("//")[1].split(":")[0]};
    }).catch(error => {
        if (error.code === 'ECONNABORTED') {
            // 超时错误
            return { status: 'timeout', data: 'Request timed out' };
        } else {
            // 其他错误
            return { status: 'error', data: error.message };
        }
    }));

    return Promise.all(requests)
}

async function getAllFindResult(ip3,port,timeout){
    const res= await getAllFind(ip3,port,timeout)
    return res.filter(item=>item.status==='200').map(item => item.data)
}

/**
 *
 */
function sendReq(ips,port,path,param,classNames){
    let urls = [];
    const key=param.split(":")[0]
    const value=param.split(":")[1]
    for (let i=0;i<ips.length;++i){
        urls.push("http://"+ips[i]+":"+port+path)
    }
    let requests = urls.map((url,index) => axios.post(url,{
        [key]:value
    }).then(response => {
        return { status: '200', data: response.data ,className:classNames[index]};
    }).catch(error => {
        if (error.code === 'ECONNABORTED') {
            // 超时错误
            return { status: 'timeout', data: 'Request timed out' ,className:classNames[index]};
        } else {
            // 其他错误
            return { status: 'error', data: error.message ,className:classNames[index]};
        }
    }));
    return Promise.all(requests)
}

async function sendFile(ips,port,path,files,classNames){
    let urls = [];
    for (let i=0;i<ips.length;++i){
        urls.push("http://"+ips[i]+":"+port+path)
    }

    let formData = new FormData()

    //上传多个文件
    files.forEach(file=>{
        formData.append("files",file,file.name)
    })

    let requests = urls.map((url,index) => axios.post(url,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        return { status: '200', data: response.data ,className:classNames[index]};
    }).catch(error => {
        if (error.code === 'ECONNABORTED') {
            // 超时错误
            return { status: 'timeout', data: 'Request timed out' ,className:classNames[index]};
        } else {
            // 其他错误
            return { status: 'error', data: error.message ,className:classNames[index]};
        }
    }));
    return Promise.all(requests)
}


export {
    getAllFindResult,
    sendReq,
    sendFile
}