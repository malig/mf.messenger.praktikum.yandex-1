import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';

const register = sue({
  name: 's-app-register-modal',
  template,
  methods: {
    // onReset(): void {
    //   (this as sApp).EventBus.emit('reset');
    // },
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if ((this as sApp).methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = Array.from(formData.entries()).reduce((memo, pair) => ({
          ...memo,
          [pair[0]]: pair[1],
        }), {});
        // eslint-disable-next-line no-console
        console.dir(res); // print result
      } else {
        // eslint-disable-next-line no-console
        console.log('form is not valid');
      }
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default register;
