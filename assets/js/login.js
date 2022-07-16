$(function () {
  $("#link_reg").on("click", function () {
    $(".login_box").hide();
    $(".reg_box").show();
  });

  $("#link_login").on("click", function () {
    $(".reg_box").hide();
    $(".login_box").show();
  });

  //   从 layui 中获取 form 对象
  //   通过form.verify() 函数自定义表单校验规则
  var form = layui.form;
  form.verify({
    username: function (value, item) {
      //value：表单的值、item：表单的DOM对象
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return "用户名不能有特殊字符";
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return "用户名首尾不能出现下划线'_'";
      }
      if (/^\d+\d+\d$/.test(value)) {
        return "用户名不能全为数字";
      }
    },

    // 不想自动弹出默认提示框，可以直接返回 true
    //支持函数式，支持数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    //校验注册密码是否一致
    repwd: function (value) {
      var pwd = $(".reg_box [name=password]").val();
      if (pwd !== value) {
        return "两次输入密码不一致";
      }
    },
  });

  //   从 layui 中获取 layer 对象(layui 弹出层)
  var layer = layui.layer;
  //   监听注册表单接口
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();

    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    $.post("/api/register", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功, 请登录!");
      // 模拟点击，跳转登录
      $("#link_login").click();
    });
  });

  //   监听登录表单接口
  $("#form_login").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 存储 token 字符串
        localStorage.setItem("token", res.token);
        location.href = "./index.html";
      },
    });
  });
});
