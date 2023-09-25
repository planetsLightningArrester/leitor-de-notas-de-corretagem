<script lang="ts">
  import Footer from "./lib/Footer.svelte";
  import DropZone from "./lib/DropZone.svelte";
  import {
    Button,
    Carousel,
    CarouselItem,
    Col,
    Container,
    Icon,
    Row,
    Styles,
  } from "sveltestrap";
  import NotesTable from "./lib/NotesTable.svelte";
  import {
    type NegotiationNote,
    type Deal,
    type WrongPassword,
    type UnknownAsset,
  } from "parser-de-notas-de-corretagem";
  import Find from "./lib/Find.svelte";
  import PasswordModal from "./lib/PasswordModal.svelte";
  import { sortDeals } from "./lib/common";

  /** List of possible passwords */
  let passwords: string[] = [];
  /** Parsed notes */
  let notes: NegotiationNote[] = [];
  /** Note results for the tab "all"*/
  let flatDeals: Deal[] = [];
  /** Notes that issued a wrong password error*/
  let notesWithWrongPassword: NoteToBeParsed[] = [];
  /** Notes that issued a unknown asset error*/
  let notesWithUnknownAssets: NoteToBeParsed[] = [];

  // Page index control
  let activeIndex = 0;
  let clickedBack = false;

  /**
   * Handle server response of a parse request
   * @param request the requested `NoteToBeParsed[]`
   * @param response an `Array` with the server response, where the first
   * position are possible password errors, and the second position are the
   * successfully parsed `NegotiationNote[]` results
   */
  function handleServerResponse(
    request: NoteToBeParsed[],
    response: [Array<WrongPassword | UnknownAsset>, NegotiationNote[]]
  ) {
    const [_errors, result] = response;
    notesWithWrongPassword = _errors.flatMap(
      (e) =>
        e.name === "WrongPassword" && request.find((p) => p.name === e.file)
    );
    notesWithUnknownAssets = _errors.flatMap(
      (e) => e.name === "UnknownAsset" && request.find((p) => p.name === e.file)
    );
    result.forEach((n) => n.deals.sort(sortDeals));
    notes.push(
      ...result.filter((r) => !notes.some((n) => n.number === r.number))
    );
    notes = notes;
    flatDeals = notes.flatMap((n) => n.deals);
    flatDeals.sort(sortDeals);
    clickedBack = false;
  }

  $: {
    activeIndex =
      !clickedBack &&
      notes.length &&
      flatDeals.length &&
      notes[0] &&
      flatDeals[0]
        ? 1
        : 0;
  }
</script>

<Styles />

<main>
  <Find />
  <Carousel items={[]} bind:activeIndex interval={false}>
    <CarouselItem bind:activeIndex itemIndex={0} class="fade-in">
      <!-- Title -->
      <Container>
        <div class="container title-container">
          <Row>
            <Col>
              <p class="title-text"><b>Leitor de notas de corretagem</b></p>
            </Col>
          </Row>
        </div>
      </Container>
      <!-- Drop zone -->
      <DropZone
        onUpdate={(notesToParse) => {
          // Send the request to the server
          window.api
            .processNotes(notesToParse, passwords)
            .then((response) => handleServerResponse(notesToParse, response));
        }}
      />
      {#if clickedBack}
        <Container>
          <Row style="justify-content: center">
            <Col
              xs={12}
              style="max-width: 600px; display: flex; justify-content: right"
            >
              <Button
                color="secondary"
                style="margin-bottom: 75px; background: none"
                on:click={() => {
                  activeIndex = 1;
                  clickedBack = false;
                }}
              >
                <span style="font-size: 20px; color: white"
                  >Voltar para notas carregadas</span
                >
                <Icon
                  style="font-size: 24px; color: white"
                  name="arrow-right"
                />
              </Button>
            </Col>
          </Row>
        </Container>
      {/if}
    </CarouselItem>
    <CarouselItem bind:activeIndex itemIndex={1} class="fade-in">
      {#if notes.length && flatDeals.length && notes[0] && flatDeals[0]}
        <NotesTable
          {notes}
          {flatDeals}
          onClickBack={() => {
            console.log("clicked back");
            activeIndex = 0;
            clickedBack = true;
          }}
        />
      {/if}
    </CarouselItem>
  </Carousel>
  <!-- Footer -->
  <Footer />

  <!-- Hidden items -->
  <PasswordModal
    {passwords}
    {notesWithWrongPassword}
    onRetry={() => {
      window.api
        .processNotes(notesWithWrongPassword, passwords)
        .then((response) =>
          handleServerResponse(notesWithWrongPassword, response)
        );
    }}
    onDismiss={() => {
      notesWithWrongPassword = [];
    }}
  />
</main>

<style global>
  .title-container {
    margin-top: 100px;
  }

  .title-text {
    font-family: "Roboto Slab", serif;
    text-align: center;
    color: #d6d6d6;
    font-size: 50px;
    text-shadow: 0 0 6px #000000, 0 0 10px #000000;
  }

  /* Required to apply to Svelte components */
  :global(.fade-in) {
    animation: fadeIn 1s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
