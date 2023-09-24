<script lang="ts">
  import { sortDeals } from "./common";
  import {
    Container,
    Row,
    Spinner,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    Button,
  } from "sveltestrap";
  import type {
    Deal,
    NegotiationNote,
    WrongPassword,
  } from "parser-de-notas-de-corretagem";

  let mainText = "Arraste as notas ou clique para carregar 📤";
  let loading = false;
  /** Note results*/
  let notes: NegotiationNote[] = [];
  /** List of possible passwords */
  let passwords: string[] = [];
  /** Note results for the tab "all"*/
  let flatDeals: Deal[] = [];
  let errors: NoteToBeParsed[] = [];
  /**
   * Callback when the parsed notes are updated
   * @param notes `NegotiationNote`s parsed
   * @param flatDeals all `Deal`s in a flat `Array`
   */
  export let onUpdate: (notes: NegotiationNote[], flatDeals: Deal[]) => void;

  /**
   * Handle server response of a parse request
   * @param request the requested `NoteToBeParsed[]`
   * @param response an `Array` with the server response, where the first
   * position are possible password errors, and the second position are the
   * successfully parsed `NegotiationNote[]` results
   */
  function handleServerResponse(
    request: NoteToBeParsed[],
    response: [WrongPassword[], NegotiationNote[]]
  ) {
    const [_errors, result] = response;
    errors = _errors.flatMap((e) => request.find((p) => p.name === e.message));
    result.forEach((n) => n.deals.sort(sortDeals));
    notes.push(
      ...result.filter((r) => !notes.some((n) => n.number === r.number))
    );
    notes = notes;
    flatDeals = notes.flatMap((n) => n.deals);
    flatDeals.sort(sortDeals);
    onUpdate(notes, flatDeals);
  }

  /**
   * Get input files from drag-and-drop or file picker, send the request to the server,
   * and process the response
   * @param files files picked or dragged-and-dropped
   */
  async function processNotes(files: Array<File>) {
    mainText = "Processando";
    loading = true;

    if (!files) {
      mainText = "Arquivos inválidos❗ Use apenas PDFs";
      setTimeout(() => {
        mainText = "Arraste as notas ou clique para carregar 📤";
      }, 2000);
      loading = false;
      return;
    }

    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (!pdfs.length) {
      mainText = "Arquivos inválidos❗ Nenhum PDF encontrado";
      setTimeout(() => {
        mainText = "Arraste as notas ou clique para carregar 📤";
      }, 2000);
      loading = false;
      return;
    }

    const toParse: NoteToBeParsed[] = [];
    for await (const pdf of pdfs) {
      toParse.push({
        name: pdf.name,
        content: await pdf.arrayBuffer(),
      });
    }

    // Send the request to the server
    window.api
      .processNotes(toParse, passwords)
      .then((response) => handleServerResponse(toParse, response));

    mainText = "Arraste as notas ou clique para carregar 📤";
    loading = false;
  }

  function onclick() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      if (input) processNotes(Array.from(input.files));
    };
    input.click();
  }

  function ondrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      processNotes(Array.from(event.dataTransfer.files));
    } else mainText = "Arraste as notas ou clique para carregar 📤";
  }

  function ondragover(event: DragEvent) {
    event.preventDefault();
    mainText = "Solte para carregar";
  }

  function ondragleave(event: DragEvent) {
    event.preventDefault();
    mainText = "Arraste as notas ou clique para carregar 📤";
  }
</script>

<!-- Drop zone -->
<div
  id="drop-zone-div"
  class="container d-flex justify-content-center"
  on:drop={ondrop}
  on:dragover={ondragover}
  on:dragleave={ondragleave}
>
  <button id="drop-zone" class="align-items-center" on:click={onclick}>
    <span class="drop-zone-text">
      {mainText}
      {#if loading}
        <Spinner color="primary" class="m-1" style="border-width: 1px" />
      {/if}
    </span>
  </button>
</div>
<Container>
  <Row class="justify-content-center">
    <Col
      xs="8"
      style="text-align: center; margin-bottom: 20px; max-width: 350px"
    >
      <p class="info-text">Nenhum dado é coletado</p>
    </Col>
  </Row>
</Container>
<!-- Modal with errors -->
<Modal
  header="⚠️ PDFs com senha"
  isOpen={!!errors.length}
  toggle={() => (errors = [])}
>
  <ModalBody>
    <p>
      Os PDFs abaixo precisam de senha. Você pode inserir mais de uma
      possibilidade de senha para os PDFs
    </p>
    {#each errors as error}
      <p>🔑 <b>{error.name}</b></p>
    {/each}
    <Row class="justify-content-center">
      <input
        class="password-input"
        type="password"
        placeholder="Possibilidade 1"
        bind:value={passwords[0]}
      />
    </Row>
    <Row class="justify-content-center">
      <input
        class="password-input"
        type="password"
        placeholder="Possibilidade 2"
        bind:value={passwords[1]}
      />
    </Row>
    <Row class="justify-content-center">
      <input
        class="password-input"
        type="password"
        placeholder="Possibilidade 3"
        bind:value={passwords[2]}
      />
    </Row>
  </ModalBody>
  <ModalFooter>
    <button
      class="btn btn-primary"
      on:click={() =>
        window.api
          .processNotes(errors, passwords)
          .then((response) => handleServerResponse(errors, response))}
    >
      Tentar novamente
    </button>
    <Button on:click={() => (errors = [])}>Ignorar</Button>
  </ModalFooter>
</Modal>

<style>
  #drop-zone {
    display: flex;
    justify-content: center;
    width: 600px;
    height: 300px;
    margin-right: 50px;
    margin-left: 50px;
    background-color: #18141d90;
    border-radius: 30px;
    border-style: dashed;
    border-color: #8b838f;
    border-width: 4px;
    max-width: 588px;
    cursor: pointer;
    transition: 300ms;
  }

  #drop-zone:hover {
    background-color: #18141dc0;
    transition: 300ms;
    scale: 1.01;
  }

  #drop-zone:-moz-drag-over {
    background-color: #18141dc0;
    transition: 300ms;
    scale: 1.01;
  }

  .drop-zone-text {
    font-family: "Roboto Slab", serif;
    color: #d6d6d660;
    font-size: 30px;
    text-align: center;
    user-select: none;
  }

  .info-text {
    font-family: "Roboto Slab", serif;
    color: #d6d6d680;
    font-size: 15px;
    text-align: center;
    user-select: none;
    text-shadow: 0 0 6px #000000, 0 0 10px #000000;
    background-color: #0000006b;
    border-radius: 10px;
    margin-top: 10px;
  }

  .password-input {
    border-radius: 12px;
    padding: 3px 6px 3px 6px;
    max-width: 200px;
  }
</style>
