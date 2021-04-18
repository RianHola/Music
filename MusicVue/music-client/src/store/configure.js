const configure = {
    state: {
        HOST: 'http://127.0.0.1:8888',   //后台访问地址
        activeName: '',                 //当前选中菜单名
        showAside: false,                //歌曲列表是否显示
        logIn: false,                    //用户是否登录
        isActive: false,                 //当前歌曲是否已收藏
        beforeActiveName: ''             //打开歌词之前的页面
    },
    getters: {
        activeName: state => {
            let activeName = state.activeName;
            if (!activeName) {
                activeName = JSON.parse(window.sessionStorage.getItem('activeName'));
            }
            return activeName
        },
        showAside: state => {
            let showAside = state.showAside;
            if (!showAside) {
                showAside = JSON.parse(window.sessionStorage.getItem('showAside'));
            }
            return showAside
        },
        logIn: state => {
            let logIn = state.logIn;
            if (!logIn) {
                logIn = JSON.parse(window.sessionStorage.getItem('logIn'));
            }
            return logIn
        },
        isActive: state => {
            let isActive = state.isActive;
            if (!isActive) {
                isActive = JSON.parse(window.sessionStorage.getItem('isActive'));
            }
            return isActive
        },
        beforeActiveName: state => {
            let beforeActiveName = state.beforeActiveName;
            if (!beforeActiveName) {
                beforeActiveName = JSON.parse(window.sessionStorage.getItem('beforeActiveName'));
            }
            return beforeActiveName
        },
    },
    mutations: {
        setActiveName: (state, activeName) => {
            state.activeName = activeName;
            window.sessionStorage.setItem('activeName', JSON.stringify(activeName));
        },
        setShowAside: (state, showAside) => {
            state.showAside = showAside;
            window.sessionStorage.setItem('showAside', JSON.stringify(showAside));
        },
        setLogIn: (state, logIn) => {
            state.logIn = logIn;
            window.sessionStorage.setItem('logIn', JSON.stringify(logIn));
        },
        setIsActive: (state, isActive) => {
            state.isActive = isActive;
            window.sessionStorage.setItem('isActive', JSON.stringify(isActive));
        },
        setBeforeActiveName: (state, beforeActiveName) => {
            state.beforeActiveName = beforeActiveName;
            window.sessionStorage.setItem('beforeActiveName', JSON.stringify(beforeActiveName));
        },
    }
}

export default configure
