import loaderview from '../scripts/loaderview.js';

const OUR_EMAIL = 'ysk1122.dev@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  // loaderview 初期化
  loaderview.init('#loaderview');

  const OrderActions = (() => {
    const formElem = document.forms['order'];
    const wrp = {
      // ラッパー要素
      form: formElem,
      // 質問ブロック要素の配列
      steps: formElem.querySelectorAll('.order__row'),
      // オーダー表示要素
      orderView: formElem.querySelector('.order-content'),
      // ステップのカウンター
      stepIndex: 0,
      // ステップごとのデータを保管する配列
      stepData: [],
      // ステップのラベルを保管する配列
      stepLabels: [],
    }

    wrp.init = () => {
      wrp.steps.forEach((elem) => {
        // Elem = 最終選択ブロック（送信ボタン）
        if (elem.id === 'order-end') {
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', async (e) => {
            e.preventDefault();
            loaderview.show('Sending message...');
            await wrp.sendMail({ to: OUR_EMAIL });
            loaderview.hide();
          });
        }

        // label 要素
        const label = elem.querySelector('input[type=hidden]');

        // Elem 内のボタンリスト
        const btns = elem.querySelectorAll('button');
        if (elem.classList.contains('select-one')) {
          // ひとつを選ぶタイプのクリックイベント
          btns.forEach((btnElem) => {
            btnElem.addEventListener('click', (e) => {
              wrp.setLabel(label.value);
              wrp.pushData(btnElem.innerText);
              wrp.next();
            });
          });
        }
        else if (elem.classList.contains('select-mulitple')) {
          // 複数を選ぶタイプのクリックイベント
          btns.forEach((btnElem) => {
            btnElem.addEventListener('click', (e) => {
              if (e.target.classList.contains('selected')) {
                wrp.removeData(btnElem.innerText);
                e.target.classList.remove('selected');
                setTimeout(() => {
                  e.target.style = 'border-color: inherit; background-color: inherit;';
                }, 100);
              } else {
                wrp.pushData(btnElem.innerText);
                e.target.classList.add('selected')
              }
            });
          });
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.setLabel(label.value);
            wrp.next();
          });
        }
        else if (elem.classList.contains('select-textarea')) {
          // テキストエリアタイプ
          const textarea = elem.querySelector('textarea');
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.setLabel(label.value);
            wrp.pushData(textarea.innerText);
            wrp.next();
          });
        }
        else if (elem.classList.contains('select-inputtext')) {
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.setLabel(label.value);

            // 一時保存データ
            let data = [];
            // テキストボックスタイプ
            const inputtext = elem.querySelectorAll('input[type=text]');
            if (inputtext) inputtext.forEach((inputBox) => data.push(`${inputBox.name}: ${inputBox.value}`));
            data.forEach((val) => wrp.pushData(val));
            wrp.next();
          });
        }
        else if (elem.classList.contains('select-input-email')) {
          const submit = elem.querySelector('input[type=submit]');
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            wrp.setLabel(label.value);
            const emailtext = elem.querySelector('input[type=email]');
            wrp.pushData(emailtext.value);
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

    wrp.removeData = (val = null) => {
      const prev = wrp.stepData[wrp.stepIndex];
      if (prev) {
        wrp.stepData[wrp.stepIndex] = prev.filter((block) => block !== val);
      }
    }

    wrp.setLabel = (value) => {
      wrp.stepLabels[wrp.stepIndex] = value;
    }

    wrp.next = () => {
      // オーダーの表示
      const div = (() => {
        const outer = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.innerText = wrp.stepLabels[wrp.stepIndex];
        outer.appendChild(h3);

        const p = document.createElement('p');
        console.log('wrp.stepData', wrp.stepData);
        p.innerText = wrp.stepData[wrp.stepIndex].join(',');
        outer.appendChild(p);

        return outer;
      })();
      wrp.orderView.appendChild(div);

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

    wrp.sendMail = async ({ to }) => {
      const formData = new FormData();
      formData.append('to', to);
      formData.append('subject', '【Trip.Tokyo】新しいリクエストがありました');
      const messages = (() => {
        return wrp.stepLabels.map((labelText, idx) => `
          Q: ${labelText}
          R: ${wrp.stepData[idx].join(', ')}
        `);
      })();
      formData.append('body', messages.join('\n'))
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbz7Y-SmFkSuUKMxgHFfoXMUwyRqUsIGUj_1pafMWC1zIeFTPGtM7RmBPOX8zfiJvos/exec', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    }

    return wrp;
  })();

  OrderActions.init();
});