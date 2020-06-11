
import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth';
import globalAxios from 'axios';
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    email: '',
    age: null,
    password: '',
    confirmPassword: '',
    country: 'usa',
    hobbyInputs: [],
    terms: false,
    user: null,
    expiresIn: ''
  },
  mutations: {
      // authUser(state, userData){
      //   state.idToken = userData.token
      //   state.userId = userData.userId
      // },

     m_signup(state){
      const formData = {
        email: state.email,
        age: state.age,
        password: state.password,
        confirmPassword: state.confirmPassword,
        country: state.country,
        hobbies: state.hobbyInputs.map(hobby => hobby.value),
        terms: state.terms
      }
      axios.post('/accounts:signUp?key=AIzaSyBgGcwUKPEynKy5yX2annHYz11l42OO7Co', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      })
      .then(res => {
        state.idToken = res.data.idToken
        state.expiresIn = res.data.expiresIn
        console.log(res)
        setTimeout(() => {
          state.idToken = null;
          state.userId = null
          router.replace('/signin')
        }, state.expiresIn * 1000);

        const now = new Date();
        const expiration = res.data.expiresIn
        const expirationDate = new Date(now.getTime() - expiration * 1000)
        localStorage.setItem('token', res.data.idToken)
        localStorage.setItem('userId', res.data.localId)
        localStorage.setItem('expirationDate', expirationDate)
      
      })
      .catch(error=>console.log(error))
     },

     m_login (state) {
      const formData = {
        email: state.email,
        password: state.password,
      }
      axios.post('/accounts:signInWithPassword?key=AIzaSyBgGcwUKPEynKy5yX2annHYz11l42OO7Co', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      })
      .then(res=>{
        
        state.expiresIn = res.data.expiresIn
        console.log(res.data)
        state.idToken = res.data.idToken
        state.userId = res.data.localId
        router.replace('/dashboard')

        /**
         * The IdToken expires after one hour. The callback function logs out the user automatically after the token has expired.
         */
        setTimeout(() => {
          state.idToken = null;
          state.userId = null
          router.replace('/signin')
        }, state.expiresIn * 1000);

        const now = new Date();
        const expiration = res.data.expiresIn
        const expirationDate = new Date(now.getTime() - expiration * 1000)
        localStorage.setItem('token', res.data.idToken)
        localStorage.setItem('userId', res.data.localId)
        localStorage.setItem('expirationDate', expirationDate)
        
      })
      .catch(error=>console.log(error))
      console.log(formData)
     
    },

    clearAuthData(state){
      state.idToken = null;
      state.userId = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('expirationDate')

    },

    storeUser (state) {
      const formData = {
        email: state.email,
        password: state.password,
        age: state.age,
        confirmPassword: state.confirmPassword,
        country: state.country,
        hobbies: state.hobbyInputs,
        terms: state.terms,
       
        
      }
      globalAxios.post('/users.json'+ '?auth='+ state.idToken, formData)
      .then(res=>{
        console.log(res);
        
      })
      .catch(error=>console.log(error))
      console.log(formData)
     
    },

     onAddHobby (state) {
      const newHobby = {
        id: Math.random() * Math.random() * 1000,
        value: ''
      }
      state.hobbyInputs.push(newHobby)
    },
    onDeleteHobby (state, id) {
      state.hobbyInputs = state.hobbyInputs.filter(hobby => hobby.id !== id)
    },

    STOREUSER(state, user){
      state.user = user;
    }
  },

  actions: {
   
    signup({commit}) {
       commit('m_signup');
       commit('storeUser');
       
    },
    onAddHobby({commit}) {
      commit('onAddHobby')
    },
    onDeleteHobby({commit}) {
      commit('onDeleteHobby')
    },

    login( {commit}) {
      commit('m_login')        
    },

    logout({commit}){
      commit('clearAuthData')
      router.replace('/signin')
    },

    fetchUser({commit, state}){
      globalAxios.get('/users.json'+ '?auth='+ state.idToken)
    .then(response => {
     console.log(response)
      const data = response.data;
      const users = [];
      for (let key in data) {
        const user = data[key];
        user.id = key;
        users.push(user)
      }
      console.log(users);
      commit('STOREUSER', users[0])

      })
    .catch(error => console.log(error))
    },

    tryAutoLogin({state}){
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if(!token){
        return
      }
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();

      if(now >= expirationDate){
        return 
      }

      state.idToken = token;
      state.userId = userId
      router.replace('/dashboard')
      

    },
    
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state){
      return state.idToken !== null
    }
  }
})