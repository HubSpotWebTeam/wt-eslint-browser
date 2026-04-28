import 'cypress-axe';

const WCAG_RULE_SETS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

function logViolations(violations) {
  violations.forEach(({ id, help, impact, nodes, helpUrl }) => {
    const targets = nodes.map(({ target }) => target.join(', ')).join('\n    ');
    console.error(`[a11y][${impact}] ${id}: ${help}\n    targets: ${targets}\n    ${helpUrl}`);
    Cypress.log({
      name: 'a11y violation',
      message: `[${impact}] ${id}: ${help}`,
      consoleProps: () => ({ id, help, impact, targets, helpUrl }),
    });
  });
}

Cypress.Commands.add('checkAccessibility', (context) => {
  cy.get('body').then(($body) => {
    if (!$body.hasClass('high-contrast')) {
      $body.addClass('high-contrast');
    }
  });

  cy.checkA11y(
    context,
    {
      runOnly: {
        type: 'tag',
        values: WCAG_RULE_SETS,
      },
    },
    logViolations,
  );
});
