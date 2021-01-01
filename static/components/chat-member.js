import { isJsonString } from "../lib/utils.js";
import { baseUrl } from "../lib/http-transport.js";
import store from "../lib/store.js";
const template = `
<div class="mpy_chat_member_wrapper mpy_white" draggable="true">
  <div class="mpy_chat_member_avatar">
    <span class="material-icons mpy_chat_member_avatar_sign"> person </span>
    <img class="mpy_avatar_preview unselectable undraggable"
      draggable="false"
      width="40"
      height="40"
      src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
      alt="">
  </div>
  <div class="mpy_chat_display_nick">
  </div>
</div>
`;
class sChatMember extends HTMLElement {
    constructor() {
        super();
        this.member = {};
        this.innerHTML = template;
        this.memberTitle = this.getElementsByClassName('mpy_chat_display_nick')[0];
        this.memberAvatar = this.getElementsByClassName('mpy_avatar_preview')[0];
        this.memberWrapper = this.getElementsByClassName('mpy_chat_member_wrapper')[0];
        // this.memberWrapper.draggable = true;
        this.memberTool = this.getElementsByClassName('mpy_chat_display_tool')[0];
        this.memberSign = this.getElementsByClassName('mpy_chat_member_avatar_sign')[0];
        this.memberWrapper.ondragstart = () => {
            Object.assign(store.state.currentMember, this.member);
        };
        this.memberWrapper.onclick = () => { Object.assign(store.state.currentMember, this.member); };
    }
    static get observedAttributes() {
        return ['s-member'];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === 's-member') {
            if (isJsonString(newValue)) {
                const member = JSON.parse(newValue);
                Object.assign(this.member, member);
                if (member.role === 'admin') {
                    this.memberSign.innerText = 'how_to_reg';
                }
                this.memberTitle.innerText = member.display_name || member.login || 'unknown';
                this.memberAvatar.src = member.avatar ? baseUrl + member.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
            }
        }
    }
}
export default sChatMember;
//# sourceMappingURL=chat-member.js.map