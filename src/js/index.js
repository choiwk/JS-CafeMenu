const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};
function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';
  const storageLength = store.getLocalStorage();
  this.init = () => {
    if (storageLength) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, idx) => {
        return `<li data-menu-id="${idx}" class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${item.name}</span>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
  >
    수정
  </button>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
  >
    삭제
  </button>
</li>
          `;
      })
      .join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = $('#menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const createMenuItem = () => {
    if ($('#menu-name').value === '') {
      alert('메뉴를 입력해주세요.');
      return;
    }
    const menu_name = $('#menu-name').value;
    this.menu[this.currentCategory].push({ name: menu_name });
    store.setLocalStorage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const changedMenuName = prompt(
      '메뉴 이름을 변경해주세요.',
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = changedMenuName;
    store.setLocalStorage(this.menu[this.currentCategory]);
    $menuName.innerText = changedMenuName;
  };

  const removeMenuName = (e) => {
    const $menuName = e.target
      .closest('li')
      .querySelector('.menu-name').innerText;
    if (confirm(`"${$menuName}" 삭제하시겠습니까?`)) {
      for (let i = 0; i < this.menu[this.currentCategory].length; i++) {
        if (this.menu[this.currentCategory][i].name === $menuName) {
          this.menu[this.currentCategory].splice(i, 1);
          i--;
        }
      }
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) {
      updateMenuName(e);
    }
    if (e.target.classList.contains('menu-remove-button')) {
      removeMenuName(e);
    }
  });

  $('#menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  $('#menu-submit-button').addEventListener('click', createMenuItem);

  $('#menu-name').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    createMenuItem();
  });

  $('nav').addEventListener('click', (e) => {
    const isCategoryBtn = e.target.classList.contains('cafe-category-name');

    if (isCategoryBtn) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();

app.init();
