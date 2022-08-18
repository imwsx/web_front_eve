$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var table = layui.table;

  initProCateList();

  function initProCateList() {
    layui.use(["table", "dropdown"], function () {
      var table = layui.table;
      var dropdown = layui.dropdown;
      layer.msg(
        "本示例演示的数据为静态模拟数据，<br>实际使用时换成您的真实接口即可。",
        {
          closeBtn: 1,
          icon: 6,
          time: 21 * 1000,
          offset: "21px",
        }
      );

      // 创建渲染实例
      table.render({
        elem: "#test",
        url: "/my/pro/cates",
        parseData: function (res) {
          //res 即为原始返回的数据
          return {
            code: res.status, //解析接口状态
            msg: res.message, //解析提示文本
            data: res.data, //解析数据列表
          };
        },
        toolbar: "#toolbarDemo",
        defaultToolbar: [
          "filter",
          "exports",
          "print",
          {
            title: "帮助",
            layEvent: "LAYTABLE_TIPS",
            icon: "layui-icon-tips",
          },
        ],
        height: "full-200", // 最大高度减去其他容器已占有的高度差
        cellMinWidth: 80,
        totalRow: true, // 开启合计行
        page: true,
        cols: [
          [
            { type: "checkbox", fixed: "left" },
            {
              field: "id",
              fixed: "left",
              width: 80,
              title: "ID",
              sort: true,
              totalRowText: "合计：",
            },
            {
              field: "pro_model",
              title: "产品型号",
              edit: "textarea",
              width: 160,
            },
            {
              field: "pro_name",
              title: "产品名称",
              edit: "textarea",
              width: 160,
              minWidth: 160,
              style: "-moz-box-align: start;",
            },
            { field: "status", width: 100, title: "在研状态" },
            { field: "joinTime", title: "最后编辑时间", width: 120 },
            {
              fixed: "right",
              title: "操作",
              width: 150,
              minWidth: 150,
              toolbar: "#barDemo",
            },
          ],
        ],
        done: function () {
          var id = this.id;
          // 更多测试
          dropdown.render({
            elem: "#moreTest", //可绑定在任意元素中，此处以上述按钮为例
            data: [
              {
                id: "add",
                title: "添加",
              },
              {
                id: "update",
                title: "编辑",
              },
              {
                id: "delete",
                title: "删除",
              },
            ],
            //菜单被点击的事件
            click: function (obj) {
              var checkStatus = table.checkStatus(id);
              var data = checkStatus.data; // 获取选中的数据
              switch (obj.id) {
                case "add":
                  layer.open({
                    title: "添加",
                    type: 1,
                    area: ["80%", "80%"],
                    content: '<div style="padding: 16px;">自定义表单元素</div>',
                  });
                  break;
                case "update":
                  if (data.length !== 1) return layer.msg("请选择一行");
                  layer.open({
                    title: "编辑",
                    type: 1,
                    area: ["80%", "80%"],
                    content: '<div style="padding: 16px;">自定义表单元素</div>',
                  });
                  break;
                case "delete":
                  if (data.length === 0) {
                    return layer.msg("请选择一行");
                  }
                  layer.msg("delete event");
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
        var id = obj.config.id;
        var checkStatus = table.checkStatus(id);
        var othis = lay(this);
        switch (obj.event) {
          case "getCheckData":
            var data = checkStatus.data;
            layer.alert(layui.util.escape(JSON.stringify(data)));
            break;
          case "getData":
            var getData = table.getData(id);
            console.log(getData);
            layer.alert(layui.util.escape(JSON.stringify(getData)));
            break;
          case "isAll":
            layer.msg(checkStatus.isAll ? "全选" : "未全选");
            break;
          case "multi-row":
            table.reload("test", {
              // 设置行样式，此处以设置多行高度为例。若为单行，则没必要设置改参数 - 注：v2.7.0 新增
              lineStyle: "height: 95px;",
            });
            layer.msg("即通过设置 lineStyle 参数可开启多行");
            break;
          case "default-row":
            table.reload("test", {
              lineStyle: null, // 恢复单行
            });
            layer.msg("已设为单行");
            break;
          case "LAYTABLE_TIPS":
            layer.alert("有事请找 wsx");
            break;
        }
      });

      //触发单元格工具事件
      table.on("tool(test)", function (obj) {
        // 双击 toolDouble
        var data = obj.data;
        //console.log(obj)
        if (obj.event === "del") {
          layer.confirm("真的删除行么", function (index) {
            obj.del();
            layer.close(index);
          });
        } else if (obj.event === "edit") {
          layer.open({
            title: "编辑",
            type: 1,
            area: ["80%", "80%"],
            content: '<div style="padding: 16px;">自定义表单元素</div>',
          });
        }
      });

      //触发表格复选框选择
      table.on("checkbox(test)", function (obj) {
        console.log(obj);
      });

      //触发表格单选框选择
      table.on("radio(test)", function (obj) {
        console.log(obj);
      });

      // 行单击事件
      table.on("row(test)", function (obj) {
        //console.log(obj);
        //layer.closeAll('tips');
      });
      // 行双击事件
      table.on("rowDouble(test)", function (obj) {
        console.log(obj);
      });

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
});
