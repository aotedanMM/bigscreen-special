(function (window) {
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.typeTree = {};
    /*
    *
    * 点击出现ztree树
    *
    * */
    window.EMapServerV2.typeTree.getZtree = function () {
        var self = this;
        G.equConfigInf = {};
        //查询结果的回调
        var callBackFun = function (data) {
            //ztree树的弹框
            var setting = {
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck
                }
            };
            var data1 = data[0];
            var data2 = data[1];
            //json数据
            var edu_type_list = [];
            for (var i = 0; i < data1.length; i++) {
                var obj = {};
                obj.id = data1[i].id;
                obj.pId = data1[i].pId;
                obj.name = data1[i].label;
                obj.table = data1[i].table;
                obj.field = data1[i].field;
                obj.value = data1[i].value;
                obj.checked = true;
                edu_type_list.push(obj)
            }
            var learner_list = [];
            var equContrast = {};
            for (var j = 0; j < data2.length; j++) {
                if (data2[j].value.length > 1 && data2[j].value.length < 8) {
                    var obj1 = {};
                    obj1.id = data2[j].value;
                    obj1.pId = data2[j].pId;
                    obj1.name = data2[j].label;
                    obj1.table = data2[j].table;
                    obj1.field = data2[j].field;
                    obj1.value = data2[j].value;
                    obj1.checked = true;
                    learner_list.push(obj1);
                    equContrast[data2[j].value] = data2[j].label;
                }
            }
            G.equConfigInf.equContrast = equContrast;
            function beforeClick(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                zTree.checkNode(treeNode, !treeNode.checked, null, true);
                return false;
            }

            function onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId),
                    nodes = zTree.getCheckedNodes(true),
                    v = "";
                //返回checkbox值
                for (var i = 0, l = nodes.length; i < l; i++) {
                    if (!nodes[i].isParent) {
                        v += nodes[i].name + ",";//多值用,隔开
                    }
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                var cityObj = $("#input_" + treeId);
                cityObj.attr("value", v);
            }
            function showMenu(v) {
                var cityObj = $("#input_" + v + "_a");
                var cityOffset = $("#input_" + v + "_a").offset();
                $("#menuContent ul").hide();
                $("#" + v).show();
                $("#menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");

                $("body").bind("mousedown", onBodyDown);
            }
            function hideMenu() {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }
            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                    hideMenu();
                }
            }

            $(document).ready(function () {
                //初始化ztree
                $.fn.zTree.init($("#treeDemo"), setting, edu_type_list);
                $.fn.zTree.init($("#learner_list"), setting, learner_list);
                G.equConfigInf.objTree1 = $.fn.zTree.getZTreeObj("treeDemo");
                G.equConfigInf.objTree2 = $.fn.zTree.getZTreeObj("learner_list");
            });
        };
        window.EMapServerV2.queryData.queryTree([1, 2], callBackFun);
    };
})(window);        