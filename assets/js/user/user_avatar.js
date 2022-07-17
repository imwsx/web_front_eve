$(function () {
  var layer = layui.layer;
  // 1.1 获取裁剪区域 DOM 元素
  var $image = $("#image");

  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 创建预览区域
    preview: ".img-preview",
  };
  // 1.3 创建裁剪区域
  $image.cropper(options);

  $("#btnChooseImg").on("click", function () {
    $("#file").click();
  });

  //   裁剪区域图片替换
  $("#file").on("change", function (e) {
    // 获取用户选择文件
    var filelist = e.target.files;
    if (filelist.length === 0) {
      return layer.msg("请选择图片!");
    }

    // 拿到用户选择文件
    var file = filelist[0];
    // 将文件转换为 路径
    var imgUrl = URL.createObjectURL(file);
    // 创建新的裁剪区域
    $image
      .cropper("destroy") //  销毁旧的裁剪区域
      .attr("src", imgUrl) //  重新设置图片路径
      .cropper(options); //  重新初始化裁剪区域
  });

  $("#btnUpload").on("click", function () {
    // 获取裁剪头像
    var dataUrl = $image
      .cropper("getCroppedCanvas", {
        // 创建 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    //   将 Canvas 内容， 转换成 base64 格式 字符串
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataUrl,
      },
      success: function (res) {
        if (res.status !== 0) {
            return layer.msg('更换头像失败!');
        }
        layer.msg('更换头像成功!');
        window.parent.getUserInfo();
      },
    });
  });
});
