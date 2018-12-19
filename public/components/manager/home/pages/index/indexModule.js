define(function(require){
'use strict'
var that;

var io=require('socketIO');
var socket=io('ws://192.168.2.247:8888',{
   transports: ['websocket'],
   path: '/test',
   reconnection : true,
   reconnectionDelay: 2000,
   reconnectionDelayMax : 5000,
   // secure: true
});
socket.on('connect', (socket) => {
  // let token = socket.handshake.query.token;
  console.log('长连接成功')

}).on('message', (socket) => {

  for(let attr in socket)
      console.log(attr,socket[attr])

});

return  {
    template: require('text!home.indexTmpl.html'),
    data:function(){
      return {
        options: [{
           value: '选项1',
           label: '黄金糕'
         }, {
           value: '选项2',
           label: '双皮奶'
         }, {
           value: '选项3',
           label: '蚵仔煎'
         }, {
           value: '选项4',
           label: '龙须面'
         }, {
           value: '选项5',
           label: '北京烤鸭'
         }],
         value: '',
         tableData: [{
           date: '2016-05-02',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1518 弄'
         }, {
           date: '2016-05-04',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1517 弄'
         }, {
           date: '2016-05-01',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1519 弄'
         }, {
           date: '2016-05-03',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1516 弄'
         }]

      }
    },
    created:function(){
        that=this;

    },
    watch:{

    },
    methods:{
        changeTime(){

        },
          goo(){
              that.$router.push({path:'/busi'})
          }
    }
  }


});
