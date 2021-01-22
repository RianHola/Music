package com.czs.music.controller;

import com.czs.music.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;
    /**
     * 判断是否登录成功
     */

}
