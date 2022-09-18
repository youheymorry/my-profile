export const state = () => ({
  myTxt:"Default",
  loading:false
});

// synchronous methods -- commit
export const mutations = {
  changeTxt(state, txt) {
    state.myTxt = txt;
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