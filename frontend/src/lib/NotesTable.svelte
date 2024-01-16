<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Find, { clearMatches } from './Find.svelte'
  import { type NegotiationNote, type Deal } from 'parser-de-notas-de-corretagem'
  import { type TableHeader, noTypeCheck, sortDeals, formatMoneyToDisplay } from './common'
  import { Container, Table, TabContent, TabPane, Icon, Row, Col, Button } from '@sveltestrap/sveltestrap'

  /** All `NegotiationNotes` */
  export let notes: NegotiationNote[] = []
  /** All `Deals` to be shown on All tab */
  export let flatDeals: Deal[] = []
  /** Callback for when the 'go back' button is clicked */
  export let onClickBack: () => void
  /** Callback for when the 'clear notes' button is clicked. If the note was really removed, the function must return `true` */
  export let onClickClearNotes: (tab: string) => Promise<boolean>
  /** Callback for when the 'export csv' button is clicked */
  export let onClickExportCsv: (tab: string) => void

  let currentTab: string = 'all'

  /** Current table sort order */
  let currentSortOrder: {
    header: TableHeader
    direction: 'up' | 'down'
  } = {
    header: 'code',
    direction: 'down',
  }

  /**
   * Handle clicks on the headers to define the sort order
   * @param header the `TableHeader` clicked
   */
  function sortTable(header: TableHeader): void {
    // ? This is required to prevent highlights to keep selecting a row that was re-arranged
    clearMatches(true)
    let direction: 'up' | 'down'
    if (header === currentSortOrder.header) {
      direction = currentSortOrder.direction === 'up' ? 'down' : 'up'
      currentSortOrder.direction = direction
    } else {
      direction = 'down'
      currentSortOrder = { header, direction }
    }

    notes.forEach((n) => n.deals.sort((p, c) => sortDeals(p, c, header, direction)))
    flatDeals.sort((p, c) => sortDeals(p, c, header, direction))
    // ? Force re-rendering
    notes = notes
    flatDeals = flatDeals
  }
</script>

<Find />
<Container data-testid="table-container" id="table-container">
  <!-- Arrow to go back to the initial screen -->
  <button data-testid="go-to-initial-screen-button" on:click={onClickBack} style="background-color: transparent; border: none">
    <Icon style="font-size: 24px; color: white; cursor: pointer" name="arrow-left" />
  </button>
  <!-- Tabs -->
  <TabContent
    on:tab={(e) => {
      if ('detail' in e && typeof e.detail === 'string') currentTab = e.detail
    }}
  >
    <TabPane id="all-pane" tabId="all" style="overflow: auto!important; max-height: 70vh!important" active={currentTab === 'all'}>
      <span slot="tab" style="user-select: none">
        {$_('words.all')}
        <Icon name="clipboard-data" />
      </span>
      <Table responsive>
        <thead>
          <th
            on:click={() => {
              sortTable('code')
            }}>{$_('words.code')}{currentSortOrder.header === 'code' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('cnpj')
            }}>{$_('words.cnpj')}{currentSortOrder.header === 'cnpj' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('date')
            }}>{$_('words.date')}{currentSortOrder.header === 'date' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('type')
            }}>{$_('words.buy_sell')}{currentSortOrder.header === 'type' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('quantity')
            }}>{$_('words.amount')}{currentSortOrder.header === 'quantity' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('price')
            }}>{$_('words.price_cost')}{currentSortOrder.header === 'price' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
        </thead>
        <tbody>
          {#each flatDeals as deal}
            <tr>
              <td>{deal.code}</td>
              <td>{deal.cnpj}</td>
              <td>{deal.date}</td>
              <td>{deal.type === 'buy' ? $_('words.buy') : $_('words.sell')}</td>
              <td>{deal.quantity}</td>
              <td>R$ {formatMoneyToDisplay(deal.price)}</td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </TabPane>
    {#each notes as note}
      <TabPane tabId={note.number} style="overflow: auto!important; max-height: 70vh!important" active={currentTab === note.number}>
        <span {...noTypeCheck({ 'data-testid': `tab-${note.number}` })} slot="tab" style="user-select: none">
          Nº {note.number}
        </span>
        <Table responsive>
          <th
            on:click={() => {
              sortTable('code')
            }}
          >
            {$_('words.code')}{currentSortOrder.header === 'code' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('cnpj')
            }}
          >
            {$_('words.cnpj')}{currentSortOrder.header === 'cnpj' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('date')
            }}
          >
            {$_('words.date')}{currentSortOrder.header === 'date' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('type')
            }}
          >
            {$_('words.buy_sell')}{currentSortOrder.header === 'type' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('quantity')
            }}
          >
            {$_('words.amount')}{currentSortOrder.header === 'quantity' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <th
            on:click={() => {
              sortTable('price')
            }}
          >
            {$_('words.price_cost')}{currentSortOrder.header === 'price' ? (currentSortOrder.direction === 'down' ? '▼' : '▲') : ''}</th
          >
          <tbody>
            {#each note.deals as deal}
              <tr data-testid={`tab-${note.number}-${deal.code}`}>
                <td>{deal.code}</td>
                <td>{deal.cnpj}</td>
                <td>{deal.date}</td>
                <td>{deal.type === 'buy' ? $_('words.buy') : $_('words.sell')}</td>
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
    <Col class="d-flex justify-content-center align-itens-center my-2">
      <Row>
        <Col>
          <Button
            color="success"
            on:click={() => {
              onClickExportCsv(currentTab)
            }}
          >
            <Icon name="filetype-csv" />
            {$_({ id: 'notes_page.export', values: { what: currentTab === 'all' ? $_('notes_page.all') : `Nº ${currentTab}` } })}
          </Button>
        </Col>
        <Col class="d-flex">
          <Button
            color="danger"
            on:click={() => {
              onClickClearNotes(currentTab)
                .then((result) => {
                  if (result && currentTab !== 'all') {
                    currentTab = 'all'
                    // ? That's messy, but I couldn't find a way to activate the all tab after deleting one
                    let el
                    el = document.getElementById('all-pane')
                    if (el !== null) el = el.parentNode
                    if (el !== null) el = el.children
                    if (el !== null) el = el.item(0)
                    if (el !== null) el = el.children
                    if (el !== null) el = el.item(0)
                    if (el !== null) el = el.children
                    if (el !== null) el = el.item(0)
                    if (el !== null && el instanceof HTMLElement) el.click()
                  }
                })
                .catch((reason) => {
                  console.error('Error on clearing notes')
                  if (reason instanceof Error) console.error(reason.message)
                  else console.error(reason)
                })
            }}
          >
            <Icon name="trash" />
            {currentTab === 'all' ? $_('notes_page.clean_all') : $_({ id: 'notes_page.clean_note', values: { note: currentTab } })}
          </Button>
        </Col>
      </Row>
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
