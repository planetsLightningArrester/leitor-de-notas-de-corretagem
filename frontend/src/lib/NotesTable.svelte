<script lang="ts">
  import { clearMatches } from "./Find.svelte";
  import { type TableHeader, sortDeals } from "./common";
  import {
    Container,
    Table,
    TabContent,
    TabPane,
    Icon,
    Row,
    Col,
    Button,
  } from "sveltestrap";
  import { NegotiationNote, type Deal } from "parser-de-notas-de-corretagem";

  /** All `NegotiationNotes` */
  export let notes: NegotiationNote[] = [];
  /** All `Deals` to be shown on All tab */
  export let flatDeals: Deal[] = [];
  /** Callback for when the 'go back' button is clicked */
  export let onClickBack: () => void;
  /** Callback for when the 'clear notes' button is clicked */
  export let onClickClearNotes: () => void;

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

  /** Current table sort order */
  let currentSortOrder: {
    header: TableHeader;
    direction: "up" | "down";
  } = {
    header: "code",
    direction: "down",
  };

  /**
   * Handle clicks on the headers to define the sort order
   * @param header the `TableHeader` clicked
   */
  function sortTable(header: TableHeader) {
    // ? This is required to prevent highlights to keep selecting a row that was re-arranged
    clearMatches(true);
    let direction: "up" | "down";
    if (header === currentSortOrder.header) {
      direction = currentSortOrder.direction === "up" ? "down" : "up";
      currentSortOrder.direction = direction;
    } else {
      direction = "down";
      currentSortOrder = { header, direction };
    }

    notes.forEach((n) =>
      n.deals.sort((p, c) => sortDeals(p, c, header, direction))
    );
    flatDeals.sort((p, c) => sortDeals(p, c, header, direction));
    // ? Force re-rendering
    notes = notes;
    flatDeals = flatDeals;
  }
</script>

<!-- Drop zone -->
<Container>
  <!-- Arrow to go back to the initial screen -->
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
          <th on:click={() => sortTable("code")}
            >Código{currentSortOrder.header === "code"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("cnpj")}
            >CNPJ{currentSortOrder.header === "cnpj"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("date")}
            >Data{currentSortOrder.header === "date"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("type")}
            >Compra/Venda{currentSortOrder.header === "type"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("quantity")}
            >Quantidade{currentSortOrder.header === "quantity"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("price")}
            >Preços+custos{currentSortOrder.header === "price"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
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
          <th on:click={() => sortTable("code")}
            >Código{currentSortOrder.header === "code"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("cnpj")}
            >CNPJ{currentSortOrder.header === "cnpj"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("date")}
            >Data{currentSortOrder.header === "date"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("type")}
            >Compra/Venda{currentSortOrder.header === "type"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("quantity")}
            >Quantidade{currentSortOrder.header === "quantity"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
          <th on:click={() => sortTable("price")}
            >Preços+custos{currentSortOrder.header === "price"
              ? currentSortOrder.direction === "down"
                ? "▼"
                : "▲"
              : ""}</th
          >
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
  <Row>
    <Col class="d-flex justify-content-center my-2">
      <Button color="danger" on:click={onClickClearNotes}>
        <Icon name="trash" />
        Limpar tudo
      </Button>
    </Col>
  </Row>
</Container>

<style>
  th {
    padding: 8px;
    color: white;
    text-align: center;
    cursor: pointer;
  }
  td {
    background-color: #353944 !important;
    color: white !important;
    text-align: center;
  }
</style>
