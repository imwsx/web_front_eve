$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var table = layui.table;
  var dropdown = layui.dropdown;
  var laydate = layui.laydate;

  initProCateList();

  function initProCateList() {
    layui.use(["table", "dropdown"], function () {
      // 创建渲染实例
      table.render({
        elem: "#test",
        id: "idTest",
        url: "/my/pro/cates",
        parseData: function (res) {
          resFormat(res);
          return {
            code: res.status,
            msg: res.message,
            data: res.data,
            count: res.total,
          };
        },
        toolbar: "#toolbarDemo",
        defaultToolbar: [
          "filter",
          "exports",
          "print",
          {
            title: "帮助",
            layEvent: "help",
            icon: "layui-icon-tips",
          },
        ],
        title: "上位机软件测试用例" + dayjs(new Date()).format("YYYY-MM-DD"),
        height: "full-200", // 最大高度减去其他容器已占有的高度差
        cellMinWidth: 80,
        page: {
          layout: ["count", "limit", "prev", "page", "next", "skip"],
          limits: [2, 3, 5, 10],
          groups: 1, //只显示 1 个连续页码
          first: false, //不显示首页
          last: false, //不显示尾页
        },
        cols: [
          [
            { type: "checkbox", fixed: "left" },
            {
              field: "id",
              fixed: "left",
              width: 80,
              title: "ID",
              sort: true,
              align: "center",
            },
            {
              field: "pro_model",
              title: "产品型号",
              edit: "textarea",
              width: 180,
              align: "center",
            },
            {
              field: "pro_name",
              title: "产品名称",
              edit: "textarea",
              width: 260,
              minWidth: 160,
              style: "-moz-box-align: start;",
            },
            {
              field: "pro_status",
              width: 100,
              title: "产品状态",
              align: "center",
              // templet: "#statusTpl",
            },
            {
              field: "edittime",
              title: "最后编辑时间",
              width: 180,
              align: "center",
            },
            {
              fixed: "right",
              title: "操作",
              width: 180,
              minWidth: 180,
              align: "center",
              toolbar: "#barDemo",
            },
          ],
        ],
        text: {
          none: "暂无相关数据",
        },
        done: function () {
          var id = this.id;
          dropdown.render({
            elem: "#moreTest",
            data: [
              {
                id: "isAll",
                title: "是否全选",
              },
              { type: "-" },
              {
                id: "getCheckData",
                title: "获取选中行数据",
              },
              {
                id: "getData",
                title: "获取当前页数据",
              },
            ],
            //菜单被点击的事件
            click: function (obj) {
              var checkStatus = table.checkStatus(id);
              var data = checkStatus.data; // 获取选中的数据
              switch (obj.id) {
                case "isAll":
                  layer.msg(checkStatus.isAll ? "全选" : "未全选");
                  break;
                case "getCheckData":
                  if (data.length !== 1) return layer.msg("请选择一行");
                  layer.alert(layui.util.escape(JSON.stringify(data)));
                  break;
                case "getData":
                  var getData = table.getData(id);
                  layer.alert(layui.util.escape(JSON.stringify(getData)));
                  break;
              }
            },
          });
        },
        error: function (res, msg) {
          console.log(res, msg);
        },
      });

      // 工具栏事件
      table.on("toolbar(test)", function (obj) {
        switch (obj.event) {
          case "addData":
            layer.open({
              title: "编辑",
              type: 1,
              area: ["26%", "50%"],
              content: $("#form-add"),
            });
            break;
          case "deleteAll":
            layer.confirm("确定删除选中产品吗？", function (index) {
              obj.del();
              layer.close(index);
            });
            break;
          case "multi-row":
            table.reload("idTest", {
              lineStyle: "height: 95px;",
            });
            layer.msg("已设为多行");
            break;
          case "default-row":
            table.reload("idTest", {
              lineStyle: null, // 恢复单行
            });
            layer.msg("已设为单行");
            break;
          case "help":
            layer.alert("有事请找 wsx");
            break;
        }
      });

      //触发单元格工具事件
      table.on("tool(test)", function (obj) {
        var checkStatus = table.checkStatus("idTest");
        if (obj.event === "del") {
          if (checkStatus.data.length !== 1) return layer.msg("请选择一行");
          layer.confirm("确定删除该产品吗？", function (index) {
            obj.del();
            layer.close(index);
          });
        } else if (obj.event === "edit") {
          layer.open({
            title: "编辑",
            type: 1,
            area: ["26%", "50%"],
            content: $("#form-edit"),
            success: function () {
              $("#form-edit input:first").attr("value", obj.data.id);
              form.val("form-edit", {
                pro_model: obj.data.pro_model,
                pro_name: obj.data.pro_name,
                pro_status: statusToNum(obj.data.pro_status),
                edittime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              });
            },
          });
        }
      });

      //触发表格复选框选择
      table.on("checkbox(test)", function (obj) {});

      //触发表格单选框选择
      table.on("radio(test)", function (obj) {});

      // 行单击事件
      table.on("row(test)", function (obj) {
        // var data = obj.data;
        // layer.prompt(
        //   {
        //     formType: 2,
        //     title: "修改型号： [" + data.pro_model + "] 的 ",
        //     value: data.sign,
        //   },
        //   function (value, index) {
        //     layer.close(index);
        //     // 发送Ajax请求
        //     obj.update({
        //       sign: value,
        //     });
        //   }
        // );
      });
      // 行双击事件
      table.on("rowDouble(test)", function (obj) {});

      // 单元格编辑事件
      table.on("edit(test)", function (obj) {
        var field = obj.field, //得到字段
          value = obj.value, //得到修改后的值
          data = obj.data; //得到所在行所有键值

        var update = {};
        update[field] = value;
        obj.update(update);
      });
    });
  }

  layui.use("laydate", function () {
    laydate.render({
      elem: "#editTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      isInitValue: true,
      value: new Date(),
    });
  });

  $("html").on("submit", "#form-add", function (e) {
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
          initProCateList();
        }
      },
    });
  });

  $("html").on("submit", "#form-edit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/pro/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增产品类别失败!");
        } else {
          layer.msg("新增产品类别成功!");
          initProCateList();
        }
      },
    });
  });

  function resFormat(res) {
    for (let i = 0; i < res.data.length; i++) {
      res.data[i].pro_status = statusToText(res.data[i].pro_status);
    }
  }

  function statusToText(key) {
    switch (key) {
      case 0:
        return "在研";
      case 1:
        return "验证";
      case 2:
        return "转产";
      case 3:
        return "在售";
    }
  }

  function statusToNum(key) {
    switch (key) {
      case "在研":
        return 0;
      case "验证":
        return 1;
      case "转产":
        return 2;
      case "在售":
        return 3;
    }
  }
});
