$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败!");
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
      area: ["400px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
      resize: false,
    });
  });

  //   表单为动态创建，通过代理的形式为 form 表单绑定 submit 事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/article/addcate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增文章类别失败!");
        } else {
          layer.msg("新增文章类别成功!");
          //   根据索引， 关闭对应弹出层
          layer.close(indexAdd);
          initArtCateList();
        }
      },
    });
  });

  var indexEdit = null;
  $("tbody").on("click", "#btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["400px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
      resize: false,
    });

    var id = $(this).attr("data-id");

    //   根据 id 获取文章分类
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败!");
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
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改文章类别失败!");
        } else {
          layer.msg("修改文章类别成功!");
          //   根据索引， 关闭对应弹出层
          layer.close(indexEdit);
          initArtCateList();
        }
      },
    });
  });

  $("tbody").on("click", "#btn-delete", function () {
    console.log(this);
    var id = $(this).attr("data-id");
    layer.confirm(
      "确定删除该文章类别?",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          method: "GET",
          url: "/my/article/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除文章类别失败!");
            } else {
              layer.msg("删除文章类别成功!");
              layer.close(index);
              initArtCateList();
            }
          },
        });
      }
    );
  });
});
