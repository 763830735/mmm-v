import {sha256} from "js-sha256";

function encode(password){
    // 创建 SHA-1 哈希对象
    return sha256(password)
}

export {
    encode
}