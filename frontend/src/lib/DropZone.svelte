<script lang="ts">
  import { Container, Row, Spinner } from "sveltestrap";

  let mainText = "Arraste as notas ou clique para carregar 📤";
  let loading = false;

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

    // window.api.processNotes(pdfs)
    console.log(pdfs);
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

  // // Listen to server requests
  // window.api.getCounterResponseFromServer((_, data) => {
  //   console.log(`Received ${JSON.stringify(data)} from main process`);
  // });

  // $: {
  //   // Send a message to the main process every time the counter is updated
  //   window.api.updateServerCounter(count);
  // }
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
  <Row>
    <span class="info-text">Nenhum dado sai do seu computador</span>
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
    background-color: #00000009;
    border-radius: 10px;
  }
</style>
