//JavaScript代码区域
var flowid = window.getQueryParam("flowid");//获取
var token = window.getQueryParam("token");
var formData ={
    flowInfo: {flowCode: "", flowName: "", flowType: "", flowRemarks: ""},
    flowPermission: {pmsType: "", pmsData: []},
    flowDesign: {
        designData: ""
        , nodeConfigData: []
        , lineConfigData: []
    }
};

$(document).ready(function(){
    pageSetup.init();
});
var pageSetup = {
            init: function () {
                this.autoSize();
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
                    this.autoSize();
                });
            },
            initControl: function () {
				wizardInit();
                form.init();
            }
};

var wizardInit = function(){
    $('#wizardFlowSetup').wizard({
				templates: {
					buttons: function() {
					  const options = this.options;
					  return '';
					}
				 }
				/*onInit: function() {
				  $('#form1').formValidation({
					framework: 'bootstrap',
					fields: {
					  txt_flowcode: {
						validators: {
						  notEmpty: {
							message: '模版编码不允许为空'
						  }
						}
					  },
					  txs_flowname: {
						validators: {
						  notEmpty: {
							message: '模版名称不允许为空'
						  }
						}
					  },
					  sel_flowtype: {
						validators: {
						  notEmpty: {
							message: '模版分类不允许为空'
						  }
						}
					  }
					}
				  });
				},
				validator: function() {
				  var fv = $('#form1').data('formValidation');
				  var $this = $(this);
				  // Validate the container
				  fv.validateContainer($this);
				  var isValidStep = fv.isValidContainer($this);
				  if (isValidStep === false || isValidStep === null) {
					return false;
				  }
				  return true;
				},
				onFinish: function() {
				  //$('#form1').submit();
				  alert('finish');
				}*/
		});
    $('#btn_prev').on('click', function () {
        $("#wizardFlowSetup").wizard('back');
    });
    $('#btn_next').on('click', function () {
        $("#wizardFlowSetup").wizard('next');
    });

};


//对表单数据进行操作
var formDataOp = {
    flowDesignNodeGet: function (id) {
        var output;
        $.each(formData.flowDesign.nodeConfigData, function (i, o) {
            if (o.baseInfo.nodeId == id) {
                output = formData.flowDesign.nodeConfigData[i];
                return false;
            }
        });
        return output;
    },
    flowDesignLineGet: function (id) {
        var output;
        $.each(formData.flowDesign.lineConfigData, function (i, o) {
            if (o.lineId == id) {
                output = formData.flowDesign.lineConfigData[i];
                return false;
            }
        });
        return output;
    },
    flowDesignNodeAdd: function (obj) {
        var flag = false;
        var index = 0;
        var data = formData.flowDesign.nodeConfigData;
        $.each(data, function (i, o) {
            if (o.baseInfo.nodeId == obj.baseInfo.nodeId) {
                flag = true;
                index = i;
                return false;
            }
        });
        if (!flag) {
            formData.flowDesign.nodeConfigData.push(obj);
        } else {
            formData.flowDesign.nodeConfigData[index] = obj;
        }
        ;
    },
    flowDesignNodeRemove: function (id) {
        var index = 0;
        var flag = false;
        $.each(formData.flowDesign.nodeConfigData, function (i, o) {
            if (o.baseInfo.nodeId == id) {
                index = i;
                flag = true;
                return false;
            }
        });
        if (flag) formData.flowDesign.nodeConfigData.splice(index, 1);
    },
    flowDesignLineAdd: function (obj) {
        var flag = false;
        var index = 0;
        $.each(formData.flowDesign.lineConfigData, function (i, o) {
            if (o.lineId == obj.lineId) {
                flag = true;
                index = i;
                return false;
            }
        });
        if (!flag) {
            formData.flowDesign.lineConfigData.push(obj);
        } else {
            formData.flowDesign.lineConfigData[index] = obj;
        }
        ;
    },
    flowDesignLineRemove: function (id) {
        var index = 0;
        var flag = false;
        $.each(formData.flowDesign.lineConfigData, function (i, o) {
            if (o.lineId == id) {
                index = i;
                flag = true;
                return false;
            }
        });
        if (flag) formData.flowDesign.lineConfigData.splice(index, 1);
    },
    getMaxLineTranId: function () {

        /*$.each(formData.flowDesign.lineConfigData, function (i, o) {
            o.trans();
        });*/
    }
};
var form = {
    init: function () {
        //绑定下拉框
        $.ajax({
            type: 'get',
            dataType: "json",
            contentType: 'application/json',
            url: workflowServiceRoot + '/FlowType/GetAllByQuery',
            async: false,
            data: JSON.stringify({}),
            success: function (response) {
                if (response.success) {
                    var data = response.result;
                    if (data != null) {
                        $("#sel_flowType").html("");
                        $("#sel_flowType").append ("<option value=''>==请选择==</option>");
                        $.each(data, function (i, o) {
                            $("#sel_flowType").append ("<option value='"+o.code+"'>"+o.name+"</option>");
                        });
                    }
                } else {
                    layer.alert("流程类别数据请求失败", { title: '请求失败' });
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
        //修改赋值
        if(flowid!=null){
            $("#txt_flowCode").attr("disabled","disabled");
            $.ajax({
                type: 'get',
                dataType: "json",
                contentType: 'application/json',
                url: workflowServiceRoot + '/FlowInfo/GetFlow?Id='+flowid,
                async: false,
                //data：JSON.stringify({ "Id": flowid }),
                success: function (response) {
                    if (response.success) {
                        var data = response.result;
                        if (data != null) {
                            ;
                            var jsondata = eval("(" + data + ")");
                            formData = jsondata;
                            $("#txt_flowCode").val(formData.flowInfo.flowCode);
                            $("#txt_flowName").val(formData.flowInfo.flowName);
                            $("#sel_flowType").val(formData.flowInfo.flowType);
                            $("#txt_flowRemarks").val(formData.flowInfo.flowRemarks);
                            $("input[name='pmsType'][value = " + formData.flowPermission.pmsType).prop("checked", true);
                            if (formData.flowPermission.pmsType == "assign") {
                                $('#wizard_mark1').hide();
                            } else {
                                $('#wizard_mark1').show();
                            }
                            if(formData.flowInfo.status!=0) $("#btn_draft").hide();
                            //formData.flowDesign.designData = {"title":"newFlow_1","nodes":{"wf_design_node_1":{"name":"开始","left":308,"top":125,"type":"start","width":160,"height":50,"alt":true},"wf_design_node_2":{"name":"结束","left":288,"top":335,"type":"end","width":160,"height":50,"alt":true}},"lines":{},"areas":{},"initNum":3};
                            /*if(formData.flowDesign.designData!=null && formData.flowDesign.designData!="") {
                                setTimeout(function () {
                                    window.frames['flowModeDesign'].demo.loadData(eval("(" + formData.flowDesign.designData + ")"));
                                }, 2000);
                            }*/

                        }
                    } else {
                        layer.alert("数据请求失败", { title: '提示' });
                    }
                },
                error: function (e) {
                    layer.alert("http请求异常", { title: '提示' });
                }
            });
        }
        layui.use(['layer', 'form', 'table'], function () {
            var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句									 
            var form = layui.form;
            var table = layui.table;
            //初始化权限化表格
            var tableflowPermission = table.render({
                elem: '#flowPermissionGrid'
                , height: 670
                //,url:'/demo/table/user/'
                , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                , cols: [[

                    { rownumbers: true, fixed: true, align: 'center', width: 20 }
                    ,{ type: 'checkbox'}
                    //{field:'id', width:80, title: 'ID'}
                    , { field: 'type', width: 80, title: '类型'
                        , templet: function(d){
                            if(d.type=='role') {
                                return '<span>角色</span>'
                            }else if(d.type=='person') {
                                return '<span>人员</span>'
                            } else {
                                return d.type;
                            }
                        } }
                    , { field: 'code', width: 100, title: '编码' }
                    , { field: 'name', width: 200, title: '名称' }
                    , { field: 'remarks', width: 700, title: '备注' }
                ]]
                , data: formData.flowPermission.pmsData
            });

            //初始化权限单选框
            form.on('radio(pmsType)', function (data) {
                //console.log(data.elem); //得到radio原始DOM对象
                //console.log(data.value); //被点击的radio的value值
                //alert(data.elem);
                //console.log(data.elem);
                //alert(data.value);//判断单选框的选中值
                //console.log(data.value);
                //alert(data.othis);
                //layer.tips('开关checked：' + (this.checked ? 'true' : 'false'), data.othis);
                //layer.alert('响应点击事件');
                if (data.value == "assign") {
                    $('#wizard_mark1').hide();
                    formData.flowPermission.pmsType = "assign";
                } else {
                    $('#wizard_mark1').show();
                    formData.flowPermission.pmsType = "all";
                }
            });
            //初始化按钮事件
            var activePermission = {
               /* createPermissionTable:function () {
                    $.ajax({
                        type: 'post',
                        dataType: "json",
                        contentType: 'application/json',
                        url: infraServiceRoot + 'api/services/app/WorkFlow/QueryRoleOrPersonList',
                        async: true,
                        data: JSON.stringify({ "Code": docid, "Page": formcode, "Limit": flowcode }),
                        success: function (response) {
                            if (response.success) {
                                var data = response.result;
                                if (data != null) {
                                    var jsondata = eval("(" + data.flowInfo.flowChartJson + ")");
                                }
                            } else {
                                alert("流程图请求失败");
                            }
                        },
                        error: function (e) {
                            alert("http请求异常");
                        }
                    });
                },*/
                addItems: function (othis) {
                    var vType = othis.data('type'), text = othis.data('text');
                    $('#hd_permissiontype').val(vType);
                    layer.open({
                        type: 1
                        , area: '600px'
                        , title: text
                        ,offset: '30px'
                        , id: 'flowPermissionEditBtn'+vType //防止重复弹出
                        , content: $('#divFlowPermissionEditGrid')
                        , btn: '确定'
                        , btnAlign: 'r' //按钮居中
                        , shade: 0 //不显示遮罩
                        , yes: function () {
                            //获取选中数据
                            var checkStatus = table.checkStatus('flowPermissionEditGrid') ,data = checkStatus.data;
                            if(data!=null && data.length>0) {                            //alert(JSON.stringify(data));
                                //执行重载
                                var oldData = table.cache["flowPermissionGrid"];
                                //$.merge(formData.flowPermission.pmsData,data);
                                $.each(data, function (index, obj) {
                                    var flag = false;
                                    $.each(oldData, function (i, o) {
                                        if (obj.type == o.type && obj.code == o.code) {
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if (flag == false) formData.flowPermission.pmsData.push(obj)
                                });
                                //formData.flowPermission.pmsData = $.unique(formData.flowPermission.pmsData);
                                table.reload('flowPermissionGrid', {
                                    data: formData.flowPermission.pmsData
                                });
                            }
                            $('#txt_flowperssion_codeorname').val('');
                            $('#hd_permissiontype').val('');
                            $('#divFlowPermissionEditGrid').hide();
                            layer.closeAll();
                        }
                    });
                    //加载角色或人员表格
                    table.render({
                        //id:'permissionTable'
                         elem: '#flowPermissionEditGrid'
                        , width: 600
                        , height: 350
                        ,loading:true
                        //,method:"post"
                        , url: infraServiceRoot + '/WorkFlowService/QueryRoleOrPersonList'
                        //, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        , cols: [[
                            { type: 'checkbox'}
                            , { field: 'code', width: 100, title: '编码' }
                            , { field: 'name', width: 180, title: '名称' }
                            , { field: 'remarks', width: 230, title: '备注' }
                        ]]
                        //, data: FlowPermissionData
                        , page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            ,curr: 1 //设定初始在第 5 页
                            ,groups: 3 //只显示 1 个连续页码
                            //, first: "|<" //不显示首页
                            //, last: ">|" //不显示尾页

                        },
                        where: {  type:vType, code: '' }
                    });
                    //$('#divFlowPermissionEditGrid').show();
                    //event.stopImmediatePropagation();
                    return false;
                },
                queryItems:function () {
                    var vType = $('#hd_permissiontype').val();
                    var vCode = $('#txt_flowperssion_codeorname').val();

                    //执行重载
                    table.reload('flowPermissionEditGrid', {
                        page: {
                            layout: ['limit', 'count', 'prev', 'page', 'next'] //自定义分页布局
                            ,curr: 1 //设定初始在第 5 页
                            ,groups: 3 //只显示 1 个连续页码
                        }
                        , where: { type:vType, code: vCode }
                    });
                },
                removeItems :function () {
                    var checkStatus = table.checkStatus('flowPermissionGrid') ,data = checkStatus.data;
                    if(data!=null && data.length>0) {
                        //执行重载
                        var oldData = table.cache["flowPermissionGrid"];
                        formData.flowPermission.pmsData = [];
                        $.each(oldData, function (index, obj) {
                            var flag = false;
                            $.each(data, function (i, o) {
                                if (obj.type == o.type && obj.code == o.code) {
                                    flag = true;
                                    return false;
                                }
                            });
                            if (flag == false) formData.flowPermission.pmsData.push(obj)
                        });
                        table.reload('flowPermissionGrid', {
                            data: formData.flowPermission.pmsData
                        });
                    }
                }
            };

            $('#flowPermissionEditBtn .layui-btn').on('click', function () {
                var othis = $(this), method = othis.data('method');
                activePermission[method] ? activePermission[method].call(this,othis) : '';
            });
            $('#btn_flowperssion_query').on('click', function () {
                activePermission.queryItems();
            });

            //form.verify({});
            //监听提交
            form.on('submit(noteaction)', function(data){
                formData.flowInfo.flowCode = data.field.txt_flowCode;
                formData.flowInfo.flowName = data.field.txt_flowName;
                formData.flowInfo.flowType = data.field.sel_flowType;
                formData.flowInfo.flowRemarks = data.field.txt_flowRemarks;
                formData.flowPermission.pmsType = data.field.pmsType;
                formData.flowDesign.designData = JSON.stringify(window.frames['flowModeDesign'].demo.exportData());
                //formData.flowPermission.pmsData = [];
                var strFormData = JSON.stringify(formData);
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    contentType: 'application/json',
                    url: workflowServiceRoot + '/FlowInfo/NoteFlow',
                    async: true,
                    data: JSON.stringify({  id:flowid, "FlowSetupJson": strFormData, "FlowSetup": formData }),
                    success: function (response) {
                        if (response.success) {
                            layer.alert("保存草稿成功", { title: '提示',icon: 6 });
                            /*var data = response.result;
                            if (data != null) {
                                var jsondata = eval("(" + data.flowInfo.flowChartJson + ")");
                            }*/
                        } else {
                            layer.alert("保存草稿失败", { title: '提示' });
                        }
                    },
                    error: function (e) {
                        if(e.responseJSON.error!=null) {
                            layer.alert(e.responseJSON.error.details, {title: '提示'});
                        } else {
                            layer.alert("Http请求异常", {title: '提示'});
                        }
                    }
                });
                return false;
            });
            //监听提交
            form.on('submit(saveaction)', function(data){
                formData.flowInfo.flowCode = data.field.txt_flowCode;
                formData.flowInfo.flowName = data.field.txt_flowName;
                formData.flowInfo.flowType = data.field.sel_flowType;
                formData.flowInfo.flowRemarks = data.field.txt_flowRemarks;
                formData.flowPermission.pmsType = data.field.pmsType;
                formData.flowDesign.designData = JSON.stringify(window.frames['flowModeDesign'].demo.exportData());
                //formData.flowPermission.pmsData = [];
                var strFormData = JSON.stringify(formData);
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    contentType: 'application/json',
                    url: workflowServiceRoot + '/FlowInfo/SaveFlow',
                    async: true,
                    data: JSON.stringify({ id:flowid, "FlowSetupJson": strFormData, "FlowSetup": formData }),
                    success: function (response) {
                        if (response.success) {
                            /*var data = response.result;
                            if (data != null) {
                                var jsondata = eval("(" + data.flowInfo.flowChartJson + ")");
                            }*/
                            layer.alert("保存成功", { title: '提示',icon: 6 });
                        } else {
                            layer.alert("保存失败", { title: '请求失败' });
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
                return false;
            });
        });
    },
    saveAction:function () {

    },
    noteAction:function () {
        //自定义验证规则
/*        form.verify({
            title: function(value){
                if(value.length < 5){
                    return '标题至少得5个字符啊';
                }
            }
            ,pass: [/(.+){6,12}$/, '密码必须6到12位']
            ,content: function(value){
                layedit.sync(editIndex);
            }
        });*/


        //表单初始赋值
        /*form.val('example', {
            "username": "贤心" // "name": "value"
            ,"password": "123456"
            ,"interest": 1
            ,"like[write]": true //复选框选中状态
            ,"close": true //开关状态
            ,"sex": "女"
            ,"desc": "我爱 layui"
        })*/
    }
};
/*
layui.use('element', function () {
	var element = layui.element;
});
*/

