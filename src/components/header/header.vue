<template>
  <header id="header">
    <div class="logo">
      <router-link to="/">Vue - Complete Guide</router-link>
    </div>
    <nav>
      <ul>
        <li v-if="!isAuthenticated">
          <router-link to="/signup">Sign Up</router-link>
        </li>
        <li v-if="!isAuthenticated">
          <router-link to="/signin">Sign In</router-link>
        </li>
        <li v-if="isAuthenticated">
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li v-if="isAuthenticated"><button @click="logout" class="logout">Log out</button></li>
      </ul>
     
    </nav>
  </header>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  computed:{
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  methods:{
   logout(){
     this.$store.dispatch('logout')
   }
  }
}
</script>
<style scoped>
  #header {
    height: 56px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    background-color: #521751;
    padding: 0 20px;
  }

  .logo {
    font-weight: bold;
    color: white;
  }

  .logo a {
    text-decoration: none;
    color: white;
  }

  nav {
    height: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  li {
    margin: 0 16px;
  }

  li a {
    text-decoration: none;
    color: white;
  }

  li a:hover,
  li a:active,
  li a.router-link-active {
    color: #fa923f;
  }
  .logout{
    background-color: transparent;
    color: white;
    border: none;
    font-size: inherit;
    cursor: pointer;
    outline: none;
  }
</style>