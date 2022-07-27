$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initCate();

  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败!");
        }
        // 注意点： 此处layui 并未监听到 ajax 异步请求
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 解决办法： 调用 layui 的form.render 方法
        form.render();
      },
    });
  }

  tinymce.init({
    selector: "#content",
    language: "zh-Hans",
  });

  var $image = $("#image");
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  $image.cropper(options);

  $("#btnChooseImg").on("click", function () {
    $("#coverFile").click();
  });

  $("#coverFile").on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    var newImgURL = URL.createObjectURL(files[0]);
    $image.cropper("destroy").attr("src", newImgURL).cropper(options);
  });

  var art_state = 0;

  $("#btnSave2").on("click", function () {
    art_state = 1;
  });

  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    $image
      .cropper("getCroppedCanvas", {
        width: 400,
        height: 200,
      })
      .toBlob(function (blob) {
        fd.append("cover_img", blob);
        pubArt(fd);
      });
  });

  function pubArt(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // formData 格式数据，需设置以下配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败!");
        }
        layer.msg("发布文章成功!");
        location.href = "../article/article_list.html";
      },
    });
  }
});
