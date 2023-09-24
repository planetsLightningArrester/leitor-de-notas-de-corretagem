<script lang="ts">
  import { Container, Table, TabContent, TabPane, Icon } from "sveltestrap";
  import { NegotiationNote, type Deal } from "parser-de-notas-de-corretagem";

  export let notes: NegotiationNote[] = [];
  export let flatDeals: Deal[] = [];
  export let onClickBack: () => void;

  /**
   * Format money to display
   * @param value a string value formatted as `AAAAAA.BB`
   * @returns the `value` formatted as `AAA.AAA,BB`
   */
  function formatMoneyToDisplay(value: string): string {
    return value
      .replace(".", "")
      .split("")
      .reverse()
      .flatMap((c, i, arr) =>
        i - 2 > 0 && i < arr.length - 1 && (i - 1) % 3 === 0
          ? `.${c}`
          : i === 1
          ? `,${c}`
          : c
      )
      .reverse()
      .join("");
  }

  $: {
    notes = notes;
    flatDeals = flatDeals;
  }
</script>

<!-- Drop zone -->
<Container>
  <Icon
    onclick={onClickBack}
    style="font-size: 24px; color: white; cursor: pointer"
    name="arrow-left"
  />
  <TabContent>
    <TabPane
      tabId="all"
      style="overflow: auto!important; max-height: 70vh!important"
      active
    >
      <span slot="tab">
        Tudo <Icon name="clipboard-data" />
      </span>
      <Table responsive>
        <thead>
          <th>Código</th>
          <th>CNPJ</th>
          <th>Data</th>
          <th>Compra/Venda</th>
          <th>Quantidade</th>
          <th>Preços+custos</th>
        </thead>
        <tbody>
          {#each flatDeals as deal}
            <tr>
              <td>{deal.code}</td>
              <td>{deal.cnpj}</td>
              <td>{deal.date}</td>
              <td>{deal.type === "buy" ? "Compra" : "Venda"}</td>
              <td>{deal.quantity}</td>
              <td>R$ {formatMoneyToDisplay(deal.price)}</td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </TabPane>
    {#each notes as note}
      <TabPane tabId={note.number}>
        <span slot="tab">
          Nº {note.number}
        </span>
        <Table responsive>
          <thead>
            <th>Código</th>
            <th>CNPJ</th>
            <th>Data</th>
            <th>Compra/Venda</th>
            <th>Quantidade</th>
            <th>Preços+custos</th>
          </thead>
          <tbody>
            {#each note.deals as deal}
              <tr>
                <td>{deal.code}</td>
                <td>{deal.cnpj}</td>
                <td>{deal.date}</td>
                <td>{deal.type === "buy" ? "Compra" : "Venda"}</td>
                <td>{deal.quantity}</td>
                <td>
                  R$ {formatMoneyToDisplay(deal.price)}
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </TabPane>
    {/each}
  </TabContent>
</Container>

<style>
  th {
    padding: 8px;
    color: white;
    text-align: center;
  }
  td {
    background-color: #353944 !important;
    color: white !important;
    text-align: center;
  }
</style>