<script>
    import { onMount, setContext } from "svelte";
    import "../app.css";
    import { auth } from "../lib/firebase/firebase";
    import { getDoc, doc } from "firebase/firestore";
    import { db } from "../lib/firebase/firebase";
    let user;
    

    onMount(async ()=>{
      let uid = localStorage.getItem("userId");
      if(uid){
        await getDoc(doc(db, "users", uid))
          .then((doc) => {
            user = doc.data();
          }).catch((error) => {
            localStorage.removeItem("userId");
          });
      }

      if(!user && window.location.pathname !== '/'){
        window.location.href = '/';
      }else if(user && window.location.pathname === '/'){
        window.location.href = '/chat';
      }
    })
    
    export let fillColor = '#0f0';

    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
  </script>

  <svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <link
  rel="stylesheet"
  href="https://unpkg.com/98.css"
>
  </svelte:head>
  
  <div class="w-screen h-screen flex justify-center items-center relative overflow-hidden">
    <div class="monitor absolute -z-10">
      <div class="start">
        <div class="start__button">
          <div class="start__logo">
          </div>
          <p class="start__text">
            Start
          </p>
        </div>
        <div class="start__time">
          <p class="start__time-text">
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
      <div class="start__menu-main">
         <div class="start__menu-main-side">
           <div class="start__menu-main-side-text text">
             <p class="ninefive">95</p>
             <p class="windows">Windows</p>
           </div>
         </div>
         <div class="start__menu-main-items">
           <ul class="start__menu-main-items-list1">
             <li class="start__menu-main-items-item programs">
               <img class="programs-img icon" src="https://i.ya-webdesign.com/images/windows-95-icons-png-7.png" alt="Programs"/>
               <p class="start__menu-main-items-item-title programs"><span class="underline">P</span>rograms</p>
               <div class="start__menu-main-items-item-arrowright"></div>
               <ul class="start__menu-sub sub__programs">
                 <li class="start__menu-sub-items-item sub__programs-items">
                   <img class="accessories-img icon" src="https://i.ya-webdesign.com/images/windows-95-icons-png-7.png" alt="Accessories"/>
                   <p class="start__menu-sub-items-item-title accessories">Accessories</p>
                   <div class="start__menu-main-items-item-arrowright"></div>
                 </li>
                 
                 <li class="start__menu-sub-items-item sub__programs-items">
                   <img class="startup-img icon" src="https://i.ya-webdesign.com/images/windows-95-icons-png-7.png" alt="StartUp"/>
                   <p class="start__menu-sub-items-item-title startup">StartUp</p>
                   <div class="start__menu-main-items-item-arrowright"></div>
                 </li>
                 
                 <li class="start__menu-sub-items-item sub__programs-items">
                   <img class="dos-img icon" src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Msdos-icon.png" alt="DOS"/>
                   <p class="start__menu-sub-items-item-title dos">MS-DOS Prompt</p>
                   <div class="start__menu-main-items-item-arrowright"></div>
                 </li>
               </ul>
             </li>
             <li class="start__menu-main-items-item documents">
               <img class="documents-img icon" src="https://i.ya-webdesign.com/images/windows-95-icons-png-6.png" alt="Documents"/>
               <p class="start__menu-main-items-item-title documents"><span class="underline">D</span>ocuments</p>
               <div class="start__menu-main-items-item-arrowright"></div>
               
             </li>
             <li class="start__menu-main-items-item settings">
               
               <p class="start__menu-main-items-item-title settings"><span class="underline">S</span>ettings</p>
               <div class="start__menu-main-items-item-arrowright"></div>
            
             </li>
        
             <li class="start__menu-main-items-item find">
             
               <p class="start__menu-main-items-item-title find"><span class="underline">F</span>ind</p>
               <div class="start__menu-main-items-item-arrowright"></div>
        
             </li>
      
             <li class="start__menu-main-items-item help">
               <img class="help-img icon" src="https://expensive.toys/img/about-icon.png" alt="Help"/>
               <p class="start__menu-main-items-item-title help"><span class="underline">H</span>elp</p>
             </li>
      
             <li class="start__menu-main-items-item run">
               
               <p class="start__menu-main-items-item-title run"><span class="underline">R</span>un...</p>
             </li>
  
           </ul>
  
           <ul class="start__menu-main-items-list2">
             <li class="start__menu-main-items-item shutdown">
               
               <p class="start__menu-main-items-item-title shutdown">Sh<span class="underline">u</span>t Down...</p>
             </li>
           </ul>
         </div>
      </div>
  
      <div class="computer desktop-icon">
        <div class="computer__icon desktop-icon__icon">
        </div>
        <p class="computer__text desktop-icon__text">
          My Computer
        </p>
      </div>
  
  <div class="recycle desktop-icon">
        <div class="recycle__icon desktop-icon__icon">
        </div>
        <p class="recycle__text desktop-icon__text">
          Recycle Bin
        </p>
      </div>
    </div>

  <slot />

  </div>

  <style lang="scss">
    $darkgrey: rgb(195, 198, 205);
    $darkergrey: rgb(133, 136, 143);
    $lightgrey: rgb(222, 235, 243);

    @mixin menu {
      background: $darkgrey;
      border-top: 2px solid $lightgrey;
      border-left: 2px solid $lightgrey;
      border-right: 2px solid black;
      border-bottom: 2px solid black;
    }

    body {
      background: black;
      font-family: Tahoma;
    }

    .monitor {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #008080;
    }

  .start {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 35px;
    background: rgb(195, 198, 205);
    border-top: 3px solid $lightgrey;
    display: flex;
    justify-content: space-between;
    
    &__button {
      width: 80px;
      height: 72%;
      @include menu;
      margin: 3px;
      display: flex;
      align-items: center;
      
      &:active {
        border-top: 2px solid black;
        border-left: 2px solid black;
        border-right: 2px solid $lightgrey;
        border-bottom: 2px solid $lightgrey;
      }
      
      &:hover {
        cursor: pointer;
      }
  }
  
  &__logo {
    width: 35px;
    height: 18px;
    position: relative;
    
    &::after {
      content: "";
      background: url(https://banner2.kisspng.com/20180821/hrt/kisspng-windows-95-windows-98-microsoft-windows-transparen-windows-95-telegram-stickers-directory-5b7c3cffc178a8.4526616315348687357925.jpg) transparent;
      background-size: contain;
      mix-blend-mode: multiply;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
    }
  }
  
  &__text {
    font-size: 14px;
    font-weight: bold;
  }
  
  &__time {
    width: 80px;
    height: 72%;
    background: $darkgrey;
    border-top: 2px solid $darkergrey;
    border-left: 2px solid $darkergrey;
    border-right: 2px solid $lightgrey;
    border-bottom: 2px solid $lightgrey;
    margin: 3px;
    display: flex;
    align-items: center;
    
    &-text {
      margin: auto;
      font-size: 12px;
    }
  }
  
  // Main menu styles
  
  &__menu-main {
    @include menu;
    width: 20%;
    display: none;
    position: absolute;
    bottom: 38px;
    
    &-side {
      background: $darkergrey;
      width: 15%;
      
      &-text {
        position: relative;
        margin-top: 202px;
        
        .windows {
          font-weight: bold;
          color: $darkgrey;
          transform: rotate(270deg);
        }

        .ninefive {
          color: white;
          transform: rotate(270deg);
          margin-bottom: 56px;
        }
      }
    }
    
    &-items {
      padding: 0;
      width: 100%;
      
      .icon {
        width: 30px;
        height: 30px;
        padding-left: 5px;
        padding-right: 5px;
      }
      
      &-item {
        font-size: 12px;
        padding-top: 3px;
        padding-bottom: 3px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        
        &:hover {
          background: rgb(0, 32, 125);
        }
        
        &:hover &-title {
          color: white;
        }
        
        &:hover &-arrowright {
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid white;
        }
      }
    }
    
    &-items-list1 {
      margin: 0;
      padding: 0;
      border-bottom: 1px solid $darkergrey;
    }
    
    &-items-list2 {
      margin: 0;
      padding: 0;
      border-top: 1px solid $lightgrey;
    }
  }
  
  &__menu-sub {
    @include menu;
    flex-direction: column;
    width: 180px;
    left: 156px;
    padding: 0;
    display: none;
    position: absolute;
      
    .icon {
      width: 23px;
      height: 23px;
    }
      
    &-items {
      
      &-item {
        display: flex;
        align-items: center;
        
        &:hover {
          background: rgb(0, 32, 125);
        }
        
        &:hover &-title {
          color: white;
        }
        
        &:hover &-arrowright {
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid white;
        }
        
        &-title {
          margin: 7px 0;
        }
      }
    }
  }
}

// Specific positioning for each sub menu

.sub {
  &__programs {
    bottom: 226px;
  }
}

// Universal styles for desktop icons

.desktop-icon {
  position: absolute;
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__icon {
    height: 50px;
  }
  
  &__text {
    color: white;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 0;
  }
  
  &:hover {
    cursor: pointer;
  }
}

// My Computer specific styles

.computer {
  top: 20px;
  left: 10px;
  
  &__icon {
    width: 55px;
    background: url("https://www.pngkey.com/png/full/44-448393_windows-95-icons-png-picture-free-stock-icon.png");
    background-size: contain;
  }
}

// Recycle Bin specific styles

.recycle {
  top: 120px;
  left: 10px;
  
  &__icon {
    width: 53px;
    background: url("https://telegram-stickers.github.io/public/stickers/windows-95/27.png");
    background-size: contain;
  }
}

// Styles for the right arrow on menu items

.start__menu-main-items-item-arrowright {
  width: 0; 
  height: 0; 
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid black;
  margin-left: auto;
  margin-right: 7px;
}

// Style classes

.underline {
  text-decoration: underline;
}

.menu-open {
  display: flex;
}

.icon-clicked {
  border: 1px dashed black;
}

// Background Image shuffling for some of the icons

.bg-img {
  background-image: url(https://i.pinimg.com/originals/96/17/c0/9617c03faeb0986659acd2fa7ff87a26.png);
  object-fit: cover;
  width: 200px;
  height: 200px;
  mix-blend-mode: multiply;
}

.settings-img {
  background-position: 87% 21%;
}

.find-img {
  background-position: 25% 22%;
}

.run-img {
  background-position: 0% 80%;
}

.shutdown-img {
  background-position: 75% 79%;
}
  </style>