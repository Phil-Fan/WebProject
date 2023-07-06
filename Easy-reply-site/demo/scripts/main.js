import {marked} from "./mark.esm.js";
// import {daysInYear} from "date-fns";
//实现markdown格式
// import  "./different.js";

// console.log(daysInYear('2002'));
console.log('you have access your website');

//账户登录功能//没有实现登录，只是随机
const Username = ['Aaron', 'Alaia', 'Alexander', 'Candella', 'Grace', 'Kylie', 'Ruben'];

//清除localstorage
let clear = document.getElementById('rmCache');
if (clear != null) {//防止在index.html页面上报错
    clear.addEventListener('click', function () {
        localStorage.clear()/**/
    })
}

//实现点击点赞、点击收藏图标变换功能
let likeimg = document.querySelectorAll('img');//事件监听器
for (let i = 0; i < likeimg.length; i++) {
    likeimg[i].addEventListener('click', function () {
        let imgsrc = likeimg[i].getAttribute('src')
        if (imgsrc === 'images/like.png') {//利用图片替换模拟点赞效果
            likeimg[i].setAttribute('src', 'images/liked.png');
        } else if (imgsrc === 'images/liked.png') {
            likeimg[i].setAttribute('src', 'images/like.png');
        }
        if (imgsrc === 'images/star.png') {
            likeimg[i].setAttribute('src', 'images/stared.png');
        } else if (imgsrc === 'images/stared.png') {
            likeimg[i].setAttribute('src', 'images/star.png');
        }
    })
}

let ReplyData = [];//用于存储信息并与localstorage合并
//从localstorage中逐个读取
function generateReply() {//获取回复
    let replyData = JSON.parse(localStorage.getItem('localReplyData'));
    console.log(replyData)//中间输出
    if (replyData != null) {//如果非空的话，就把本地的帖子一条条地传给输出函数
        for (let i = 0; i < replyData.length; i++) {
            console.log('获取到第' + (i + 1) + '条数据');
            console.log(replyData[i].replyId, replyData[i].replyTime, replyData[i].replyTitle, replyData[i].replyText);
            replyAdd(replyData[i].replyId, replyData[i].replyTime, replyData[i].replyTitle, replyData[i].replyText);
            ReplyData.push(replyData[i]);
        }
    }
}

generateReply();//函数要记得调用才可以生效


//将生成好的回帖存到localstorage中
function replyStore(replyId, replyTime, replyTitle, replyText) {//把信息存储到全局数组当中
    // console.log(typeof ReplyData);
    let reply_data = {
        'replyId': replyId,
        'replyTime': replyTime,
        'replyTitle': replyTitle,
        'replyText': replyText
    }
    console.log(reply_data);
    ReplyData.push(reply_data);
}

function localUpdate() {//把数组中的信息update到本地
    localStorage.setItem('localReplyData', JSON.stringify(ReplyData));
    console.log('已经将回复存储到localstorage');
    console.log('共' + JSON.parse(localStorage.getItem('localReplyData')).length + '条')
    console.log(ReplyData)
}

//评论的发布、修改和删除
const send = document.getElementById('send');//seng按钮的事件监听
send.addEventListener('click', function () {
    getData()
});

function getData() {
    let replyId = Username[Math.floor(Math.random() * Username.length)];
    let replyTitle = marked(document.getElementById('replytitle').value);
    let replyText = marked(document.getElementById('replytext').value);//markdown的实现 利用开源的marked库
    // const replyTitle = document.getElementById('replytitle').value;
    // const replyText = document.getElementById('replytext').value;
    document.getElementById('replytitle').value = ''
    document.getElementById('replytext').value = '' //发帖后自动删除文本
    // console.log(marked(replyTitle) + marked(replyText))
    // if ( == 1) {//关键词的检测函数
    replyText = check(replyText);
    replyStore(replyId, getTime(), replyTitle, replyText);
    localUpdate();
    replyAdd(replyId, getTime(), replyTitle, replyText);
}

function replyAdd(replyId, replyTime, replyTitle, replyText) {//添加回帖的函数，记录四个参数，并新建div，完成页面的更新
    const replyList = document.querySelector('.reply-list');
    const reply = document.createElement('div');
    reply.setAttribute('class', 'reply-topic');
    // console.log('replyId = '+reply.getAttribute('replyId'))
    //reply HTML的插入
    reply.innerHTML = '<div class="topic-info">\n' +
        '                            <div class="user-info">\n' +
        '                                <div class="user-head">\n' +
        '                                    <img src="images/head/head-' + replyId + '.jfif" alt="用户' + replyId + '头像">\n' +
        '                                </div>\n' +
        '                                <div class="user-time">\n' +
        '                                    <div class="user-time-text">\n' +
        '                                        <p class="name">' + replyId + '</p>\n' +
        '                                    </div>\n' +
        '\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="user-post">\n' +
        '                                <div class="user-post-title">\n' +
        '                                    <div class="user-post-title-text" id="title-content">\n' +
        '                                        <p>' +
        replyTitle +
        '</p>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                                <div class="user-post-text" id="text-content">\n' +
        '                                    <p>' +
        replyText +
        '</p>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                        </div>'

    //删除符号 实现评论的删除
    const closeButton = document.createElement('button');
    closeButton.textContent = 'delete';
    closeButton.setAttribute('id', 'close')
    closeButton.setAttribute('replyId', replyId);//此处比较巧，利用closeButton这个按钮的属性作为中间量，把用于判定帖子相同的属性附带加上了，这样就可以避免属性存在，但是获取不到replyId的情况出现
    closeButton.setAttribute('replyTime', replyTime);
    reply.appendChild(closeButton);
    closeButton.onclick = function () {
        replyRm(closeButton.getAttribute('replyId'), closeButton.getAttribute('replyTime'))
        localUpdate();
        // console.log(closeButton.getAttribute('replyId') + closeButton.getAttribute('replyTime') )
        reply.parentNode.removeChild(reply);//删除自己只能通过父节点来实现，自己不可以删除自己
    }

    //修改符号 实现评论修改功能
    const modifyButton = document.createElement('button');
    modifyButton.textContent = 'Modify';
    modifyButton.setAttribute('id', 'modify')
    modifyButton.setAttribute('replyId', replyId);
    modifyButton.setAttribute('replyTime', replyTime);//一样的思路，利用button属性传递参数
    reply.appendChild(modifyButton);
    modifyButton.onclick = function () {
        console.log(replyId, replyTime)
        replyRm(modifyButton.getAttribute('replyId'), modifyButton.getAttribute('replyTime'));
        reply.parentNode.removeChild(reply);
        const mdf_replyTitle = marked(document.getElementById('replytitle').value);//实现markdown
        const mdf_replyText = marked(document.getElementById('replytext').value);
        // let mdf_replyTitle = document.getElementById('replytitle').value;
        // let mdf_replyText = document.getElementById('replytext').value;
        document.getElementById('replytitle').value = '';
        document.getElementById('replytext').value = ''; //发帖后自动删除文本
        //实现修改的逻辑：先删除再发新帖
        replyAdd(replyId, getTime(), mdf_replyTitle, mdf_replyText);
        replyStore(replyId, getTime(), mdf_replyTitle, mdf_replyText);
        localUpdate();
    }

    //获取当前时间，并显示
    let time_view = document.createElement('div');
    time_view.setAttribute('id', 'timeview');
    time_view.textContent = replyTime;
    reply.appendChild(time_view);

    replyList.appendChild(reply);//都调整完以后，把帖子加到页面里面
}

//删除回答
function replyRm(replyID, replyTIME) {//利用userID和发帖事件双重验证，可以大概率保证唯一性，但也有少部分情况，
    //个人拓展思路：给帖子一个cid一样的东西唯一确定，方便查询；或者做一个登录系统，利用用户的历史贴来确定。
    console.log('id = ' + replyID + replyTIME);
    console.log('删除' + replyID + replyTIME + ',now remain' + ReplyData.length);
    for (let i = 0; i < ReplyData.length; i++) {
        // console.log(replyID,replyTIME);
        if (replyID === ReplyData[i].replyId && replyTIME === ReplyData[i].replyTime) {
            console.log(ReplyData);
            ReplyData.splice(i, 1);//此处不应该用delete来删除，delete不会删除掉元素，而是把元素变成空，会导致后续很麻烦，经过查阅手册发现了splice这个库
            console.log(ReplyData);
            break;
        }
    }
}

//时间获取与时间差计算 date-fns
function getTime() {
    //date-fns因为import问题没有解决所以库没有引进来，其实框架已经搭好了，就差一个库了
    let myDate = new Date()
    return myDate.toLocaleDateString() + 'at' + myDate.toLocaleTimeString();//用自带库实现的时间显示
    //时间差 date-fns
    // console.log(differenceInDays(new Date("2021-10-20"), new Date("2021-10-1")));
}

//评论区关键词查询
function check(text) {
    //正则表达式
    let keyword = 'FUCK';//可以自定义关键词
    //给定关键词
    keyword = keyword.split('').join('[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\/]*');//注意匹配特殊符号要加上转义字符，原来没加的时候根本匹配不到！！！气死我了
    let checkFormulation = new RegExp(keyword,'gi');//不区分大小写的全局匹配
    console.log(text.replace(checkFormulation,'*****'))//输出到控制台
    return text.replace(checkFormulation,'*****');
}