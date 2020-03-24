const getters={
    getUserId(state){     
      state['local_userInfo']=JSON.parse(window.localStorage.getItem('m_userInfo'));
      return state['local_userInfo'].id
    }
  };

  export default getters;