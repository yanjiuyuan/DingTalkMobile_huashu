// let dormainName = "http://wuliao5222.55555.io:57513/"; //线下测试
let dormainName = "http://47.96.172.122:8092/"; //线上

function doWithErrcode(result) {
    if (!result) {
        return 1;
    }
    if (result.error && result.error.errorCode != 0) {
        dd.alert({ content: result.error.errorMessage });
        return 1;
    }
    return 0;
}
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth() + 1;
var day = d.getDate();
var hour = d.getHours();
var minutes = d.getMinutes();
export default {
    data: {
        jinDomarn2: "http://wuliao5222.55555.io:35705/api/", //研究院
        //jinDomarn:'http://1858o1s713.51mypc.cn:46389/api/',//华数
        jinDomarn: "http://wuliao5222.55555.io:45578/api/", //华数
        dormainName: dormainName,
        currentPage: 1,
        totalRows: 0,
        pageSize: 5,
        Year: year,
        Month: month,
        Day: day,
        DateStr: _dateToString(d),
        TimeStr: hour + ":" + minutes
    },
    func: {
        checkLogin() {},

        goHome() {
            console.log("welCome ~");
        },
        goError() {},
        //http 请求
        _getData(url, succe, userInfo = {}) {
            dd.httpRequest({
                url: dormainName + url,
                method: "GET",
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
                success: function(res) {
                    var app = getApp();
                    //检查登录
                    if (app.userInfo) {
                        userInfo = app.userInfo;
                    }
                    console.log(url);
                    console.log(res);
                    if (doWithErrcode(res.data)) {
                        postErrorMsg("GET", url, res.data.error, userInfo);
                        return;
                    }
                    succe(res.data.data);
                },
                fail: function(res) {
                    if (JSON.stringify(res) == "{}") return;
                    postErrorMsg("GET", url, res, userInfo);
                    dd.alert({ content: "获取数据失败-" + url + "报错:" + JSON.stringify(res) });
                }
            });
        },
        _postData(url, succe, param, userInfo = {}) {
            dd.httpRequest({
                url: dormainName + url,
                method: "POST",
                data: JSON.stringify(param),
                headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
                success: function(res) {
                    var app = getApp();
                    //检查登录
                    if (app.userInfo) {
                        userInfo = app.userInfo;
                    }
                    console.log(url);
                    console.log(param);
                    console.log(res);
                    if (doWithErrcode(res.data)) {
                        postErrorMsg("GET", url, res.data.error, userInfo);
                        return;
                    }
                    succe(res.data.data);
                },
                fail: function(res) {
                    console.log("在错误里面~~~~~~~~~~~");
                    if (JSON.stringify(res) == "{}") return;
                    postErrorMsg("GET", url, res, userInfo);
                    dd.alert({ content: "获取数据失败-" + url + "报错:" + JSON.stringify(res) });
                }
            });
        },
        requestData(type, url, succe, param = {}, userInfo) {
            //dd.showLoading()
            console.warn(url);
            dd.httpRequest({
                url: dormainName + url,
                method: type,
                data: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
                success: function(res) {
                    console.log(url);
                    if (type == "POST" || type == "post") console.log(param);
                    console.log(res);
                    succe(res);
                },
                fail: function(res) {
                    if (JSON.stringify(res) == "{}") return;
                    dd.alert({ content: "获取数据失败-" + url + "报错:" + JSON.stringify(res) });
                },
                complete: function(res) {
                    //dd.hideLoading();
                }
            });
        },
        //
        mergeObjectArr(arr1, arr2, prop) {
            for (var a = 0; a < arr1.length; a++) {
                for (var b = 0; b < arr2.length; b++) {
                    if (arr1[a][prop] == arr2[b][prop]) {
                        for (var p in arr2[b]) {
                            arr1[a][p] = arr2[b][p];
                        }
                    }
                }
            }
            return arr1;
        },

        formatQueryStr(obj) {
            var queryStr = "?";
            for (var o in obj) {
                queryStr = queryStr + o + "=" + encodeURI(obj[o]) + "&";
            }
            return queryStr.substring(0, queryStr.length - 1);
        },
        _formatQueryStr(obj) {
            var queryStr = "?";
            for (var o in obj) {
                queryStr = queryStr + o + "=" + obj[o] + "&";
            }
            return queryStr.substring(0, queryStr.length - 1);
        },
        _getTime() {
            return _getTime();
        }
    }
};

function postErrorMsg(type, url, error, userInfo = {}, param = {}) {
    return;
    let postParam = {
        ApplyMan: userInfo.nickName ? userInfo.nickName : "",
        ApplyManId: userInfo.userid ? userInfo.userid : "",
        ApplyTime: _getTime(),
        Url: url,
        Para: JSON.stringify(param),
        GetOrPost: type,
        ErrorCode: error.errorCode ? error.errorCode : "",
        ErrorMsg: error.errorMessage ? error.errorMessage : JSON.stringify(error)
    };
    let postUrl = dormainName + "ErrorLog/Save";
    dd.alert({ content: postUrl });
    dd.alert({ content: JSON.stringify(postParam) });
    dd.httpRequest({
        url: dormainName + "ErrorLog/Save",
        method: "POST",
        data: JSON.stringify(postParam),
        headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        success: function(res) {
            console.log("提交错误信息~~~~~~~~~~~~~~~~~~~~~~");
            console.log(postUrl);
            console.log(postParam);
            console.log(res);
        }
    });
}

function _getTime() {
    var split = "-";
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    return year + split + month + split + day + " " + hour + ":" + minute + ":" + second;
}

function _dateToString(date, split) {
    if (!split) split = "-";
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + split + month + split + day;
}
