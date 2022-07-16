//  一个典型的前置过滤器注册使用$.ajaxPrefilter()
// options是请求选项
$.ajaxPrefilter(function (options) {
  //   统一拼接请求根路径
  options.url = "http://127.0.0.1:8081" + options.url;
});
