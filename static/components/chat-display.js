import { isJsonString } from "../lib/utils.js";
import store from "../lib/store.js";
import eventBus from "../lib/event-bus.js";
import { backendUrl, CONST } from "../lib/const.js";
const template = `
<div class="mpy_chat_display_wrapper mpy_white">
  <div class="mpy_chat_display_tool">
    <div class="mpy_chat_display_avatar">
      <span class="material-icons mpy_chat_display_avatar_sign"> settings </span> 
      <img 
        class="mpy_avatar_preview unselectable undraggable"
        width="40"
        height="40"
        src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
        alt="">
    </div>
  </div>
  <div class="mpy_chat_display">
    <div class="mpy_chat_display_header">Lorem ipsum</div>
    <div class="mpy_chat_display_body">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div class="mpy_chat_display_status">
    <div class="mpy_chat_time mpy_pt10">
      09:20
    </div>
    <div class="mpy_chat_display_sign">
      4
    </div>
  </div>
</div>
`;
class sChatDisplay extends HTMLElement {
    constructor() {
        super();
        this.chatId = 0;
        this.innerHTML = template;
        this.chatTitle = this.getElementsByClassName('mpy_chat_display_header')[0];
        this.chatAvatar = this.getElementsByClassName('mpy_avatar_preview')[0];
        this.chatWrapper = this.getElementsByClassName('mpy_chat_display_wrapper')[0];
        this.chatTool = this.getElementsByClassName('mpy_chat_display_tool')[0];
        eventBus.on(CONST.update, () => this.update());
    }
    static get observedAttributes() {
        return ['s-chat'];
    }
    update() {
        if (this.chatId && this.chatId === store.state.currentChat.id) {
            this.chatWrapper.classList.add('mpy_chat_display_wrapper__active');
        }
        else {
            this.chatWrapper.classList.remove('mpy_chat_display_wrapper__active');
        }
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === 's-chat') {
            if (isJsonString(newValue)) {
                const chat = JSON.parse(newValue);
                this.chatTitle.innerText = chat.title || 'chat title';
                this.chatId = chat.id;
                this.chatAvatar.src = chat.avatar ? backendUrl + chat.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
                this.chatTool.onclick = (e) => {
                    Object.assign(store.state.currentChat, chat);
                    eventBus.emit(CONST.chatChange);
                    window.router.go('/#/chat/edit');
                    e.preventDefault();
                    e.stopPropagation();
                };
                this.chatWrapper.onclick = () => {
                    Object.assign(store.state.currentChat, chat);
                    eventBus.emit(CONST.chatChange);
                    return false;
                };
                eventBus.emit(CONST.update);
            }
        }
    }
}
export default sChatDisplay;
//# sourceMappingURL=chat-display.js.map