// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Title = require("Title");
var GlobalData = require("GlobalData");
var NetUtil = require("NetUtil");
var HeadPortraitsLoad = require("HeadPortraitsLoad");
var ButAnimation = require("ButAnimation");
var Alert = require("Alert");
var CommonConfig = require("CommonConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:{
            default: null,                
            type: cc.Label  
        },
        txSprite:{
            default: null,                
            type: cc.Sprite    
        },  
        synopsisLabel:{
            default: null,                
            type: cc.Label    
        },
        edsxLabel:{
            default: null,                
            type: cc.Label  
        },
        dqedLabel:{
            default: null,                
            type: cc.Label  
        },
        tuBut:{
            default: null,                
            type: cc.Sprite   
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        Title.creation("联盟信息","allianceList");
        this.clubInfo =  GlobalData.getScenesParameter();
        this.allianceInfo = GlobalData.getParameter("alliance"); 
        this.nameLabel.string =  this.allianceInfo.name;
        HeadPortraitsLoad.Load(self.txSprite.node,CommonConfig.getHttpUrl()+self.allianceInfo.headPortraitUrl);
        this.synopsisLabel.string =  this.allianceInfo.synopsis?this.allianceInfo.synopsis:"暂无简介";
        this.edsxLabel.string =  "额度上限:"+this.allianceInfo.maxquota;
        this.dqedLabel.string =  "当前额度:"+this.allianceInfo.currentquota;
        self.tuBut.node.on(cc.Node.EventType.TOUCH_START,function (args) {
            ButAnimation.play(self.tuBut.node,function(){
                Alert.show("确定退出联盟？",function(str){
                    if(str == "确定"){
                        self.quitAlliance();
                    }
                },"确定","取消");
          
            });
        },self); 
    },
    quitAlliance(){
        let self = this;
        NetUtil.pomeloRequest("game.allianceHandler.quitAlliance", {allianceid:self.allianceInfo.allianceId,clubid:self.clubInfo.id},function(data){
            if(data.code!=200){
                if(data.msg){
                    Alert.show(data.msg);
                }
                return ;
            }         
            Alert.show("退出成功！",function(){
                cc.director.loadScene("allianceList");  
            });
        });
    },
    start () {

    },

    // update (dt) {},
});
