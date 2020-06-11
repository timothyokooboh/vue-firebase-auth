<template>
  <div id="signup">
    {{country}} {{email}}
   
    <div class="signup-form">
      <form @submit.prevent="signup">

        <div class="input" :class="{invalid: $v.email.$error}">
          <label for="email">Mail</label>
          <input
                  type="text"
                  id="email"
                @blur="$v.email.$touch()" 
                  v-model="email"
                  >
          <div v-if="!$v.email.email">Please provide a valid email address</div>  
           
        </div>
        
        <div class="input" :class="{invalid: $v.age.$error}">
          <label for="age">Your Age</label>
          <input
                  
                  id="age"
                  @blur="$v.age.$touch()" 
                  v-model.number="age">
                  <div v-if="!$v.age.minValue">The age must be {{$v.age.$params.minValue.min}} or above</div>

                 
        </div>
        <div class="input" :class="{invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  @blur="$v.password.$touch"
                  v-model="password">
                <div v-if="!$v.password.minlen">Password must be at least 6 characters</div>
        </div>
        <div class="input" :class="{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password</label>
          <input
                  type="password"
                  id="confirm-password"
                  @blur="$v.confirmPassword.$touch()"
                  v-model="confirmPassword">
                  <div v-if="!$v.confirmPassword.sameAs">Passwords do not match</div>
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
                    class="input" :class="{invalid: $v.hobbyInputs.$each[index].$error}"
                    v-for="(hobbyInput, index) in hobbyInputs"
                   
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                       @blur="$v.hobbyInputs.$each[index].value.$touch()"
                      v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
            </div>
            <p v-if="!$v.hobbyInputs.minlen">You have to specify at least {{$v.hobbyInputs.$params.minlen.min}} hobbies</p>
            <p v-if="!$v.hobbyInputs.required">Please add hobbies</p>
          </div>
        </div>
        <div class="input inline">
          <input type="checkbox" id="terms" v-model="terms">
          <label for="terms">Accept Terms of Use</label>
        </div>
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {required, email, numeric, minValue, minLength, sameAs} from 'vuelidate/lib/validators'
  import axios from 'axios'
  //import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  export default {
   
    
    methods: {
      ...mapActions([
        'signup',
        'onAddHobby',
        'onDeleteHobby'
      ]),
      
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      
      
    },

    validations: {
      email: {
        required,
        email,
        unique: val => {
          if(val === '') return true;
          return axios.get('/users.json?orderBy="email"&equalTo="'+val + '"')
          .then(res=>{
            console.log(res)
            return Object.keys(res.data).length === 0
          })
        }
       
      },
     age: {
       required,
       numeric,
       minValue: minValue(18)
     },
     password:{
       required,
       minlen:minLength(6)
     },
     confirmPassword:{
       sameAs: sameAs('password')
     },
     hobbyInputs:{
       required,
       minlen: minLength(2),
       $each:{
         value:{
           required,
           minlen: minLength(5)
         }
       }
     }
    },

    computed: {
      
        email:{
          get(){
            return this.$store.state.email
          },
          set(val){
            this.$store.state.email = val 
          }
        },
        
        age:{
          get(){
            return this.$store.state.age
          },
          set(val){
            this.$store.state.age = val 
          }
        },
        
        password:{
          get(){
            return this.$store.state.password
          },
          set(val){
            this.$store.state.password = val 
          }
        },
        
        confirmPassword:{
          get(){
            return this.$store.state.confirmPassword
          },
          set(val){
            this.$store.state.confirmPassword = val 
          }
        },
        
        country:{
          get(){
            return this.$store.state.country
          },
          set(val){
            this.$store.state.country = val 
          }
        },
        
        hobbyInputs:{
          get(){
            return this.$store.state.hobbyInputs
          },
          set(val){
            this.$store.state.hobbyInputs = val 
          }
        },
        
        terms:{
          get(){
            return this.$store.state.terms
          },
          set(val){
            this.$store.state.terms = val 
          }
        },
        
    }
  }
</script>

<style scoped>
  .input.invalid input {
    border: 1px solid red;   
  }
  .input.invalid label {
    color: red;   
  }
  
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>