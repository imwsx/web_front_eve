$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var table = layui.table;
  var dropdown = layui.dropdown;
  var laydate = layui.laydate;

  initTcList();

  var addIndex = null;
  var editIndex = null;
  function initTcList() {
    layui.use(["table", "dropdown"], function () {
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
          {
            title: "刷新",
            layEvent: "fresh",
            icon: "layui-icon-refresh",
          },
          {
            title: "帮助",
            layEvent: "help",
            icon: "layui-icon-tips",
          },
        ],
        title: "上位机软件测试用例" + dateFormat(1),
        height: "full-200",
        cellMinWidth: 80,
        page: {
          layout: ["count", "limit", "prev", "page", "next", "skip"],
          limits: [2, 3, 5, 10],
          groups: 5,
          first: 1,
          last: "count",
        },
        cols: [
          [
            { type: "checkbox", fixed: "left" },
            {
              field: "id",
              title: "ID",
              width: 70,
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
              edit: "textarea",
              align: "center",
            },
            {
              field: "tc_pre",
              title: "前提条件",
              edit: "textarea",
              style: "-moz-box-align: start;",
              hide: true,
            },
            {
              field: "tc_step",
              title: "执行步骤",
              edit: "textarea",
            },
            {
              field: "tc_exp",
              title: "预期结果",
              edit: "textarea",
            },
            {
              field: "tc_remark",
              title: "备注",
              edit: "textarea",
              hide: true,
            },
            {
              field: "tc_pr",
              title: "优先级",
              width: 75,
              templet: "#prTpl",
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
              width: 235,
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
              width: 150,
              toolbar: "#barDemo",
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
            click: function (obj) {
              var checkStatus = table.checkStatus(id);
              var data = checkStatus.data;
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

      //工具栏事件
      table.on("toolbar(test)", function (obj) {
        var checkStatus = table.checkStatus("idTest");
        switch (obj.event) {
          case "addData":
            addIndex = layer.open({
              title: "编辑",
              type: 1,
              area: ["50%", "91%"],
              content: $("#tc-add"),
            });
            break;
          case "saveAll":
            for (let i = 0; i < checkStatus.data.length; i++) {
              checkStatus.data[i].tc_pr = prToNum(checkStatus.data[i].tc_pr);
              if (flag1) checkStatus.data[i].tc_status = tc_status_value;
              if (flag2) checkStatus.data[i].is_lock = tc_lock_value;
              $.ajax({
                method: "POST",
                url: "/my/testcase/updatetc",
                data: checkStatus.data[i],
                success: function (res) {
                  if (res.status !== 0) {
                    return layer.msg("保存失败!");
                  } else {
                    layer.msg("保存成功!");
                  }
                },
              });
            }
            initTcList();
            break;
          case "deleteAll":
            layer.confirm("确定删除选中用例吗？", function (index) {
              var arr = [];
              for (let i = 0; i < checkStatus.data.length; i++) {
                arr.push(checkStatus.data[i].id);
              }
              for (let i = 0; i < arr.length; i++) {
                $.ajax({
                  method: "GET",
                  url: "/my/testcase/deletetc/" + arr[i],
                  success: function (res) {
                    if (res.status !== 0) {
                      return layer.msg("删除失败!");
                    } else {
                      layer.msg("删除成功!");
                    }
                  },
                });
              }
              initTcList();
              layer.close(index);
            });
            break;
          case "report":
            reIndex = layer.open({
              title: "迭代报告",
              type: 1,
              area: ["50%", "92%"],
              content: $("#tc-re"),
              success: function () {
                $.ajax({
                  method: "GET",
                  url: "/my/testcase/tcs/status",
                  success: function (res) {
                    if (res.status !== 0) {
                      return layer.msg("获取失败!");
                    } else {
                      // layer.msg("获取成功!");
                      $(".style1").text(res.total[0]);
                      $(".style2").text(res.total[1]);
                      $(".style3").text(res.total[2]);
                      $(".style4").text(res.total[3]);
                      $(".style5").text(res.total[4]);
                      $(".style6").text(res.total[5]);
                      $(".style7").text(res.total[6]);
                    }
                  },
                });
                $.ajax({
                  method: "GET",
                  url: "/my/testcase/tcs/pr",
                  success: function (res) {
                    if (res.status !== 0) {
                      return layer.msg("获取失败!");
                    } else {
                      // layer.msg("获取成功!");
                      $(".style8").text(res.total[0]);
                      $(".style9").text(res.total[1]);
                      $(".style10").text(res.total[2]);
                    }
                  },
                });
              },
            });
            break;
          case "multi-row":
            table.reload("idTest", { lineStyle: "height:95px;" });
            layer.msg("已设为多行");
            break;
          case "default-row":
            table.reload("idTest", { lineStyle: null });
            layer.msg("已设为单行");
            break;
          case "fresh":
            table.reload("idTest", { url: "/my/testcase/tcs" });
            break;
          case "help":
            layer.alert("用例标题不可重复");
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
                initTcList();
              }
            },
          });
        } else if (obj.event === "del") {
          layer.confirm("确定删除该用例吗？", function (index) {
            var id = obj.data.id;
            $.ajax({
              method: "GET",
              url: "/my/testcase/deletetc/" + id,
              success: function (res) {
                if (res.status !== 0) {
                  return layer.msg("删除失败!");
                } else {
                  layer.msg("删除成功!");
                  initTcList();
                  layer.close(index);
                }
              },
            });
          });
        } else if (obj.event === "edit") {
          editIndex = layer.open({
            title: "编辑",
            type: 1,
            area: ["50%", "87%"],
            content: $("#tc-tab"),
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
                edittime: dateFormat(2),
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

      //行单击事件
      table.on("row(test)", function (obj) {});

      //行双击事件
      table.on("rowDouble(test)", function (obj) {});

      //单元格编辑事件
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
          initTcList();
          layer.close(addIndex);
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
          initTcList();
          layer.close(editIndex);
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

  function dateFormat(key) {
    switch (key) {
      case 1:
        return dayjs(new Date()).format("YYYY-MM-DD");
      case 2:
        return dayjs(new Date()).format("YYYY-MM-DDHH:mm:ss");
    }
  }
});
