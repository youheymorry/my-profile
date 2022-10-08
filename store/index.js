let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const state = () => ({
  isMobile:isMobile,
  loading:false,
  imgClassifier:null,
});

// synchronous methods -- commit
export const mutations = {
  changeScreen(state) {
    // for development only
    state.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  toggleLoading(state, bool) {
    state.loading = bool;
  },
  loadAnimData(state, animData){
    state.loadAnim1 = animData.loadAnim1;
    state.loadAnim2 = animData.loadAnim2;
  },
  saveImgClassifier(state, imgClassifier){
    state.imgClassifier = imgClassifier;
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