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
        url: "/my/testcase/tcs",
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
              title: "ID",
              width: 80,
              // width: 80,
              fixed: "left",
              sort: true,
              align: "center",
            },
            {
              field: "tc_module",
              title: "用例模块",
              width: 120,
              edit: "textarea",
              align: "center",
            },
            {
              field: "tc_title",
              title: "用例标题",
              // width: 180,
              edit: "textarea",
              align: "center",
            },
            {
              field: "tc_pre",
              title: "前提条件",
              // width: 260,
              // minWidth: 160,
              edit: "textarea",
              style: "-moz-box-align: start;",
              hide: true,
            },
            {
              field: "tc_step",
              title: "执行步骤",
              // width: 260,
              edit: "textarea",
            },
            {
              field: "tc_exp",
              title: "预期结果",
              // width: 260,
              edit: "textarea",
            },
            {
              field: "tc_remark",
              title: "备注",
              // width: 180,
              edit: "textarea",
              hide: true,
            },
            {
              field: "tc_pr",
              title: "优先级",
              width: 80,
              align: "center",
            },
            {
              field: "edittime",
              title: "编辑时间",
              width: 165,
              align: "center",
              hide: true,
            },
            {
              field: "tc_status",
              title: "状态",
              width: 250,
              templet: "#radioTpl",
              align: "center",
              unresize: true,
            },
            {
              field: "is_lock",
              title: "是否启用",
              width: 110,
              templet: "#checkboxTpl",
              align: "center",
              unresize: true,
              hide: true,
            },
            {
              fixed: "right",
              title: "操作",
              width: 180,
              toolbar: "#barDemo",
              // minWidth: 180,
              align: "center",
              unresize: true,
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
              area: ["50%", "91%"],
              content: $("#tc-add"),
            });
            break;
          case "deleteAll":
            layer.confirm("确定删除选中用例吗？", function (index) {
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
              lineStyle: null,
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
        if (obj.event === "save") {
          obj.data.tc_pr = prToNum(obj.data.tc_pr);
          if (flag1) obj.data.tc_status = tc_status_value;
          if (flag2) obj.data.is_lock = tc_lock_value;
          $.ajax({
            method: "POST",
            url: "/my/testcase/updatetc",
            data: obj.data,
            success: function (res) {
              if (res.status !== 0) {
                return layer.msg("保存失败!");
              } else {
                layer.msg("保存成功!");
                initProCateList();
              }
            },
          });
        } else if (obj.event === "del") {
          // if (checkStatus.data.length !== 1) return layer.msg("请选择一行");
          layer.confirm("确定删除该产品吗？", function (index) {
            obj.del();
            layer.close(index);
          });
        } else if (obj.event === "edit") {
          layer.open({
            title: "编辑",
            type: 1,
            area: ["50%", "91%"],
            content: $("#tc-edit"),
            success: function () {
              $("#tc-edit input:first").attr("value", obj.data.id);
              form.val("tc-edit", {
                tc_module: obj.data.tc_module,
                tc_title: obj.data.tc_title,
                tc_pre: obj.data.tc_pre,
                tc_step: obj.data.tc_step,
                tc_exp: obj.data.tc_exp,
                tc_remark: obj.data.tc_remark,
                tc_pr: prToNum(obj.data.tc_pr),
                edittime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              });
            },
          });
        }
      });
      //触发表格复选框选择
      table.on("checkbox(test)", function (obj) {});

      var flag1 = false;
      var flag2 = false;
      form.on("radio(statusDis)", function (obj) {
        flag1 = true;
        return (tc_status_value = obj.value);
      });

      form.on("checkbox(lockDis)", function (obj) {
        flag2 = true;
        if (obj.elem.checked === true) {
          return (tc_lock_value = "1");
        } else {
          return (tc_lock_value = "0");
        }
      });

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

  $("html").on("submit", "#tc-add", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/testcase/addtc",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("用例添加失败!");
        } else {
          layer.msg("用例添加成功!");
          initProCateList();
        }
      },
    });
  });

  $("html").on("submit", "#tc-edit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/testcase/updatetc",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("用例更新失败!");
        } else {
          layer.msg("用例更新成功!");
          initProCateList();
        }
      },
    });
  });

  function resFormat(res) {
    for (let i = 0; i < res.data.length; i++) {
      res.data[i].tc_pr = prToText(res.data[i].tc_pr);
    }
  }

  function prToText(key) {
    switch (key) {
      case 0:
        return "高";
      case 1:
        return "中";
      case 2:
        return "低";
    }
  }

  function prToNum(key) {
    switch (key) {
      case "高":
        return 0;
      case "中":
        return 1;
      case "低":
        return 2;
    }
  }
});
