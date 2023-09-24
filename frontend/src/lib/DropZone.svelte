<script lang="ts">
  import type { Deal, NegotiationNote } from "parser-de-notas-de-corretagem";
  import { Container, Row, Spinner, Col } from "sveltestrap";

  let mainText = "Arraste as notas ou clique para carregar 📤";
  let loading = false;
  /** Note results*/
  let notes: NegotiationNote[] = [];
  /** Note results for the tab "all"*/
  let flatDeals: Deal[] = [];
  export let onUpdate: (notes: NegotiationNote[], flatDeals: Deal[]) => void;

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

    /**
     * Sort `Deal`s using the `Array.sort` function
     * @param a a `Deal`
     * @param b a `Deal`
     */
    function sort(a: Deal, b: Deal): number {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) return 1;
      else {
        if (
          a.date.split("").reverse().join() < b.date.split("").reverse().join()
        )
          return -1;
        else return 1;
      }
    }

    window.api.processNotes(toParse, (_, result) => {
      result.forEach((n: NegotiationNote) => n.deals.sort(sort));
      notes = result;
      flatDeals = result.flatMap((n: NegotiationNote) => n.deals);
      flatDeals.sort(sort);
      onUpdate(notes, flatDeals);
    });

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
  }
</style>