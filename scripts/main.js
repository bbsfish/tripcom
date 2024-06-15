document.addEventListener('DOMContentLoaded', () => {
  const OrderActions = (() => {
    const formElem = document.forms['order'];
    const wrp = {
      // ラッパー要素
      form: formElem,
      // 質問ブロック要素の配列
      steps: formElem.querySelectorAll('.order__row'),
      // ステップのカウンター
      stepIndex: 0,
      // ステップごとのデータを保管する配列
      stepData: [],
    }

    wrp.init = () => {
      wrp.steps.forEach((elem) => {
        if (elem.id === 'order-end') {
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(wrp.stepData);
          });
        }

        const btns = elem.querySelectorAll('button');
        if (elem.classList.contains('select-one')) {
          btns.forEach((btnElem) => {
            btnElem.addEventListener('click', (e) => {
              wrp.pushData(btnElem.innerText);
              wrp.next();
            });
          });
        }
        else if (elem.classList.contains('select-mulitple')) {
          btns.forEach((btnElem) => {
            btnElem.addEventListener('click', (e) => {
              wrp.pushData(btnElem.innerText);
            });
          });
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.next();
          });
        }
        else if (elem.classList.contains('select-textarea')) {
          const textarea = elem.querySelector('textarea');
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.pushData(textarea.innerText);
            wrp.next();
          });
        }
      });
    }

    wrp.pushData = (data) => {
      const prev = wrp.stepData[wrp.stepIndex];
      if (!prev) wrp.stepData[wrp.stepIndex] = [data];
      else wrp.stepData[wrp.stepIndex].push(data);
    }

    wrp.next = () => {
      // 古いブロックを非表示して、新しいブロックを表示
      // wrp.steps[wrp.stepIndex].style = 'height: 5px';
      wrp.steps[wrp.stepIndex].classList.add('order-minimize');
      setTimeout(() => {
        wrp.steps[wrp.stepIndex].style = 'display: none;';
        wrp.stepIndex++;
        wrp.steps[wrp.stepIndex].classList.remove('order-minimize');
        wrp.steps[wrp.stepIndex].style = 'display: block;';
      }, 6*100);
    }

    return wrp;
  })();

  OrderActions.init();
});