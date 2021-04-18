<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card>
            <div class="grid-content">
              <div>
                <div class="grid-num">{{consumerCount}}</div>
                <div >用户总数</div>
              </div>
            </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <div class="grid-content">
              <div>
                <div class="grid-num">{{songCount}}</div>
                <div >歌曲总数</div>
              </div>
            </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <div class="grid-content">
              <div>
                <div class="grid-num">{{singerCount}}</div>
                <div >歌手数量</div>
              </div>
            </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <div class="grid-content">
              <div>
                <div class="grid-num">{{songListCount}}</div>
                <div >歌单数量</div>
              </div>
            </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <el-card>
            <h3>用户性别比例</h3>
            <div style="background-color:white">
              <ve-pie :data="consumerSex" :theme="options"></ve-pie>
            </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
            <h3>歌曲类型分布</h3>
            <div style="background-color:white">
              <ve-histogram :data="songStyle" :extend="chartExtend"></ve-histogram>
              <!-- {{songStyle}} -->
            </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <el-card>
            <h3>歌手性别比例</h3>
            <div style="background-color:white">
              <ve-pie :data="singerSex" ></ve-pie>
            </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
            <h3>歌手地区分布</h3>
            <div style="background-color:white">
              <ve-histogram :data="country" :theme="options1" :extend="chartExtend"></ve-histogram>
            </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {getAllConsumer,getAllSong,getAllSinger,getAllSongList} from "../api/index";

export default {
  data(){
    return {
      chartExtend: {
      // x轴字体斜显示
	      xAxis: {
		      axisLabel: {
			      interval: 0, 
			      // rotate: 90, // 旋转的度数
            formatter: function(value) {
              let result = ""; //拼接加\n返回的类目项
              let maxLength = 1; //每项显示文字个数
              let valLength = value.length; //X轴类目项的文字个数
              let rowNumber = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowNumber > 1) {
                //如果文字大于3,
                for (let i = 0; i < rowNumber; i++) {
                  let temp = ""; //每次截取的字符串
                  let start = i * maxLength; //开始截取的位置
                  let end = start + maxLength; //结束截取的位置
                  temp = value.substring(start, end) + "\n";
                  result += temp; //拼接生成最终的字符串
                }
                return result
              } else {
                return value
              }
            }
          }
        }
      },
      consumerCount: 0,   //用户总数
      songCount: 0,       //歌曲总数
      singerCount: 0,     //歌手数量
      songListCount: 0,    //歌单数量
      consumer: [],       //所有用户
      singer: [],         //所有歌手
      consumerSex: {
        columns: ['性别','总数'],
        rows:[
          {'性别':'女','总数':'0'},
          {'性别':'男','总数':'0'},
          
        ]
      },
      options:{
        color:['#87cefa','#ffc0cb']
      },
      options1:{
        color:['yellow']
      },
      songStyle: {
        columns: ['风格','总数'],
        rows:[
          {'风格':'轻音乐','总数':'0'},
        ]
      },
      singerSex: {
        columns: ['性别','总数'],
        rows:[
          {'性别':'女','总数':'0'},
          {'性别':'男','总数':'0'},
          {'性别':'组合','总数':'0'},
          {'性别':'不明','总数':'0'},
        ]
      },
      country: {
        columns: ['国籍','总数'],
        rows:[
          {'国籍':'中国','总数':'0'},
        ]
      },
    }
  },
  created(){
  },
  mounted(){
    this.getConsumer();
    this.getSong();
    this.getSinger();
    this.getSongList();
  },
  methods:{
    //查询用户总数
    getConsumer(){
      getAllConsumer().then(res =>{
        this.consumer = res;
        this.consumerCount = res.length;
        this.consumerSex.rows[0]['总数'] = this.setSex(0,this.consumer);
        this.consumerSex.rows[1]['总数'] = this.setSex(1,this.consumer);
      })
    },
    //根据性别获取用户数
    setSex(sex,val){   
      let count = 0;
      for(let item of val){
        if(sex == item.sex){count++;}
      }
      return count;
    },
    //查询歌曲总数
    getSong(){
      getAllSong().then(res => {
        this.songCount = res.length;
      })
    },
    //查询歌手数量
    getSinger(){
      getAllSinger().then(res => {
        this.singerCount = res.length;
        this.singerSex.rows[0]['总数'] = this.setSex(0,res);
        this.singerSex.rows[1]['总数'] = this.setSex(1,res);
        this.singerSex.rows[2]['总数'] = this.setSex(2,res);
        this.singerSex.rows[3]['总数'] = this.setSex(3,res);
        for(let item of res){
          if(this.getByCountry(item.location)){
            this.country.rows.push({'国籍':item.location,'总数':'1'});
          }
        }
      })
    },
    
    //查询歌单数量
    getSongList(){
      getAllSongList().then(res => {
        this.songListCount = res.length;
        for(let item of res){
          if(this.getByStyle(item.style)){
            this.songStyle.rows.push({'风格':item.style,'总数':'1'});
          }
        }
      })
    },

    //根据歌曲风格获取数量
    getByStyle(style){
      for (let item of this.songStyle.rows) {
        console.log(item['风格']);
        if(item['风格'].includes(style)){
          item['总数']++;
          return false
        }
      }
      return true
    },
    //根据歌手地区统计数量
    getByCountry(country){
      for (let item of this.country.rows) {
        if(item['国籍'].includes(country)){
          item['总数']++;
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
.grid-content {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: darkgray;
  text-align: center;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}
</style>