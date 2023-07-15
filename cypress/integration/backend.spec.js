const apiUrl = `${Cypress.env("apiUrl")}`;

describe("Backend Test Spec", () => {
  it("should call ping", () => {
    cy.request({
      failOnStatusCode: false,
      method: "GET",
      url: `${apiUrl}/ping`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should reject bad request", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/transactions`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: "fbf4a552-2418-46c5-b308-6094ddc493a1",
        amount: "1asdads0",
      }),
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
