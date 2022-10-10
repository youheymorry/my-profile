let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const state = () => ({
  isMobile:isMobile,
  loading:false,
  mlModels:{
    imgClassifier:null,
    mnistModel:null
  }
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
  saveImgClassifier(state, imgClassifier){
    state.mlModels.imgClassifier = imgClassifier;
  },
  saveMnistModel(state, model){
    state.mlModels.mnistModel = model;
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

// store.getters.getMyTxt
export const getters = {
  getMyTxt(state){
    return state.myTxt;
  }
};