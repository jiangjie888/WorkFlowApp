// JavaScript Document
var property={
	width:1200,
	height:747,
    //height:600,
	//toolBtns:["begnode","endnode","user","supervisor","community","street","region","citycenter","dept","checkin","checkout","finalcase"],
	toolBtns:["start","end","user","dept","finalcase"],
	haveHead:false,
	headBtns:["new","open","save","undo","redo","reload"],//如果haveHead=true，则定义HEAD区的按钮
	haveTool:true,
	haveGroup:false,
	useOperStack:false
};
var remark={
	cursor:"选择指针",
	direct:"结点连线",
	start:"入口结点",
	end:"结束结点",
	user:"普通节点",
	supervisor:"监督员",
	community:"社区",
	street:"街道",
	region:"区指挥中心",
	citycenter:"市指挥中心",
	dept:"部门",
	checkin:"核实",
	checkout:"核查",
	finalcase:"结案"

};
var demo,loaddataflag = false;
$(document).ready(function(){
	demo=$.createGooFlow($("#wf_design"),property);
	demo.setNodeRemarks(remark);

    demo.onItemAdd=function(id,type,json){
        /*if(type=="line" && json.from!="" && json.to!=""){
            formDataDesign.lineData = { lineId: id, lineName: json.name, from:json.from, to:json.to, trans: [] };
            window.parent.window.formDataOp.flowDesignLineAdd(formDataDesign.lineData);
        }*/
        if(type=="node" && loaddataflag == false){
            formDataDesign.nodeData =  { baseInfo: { nodeId: id, nodeName: json.name, nodeStep: "000",nodeType:json.type}, approveInfo: [], formInfo: [] };
            window.parent.window.formDataOp.flowDesignNodeAdd(formDataDesign.nodeData);
        }
        return true;
    };
	demo.onItemDel=function(id,type){
	    if(type=="line"){
            window.parent.window.formDataOp.flowDesignLineRemove(id);
        }
        if(type=="node"){
            for(var k in demo.$lineData){
                if(demo.$lineData[k].from==id||demo.$lineData[k].to==id){
                    window.parent.window.formDataOp.flowDesignLineRemove(k);
                }
            }
            window.parent.window.formDataOp.flowDesignNodeRemove(id);
        }
        return true;
	};

    setTimeout(function () {
        if (window.parent.formData.flowDesign.designData != "") {
            loaddataflag = true;
            demo.loadData(eval("(" + window.parent.formData.flowDesign.designData + ")"));
        }
    }, 2000);
	//demo.loadData(window.parent.formData.flowDesign.designData);

    //{"title":"newFlow_1","nodes":{"wf_design_node_1":{"name":"开始","left":308,"top":125,"type":"start","width":160,"height":50,"alt":true},"wf_design_node_2":{"name":"结束","left":288,"top":335,"type":"end","width":160,"height":50,"alt":true}},"lines":{},"areas":{},"initNum":3}
    page.init();
});
var formDataDesign = {
  nodeData:{ baseInfo: { nodeId: "", nodeName: "", nodeStep: "",nodeType:""}, approveInfo: [], formInfo: [] },
  lineData:{ lineId: "", lineName: "", from:"", to:"", trans: [] }
};
var page = {
    init: function () {
        //this.autoSize();
        this.eventBind();
        this.initControl();
    },
    autoSize: function () {
        //$("#main").outerHeight($("#extend_test").height() - $("#nav").outerHeight());
        // $("#left").outerHeight($("#main").height());
        //$("#right").outerHeight($("#main").height());

        //var width = $('.jqGrid_wrapper').width();
        //$("#jqGridList1").setGridWidth(width);
    },
    eventBind: function () {
        //页面Resize
        $(window).resize(function () {
            //alert(window.innerWidth);
            page.autoSize();
        });
    },
    initControl: function () {
        form.init();
    }
};

var form = {
    init: function () {
        //绑定下拉框
        $.ajax({
            type: 'get',
            dataType: "json",
            contentType: 'application/json',
            url: workflowServiceRoot + '/SysDataDictService/GetDataDictByPCode?code=sel_flow_tranmark',
            async: true,
            //data: JSON.stringify({"codes":"sel_flow_tranmark"}),
            success: function (response) {
                if (response.success) {
                    if (response.result != null) {
                        var data = response.result;
                        $("#div_lineTranType").html("");
                        $.each(data, function (i, o) {
                            $("#div_lineTranType").append ("<input type='radio' name='rdo_lineTranType' value='"+ o.code +"' title='"+ o.name +"' lay-verify='required'>");
                        });
                        $("input[name='rdo_lineTranType'][value = '000']").attr("checked", true);
                    }
                } else {
                    layer.alert("数据请求失败", { title: '请求失败' });
                }
            },
            error: function (e) {
                if(e.responseJSON.error!=null) {
                            layer.alert(e.responseJSON.error.details, {title: '请求失败'});
                        } else {
                            layer.alert("Http请求异常", {title: '请求失败'});
                        }
            }
        });
        //绑定下拉框
        $.ajax({
            type: 'get',
            dataType: "json",
            contentType: 'application/json',
            url: workflowServiceRoot + '/SysDataDictService/GetDataDictByPCode?code=sel_flow_nodemark',
            async: true,
            //data: JSON.stringify({"codes":"sel_flow_nodemark"}),
            success: function (response) {
                if (response.success) {
                    if (response.result != null) {
                        var data = response.result;
                        $("#div_nodeStep").html("");
                        $.each(data, function (i, o) {
                            $("#div_nodeStep").append ("<input type='radio' name='rdo_nodeStep' value='"+ o.code +"' title='"+ o.name +"' lay-verify='required'>");
                        });
                        $("input[name='rdo_nodeStep'][value = '000']").attr("checked", true);
                        //form.render(‘select’,’selFilter’);
                    }
                } else {
                    layer.alert("数据请求失败", { title: '请求失败' });
                }
            },
            error: function (e) {
                if(e.responseJSON.error!=null) {
                            layer.alert(e.responseJSON.error.details, {title: '请求失败'});
                        } else {
                            layer.alert("Http请求异常", {title: '请求失败'});
                        }
            }
        });


        form.active.editNodeTab();
        form.permissionInit();
        form.formInit();
        form.lineOpInit();
        form.selectTriggerCss(0);
    },
    selectTriggerCss:function(index){
        $(".select-menu-input").eq(index).val($(".select-this").eq(index).html());//在输入框中自动填充第一个选项的值
        $(".select-menu-div").eq(index).on("click",function(e){
            e.stopPropagation();
            if($(".select-menu-ul").eq(index).css("display")==="block"){
                $(".select-menu-ul").eq(index).hide();
                $(".select-menu-div").eq(index).find("i").removeClass("select-menu-i");
                $(".select-menu-ul").eq(index).animate({marginTop:"50px",opacity:"0"},"fast");
            }else{
                $(".select-menu-ul").eq(index).show();
                $(".select-menu-div").eq(index).find("i").addClass("select-menu-i");
                $(".select-menu-ul").eq(index).animate({marginTop:"5px",opacity:"1"},"fast");
            }
            for(var i=0;i<$(".select-menu-ul").length;i++){
                if(i!==index&& $(".select-menu-ul").eq(i).css("display")==="block"){
                    $(".select-menu-ul").eq(i).hide();
                    $(".select-menu-div").eq(i).find("i").removeClass("select-menu-i");
                    $(".select-menu-ul").eq(i).animate({marginTop:"50px",opacity:"0"},"fast");
                }
            }
        });
        $(".select-menu-ul").eq(index).on("click","li",function(){//给下拉选项绑定点击事件
            $(".select-menu-input").eq(index).val($(this).html());//把被点击的选项的值填入输入框中
            $(".select-menu-div").eq(index).click();
            $(this).siblings(".select-this").removeClass("select-this");
            $(this).addClass("select-this");
        });
        $("body").on("click",function(event){
            //event.stopPropagation();
            if($(".select-menu-ul").eq(index).css("display")==="block"){
                console.log(1);
                $(".select-menu-ul").eq(index).hide();
                $(".select-menu-div").eq(index).find("i").removeClass("select-menu-i");
                $(".select-menu-ul").eq(index).animate({marginTop:"50px",opacity:"0"},"fast");
            }
        });
    },
	active:{
        editNodeWin: function (type,othis, id) {
            layui.use(['layer', 'form', 'table'], function () {
                var $ = layui.jquery, layer = layui.layer;
                var layuiform = layui.form;
                var table = layui.table;
				var divdom = (type=="node")?$('#divFlowNodeEditDet'):$('#divFlowLineEditDet');
				var ttile = "";

                layuiform.verify({
                    rdo_nodeStep_verify: function(value){
                        if(value == ''){
                            return "必填项不允许为空";
                        }
                    }
                });
                layuiform.on('radio(rdo_lineIsAuto)', function (data) {
                    $("#rdo_lineIsAuto_verify").val(data.value);
                });
                layuiform.on('radio(rdo_lineIsMessage)', function (data) {
                    $("#rdo_lineIsMessage_verify").val(data.value);
                });
                layuiform.on('radio(rdo_lineTranType)', function (data) {
                    $("#rdo_lineTranType_verify").val(data.value);
                });
               layuiform.on('radio(rdo_nodeStep)', function (data) {
                    $("#rdo_nodeStep_verify").val(data.value);
                });



				if(type=="node")
                {
                    ttile="节点信息设置";
                    $("#txt_nodeId").val(id);
                    $("#txt_nodeName").val(othis.name);
                }
                if(type=="line")
                {
                    ttile="流转动作信息设置";
                    $("#hf_lineId").val(id);
                    $("#hf_lineName").val(othis.name);

                }

                layer.open({
                    type: 1
                    , area: '650px'
                    , title: ttile
                    , offset: 'auto'
                    , id: 'flowNodeEditWin0' //防止重复弹出
                    , content: divdom
                    , btn: ['确定','关闭']
                    , btnAlign: 'r' //按钮居中
                    //, shade: 0 //不显示遮罩
                    , success:function (layero,index) {
                        //默认添加一条线记录
                        if(type=="line"){
                            var lineDataJson =window.parent.window.formDataOp.flowDesignLineGet(id);
                            if(lineDataJson!=undefined && lineDataJson!=null) {
                                formDataDesign.lineData = lineDataJson;
                            } else {
                                formDataDesign.lineData = { lineId: "", lineName: "",from: "", to: "", trans: [] };
                            }
                            table.reload('tableFlowLineDet', {
                                data: formDataDesign.lineData.trans
                            });
                            //layuiform.render('radio','rdo_lineTranType');
                        }
                        if(type=="node") {
                            var nodeDataJson = window.parent.window.formDataOp.flowDesignNodeGet(id);
                            if (nodeDataJson!=undefined && nodeDataJson != null) {
                                formDataDesign.nodeData = nodeDataJson;
                                $("#txt_nodeId").val(formDataDesign.nodeData.baseInfo.nodeId);
                                $("#txt_nodeName").val(formDataDesign.nodeData.baseInfo.nodeName);
                                $("input[name='rdo_nodeStep'][value = '" + formDataDesign.nodeData.baseInfo.nodeStep+"'").prop('checked', true);
                                $("#rdo_nodeStep_verify").val(formDataDesign.nodeData.baseInfo.nodeStep);
                                //layuiform.render('radio','rdo_nodeStep');
                            } else {
                                formDataDesign.nodeData = { baseInfo: { nodeId: "", nodeName: "", nodeStep: "", nodeType: ""}, approveInfo: [], formInfo: [] };
                            }

                            if(formDataDesign.nodeData.approveInfo.length===0) {
                                table.reload('tableFlowNodePermission', {
                                    data: []
                                });
                            } else {
                                table.reload('tableFlowNodePermission', {
                                    data: formDataDesign.nodeData.approveInfo
                                });
                            }

                            if(formDataDesign.nodeData.formInfo.length===0) {
                                table.reload('tableFlowNodeForm', {
                                    data: []
                                });
                            } else {
                                table.reload('tableFlowNodeForm', {
                                    data: formDataDesign.nodeData.formInfo
                                });
                            }
                        }
                        layero.addClass("layui-form");
                        layero.find(".layui-layer-btn0").attr('lay-filter','saveDesignData').attr('lay-submit','');//将按钮弄成提交
                        layuiform.render();
                    }
                    , yes: function (index,layero) {
                        //临时保存单个节点的数据,并且更新flowChart

                        layuiform.on('submit(saveDesignData)',function (data) {
                            if(type=="node") {

                                var nodeId = $("#txt_nodeId").val();
                                var nodeName = $("#txt_nodeName").val();
                                var rdoObj = $('input:radio[name="rdo_nodeStep"]:checked');
                                var nodeStep = (rdoObj.length == 0) ? "" : rdoObj.val();


                                if (nodeId != "" && nodeName != "" && nodeStep != "") {
                                    //更新本窗口对象
                                    formDataDesign.nodeData.baseInfo = {
                                        nodeId: nodeId,
                                        nodeName: nodeName,
                                        nodeStep: nodeStep,
                                        nodeType:othis.type
                                    };
                                    //更新父窗口对象
                                    window.parent.window.formDataOp.flowDesignNodeAdd(formDataDesign.nodeData);
                                    //更新流程设计图对象
                                    demo.setName(nodeId, nodeName, type);
                                    //表单清空
                                    formDataDesign.nodeData = { baseInfo: { nodeId: "", nodeName: "", nodeStep: "", nodeType: ""}, approveInfo: [], formInfo: [] };
                                    table.reload('tableFlowNodeForm', {
                                        data: []
                                    });
                                    form.empty(type);
                                    divdom.hide();
                                    layer.close(index);
                                }
                            }
                            if(type=="line"){
                                var data = table.cache["tableFlowLineDet"];
                                if(data!=null && data.length>0) {


                                    //更新本窗口对象
                                    formDataDesign.lineData.lineId = $("#hf_lineId").val();
                                    formDataDesign.lineData.lineName = $("#hf_lineName").val();
                                    formDataDesign.lineData.from = demo.$lineData[$("#hf_lineId").val()].from;
                                    formDataDesign.lineData.to = demo.$lineData[$("#hf_lineId").val()].to;

                                    //更新父窗口对象
                                    window.parent.window.formDataOp.flowDesignLineAdd(formDataDesign.lineData);
                                    //更新流程设计图对象
                                    var linenames = "";
                                    $.each(formDataDesign.lineData.trans, function (i, o) {
                                        linenames += o.tranId + ":" + o.tranName+"  ";
                                    });
                                    demo.setName($("#hf_lineId").val(), linenames, type);

                                    //
                                    formDataDesign.lineData = { lineId: "", lineName: "",from: "", to: "", trans: [] };
                                    table.reload('tableFlowLineDet', {
                                        data: []
                                    });
                                    form.empty(type);
                                    $("#hf_lineId").val("");
                                    $("#hf_lineName").val("");
                                    divdom.hide();
                                    layer.close(index);
                                } else {
                                    layer.alert("至少需要一个流转条件",{title:"提示"});
                                    return false;
                                }
                            }
                            return false;
                        });

                    }
                    ,btn2: function(index, layero){
                        divdom.hide();
                        layer.close(index);
                	}
                });
                divdom.show();
            });
        },
        editNodeTab:function(){
            layui.use('element', function(){
                var element = layui.element;
                //一些事件监听
                element.on('tab(docDemoTabBrief)', function(data){
                    console.log(data);
                });
            });
		}
    },
    permissionInit:function () {
        layui.use(['layer', 'form', 'table'], function () {
            var $ = layui.jquery, layer = layui.layer;
            //var form = layui.form;
            var table = layui.table;
            //初始化权限化表格
            table.render({
                elem: '#tableFlowNodePermission'
                , height: 260
                //,url:'/demo/table/user/'
                //, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                , cols: [[
                    //{rownumbers: true, fixed: true, align: 'center', width: 20}
                    { type: 'checkbox'}
                    , {field: 'type', width: 60, title: '类型'
                        , templet: function(d){
                            if(d.type=='role') {
                                return '<span>角色</span>'
                            }else if(d.type=='person') {
                                return '<span>人员</span>'
                            } else {
                                return d.type;
                            }
                        } }
                    , {field: 'code', width: 100, title: '编码'}
                    , {field: 'name', width: 160, title: '名称'}
                    , {field: 'remarks',  width: 220, title: '备注'}
                ]]
                , data: []
            });

            //初始化按钮事件
            var activePermission = {
                addItems: function (othis) {
                    var vType = othis.data('type'), text = othis.data('text');
                    $('#hd_permissiontype').val(vType);
                    layer.open({
                        type: 1
                        , area: '680px'
                        , title: text
                        , offset: "30px" //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                        , id: 'modFlowNodePermissionEdit' + vType //防止重复弹出
                        , content: $('#modFlowNodePermissionEdit')
                        , btn: ['确定','关闭']
                        , btnAlign: 'r' //按钮居中
                        //, shade: 0 //不显示遮罩
                        , yes: function(index, layero) {
                                //formData.flowDesign.nodeConfigData.approveInfo
                                //获取选中数据
                                var checkStatus = table.checkStatus('tableFlowNodePermissionEdit'),
                                    data = checkStatus.data;
                                if (data != null && data.length > 0) {                            //alert(JSON.stringify(data));
                                    //执行重载
                                    var oldData = table.cache["tableFlowNodePermission"];
                                    $.each(data, function (index, obj) {
                                        var flag = false;
                                        $.each(oldData, function (i, o) {
                                            if (obj.type == o.type && obj.code == o.code) {
                                                flag = true;
                                                return false;
                                            }
                                        });
                                        if (flag == false) formDataDesign.nodeData.approveInfo.push(obj)
                                    });
                                    //formData.flowPermission.pmsData = $.unique(formData.flowPermission.pmsData);
                                    table.reload('tableFlowNodePermission', {
                                        data: formDataDesign.nodeData.approveInfo
                                    });
                                }
                                $('#hd_permissiontype').val('');
                                $('#txt_flowperssion_codeorname').val('');
                                $('#modFlowNodePermissionEdit').hide();
                                layer.close(index);
                        }
                        ,btn2: function(index, layero){
                            $('#hd_permissiontype').val('');
                            $('#modFlowNodePermissionEdit').hide();
                            layer.close(index);
                        }
                    });
                    //加载角色或人员表格
                    table.render({
                        elem: '#tableFlowNodePermissionEdit'
                        , width: 680
                        , height: 350
                        , loading: true
                        //,method:"post"
                        , url: infraServiceRoot + '/WorkFlowService/QueryRoleOrPersonList'
                        //, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        , cols: [[
                            {type: 'checkbox'}
                            , {field: 'code', width: 100, title: '编码'}
                            , {field: 'name', width: 160, title: '名称'}
                            , {field: 'remarks', width: 220,title: '备注'}
                        ]]
                        //, data: FlowPermissionData
                        , page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            , curr: 1 //设定初始在第 5 页
                            , groups: 3 //只显示 1 个连续页码
                            //, first: "|<" //不显示首页
                            //, last: ">|" //不显示尾页

                        },
                        where: { type: vType, code: '' }
                    });
                },
                queryItems: function () {
                    var vType = $('#hd_permissiontype').val();
                    var vCode = $('#txt_flowperssion_codeorname').val();

                    //执行重载
                    table.reload('tableFlowNodePermissionEdit', {
                        page: {
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            , curr: 1 //设定初始在第 5 页
                            , groups: 3 //只显示 1 个连续页码
                        }
                        , where: {
                            type: vType,
                            code: vCode
                        }
                    });
                },
                removeItems:function () {
                    var checkStatus = table.checkStatus('tableFlowNodePermission') ,data = checkStatus.data;
                    if(data!=null && data.length>0) {
                        //执行重载
                        var oldData = table.cache["tableFlowNodePermission"];
                        formDataDesign.nodeData.approveInfo = [];
                        $.each(oldData, function (index, obj) {
                            var flag = false;
                            $.each(data, function (i, o) {
                                if (obj.type == o.type && obj.code == o.code) {
                                    flag = true;
                                    return false;
                                }
                            });
                            if (flag == false) formDataDesign.nodeData.approveInfo.push(obj)
                        });
                        table.reload('tableFlowNodePermission', {
                            data: formDataDesign.nodeData.approveInfo
                        });
                    }
                }
            };
            $('#flowNodePermissionBtn .layui-btn').on('click', function () {
                var othis = $(this), method = othis.data('method');
                activePermission[method] ? activePermission[method].call(this, othis) : '';
            });
            $('#btn_flowperssion_query').on('click', function () {
                activePermission.queryItems();
            });
        });
    },
    formInit:function () {
        layui.use(['layer', 'form', 'table'], function () {
            var $ = layui.jquery, layer = layui.layer;
            //var form = layui.form;
            var table = layui.table;
            //初始化权限化表格
            table.render({
                elem: '#tableFlowNodeForm'
                , height: 260
                //,url:'/demo/table/user/'
                //, cellMinWidth: 80
                , cols: [[
                    //{ rownumbers: true, fixed: true, align: 'center', width: 20}
                    { type: 'checkbox',fixed: 'left'}
                    , {field: 'type', width: 100, title: '类别'}
                    , {field: 'code', width: 100, title: '编码'}
                    , {field: 'name', width: 160, title: '名称'}
                    , {field: 'url', width: 80, title: '地址'}
                    , {field: 'remarks', width: 200, title: '备注'}
                ]]
                , data: []
               /* , done: function(res, curr, count){
                    $('#tableFlowNodeForm').find('.layui-table-body').find("table" ).find("tbody").children("tr").on('click',function(){
                        var id = JSON.stringify($('#tableFlowNodeForm').find('.layui-table-body').find("table" ).find("tbody").find(".layui-table-hover").data('index'));
                        var obj = res.data[id];
                        fun.openLayer(obj);
                    })
                }*/
            });

            //初始化按钮事件
            var activeForm = {
                addItems: function (othis) {
                    var vType = othis.data('type'), text = othis.data('text');
                    $('#hd_permissiontype').val(vType);
                    layer.open({
                        type: 1
                        , area: '680px'
                        , title: text
                        , offset: "30px"
                        , id: 'modFlowNodePermission' + vType //防止重复弹出
                        , content: $('#modFlowNodePermissionEdit')
                        , btn: ['确定','关闭']
                        , btnAlign: 'r' //按钮居中
                        //, shade: 0 //不显示遮罩
                        , yes: function(index, layero){
                            //获取选中数据
                            var checkStatus = table.checkStatus('tableFlowNodePermissionEdit') ,data = checkStatus.data;
                            if(data!=null && data.length>0) {                            //alert(JSON.stringify(data));
                                //执行重载
                                var oldData = table.cache["tableFlowNodeForm"];
                                $.each(data, function (index, obj) {
                                    var flag = false;
                                    $.each(oldData, function (i, o) {
                                        if (obj.type == o.type && obj.code == o.code) {
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if (flag == false) formDataDesign.nodeData.formInfo.push(obj)
                                });
                                //formData.flowPermission.pmsData = $.unique(formData.flowPermission.pmsData);
                                table.reload('tableFlowNodeForm', {
                                    data: formDataDesign.nodeData.formInfo
                                });
                            }
                            $('#hd_permissiontype').val('');
                            $('#txt_flowperssion_codeorname').val('');
                            $('#modFlowNodePermissionEdit').hide();
                            layer.close(index);
                        }
                        ,btn2: function(index, layero){
                            $('#hd_permissiontype').val('');
                            $('#modFlowNodePermissionEdit').hide();
                            layer.close(index);
                        }
                    });
                    //加载表格
                    table.render({
                        elem: '#tableFlowNodePermissionEdit'
                        , width: 680
                        , height: 350
                        , loading: true
                        //,method:"post"
                        , url: workflowServiceRoot + '/FormSet/QueryFormList'
                        //, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        , cols: [[
                            {type: 'checkbox',fixed: 'left'}
                            //, {field: 'type', width: 100, title: '类型'}
                            , {field: 'type', width: 100, title: '类别'}
                            , {field: 'code', width: 100, title: '编码'}
                            , {field: 'name', width: 200, title: '名称'}
                            , {field: 'url', width: 100, title: '地址'}
                            , {field: 'remarks', width: 200, title: '备注'}
                        ]]
                        //, data: FlowPermissionData
                        , page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            , curr: 1 //设定初始在第 5 页
                            , groups: 3 //只显示 1 个连续页码
                            //, first: "|<" //不显示首页
                            //, last: ">|" //不显示尾页

                        },
                        where: {type: vType, code: ''}
                    });
                },
                queryItems: function () {
                    var vType = $('#hd_permissiontype').val();
                    var vCode = $('#txt_flowperssion_codeorname').val();

                    //执行重载
                    table.reload('tableFlowNodePermissionEdit', {
                        page: {
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            , curr: 1 //设定初始在第 5 页
                            , groups: 3 //只显示 1 个连续页码
                        }
                        , where: {
                            type: vType,
                            code: vCode
                        }
                    });
                },
                removeItems:function () {
                    var checkStatus = table.checkStatus('tableFlowNodeForm') ,data = checkStatus.data;
                    if(data!=null && data.length>0) {
                        //执行重载
                        var oldData = table.cache["tableFlowNodeForm"];
                        formDataDesign.nodeData.formInfo = [];
                        $.each(oldData, function (index, obj) {
                            var flag = false;
                            $.each(data, function (i, o) {
                                if (obj.type == o.type && obj.code == o.code) {
                                    flag = true;
                                    return false;
                                }
                            });
                            if (flag == false) formDataDesign.nodeData.formInfo.push(obj)
                        });
                        table.reload('tableFlowNodeForm', {
                            data: formDataDesign.nodeData.formInfo
                        });
                    }
                }
            };
            $('#flowNodeFormBtn .layui-btn').on('click', function () {
                var othis = $(this), method = othis.data('method');
                activeForm[method] ? activeForm[method].call(this, othis) : '';
            });
            /*$('#btn_flowperssion_query').on('click', function () {
                activeForm.queryItems();
            });*/
        });
    },
    lineOpInit:function () {
        layui.use(['layer', 'form', 'table'], function () {
            var $ = layui.jquery, layer = layui.layer;
            var layuiform = layui.form;
            var table = layui.table;
            //初始化权限化表格
            table.render({
                elem: '#tableFlowLineDet'
                , height: 260
                //, width:680
                //,url:'/demo/table/user/'
                //, cellMinWidth: 80
                , cols: [[
                    {type: 'checkbox',fixed: 'left'}
                    , {field: 'tranId', width: 80, title: '条件ID'}
                    , {field: 'tranName', width: 160, title: '条件名称'}
                    , {field: 'tranDefeultTime', width: 120, title: '默认限时(m)'}
                    , {field: 'tranActionTypeDesc', width: 140, title: '动作标记'}
                    , {field: 'tranReceiveType', width: 100, title: '接收类型' , templet: function(d){
                            if(d.tranReceiveType=='1') {
                                return '<span>人员</span>'
                            }else if(d.tranReceiveType=='2') {
                                return '<span>部门</span>'
                            }else if(d.tranReceiveType=='3') {
                                return '<span>岗位</span>'
                            }else if(d.tranReceiveType=='4') {
                                return '<span>角色</span>'
                            }else if(d.tranReceiveType=='5') {
                                return '<span>上一次处理人</span>'
                            } else {
                                return d.tranReceiveType;
                            }
                        } }
                    , {field: 'tranReceiveScope', width: 100, title: '接收范围' , templet: function(d){
                            if(d.tranReceiveScope=='0') {
                                return '<span>同级</span>'
                            }else if(d.tranReceiveScope=='1') {
                                return '<span>所有下级</span>'
                            }else if(d.tranReceiveScope=='2') {
                                return '<span>所有上级</span>'
                            }else if(d.tranReceiveScope=='3') {
                                return '<span>下一级</span>'
                            }else if(d.tranReceiveScope=='4') {
                                return '<span>上一级</span>'
                            } else {
                                return d.tranReceiveScope;
                            }
                        } }
                ]]
                , data: []
            });

            //初始化按钮事件
            var activeLine = {
                addItems: function (othis) {
                    layer.open({
                        type: 1
                        , area: '680px'
                        , title: "添加条件"
                        , offset: '30px'
                        , id: 'winFlowLineFrom' //防止重复弹出
                        , content: $('#modFlowLineFrom')
                        , btn: ['确定','关闭']
                        , btnAlign: 'r' //按钮居中
                        //, shade: 0 //不显示遮罩
                        , success:function (layero,index) {

                            //初始化代码编辑器
                            var sc = document.getElementById("script1");
                            var scV = (sc.textContent || sc.innerText || sc.innerHTML).replace(/^\s*/, "");
                            //sc.innerHTML = "";
                            if($('#hf_markcodemoni').val()=="0") {
                                var codeObj = document.getElementById("txt_flowline_param");
                                codeObj.value = scV;
                                window.editor = CodeMirror.fromTextArea(codeObj, {
                                    mode: "javascript",
                                    lineNumbers: true,
                                    lineWrapping: true,
                                    indentUnit : 2,  // 缩进单位，默认2
                                    smartIndent : true,  // 是否智能缩进
                                    tabSize : 4,  // Tab缩进，默认4
                                    extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
                                    foldGutter: true,
                                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                                });
                                $('#hf_markcodemoni').val("1");
                            } else {
                                setTimeout(function () {
                                    window.editor.setValue(scV);
                                },1000);
                            }
                            //var tranId = $("#txt_lineId").val();

                            layuiform.verify({
                                rdo_lineTranType_verify: function(value){
                                    if(value == ''){
                                        return "必填项不允许为空";
                                    }
                                }
                            });


                            layuiform.on('radio(rdo_lineIsAuto)', function (data) {
                                $("#rdo_lineIsAuto_verify").val(data.value);
                            });
                            layuiform.on('radio(rdo_lineIsMessage)', function (data) {
                                $("#rdo_lineIsMessage_verify").val(data.value);
                            });

                            layuiform.on('radio(rdo_lineTranType)', function (data) {
                                $("#rdo_lineTranType_verify").val(data.value);
                            });

                            layero.addClass("layui-form");
                            layero.find(".layui-layer-btn0").attr('lay-filter','saveTran').attr('lay-submit','');//将按钮弄成提交
                            layuiform.render();
                        }
                        , yes: function(index, layero){
                            layuiform.on('submit(saveTran)',function (data) {
                                //临时保存线数据
                                var tranId = $("#txt_lineId").val();
                                var tranName = $("#txt_lineName").val();
                                var tranTrigger= $("#txt_lineTrigger").val();
                                var tranTriggerCss= $(".select-this").eq(0).attr("css");

                                var tranDefeultTime = $("#txt_lineDefeultTime").val();
                                var tranIsAuto = $('input:radio[name="rdo_lineIsAuto"]:checked').val();
                                var tranIsMessage = $('input:radio[name="rdo_lineIsMessage"]:checked').val();
                                var tranActionType = $('input:radio[name="rdo_lineTranType"]:checked').val();

                                var tranActionTypeDesc = $('input:radio[name="rdo_lineTranType"]:checked').attr("title");
                                var tranReceiveType = $("#sel_lineReceiveType").val();
                                var tranReceiveScope = $("#sel_lineReceiveScope").val();
                                var tranParam = window.editor.getValue();//$("#txt_flowline_param").val();
                                //var tranParamSrc = window.editor.getTextArea().value;


                                if (tranId != "" && tranTrigger!="" && tranName != "" && tranDefeultTime != "" && tranActionType != "" && tranReceiveType != "" && tranReceiveScope != "" && tranParam != "") {
                                    //执行重载
                                    var oldData = table.cache["tableFlowLineDet"];
                                    var flag = false;
                                    $.each(oldData, function (i, o) {
                                        if (o.tranId == tranId) {
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if (flag == false) {
                                        formDataDesign.lineData.trans.push({
                                            tranId: tranId,
                                            tranTrigger: tranTrigger,
                                            tranTriggerCss: tranTriggerCss,
                                            tranName: tranName,
                                            tranDefeultTime: tranDefeultTime,
                                            tranIsAuto: tranIsAuto,
                                            tranIsMessage: tranIsMessage,
                                            tranActionType: tranActionType,
                                            tranActionTypeDesc: tranActionTypeDesc,
                                            tranReceiveType: tranReceiveType,
                                            tranReceiveScope: tranReceiveScope,
                                            tranParam: JSON.stringify(eval("(" + tranParam + ")")),
                                            tranParamSrc:tranParam
                                        });
                                        table.reload('tableFlowLineDet', {
                                            data: formDataDesign.lineData.trans
                                        });
                                    }
                                    form.empty("line");
                                    $('#modFlowLineFrom').hide();
                                    layer.close(index);
                                }
                                return false;
                            });
                        }
                        ,btn2: function(index, layero){
                            form.empty("line");
                            $('#modFlowLineFrom').hide();
                            layer.close(index);
                        }
                    });



                },
                editItems:function () {
                    //复制表单
                    var checkStatus = table.checkStatus('tableFlowLineDet') ,data = checkStatus.data;
                    if(data==null || data.length==0 || data.length>1) {
                        layer.alert("请选择单行数据", { title: '提示' });
                        return false;
                    }
                    layer.open({
                        type: 1
                        , area: '680px'
                        , title: "编辑条件"
                        , offset: '30px'
                        , id: 'winFlowLineFrom' //防止重复弹出
                        , content: $('#modFlowLineFrom')
                        , btn: ['确定','关闭']
                        , btnAlign: 'r' //按钮居中
                        //, shade: 0 //不显示遮罩
                        , success:function (layero,index) {

                            //初始化代码编辑器
                            //var sc = document.getElementById("script1");
                            //var scV = (sc.textContent || sc.innerText || sc.innerHTML).replace(/^\s*/, "");
                            //sc.innerHTML = "";
                            if($('#hf_markcodemoni').val()=="0") {

                                var codeObj = document.getElementById("txt_flowline_param");
                                //codeObj.value = scV;
                                window.editor = CodeMirror.fromTextArea(codeObj, {
                                    mode: "javascript",
                                    lineNumbers: true,
                                    lineWrapping: true,
                                    indentUnit : 2,  // 缩进单位，默认2
                                    smartIndent : true,  // 是否智能缩进
                                    tabSize : 4,  // Tab缩进，默认4
                                    extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
                                    foldGutter: true,
                                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                                });
                                $('#hf_markcodemoni').val("1");
                            }

                            layero.addClass("layui-form");
                            layero.find(".layui-layer-btn0").attr('lay-filter','saveTran').attr('lay-submit','');//将按钮弄成提交

                            //赋值
                            $("#txt_lineId").val(data[0].tranId);
                            $("#txt_lineTrigger").val(data[0].tranTrigger);
                            //form.selectTriggerCss(0);
                            $(".select-menu-input").eq(0).val("");//把被点击的选项的值填入输入框中
                            for(var i=0;i<$(".select-menu-ul").children().length;i++){
                                $(".select-menu-ul").children().eq(i).removeClass("select-this");
                            }
                            for(var i=0;i<$(".select-menu-ul").children().length;i++){
                                if($(".select-menu-ul").children().eq(i).attr("css")== data[0].tranTriggerCss){
                                    $(".select-menu-input").eq(0).val($(".select-menu-ul").children().eq(i).html());//把被点击的选项的值填入输入框中
                                    $(".select-menu-ul").children().eq(i).addClass("select-this");
                                    break;
                                }
                            }
                            $(".select-menu-ul").hide();



                            $("#txt_lineName").val(data[0].tranName);
                            $("#txt_lineDefeultTime").val(data[0].tranDefeultTime);

                            $("input[name='rdo_lineIsAuto'][value = '"+ data[0].tranIsAuto+"'").prop("checked",true);
                            $("#rdo_lineIsAuto_verify").val(data[0].tranIsAuto);

                            $("input[name='rdo_lineIsMessage'][value = '"+ data[0].tranIsMessage+"'").prop("checked",true);
                            $("#rdo_lineIsMessage_verify").val(data[0].tranIsMessage);

                            $("input[name='rdo_lineTranType'][value = '"+ data[0].tranActionType+"'").prop("checked",true);
                            $("#rdo_lineTranType_verify").val(data[0].tranActionType);

                            $("#sel_lineReceiveType").val(data[0].tranReceiveType);
                            $("#sel_lineReceiveScope").val(data[0].tranReceiveScope);
                            window.editor.setValue(data[0].tranParamSrc);
                            layuiform.render();
                        }
                        , yes: function (index,layero) {
                            layuiform.on('submit(saveTran)', function (data) {
                                //临时保存线数据
                                var tranId = $("#txt_lineId").val();
                                var tranTrigger = $("#txt_lineTrigger").val();
                                var tranTriggerCss = $(".select-this").eq(0).attr("css")

                                var tranName = $("#txt_lineName").val();
                                var tranDefeultTime = $("#txt_lineDefeultTime").val();
                                var tranIsAuto = $('input:radio[name="rdo_lineIsAuto"]:checked').val();
                                var tranIsMessage = $('input:radio[name="rdo_lineIsMessage"]:checked').val();
                                var tranActionType = $('input:radio[name="rdo_lineTranType"]:checked').val();
                                var tranActionTypeDesc = $('input:radio[name="rdo_lineTranType"]:checked').attr("title");
                                var tranReceiveType = $("#sel_lineReceiveType").val();
                                var tranReceiveScope = $("#sel_lineReceiveScope").val();
                                var tranParam = window.editor.getValue();//$("#txt_flowline_param").val();
                                var tranJson = {
                                    tranId: tranId,
                                    tranTrigger: tranTrigger,
                                    tranTriggerCss: tranTriggerCss,
                                    tranName: tranName,
                                    tranDefeultTime: tranDefeultTime,
                                    tranIsAuto:tranIsAuto,
                                    tranIsMessage:tranIsMessage,
                                    tranActionType: tranActionType,
                                    tranActionTypeDesc: tranActionTypeDesc,
                                    tranReceiveType: tranReceiveType,
                                    tranReceiveScope: tranReceiveScope,
                                    tranParam: JSON.stringify(eval("(" + tranParam + ")")),
                                    tranParamSrc:tranParam
                                };

                                if (tranId != "" && tranTrigger != "" && tranName != "" && tranDefeultTime != "" && tranActionType != "" && tranReceiveType != "" && tranReceiveScope != "" && tranParam != "") {
                                    //执行重载
                                    var oldData = table.cache["tableFlowLineDet"];
                                    var flag = false,idxFlag=0;
                                    $.each(oldData, function (i, o) {
                                        if (o.tranId == tranId) {
                                            flag = true;idxFlag=i;
                                            return false;
                                        }
                                    });
                                    if (flag == false) {
                                        formDataDesign.lineData.trans.push(tranJson);
                                    } else {
                                        formDataDesign.lineData.trans[idxFlag] = tranJson;
                                    }
                                    table.reload('tableFlowLineDet', {
                                        data: formDataDesign.lineData.trans
                                    });
                                    form.empty("line");
                                    $('#modFlowLineFrom').hide();
                                    layer.close(index);
                                }
                                return false;
                            });


                        }
                        ,btn2: function(index, layero){
                            form.empty("line");
                            $('#modFlowLineFrom').hide();
                            layer.close(index);
                        }
                    });
                },
                removeItems:function (){
                    var checkStatus = table.checkStatus('tableFlowLineDet') ,data = checkStatus.data;
                    if(data!=null && data.length>0) {
                        //执行重载
                        var oldData = table.cache["tableFlowLineDet"];
                        formDataDesign.lineData.trans = [];
                        $.each(oldData, function (index, obj) {
                            var flag = false;
                            $.each(data, function (i, o) {
                                if (obj.tranId == o.tranId) {
                                    flag = true;
                                    return false;
                                }
                            });
                            if (flag == false) formDataDesign.lineData.trans.push(obj)
                        });
                        table.reload('tableFlowLineDet', {
                            data: formDataDesign.lineData.trans
                        });
                    }
                }
            };
            $('#flowLineDetBtn .layui-btn').on('click', function () {
                var othis = $(this), method = othis.data('method');
                activeLine[method] ? activeLine[method].call(this, othis) : '';
            });

        });
    },
    empty:function (type) {
        if(type=="node"){
            $("#txt_nodeId").val("");
            $("#txt_nodeName").val("");
            $("input[name='rdo_nodeStep'][value = '000']").prop("checked", true);
            $("#rdo_nodeStep_verify").val("000");

        }
        if(type=="line"){
            //$("#hf_lineId").val("");
            //$("#hf_lineName").val("");
            $("#txt_lineId").val("");
            $("#txt_lineTrigger").val("");
            /*$(".select-menu-input").eq(0).val("");//把被点击的选项的值填入输入框中
            for(var i=0;i<$(".select-menu-ul").children().length;i++){
                $(".select-menu-ul").children().eq(i).removeClass("select-this");
            }
            $(".select-menu-ul").hide();*/
            //form.selectTriggerCss(0);

            $("#txt_lineName").val("");
            $("#txt_lineDefeultTime").val("0");

            $("input[name='rdo_lineIsAuto'][value = '0']").prop("checked", true);
            $("#rdo_lineIsAuto_verify").val("0");

            $("input[name='rdo_lineIsMessage'][value = '0']").prop("checked", true);
            $("#rdo_lineIsMessage_verify").val("0");

            $("input[name='rdo_lineTranType'][value = '000']").prop("checked", true);
            $("#rdo_lineTranType_verify").val("000");

            $("#sel_lineReceiveType").val("");
            $("#sel_lineReceiveScope").val("0");
            $("#txt_flowline_param").val("");
        }
    }
};
//form.selectTriggerCss(0);