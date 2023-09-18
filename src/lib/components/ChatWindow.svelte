<script>
    import { onMount, afterUpdate } from 'svelte';
    import { db } from '../firebase/firebase';
    import {
      collection,
      updateDoc,
      doc,
      arrayUnion,
      where,
      query,
      getDoc,
      getDocs,
      onSnapshot
    } from 'firebase/firestore';
  
    export let otherUser;
  
    let screenName;
    let chatId;
    let messages = [];
    let message;
  
    function compareByLength(str1, str2) {
      return str1.length - str2.length;
    }
  
    onMount(() => {
      screenName = localStorage.getItem('screenName');
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'chats'),
          where('users', '==', [screenName, otherUser].slice().sort(compareByLength))
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            console.log(change, 'change');
            const data = change.doc.data();
            messages = data.messages;
          });
        }
      );
  
      // Clean up the listener when the component is unmounted
      return () => {
        unsubscribe();
      };
    });
  
    async function fetchData(screenName) {
      if (!screenName) return;
      let chatsQuery = query(collection(db, 'chats'));
      chatsQuery = query(
        chatsQuery,
        where('users', '==', [screenName, otherUser].slice().sort(compareByLength))
      );
      const chatsQuerySnapshot = await getDocs(chatsQuery);
      chatId = chatsQuerySnapshot.docs[0].id;
    }
  
    $: {
      fetchData(screenName);
    }
  
    let sendMessage = async () => {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion(`${screenName}: ${message}`)
      });
    };
  
    function getUsername(message) {
      return message.split(':')[0];
    }
  
    // Trigger fetchData when otherUser changes
    afterUpdate(() => {
      fetchData(screenName);
    });
  </script>

<img
    class="w-screen h-screen absolute"
    src="https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2F2RNK1P0BYVrSCZEy_Sd1Ew%252F3417757448_4a6bdf36ce_o.jpg&width=910"
    alt=""
  />
  <div class="instant-messenger absolute">
    <div class="title-bar">
        <div class="title-bar-text">{otherUser} - Instant Message</div>
        <div class="title-bar-controls">
          <button aria-label="Close"></button>
        </div>
      </div>

    <nav class="nav">
      <ul class="nav__list">
        <li class="nav__item">File</li>
        <li class="nav__item">Edit</li>
        <li class="nav__item">Insert</li>
      </ul>
    </nav>

    <div class="message-list">
      <div class="message-list__container">
        {#each messages as message}
            <div class='message-item'>
                {#if getUsername(message) === screenName}
                <span class="text-black screenName">{getUsername(message)}</span>
                {:else}
                <span class="text-red-600 screenName">{getUsername(message)}</span>
                {/if}

                <span>: {message.split(":")[1]}</span>
            </div>
        {/each}
      </div>
    </div>

    <div class="customize-row">
      <div class="customize-row__set">
        
      </div>
    </div>

    <form
      class="message-form"
      on:submit|preventDefault
    >
      <textarea class="message-form__textarea" bind:value={message}/>
      <div class="message-form__actions">
        <button
          type="button"
          on:click={sendMessage}
          class={`message-form__submit`}
        />
      </div>
    </form>
  </div>

  <style lang="scss">
    .screenName{
        font-weight: bold;
    }

    .instant-messenger {
    width: 500px;
    border: 1px solid gray;
    background: #d6d6ce;
    padding: 1px;
    box-shadow: 2px 2px 2px #424242;
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid #848484;
    border-bottom: 1px solid #848484;
  }

  .instant-messenger2 {
    width: 320px;
    border: 1px solid gray;
    background: #d6d6ce;
    padding: 1px;
    box-shadow: 2px 2px 2px #424242;
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid #848484;
    border-bottom: 1px solid #848484;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    background: #08216b;
    background: -webkit-linear-gradient(left, #08216b, #a5c6ef);
    background: -o-linear-gradient(right, #08216b, #a5c6ef);
    background: -moz-linear-gradient(right, #08216b, #a5c6ef);
    background: linear-gradient(to right, #08216b, #a5c6ef);
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

  .message-list {
    width: 100%;
    overflow: hidden;
    padding: 5px;
    box-sizing: border-box;

    &__container {
      width: 100%;
      height: 200px;
      padding: 5px;
      box-sizing: border-box;
      overflow-y: scroll;
      word-wrap: word-break;
      word-break: break-all;
      background: #fff;
    }
  }

  .message-item {
    display: flex;
    padding: 5px 0;

    &--other {
      .message-item__screenname {
        color: red;
      }
    }

    &__screenname {
      margin-right: 3px;
      font-weight: bold;
    }
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
      background-image: url("data:image/png;base64,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");
      width: 65px;
      height: 65px;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #ecead8;

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