<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Container, Row, Spinner, Col } from '@sveltestrap/sveltestrap'
  /**
   * Callback when the parsed notes are updated
   * @param notes `NegotiationNote`s parsed
   * @param flatDeals all `Deal`s in a flat `Array`
   */
  export let onUpdate: (notesToParse: NoteToBeParsed[]) => void

  let mainText = $_('main_page.drop_zone.idle_text')
  let loading = false

  // -- Callbacks

  /**
   * Get input files from drag-and-drop or file picker, send the request to the server,
   * and process the response
   * @param files files picked or dragged-and-dropped
   */
  async function processNotes(files: File[]): Promise<void> {
    mainText = $_('main_page.drop_zone.processing')
    loading = true

    if (files.length === 0) {
      mainText = $_('main_page.drop_zone.invalid_files')
      setTimeout(() => {
        mainText = $_('main_page.drop_zone.idle_text')
      }, 2000)
      loading = false
      return
    }

    const pdfs = files.filter((f) => f.type === 'application/pdf')
    if (pdfs.length === 0) {
      mainText = $_('main_page.drop_zone.no_pdf')
      setTimeout(() => {
        mainText = $_('main_page.drop_zone.idle_text')
      }, 2000)
      loading = false
      return
    }

    const toParse: NoteToBeParsed[] = []
    for await (const pdf of pdfs) {
      toParse.push({
        name: pdf.name,
        content: await pdf.arrayBuffer(),
      })
    }

    mainText = $_('main_page.drop_zone.idle_text')
    loading = false

    onUpdate(toParse)
  }

  function onclick(): void {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = () => {
      if (input.files !== null) {
        processNotes(Array.from(input.files)).catch((reason) => {
          console.error('Error on processing notes')
          if (reason instanceof Error) console.error(reason.message)
          else console.error(reason)
        })
      }
    }
    input.click()
  }

  function ondrop(event: DragEvent): void {
    event.preventDefault()
    if (event.dataTransfer !== null) {
      processNotes(Array.from(event.dataTransfer.files)).catch((reason) => {
        console.error('Error on processing notes')
        if (reason instanceof Error) console.error(reason.message)
        else console.error(reason)
      })
    } else mainText = $_('main_page.drop_zone.idle_text')
  }

  function ondragover(event: DragEvent): void {
    event.preventDefault()
    mainText = $_('main_page.drop_zone.drop_here')
  }

  function ondragleave(event: DragEvent): void {
    event.preventDefault()
    mainText = $_('main_page.drop_zone.idle_text')
  }
</script>

<!-- Drop zone -->
<Container id="drop-zone-div" class="container d-flex justify-content-center">
  <button id="drop-zone" data-testid="drop-zone-button" class="align-items-center" on:click={onclick} on:drop={ondrop} on:dragover={ondragover} on:dragleave={ondragleave}>
    <span class="drop-zone-text">
      {mainText}
      {#if loading}
        <Spinner color="primary" class="m-1" style="border-width: 1px" />
      {/if}
    </span>
  </button>
</Container>
<Container>
  <Row class="justify-content-center">
    <Col xs="8" style="text-align: center; max-width: 350px">
      <p class="info-text">{$_('main_page.drop_zone.data_disclaimer')}</p>
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
    font-family: 'Roboto Slab', serif;
    color: #d6d6d660;
    font-size: 30px;
    text-align: center;
    user-select: none;
  }

  .info-text {
    font-family: 'Roboto Slab', serif;
    color: #d6d6d680;
    font-size: 15px;
    text-align: center;
    user-select: none;
    text-shadow:
      0 0 6px #000000,
      0 0 10px #000000;
    background-color: #0000006b;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 0;
  }
</style>
