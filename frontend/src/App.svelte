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
  import {
    formatMoneyToDisplay,
    resolveImgPath,
    sortDeals,
  } from "./lib/common";
  import UnknownAssetModal from "./lib/UnknownAssetModal.svelte";
  import Notifications from "./lib/Notifications.svelte";
  import ClearNotesModal from "./lib/ClearNotesModal.svelte";
  import backgroundImage from "./assets/bg.jpg";

  // Set background image
  document.body.style.backgroundImage = `url(${resolveImgPath(
    backgroundImage
  )})`;
  document.body.style.backgroundSize = "cover";

  /** List of user defined assets */
  let customAssets: CustomAsset[] = [];
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
  let mainDiv: HTMLElement;

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
    notesWithWrongPassword = [];
    notesWithUnknownAssets = [];
    customAssets = [];

    _errors.forEach((e) => {
      if (e.name === "WrongPassword") {
        const prevRequest = request.find((p) => p.name === e.file);
        if (prevRequest) notesWithWrongPassword.push(prevRequest);
        else {
          console.warn(
            `Couldn't find a previous request matching ${e.file} in the list of requests below`
          );
          console.log(request);
        }
      } else if (e.name === "UnknownAsset" && "asset" in e) {
        const prevRequest = request.find((p) => p.name === e.file);
        if (prevRequest) {
          notesWithUnknownAssets.push({
            ...prevRequest,
            missingAsset: e.asset,
          });
          customAssets.push({
            name: e.asset,
            cnpj: "",
            code: "",
            isFII: false,
          });
        } else {
          console.warn(
            `Couldn't find a previous request matching ${e.file} in the list of requests below`
          );
          console.log(request);
        }
      }
    });
    result.forEach((n) => n.deals.sort(sortDeals));
    const previousLength = notes.length;
    notes.push(
      ...result.filter((r) => !notes.some((n) => n.number === r.number))
    );
    pushNotificationsOfNewNotes(notes.length - previousLength);
    notes = notes;
    flatDeals = notes.flatMap((n) => n.deals);
    flatDeals.sort(sortDeals);
    clickedBack = false;
  }

  /**
   * Display a push notifications about new notes processed
   * @param amount the new amount of processed notes
   */
  function pushNotificationsOfNewNotes(amount: number) {
    if (amount > 0) {
      new Notifications({
        target: mainDiv,
        props: {
          type: "success",
          message: `${amount} nota${amount > 1 ? "s" : ""} adicionada${
            amount > 1 ? "s" : ""
          }`,
        },
      });
    } else {
      new Notifications({
        target: mainDiv,
        props: {
          type: "warning",
          message: `Nenhuma nova nota adicionada. Duplicatas são ignoradas`,
        },
      });
    }
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

<main bind:this={mainDiv}>
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
            .processNotes(notesToParse, passwords, customAssets)
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
            activeIndex = 0;
            clickedBack = true;
          }}
          onClickClearNotes={(tab) => {
            return new Promise((resolve) => {
              new ClearNotesModal({
                target: mainDiv,
                props: {
                  note: tab,
                  onConfirm: () => {
                    if (tab === "all") {
                      notes = [];
                      flatDeals = [];
                      notesWithWrongPassword = [];
                      notesWithUnknownAssets = [];
                    } else {
                      notes = notes.filter((n) => n.number !== tab);
                      flatDeals = notes.flatMap((n) => n.deals);
                      flatDeals.sort(sortDeals);
                    }
                    resolve(true);
                  },
                  onDismiss: () => {
                    resolve(false);
                  },
                },
              });
            });
          }}
          onClickExportCsv={(tab) => {
            let data = "";
            if (tab === "all") {
              data = flatDeals
                .map(
                  (d) =>
                    `${d.code}\t${d.cnpj}\t${d.date}\t${
                      d.type === "buy" ? "Compra" : "Venda"
                    }\t${d.quantity}\t${formatMoneyToDisplay(d.price)}`
                )
                .join("\n");
            } else {
              const note = notes.find((n) => n.number === tab);
              if (!note) {
                new Notifications({
                  target: mainDiv,
                  props: {
                    type: "error",
                    message: `Não foi possível gerar o .csv da nota Nº ${tab}. A nota parece ter sido removida`,
                  },
                });
              } else {
                data = note.deals
                  .map(
                    (d) =>
                      `${d.code}\t${d.cnpj}\t${d.date}\t${
                        d.type === "buy" ? "Compra" : "Venda"
                      }\t${d.quantity}\t${formatMoneyToDisplay(d.price)}`
                  )
                  .join("\n");
              }
            }

            const csv = document.createElement("a");
            csv.setAttribute(
              "href",
              "data:text/plain;charset=utf-8," +
                encodeURIComponent(
                  "Código\tCNPJ\tData\tCompra/Venda\tQuantidade\tPreços+custos\n" +
                    data
                )
            );
            csv.setAttribute("download", "Notas.csv");
            csv.style.display = "none";
            csv.click();
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
        .processNotes(notesWithWrongPassword, passwords, customAssets)
        .then((response) =>
          handleServerResponse(notesWithWrongPassword, response)
        );
    }}
    onDismiss={() => {
      notesWithWrongPassword = [];
    }}
  />
  <UnknownAssetModal
    {customAssets}
    {notesWithUnknownAssets}
    onRetry={() => {
      window.api
        .processNotes(notesWithUnknownAssets, passwords, customAssets)
        .then((response) =>
          handleServerResponse(notesWithUnknownAssets, response)
        );
    }}
    onDismiss={() => {
      notesWithUnknownAssets = [];
    }}
  />
</main>

<style global>
  main {
    display: flow-root;
  }

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
