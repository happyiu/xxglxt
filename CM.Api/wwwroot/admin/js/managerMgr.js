layui.use(['element', 'table', 'dtree','layer','form'], function () {
    var $ = layui.jquery;
    var element = layui.element;
    var table = layui.table;
    var layer = layui.layer;
    var dtree = layui.dtree;
    var form = layui.form;

    var page = {};

    $.extend(dtree, {
        init: function () {
            dtree.on("node('slTree')", function (obj) {

            });
            layui.page = page;
        },
        show: function (data) {
            var menu = [];
            data.forEach(function (item) {
                menu.push({
                    id: item.id,
                    name: item.name,
                    pid: -1
                });
            });
            menu.unshift({
                id: -1,
                name: "<全部>",
                pid: 0
            });
            dtree.render({
                elem: "#slTree",
                data: menu,
                dataFormat: "list",
                response: {
                    id: "id",
                    title: "name",
                    parentId: "pid"

                },
                ficon: "1",
                dot: true,
                skin: "layui",
                initLevel: "3"
            });
        }
    });

    $.extend(table, {
        showAll: function () {
            $.ajax({
                type: "GET",
                url: "/api/manager",
                //url: "/json/grade.json",
                data: {
                    token: "itg"
                },
                dataType: "json",
                success: function (data) {
                    table.show(data);
                }
            });
        },
        show: function (mydata) {
            table.render({
                elem: '#tab',
                toolbar: '#mytoolbar',
                skin: 'line',
                data: mydata,
                cols: [
                    [{
                        type: 'checkbox'
                    }, {
                        field: 'id',
                        title: 'ID',
                        sort: true
                    }, {
                        field: 'userName',
                        title: '账号',
                        sort: true
                    }, {
                        field: 'realName',
                        title: '姓名',
                        sort: true
                    }, {
                        field: 'roleId',
                        title: '角色',
                        sort: true
                    }, {
                        field: 'mobile',
                        title: '电话',
                        sort: true
                    },{
                        field: 'createDate',
                        title: '创建日期',
                        sort: true
                    }, {
                        title: '操作',
                        fixed: 'right',
                        width: 178,
                        align: 'center',
                        toolbar: '#barDemo'
                    }]
                ],
                id: 'testReload',
                page: {
                    count: 10,
                    limit: 10,
                    limits: [10, 20, 30, 50],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function (obj) {
                        console.log(obj)
                    }
                }
            });

        },
        add: function (obj) {
            layer.open({
                type: 2 //此处以iframe举例
                ,
                title: '添加人员信息',
                area: ['720px', '550px'],
                maxmin: true,
                content: ['managerAdd.html', 'no']
            });
        },
        adv: function (obj) {
            alert('高级搜索');
        },
        delAll: function (obj) {
            alert('delAll');
        },
        search: function (obj) {
            //alert('reload');
            var myurl = "/api/manager";
            var key = $("#demoReload").val();
            if (key != "") {
                myurl = myurl + "/" + key;
            }

            $.ajax({
                type: "GET",
                url: myurl,
                data: {
                    token: "itg"
                },
                dataType: "json",
                success: function (data) {
                    table.show(data);
                }
            });

        },
        rowDel: function (data) {
            console.log(data);
            layer.confirm('您确定要删除?', {
                icon: 3,
                title: '提示'
            }, function (index) {
                //do something
                $.ajax({
                    url: "/api/manager/" + data.id,
                    type: "DELETE",
                    success: function (result) {
                        table.showAll();
                    }
                });
                layer.close(index);
            });
        },
        rowEdit: function (data) {
            //alert('rowEdit');
            // console.log(data);
            var tb = "edit";
            var fkey = tb + '_manager_' + data.id;
            layui.data(tb, {
                key: fkey,
                value: data
            });
            layer.open({
                type: 2, //此处以iframe举例   
                title: '编辑人员信息',
                area: ['720px', '540px'],
                shade: 0,
                maxmin: true,
                content: ['managerAdd.html?edit=' + fkey, 'no']
            });

        }
    });

    $.extend(page, {
        cachData: null,
        init: function () {
            dtree.init();
            table.init();
            page.render();
        },
        render: function () {
            var index = layer.load(2);
            $.ajax({
                type: "GET",
                url: "/api/Manager/GetManagerData",
                data: {
                    token: "itg"
                },
                dataType: "json",
                success: function (data) {
                    var roles = data.data[0].roles;
                    var managers = [];
                    data.data[0].managers.forEach(function (item) {
                        rname = "";
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i].id == item.roleId) {
                                rname = roles[i].name;
                                break;
                            }
                        }
                        managers.push($.extend(item, {
                            roleName: rname
                        }));
                    });

                    dtree.show(roles);
                    table.show(managers);

                    page.cacheData = {
                        roles: roles,
                        managers: managers
                    };
                    layer.close(index);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.close(index);
                }
            });
        }
    });

    page.init();


});