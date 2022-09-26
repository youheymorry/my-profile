let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const state = () => ({
  myTxt:"Default",
  isMobile:isMobile,
  loading:false,
});

// synchronous methods -- commit
export const mutations = {
  changeScreen(state) {
    // for development only
    state.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  toggleLoading(state) {
    state.loading = !state.loading;
  }
};

// asynchronous methods -- dispatch
export const actions = {
  changeTxtDelay(context, txt){
    const c = context;
    const t = txt;
    setTimeout(function() {
      c.commit("changeTxt", t);
    }, 2000);
  }
};

export const getters = {
  addIdentTxt(stete){
    return "Getters " + state.myTxt;
  }
};