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
  import { NegotiationNote, type Deal } from "parser-de-notas-de-corretagem";
  import Find from "./lib/Find.svelte";

  let notes: NegotiationNote[] = [];
  let flatDeals: Deal[] = [];
  let activeIndex = 0;
  let clickedBack = false;
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
        onUpdate={(_notes, _flatDeals) => {
          clickedBack = false;
          notes = _notes;
          flatDeals = _flatDeals;
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
