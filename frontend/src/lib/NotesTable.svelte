<script lang="ts">
  import { Container, Table, TabContent, TabPane, Icon } from "sveltestrap";
  import { NegotiationNote, type Deal } from "parser-de-notas-de-corretagem";

  export let notes: NegotiationNote[] = [];
  export let flatDeals: Deal[] = [];
  export let onClickBack: () => void;

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
    <TabPane tabId="all" active>
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
              <td>R$ {deal.price.replace(".", ",")}</td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </TabPane>
    {#each notes as note}
      <TabPane tabId={note.number}>
        <span slot="tab">
          N {note.number}
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
                <td>R$ {deal.price.replace(".", ",")}</td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </TabPane>
    {/each}
  </TabContent>
</Container>
