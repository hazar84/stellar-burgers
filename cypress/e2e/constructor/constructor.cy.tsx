describe('Конструктор бургера — полный интеграционный тест', () => {
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
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain',
      `${bunName} (верх)`
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
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
    cy.get('[data-cy="total-price"]').should('have.text', '2949');
  });

  // Модальное окно ингредиента
  it('Открывает и закрывает модальное окно ингредиента', () => {
    cy.contains(bunName).click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-content"]').should('contain', bunName);

    // Закрытие по крестику
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Повторное открытие
    cy.contains(bunName).click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрытие по оверлею
    cy.get('[data-cy="modal"]')
      .siblings('[data-cy="modal-overlay"]')
      .click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
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
    cy.get('[data-cy="order-button"]').click();

    // Проверяем запрос
    cy.wait('@createOrder')
      .its('response.body.order.number')
      .should('eq', 12345);

    // Проверяем модальное окно
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('have.text', '12345');

    // Закрываем
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="order-modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy^="constructor-ingredient-"]').should('have.length', 0);
    cy.get('[data-cy="total-price"]').should('have.text', '0');
  });
});
