// JavaScript Document
var property={
	width:1200,
	height:747,
	//toolBtns:["begnode","endnode","user","supervisor","community","street","region","citycenter","dept","checkin","checkout","finalcase"],
	toolBtns:["start","end","supervisor","community","street","region","citycenter","dept","checkin","checkout","finalcase"],
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
var demo;
$(document).ready(function(){
	demo=$.createGooFlow($("#wf_design"),property);
	demo.setNodeRemarks(remark);
	//demo.onItemDel=function(id,type){
	//	return confirm("确定要删除该单元吗?");
	//}
	//demo.loadData(jsondata);
});

/*
var message;
	layui.config({
		base: '${path}/static/plugins/BeginnerAdmin/build/js/'
	}).use(['app', 'message'], function() {
		var app = layui.app,
			$ = layui.jquery,
			layer = layui.layer;
		//将message设置为全局以便子页面调用
		message = layui.message;
		//主入口
		app.set({
			type: 'iframe'
		}).init();
		$('#pay').on('click', function() {
			layer.open({
				title: false,
				type: 1,
				content: '<img src="/static/plugins/BeginnerAdmin/build/images/pay.png" />',
				area: ['500px', '250px'],
				shadeClose: true
			});
		});
	});
*/
	
	/* $('#logout').click(function (event) {
		event.preventDefault();
		$.ajax({
			type: "POST",
			contentType: "application/json",
			dataType: "json",
			url: '${path}/main/loginout',
			//data: JSON.stringify({ rkey:null, username:'test', password:'1', name:'测试',roles:[] }),
			success: function (response) {
				
			},
			error: function(data) {
				alert("网络错误");
			}
		});
	}); */