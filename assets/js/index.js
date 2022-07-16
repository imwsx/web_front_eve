$(function () {
  getUserInfo();

  var layer = layui.layer;
  $("#btnSignout").on("click", function () {
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "退出" },
      function (index) {
        // 清空本地存储 token
        localStorage.removeItem("token");
        // 退出至登录界面
        location.href = "./login.html";
        // 关闭 confirm 框
        layer.close(index);
      }
    );
  });
});

function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("用户信息获取失败!");
      }

      renderAvatar(res.data);
    },
  });
}

// 渲染用户头像
function renderAvatar(user) {
  var name = user.nickname || user.username;
  $(".userinfo > #name").html(name);
  // 头像渲染
  // 渲染图片头像
  if (user.user_pic != null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();

    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
