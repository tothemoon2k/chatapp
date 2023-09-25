<script>
  import { onMount } from "svelte";
  import { db } from "$lib/firebase/firebase";
  import ChatWindow from "$lib/components/ChatWindow.svelte";
  import InstagramChatWindow from "$lib/components/InstagramChatWindow.svelte";
  import chatSidebar from "$lib/images/chatSidebar.png";
  import { io } from "$lib/realtime";
  import {
    setDoc,
    addDoc,
    updateDoc,
    collection,
    getDocs,
    query,
    where,
    doc,
    onSnapshot,
  } from "firebase/firestore";
  import Draggable from "$lib/components/Draggable.svelte";
  let screenName = "";
  let value = "";
  let messageData = [];
  let chatsHAA = [];
  let currentChat;

  onMount(() => {
    screenName = localStorage.getItem("screenName");
    io.emit("loadChats")

    io.on("sendChats", (chats) => {
      console.log('we got em')
    });

    const unsubscribe = onSnapshot(
        query(
          collection(db, 'chats'),
          where('users', 'array-contains', screenName)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const otherScreenName = data.users.find(user => user !== screenName);
            const latestMessage = data.messages[data.messages.length - 1];
            const [senderName, messageContent] = latestMessage.split(": ");
            let chatExists = false;

            for (let i = 0; i < chatsHAA.length; i++) {
              if (chatsHAA[i].otherPerson === otherScreenName) {
                chatsHAA[i].latestSender = senderName;
                chatsHAA[i].latestMessage = messageContent;
                chatExists = true;
                chatsHAA = chatsHAA;
                break;
              }
            }

            if (!chatExists) {
              chatsHAA.push({
                otherPerson: otherScreenName,
                latestSender: senderName,
                latestMessage: messageContent
              });
              chatsHAA = chatsHAA;
            }

          });
        }
      );
  
      // Clean up the listener when the component is unmounted
      return () => {
        unsubscribe();
      };
  });

  const addedMessage = (e, val) => {
    e.preventDefault();
    const message = { text: val, id: messageData.length };
    messageData.push(message);
    value = "";
  };

  const handleChange = (event) => {
    value = event.target.value;
  };

  let buddyTab = "online";

  let buddyTabClick = (tab) => {
    buddyTab = tab;
  };

  let newChatScreenName = "";
  let newChatMessage = "";

  function compareByLength(str1, str2) {
        return str1.length - str2.length;
      }

  let sendNewChat = async () => {
    try {
      if (newChatScreenName === "" || newChatMessage === "") {
        alert("Please enter a screen name and message");
        return;
      }

      if(newChatScreenName === screenName) {
        alert("Unfortunately you cannot message yourself");
        return;
      }

      let userQuery = query(collection(db, "users"));
      userQuery = query(
        userQuery,
        where("screenName", "==", newChatScreenName)
      );

      // Execute the query
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.size === 0) {
        alert(
          "Please double-check the screen name, we could not find that user"
        );
        return;
      }

      let chatsQuery = query(collection(db, "chats"));
      chatsQuery = query(
        chatsQuery,
        where(
          "users",
          "==",
          [screenName, newChatScreenName].slice().sort(compareByLength)
        )
      );

      // Execute the query
      const chatsQuerySnapshot = await getDocs(chatsQuery);

      if (chatsQuerySnapshot.size > 0) {
        console.log(chatsQuerySnapshot.size);
        alert("Chat already exists");
        return;
      }

      const docRef = await addDoc(collection(db, "chats"), {
        users: [screenName, newChatScreenName].slice().sort(compareByLength),
        messages: [screenName + ": " + newChatMessage],
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  let setCurrentChat = (chat) => {
    currentChat = null;

    setTimeout(() => {
      currentChat = chat;
    }, 50);
  }
</script>


<InstagramChatWindow otherUser={"justinfilms_"}/>


{#if currentChat}
  <Draggable>
    <ChatWindow otherUser={currentChat}/>
  </Draggable>
{/if}


<Draggable>
  <div class="instant-messenger2 absolute">
    <div class="title-bar">
      <div class="title-bar-text ml-1 gap-2 flex items-center"><img src={chatSidebar} class="h-5" alt="">{screenName}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label="Maximize" />
        <button aria-label="Close" />
      </div>
    </div>

    <div class="flex justify-around mt-1">
      <p class="w-1/3 flex justify-center hover:bg-gray-400 hover:cursor-pointer">My Aim</p>
      <p class="w-1/3 flex justify-center hover:bg-gray-400 hover:cursor-pointer">Friends</p>
      <p class="w-1/3 flex justify-center hover:bg-gray-400 hover:cursor-pointer">Help</p>
    </div>

    <div class="w-full flex justify-center items-center mt-1 mb-1.5">
      <hr class="border border-gray-400 w-full mx-2" />
    </div>

    <img
      class="w-5/6 mx-auto mt-1 mb-3"
      src="https://news.northeastern.edu/wp-content/uploads/2017/11/aim-story-header-02.jpg"
      alt=""
    />

    <menu role="tablist">
      <li
        role="tab"
        aria-selected={`${buddyTab === "online" ? "true" : ""}`}
        on:click={() => buddyTabClick("online")}
      >
        <a href="#tabs">Chats</a>
      </li>
      <li
        role="tab"
        aria-selected={`${buddyTab === "setup" ? "true" : ""}`}
        on:click={() => {
          buddyTabClick("setup");
        }}
      >
        <a href="#tabs">New Chat</a>
      </li>
    </menu>
    <div class="window flex justify-center" role="tabpanel">
      <div class="window-body w-full flex justify-center flex-col">
        {#if buddyTab === "online"}
        <p class="font-bold chat-bt mb-1.5">Chats</p>
        {#if !chatsHAA.length}
          <p class="text-center my-4">Your Messages Will Appear Here</p>
        {/if}

          {#each chatsHAA as chat (chat.latestMessage)}
            <div class=" w-full py-2 px-2 mb-3 darkfr hover:cursor-pointer" on:click={() => setCurrentChat(chat.otherPerson)}>
              <div class="title-bar-text t-b">{chat.otherPerson}</div>
              <p class="message-size">{chat.latestSender === screenName ? "You" : chat.latestSender}: {chat.latestMessage.split(',')[0].trim()}</p>
            </div>
          {/each}
        {:else if buddyTab === "setup"}
          <h5 class="font-medium mb-1.5 mt-1">All you need to start a new chat is the other persons screen name</h5>
          <input
            type="text"
            placeholder="Their ScreenName"
            bind:value={newChatScreenName}
            class="mt-1 mb-1.5"
          />
          <input
            type="text"
            placeholder="Message"
            bind:value={newChatMessage}
            class="mb-3"
          />
          <button on:click={sendNewChat}>Send Message</button>
        {/if}
      </div>
    </div>
  </div>
</Draggable>

<style lang="scss">
  .darkfr{
    background-color:#a7a7a7;
  }

  .chat-bt{
    font-size: 1rem;
  }

  .t-b{
    font-size: 0.75rem;
    color: black;
  }

  .message-size{
    font-size: 0.7rem;
  }

  html,
  body {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'VT323', monospace;
  }

  body {
    background: url("http://wallpapercave.com/wp/pBHbmte.jpg");
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
    width: 220px;
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
