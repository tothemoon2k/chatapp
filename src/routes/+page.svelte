
<script>
    import { getAuth } from 'firebase/auth';
    import { generateUsername } from "unique-username-generator";
    import Draggable from '$lib/components/Draggable.svelte';
    import signOnLogo from '$lib/images/signonLogo.png';
    import screenNameText from '$lib/images/screennameText.png';
    import help from '$lib/images/help.png'
    import setup from '$lib/images/setup.png'
    import signon from '$lib/images/signon.png'
    let value = '';
    let messageData = [];

    let screenName;
    let password;
    let checkPassword;

    let mode = 'login'

    let switchMode =()=>{
        mode = mode === 'login' ? 'register' : 'login';
    }

    const auth = getAuth();
    
    let loginAction = async () => {
        if(screenName.length > 0 && password.length > 0){
            try{
                await authHandlers.login(screenName, password);
                //window.location.href = '/chat';
            }catch(err){
                alert("There was an unexpected error logging in. Please try again.");
                console.log(err)
            }
        }
    }
    

    const registerAction = async() => {
       if (password.length >= 6 && password === passwordCheck){
        try{
            const user = await authHandlers.register(screenName, password);
            //window.location.href = '/chat';
        }catch(err){
            console.log(err)
        }
        }else if(password.length >= 6 === false){
           alert("Password must be at least 6 characters long");
       } else if (password !== passwordCheck){
           alert("Passwords do not match");
       }
    }

    const inputUsername = () => {
        screenName = generateUsername();
        console.log(screenName);
    }
  </script>
  
  



  <Draggable class="absolute">
    <div class="instant-messenger absolute">
        
        {#if mode === 'register'}
            <div class="title-bar">
                <div class="flex gap-2 items-center">
                    <img class="h-4" src="https://www.pngkey.com/png/full/960-9609440_icones-aim-images-aol-instant-messenger-png-et.png" alt="">
                    <div class="title-bar-text">Create your Account</div>
                </div>

                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
                </div>
            </div>
        
            <div class="w-full h-full flex justify-center items-center">
                <img class="logo" src={signOnLogo} alt="">
            </div>
        
            <div class="w-full flex justify-center items-center">
                <hr class="border border-gray-500 mt-4"/>
            </div>

            

            <div class="field-row-stacked input">
                <label for="screenName" class="mt-2 flex items-center gap-2">Create Your Screen Name</label>
                <input id="screenName" type="text" bind:value={screenName} />
            </div>

            <a href="" on:click={inputUsername}  class="underline ml-6 link text-blue-700">Get a Screen Name</a>

            <div class="field-row-stacked input">
                <label for="password" class="mt-2">Create Your Password</label>
                <input id="password" type="password" bind:value={password} />
            </div>

            <div class="field-row-stacked input">
                <label for="confirmPassword" class="mt-2">Confirm Password</label>
                <input id="confirmPassword" type="password" bind:value={password} />
            </div>

            <div class="field-row flex justify-end checks">
                <input type="checkbox" id="autoLogin">
                <label for="autoLogin">Auto Login</label>
            </div>
            
            <div class="con flex justify-between">
                <div class="flex">
                    <img src={help} alt="" class="w-auto h-12 icon">
                    <img on:click={switchMode} src={setup} alt="" class="w-auto h-12 icon">
                </div>

                <img on:click={loginAction} src={signon} alt="" class="w-auto h-14 icon">
            </div>


            <p class="text-center version my-1">Version Beta V1</p>

        {:else if mode === 'login'}    
        <div class="title-bar">
            <div class="flex gap-2 items-center">
                <img class="h-4" src="https://www.pngkey.com/png/full/960-9609440_icones-aim-images-aol-instant-messenger-png-et.png" alt="">
                <div class="title-bar-text">Sign On</div>
            </div>

            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
            </div>
        </div>
    
        <div class="w-full h-full flex justify-center items-center">
            <img class="logo" src={signOnLogo} alt="">
        </div>
    
        <div class="w-full flex justify-center items-center">
            <hr class="border border-gray-500 mt-4"/>
        </div>

        <img class="h-5 w-auto ml-6 mt-1" src={screenNameText} alt="">

        <div class="field-row-stacked input">
            <input id="screenname" type="text" bind:value={screenName}/>
        </div>

        <a href="" class="underline ml-6 link text-blue-700">Get a Screen Name</a>

        <div class="field-row-stacked input">
            <label for="password" class="mt-2">Password</label>
            <input id="password" type="password" bind:value={checkPassword} />
        </div>

        <a href="" class="underline ml-6 link text-blue-700">Forgot Password?</a>

        <div class="field-row flex justify-between checks">
            <input checked type="checkbox" id="savePassword">
            <label for="savePassword">Save Password</label>
            <input type="checkbox" id="autoLogin">
            <label for="autoLogin">Auto Login</label>
        </div>
        
        <div class="con flex justify-between">
            <div class="flex">
                <img src={help} alt="" class="w-auto h-12 icon">
                <img on:click={switchMode} src={setup} alt="" class="w-auto h-12 icon">
            </div>

            <img on:click={loginAction} src={signon} alt="" class="w-auto h-14 icon">
        </div>


        <p class="text-center version my-1">Version Beta V1</p>
        {/if}
    </div>
</Draggable>




<style lang="scss">
    .icon:hover{
        cursor: pointer;
        background-color: #b2b2b2;
        box-sizing: border-box;
        border: none;
        color: transparent;
        text-shadow: 0 0 #222222;
        background: #c0c0c0;
        box-shadow: inset -1px -1px #0a0a0a, inset -2px -2px #808080;
        border-radius: 0;
    }

    .version{
        font-size: 1rem;
    }

    .con{
        width: 89%;
        margin: 0 auto;
        margin-top: 0.9rem;
    }

    .checks{
        width: 83%;
        margin: 0 auto;
        margin-top: 0.5rem;
    }

    .input{
        width: 83%;
        margin: 0 auto;
    }

    .link{
        font-size: 1rem;
        letter-spacing: 0.0025rem;
    }

    hr{
        width: 94%;
    }

html,
body {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Arial';
}

body {
  background: url('http://wallpapercave.com/wp/pBHbmte.jpg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
}

button {
  cursor: pointer;

  &:focus {
    outline: none;
  }
  

}

.instant-messenger {
  width: 300px;
  border: 1px solid gray;
  background: #d6d6ce;
  padding: 1px;
  box-shadow: 2px 2px 2px #424242;
  border-top: 1px solid white;
  border-left: 1px solid white;
  border-right: 1px solid #848484;
  border-bottom: 1px solid #848484;
  font-family: 'VT323', monospace;
}

.instant-messenger2 {
  width: 220px;
  border: 1px solid gray;
  background: #d6d6ce;
  padding: 1px;
  box-shadow: 2px 2px 2px #424242;
  border-top: 1px solid white;
  border-left: 1px solid white;
  border-right: 1px solid #848484;
  border-bottom: 1px solid #848484;
  font-family: 'VT323', monospace;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  background: #08216b;
  background: -webkit-linear-gradient(left, #08216b , #a5c6ef);
  background: -o-linear-gradient(right, #08216b, #a5c6ef);
  background: -moz-linear-gradient(right, #08216b, #a5c6ef);
  background: linear-gradient(to right, #08216b , #a5c6ef);
  height: 35px;
  color: #fff;
  
  &__links {
    display: flex;
    list-style: none;
  }
  
  &__minimize,
  &__maximize,
  &__close {
    margin: 0 2px;
    width: 25px;
    height: 25px;
    color: black;
    font-weight: 700;
    background: #d6d6ce;
    font-size: 20px;
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid #848484;
    border-bottom: 1px solid #848484;
    box-shadow: 1px 1px 1px #424242;
    text-align: center;
    line-height: 25px;
    
    &:hover {
      cursor: pointer;
    }
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__list {
    margin: 0;
    padding: 5px 0;
    list-style: none;
    display: flex;
  }
  
  &__item {
    padding: 0 5px;
    cursor: pointer;
  }
  
  &__warning-level {
    padding-right: 5px;
  }
}

.logo{
    margin-top: 10px;
    height: 190px;
}

.message-form {
  width: 100%;
  overflow: hidden;
  padding: 5px;
  box-sizing: border-box;

  &__textarea {
    width: 100%;
    height: 80px;
    padding: 5px;
    box-sizing: border-box;
    resize: none;
    font-size: 16px;

    
    &:focus {
      outline: none;
    }
  }
  
  &__actions {
    display: flex;
    padding: 5px 0;
    flex-direction: row-reverse;
  }
  
  &__submit {
    background-image: url('data:image/png;base64,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');
    width: 65px;
    height: 65px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #ECEAD8;

    cursor: pointer;
    
    &--disabled {
      -webkit-filter: grayscale(100%);
      filter: gray;
    }
    
    &:active {

    }
  }
}

.customize-row {
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 3px 100px 3px 1px;
  border: 2px solid #848484;
  box-shadow: inset 2px 2px 0 0 #f4f4f4;
  
  &__set {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 30px;
    border-left: 1px solid white;
    border-right: 1px solid #848484;
    
    &:last-of-type {
      border-right: none;
    }
    
    &:first-of-type {
      border-left: none;
    }
  }
  
  &__button {
    height: 100%;
    background: none;
    padding: 0 12px;
    border: 3px solid transparent;
    box-shadow: none;
  }
}




</style>