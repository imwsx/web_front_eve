$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义美化时间的过滤器---template 属性调用
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  //   时间格式化 补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  template.defaults.imports.getState = (state) => {
    if (Boolean(+state)) {
      return "草稿";
    } else {
      return "已发布";
    }
  };

  var q = {
    pagenum: 1,
    pagesize: 1,
    cate_id: "",
    state: "",
  };

  initTable();

  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败!");
        }

        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  initCate();

  // 初始化 文章分类
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

  $("#form-search").on("submit", (e) => {
    e.preventDefault();
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    // 未查询参数对象 q 赋值
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  // 定义渲染分页方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      limits: [2, 3, 5, 10],
      curr: q.pagenum,
      // jump 触发回调方式
        // 1. 点击页码
        // 2. 调用 laypage.render 方法就会触发 jump 回调
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // 切换分页后，重新初始化表格；注意直接调用初始化表格函数会发生死循环
        // initTable();
        if (!first) {
          initTable();
        }
      },
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
    });
  }

  
});
