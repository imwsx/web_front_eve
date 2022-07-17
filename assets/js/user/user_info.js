$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间!";
      }
    },
  });

  initUserInfo();

  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户基本信息失败!");
        } else {
          form.val("formUserInfo", res.data);
        }
      },
    });
  }

  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败!");
        } else {
          //    调用父页面中 index.js 下方法, 重新渲染头像、登录名
          //   window 为 iframe, parent 为 index
          layer.msg("更新用户信息成功!");
          window.parent.getUserInfo();
        }
      },
    });
  });
});
