<template>
  <div class="init">
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import util from '../base/util';
import api from '../base/api';
/*
* 初始化数据模块
**/
export default {
  name: 'init',

  data (){
    return {
      shopSid:0,
    }
  },
  created(){
    this.shopSid=util.getUrlParam('shop_sid');
    if(this.shopSid){
      this.init();
    }else{
      this.$vux.toast.show({
       text: '没有对应的店铺号',
       type: 'warn'
     });

    }

  },methods:{
    init(){
      util.getWxUserInfoByHide(null,'&shop_sid='+this.shopSid ,(data)=>{
        this.$http.post(api.centreQr.replace('{shop_sid}',this.shopSid).replace('{open_id}',data.openId),{
          parameter: util.getUrlParam('parameter'),
          user_key: util.getUrlParam('user_key')
        }).then((res)=>{
              console.log(res)
              if(200==res.data.status){
                      this.$vux.alert.show({
                        title: '扫描成功',
                        content: '请在电脑或者APP上查看',
                        onShow () {

                        },
                        onHide: ()=> {
                          //关闭页面
                          this.$wechat.closeWindow()
                        }
                      });

              }
        })

      });
    }
  }
}
</script>

<style lang="less" scoped>
@import '../base/base';

.init {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-align: center;
}

</style>
