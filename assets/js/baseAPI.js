//  一个典型的前置过滤器注册使用$.ajaxPrefilter()
// options是请求选项
$.ajaxPrefilter(function (options) {
  //   统一拼接请求根路径
  options.url = "http://127.0.0.1:8081" + options.url;

  // 统一为设置权限接口 设置请求头
  if (options.url.indexOf("/my") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调函数
  // 无论成功或失败，都会调用 complete 回调函数
  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败!"
    ) {
      // 清空本地存储 token
      localStorage.removeItem("token");
      // 退出至登录界面
      location.href = "./login.html";
    }
  };
});
