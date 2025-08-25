describe('Конструктор бургера — полный интеграционный тест', () => {
  //Селекторы
  const MODAL = '[data-cy="modal"]';
  const MODAL_CONTENT = '[data-cy="modal-content"]';
  const MODAL_CLOSE_BUTTON = '[data-cy="modal-close-button"]';
  const MODAL_OVERLAY = '[data-cy="modal-overlay"]';
  const ORDER_MODAL = '[data-cy="order-modal"]';
  const CONSTRUCTOR_BUN_TOP = '[data-cy="constructor-bun-top"]';
  const CONSTRUCTOR_BUN_BOTTOM = '[data-cy="constructor-bun-bottom"]';
  const CONSTRUCTOR_INGREDIENT = '[data-cy^="constructor-ingredient-"]';
  const TOTAL_PRICE = '[data-cy="total-price"]';
  const ORDER_BUTTON = '[data-cy="order-button"]';
  const ORDER_NUMBER = '[data-cy="order-number"]';

  // Данные  
  const bunName = 'Краторная булка N-200i';
  const mainName = 'Биокотлета из марсианской Магнолии';
  const sauceName = 'Соус традиционный галактический';

  beforeEach(() => {
    // Моки
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order' }).as(
      'createOrder'
    );

    // Токены
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    // Открываем страницу
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  // Очищаем токены после каждого теста
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  // Добавление ингредиентов
  it('Добавляет булку и начинки в конструктор', () => {
    // Добавляем булку
    cy.contains(bunName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Проверяем, что булки добавились
    cy.get(CONSTRUCTOR_BUN_TOP).should(
      'contain',
      `${bunName} (верх)`
    );
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should(
      'contain',
      `${bunName} (низ)`
    );

    // Добавляем начинку
    cy.contains(mainName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.contains(sauceName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Проверка цены: 1255*2 + 424 + 15 = 2949
    cy.get(TOTAL_PRICE).should('have.text', '2949');
  });

  // Модальное окно ингредиента
  it('Открывает и закрывает модальное окно ингредиента, проверяет детали', () => {
    // Проверяем булку
    cy.contains(bunName).click();
    cy.get(MODAL).should('be.visible');
    cy.get(MODAL_CONTENT).should('contain', bunName);

    // Проверяем, что в модалке отображаются детали булки
    cy.get(MODAL_CONTENT).within(() => {
      cy.contains(/^Калории,\s*ккал$/).next().should('have.text', '420');
      cy.contains(/^Белки,\s*г$/).next().should('have.text', '80');
      cy.contains(/^Жиры,\s*г$/).next().should('have.text', '24');
      cy.contains(/^Углеводы,\s*г$/).next().should('have.text', '53');
    });

    // Закрытие по крестику
    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    // Проверяем биокотлету
    cy.contains(mainName).click();
    cy.get(MODAL).should('be.visible');
    cy.get(MODAL_CONTENT).should('contain', mainName);

    // Проверяем, что в модалке отображаются детали биокотлеты
    cy.get(MODAL_CONTENT).within(() => {
      cy.contains(/^Калории,\s*ккал$/).next().should('have.text', '4242');
      cy.contains(/^Белки,\s*г$/).next().should('have.text', '420');
      cy.contains(/^Жиры,\s*г$/).next().should('have.text', '142');
      cy.contains(/^Углеводы,\s*г$/).next().should('have.text', '242');
    });

    // Закрытие по оверлею
    cy.get(MODAL)
      .siblings(MODAL_OVERLAY)
      .click({ force: true });
    cy.get(MODAL).should('not.exist');

    // Проверяем соус
    cy.contains(sauceName).click();
    cy.get(MODAL).should('be.visible');
    cy.get(MODAL_CONTENT).should('contain', sauceName);

    // Проверяем, что в модалке отображаются детали соуса
    cy.get(MODAL_CONTENT).within(() => {
      cy.contains(/^Калории,\s*ккал$/).next().should('have.text', '99');
      cy.contains(/^Белки,\s*г$/).next().should('have.text', '42');
      cy.contains(/^Жиры,\s*г$/).next().should('have.text', '24');
      cy.contains(/^Углеводы,\s*г$/).next().should('have.text', '42');
    });

    // Закрываем по esc
    cy.get('body').type('{esc}');
    cy.get(MODAL).should('not.exist');
  });

  // Оформление заказа
  it('Оформляет заказ и показывает номер', () => {
    // Собираем бургер
    cy.contains(bunName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.contains(mainName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.contains(sauceName)
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Кликаем "Оформить заказ"
    cy.get(ORDER_BUTTON).click();

    // Проверяем запрос
    cy.wait('@createOrder')
      .its('response.body.order.number')
      .should('eq', 12345);

    // Проверяем модальное окно
    cy.get(MODAL).should('be.visible');
    cy.get(ORDER_NUMBER).should('have.text', '12345');

    // Закрываем
    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(ORDER_MODAL).should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
    cy.get(CONSTRUCTOR_INGREDIENT).should('have.length', 0);
    cy.get(TOTAL_PRICE).should('have.text', '0');
  });
});
