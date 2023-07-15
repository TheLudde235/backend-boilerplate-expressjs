<script>
  const endpoint = "http://localhost:3000";

  let accountId = "fbf4a552-2418-46c5-b308-6094ddc493a1";
  let amount;

  async function getTransactions() {
    try {
      return await (await fetch(endpoint + "/transactions")).json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAccount(accountId) {
    try {
      return await (await fetch(endpoint + `/accounts/${accountId}`)).json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function submit() {
    try {
      await fetch(endpoint + "/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: accountId,
          amount,
        }),
      });
    } catch (err) {
      console.error(err.message);
    }
  }
</script>

<div class="left">
  <h2>Submit new transaction</h2>
  <form id="transaction-form" on:submit={submit}>
    <label for="account-id">Account ID:</label>
    <input data-type="account-id" name="account-id" bind:value={accountId} />
    <label for="amount">Amount:</label>
    <input data-type="amount" name="amount" bind:value={amount} />
    <input
      data-type="transaction-submit"
      type="submit"
      id="submit-button"
      disabled={accountId.length != 36 || Number(amount).toString() == "NaN"}
    />
  </form>
</div>

<div class="right">
  <h2>Transaction history</h2>
  <ul id="transactions">
    {#await getTransactions()}
      LOADING...
    {:then transactions}
      {#each transactions as transaction}
        <div
          data-type="transaction"
          data-account-id={transaction.account_id}
          data-amount={transaction.amount}
          data-balance="0"
          class="transaction"
        >
          <p>
            Transferred
            {transaction.amount < 0
              ? transaction.amount * -1 + "$ from"
              : transaction.amount + "$ to"} account {transaction.account_id}
          </p>
          {#if transaction === transactions[0]}
            {#await getAccount(transaction.account_id) then account}
              <p>The current account balance is {account.balance}</p>
            {/await}
          {/if}
        </div>
      {/each}
    {/await}
  </ul>
</div>

<style>
  .transaction {
    border: solid #111;
    margin: 10px;
    padding: 10px;
  }
</style>
