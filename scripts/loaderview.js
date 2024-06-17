const loaderview = (function (){
  const wrp = {
    status: false,
    element: null,
    defaultMessage: '通信中',
  };

  /**
   * ダイアログ要素をメモリに保存する
   * @param {string} elementId ダイアログのもつ ID
   */
  wrp.init = (elementId) => {
    wrp.element = document.querySelector(elementId);
    if (!wrp.element) {
      console.error('[loaderview.js] ERROR on init, element is undefined');
    } else {
      console.log('[loaderview.js] init', wrp.element);
      wrp.element.style.display = "none";
    }
  };

  /**
   * 表示する
   * @param {string} [message=this.defaultMessage] 表示メッセージ
  */
  wrp.show = (message = wrp.defaultMessage) => {
    if (wrp.status) return;
    const elem = wrp.element;
    elem.querySelector('#loaderview_message').innerText = message;
    elem.style.display = "flex";
    elem.classList.remove('fadeout');
    wrp.status = !wrp.status;
  };

  /**
   * 非表示にする
  */
  wrp.hide = () => {
    if (!wrp.status) return;
    const elem = wrp.element;
    elem.classList.add('fadeout');
    setTimeout(function(){ 
      elem.style.display = 'none'; 
    }, 1000);
    wrp.status = !wrp.status;
  };

  return wrp;
})();

export default loaderview;
