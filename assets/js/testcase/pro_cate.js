$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initProCateList();
  function initProCateList() {
    $.ajax({
      method: "GET",
      url: "/my/pro/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取产品分类失败!");
        } else {
          var htmlStr = template("tpl-table", res);
          $("tbody").html(htmlStr);
        }
      },
    });
  }

  //   添加索引，为后续关闭弹出层
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["400px", "300px"],
      title: "添加产品分类",
      content: $("#dialog-add").html(),
      resize: false,
    });
  });

  //   表单为动态创建，通过代理的形式为 form 表单绑定 submit 事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/pro/addcate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增产品类别失败!");
        } else {
          layer.msg("新增产品类别成功!");
          //   根据索引， 关闭对应弹出层
          layer.close(indexAdd);
          initProCateList();
        }
      },
    });
  });

  var indexEdit = null;
  $("tbody").on("click", "#btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["400px", "300px"],
      title: "修改产品分类",
      content: $("#dialog-edit").html(),
      resize: false,
    });

    var id = $(this).attr("data-id");

    //   根据 id 获取文章分类
    $.ajax({
      method: "GET",
      url: "/my/pro/cates/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取产品分类失败!");
        } else {
          form.val("form-edit", res.data);
        }
      },
    });
  });

  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/pro/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改产品类别失败!");
        } else {
          layer.msg("修改产品类别成功!");
          //   根据索引， 关闭对应弹出层
          layer.close(indexEdit);
          initProCateList();
        }
      },
    });
  });

  $("tbody").on("click", "#btn-delete", function () {
    console.log(this);
    var id = $(this).attr("data-id");
    layer.confirm(
      "确定删除该产品类别?",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          method: "GET",
          url: "/my/pro/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除产品类别失败!");
            } else {
              layer.msg("删除产品类别成功!");
              layer.close(index);
              initProCateList();
            }
          },
        });
      }
    );
  });
});
