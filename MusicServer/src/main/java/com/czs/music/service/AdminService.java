package com.czs.music.service;

import org.springframework.stereotype.Repository;
/**
 * 管理员service接口
 */
@Repository
public interface AdminService {
    /**
     *验证密码是否正确
     */
    public boolean verifyPassword(String username,String password);
}
