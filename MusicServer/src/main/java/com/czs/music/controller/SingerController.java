package com.czs.music.controller;

import com.alibaba.fastjson.JSONObject;
import com.czs.music.domain.Singer;
import com.czs.music.service.SingerService;
import com.czs.music.utils.Consts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * 歌手控制类
 */

@RestController
@RequestMapping("/singer")
public class SingerController {

    @Autowired
    private SingerService singerService;

    /**
     * 添加歌手
     */
    @RequestMapping(value = "/add",method = RequestMethod.POST)
    public  Object addSinger(HttpServletRequest request){
        JSONObject jsonObject = new JSONObject();
        String name = request.getParameter("name").trim();  //姓名
        String sex = request.getParameter("sex").trim();    //性别
        String picture = request.getParameter("picture").trim();    //头像
        String birth = request.getParameter("birth").trim();    //生日
        String location = request.getParameter("location").trim();  //地区
        String introduction = request.getParameter("introduction").trim();  //简介
        //把生日转化成Date格式
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date brithDate = new Date();
        try {
            brithDate = dateFormat.parse(birth);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //保存到歌手对象中
        Singer singer = new Singer();
        singer.setName(name);
        singer.setSex(new Byte(sex));
        singer.setPicture(picture);
        singer.setBirth(brithDate);
        singer.setLocation(location);
        singer.setIntroduction(introduction);
        boolean flag = singerService.insert(singer);
        if (flag) {
            jsonObject.put(Consts.CODE,1);
            jsonObject.put(Consts.MSG,"添加成功");
            return jsonObject;
        }
        jsonObject.put(Consts.CODE,0);
        jsonObject.put(Consts.MSG,"添加失败");
        return jsonObject;
    }

    /**
     * 修改歌手
     */
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    public  Object updateSinger(HttpServletRequest request){
        JSONObject jsonObject = new JSONObject();
        String id = request.getParameter("id").trim();  //主键
        String name = request.getParameter("name").trim();  //姓名
        String sex = request.getParameter("sex").trim();    //性别
        String picture = request.getParameter("picture").trim();    //头像
        String birth = request.getParameter("birth").trim();    //生日
        String location = request.getParameter("location").trim();  //地区
        String introduction = request.getParameter("introduction").trim();  //简介
        //把生日转化成Date格式
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date brithDate = new Date();
        try {
            brithDate = dateFormat.parse(birth);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //保存到歌手对象中
        Singer singer = new Singer();
        singer.setId(Integer.parseInt(id));
        singer.setName(name);
        singer.setSex(new Byte(sex));
        singer.setPicture(picture);
        singer.setBirth(brithDate);
        singer.setLocation(location);
        singer.setIntroduction(introduction);
        boolean flag = singerService.update(singer);
        if (flag) {
            jsonObject.put(Consts.CODE,1);
            jsonObject.put(Consts.MSG,"修改成功");
            return jsonObject;
        }
        jsonObject.put(Consts.CODE,0);
        jsonObject.put(Consts.MSG,"修改失败");
        return jsonObject;
    }

    /**
     * 删除歌手
     */
    @RequestMapping(value = "/delete",method = RequestMethod.GET)
    public Object deleteSinger(HttpServletRequest request){
        String id = request.getParameter("id").trim();  //主键
        boolean flag = singerService.delete(Integer.parseInt(id));
        return flag;
    }

    /**
     * 根据主键查询整个对象
     */
    @RequestMapping(value = "/selectByPrimaryKey",method = RequestMethod.GET)
    public Object selectByPrimaryKey(HttpServletRequest request){
        String id = request.getParameter("id").trim();  //主键
        return singerService.selectByPrimaryKey(Integer.parseInt(id));
    }

    /**
     * 查询所有歌手
     */
    @RequestMapping(value = "/allSinger",method = RequestMethod.GET)
    public List<Singer> allSinger(HttpServletRequest request){
        return singerService.allSinger();
    }

    /**
     * 根据歌手名模糊查询列表
     */
    @RequestMapping(value = "/singerOfName",method = RequestMethod.GET)
    public List<Singer> singerOfName(HttpServletRequest request) {
        String name = request.getParameter("name").trim();  //歌手的名字
        return singerService.singerOfName("%"+name+"%");
    }

    /**
     * 根据性别查询
     */
    @RequestMapping(value = "/singerOfSex",method = RequestMethod.GET)
    public List<Singer> singerOfSex(HttpServletRequest request) {
        String sex = request.getParameter("sex").trim();  //歌手的名字
        return singerService.singerOfSex(Integer.parseInt(sex));
    }
}
