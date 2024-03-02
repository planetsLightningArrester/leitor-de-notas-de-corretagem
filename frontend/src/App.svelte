<script lang="ts">
  import './i18n'
  import { _ } from 'svelte-i18n'
  import Footer from './lib/Footer.svelte'
  import DropZone from './lib/DropZone.svelte'
  import backgroundImage from './assets/bg.jpg'
  import NotesTable from './lib/NotesTable.svelte'
  import PasswordModal from './lib/PasswordModal.svelte'
  import Notifications from './lib/Notifications.svelte'
  import LocaleSwitches from './lib/LocaleSwitches.svelte'
  import ClearNotesModal from './lib/ClearNotesModal.svelte'
  import UnknownAssetModal from './lib/UnknownAssetModal.svelte'
  import { type NegotiationNote, type Deal, type UnknownAsset, type WrongPassword } from 'parser-de-notas-de-corretagem'
  import { formatMoneyToDisplay, resolveImgPath, sortDeals } from './lib/common'
  import { Button, Carousel, CarouselItem, Col, Container, Icon, Row, Styles } from '@sveltestrap/sveltestrap'

  // Set background image
  document.body.style.backgroundImage = `url(${resolveImgPath(backgroundImage)})`
  document.body.style.backgroundSize = 'cover'

  $: {
    // Set title
    document.title = $_('main_page.title')
  }

  /** List of user defined assets */
  let customAssets: CustomAsset[] = []
  /** List of user defined assets */
  const ignoreCustomAssets: string[] = []
  /** List of possible passwords */
  const passwords: string[] = []
  /** Parsed notes */
  let notes: NegotiationNote[] = []
  /** Note results for the tab "all" */
  let flatDeals: Deal[] = []
  /** Notes that issued a wrong password error */
  let notesWithWrongPassword: NoteToBeParsed[] = []
  /** Notes that issued a unknown asset error */
  let notesWithUnknownAssets: NoteToBeParsed[] = []
  let mainDiv: HTMLElement

  // Page index control
  let activeIndex = 0
  let clickedBack = false

  // Updates
  const checkingForUpdates = false
  let update: Update | undefined
  window.api
    .checkUpdates()
    .then((value) => (update = value))
    .catch((reason) => {
      console.error('Error checking for updates')
      if (reason instanceof Error) console.error(reason.message)
      else console.error(reason)
    })
  const onUpdateAssets = async (): Promise<void> => {
    if (typeof update !== 'undefined') window.api.proceedWithUpdate(update)
  }

  /**
   * Handle server response of a parse request
   * @param request the requested `NoteToBeParsed[]`
   * @param response an `Array` with the server response, where the first
   * position are possible password errors, and the second position are the
   * successfully parsed `NegotiationNote[]` results
   * @param replace whether the result should replace an already parsed note
   * or be discarded if duplicated. Default is `false` (discard)
   */
  function handleProcessNotesResponse(request: NoteToBeParsed[], response: ProcessNotesResult, replace = false): void {
    const errors: Array<WrongPassword | UnknownAsset> = response.errors
    const results: NegotiationNote[] = response.results
    notesWithWrongPassword = []
    notesWithUnknownAssets = []
    customAssets = []

    errors.forEach((e) => {
      if (e.name === 'WrongPassword') {
        const prevRequest = request.find((p) => p.name === e.file)
        if (typeof prevRequest !== 'undefined') notesWithWrongPassword.push(prevRequest)
        else {
          console.warn(`Couldn't find a previous request matching ${e.file} in the list of requests below`)
          console.log(request)
        }
      } else if (e.name === 'UnknownAsset' && 'asset' in e) {
        const prevRequest = request.find((p) => p.name === e.file)
        if (typeof prevRequest !== 'undefined') {
          if (!ignoreCustomAssets.some((code) => code === e.asset)) {
            notesWithUnknownAssets.push({
              ...prevRequest,
              missingAsset: e.asset,
            })
            customAssets.push({
              name: e.asset,
              cnpj: '',
              code: '',
              isFII: false,
            })
          }
        } else {
          console.warn(`Couldn't find a previous request matching ${e.file} in the list of requests below`)
          console.log(request)
        }
      }
    })
    results.forEach((n) => n.deals.sort(sortDeals))
    const previousLength = notes.length
    if (replace) {
      results.forEach((r) => {
        const existentIndex = notes.findIndex((n) => n.number === r.number)
        if (existentIndex !== -1) {
          notes.splice(existentIndex, 1, r)
        } else notes.push(r)
      })
      const notification = new Notifications({
        target: mainDiv,
        props: {
          type: 'success',
          message: $_('notes_page.note_reloaded'),
        },
      })
      notification.$on('destroy', () => {
        notification.$destroy()
      })
    } else {
      notes.push(...Array.from<NegotiationNote>(results.filter((r) => !notes.some((n) => n.number === r.number))))
      pushNotificationsOfNewNotes(notes.length - previousLength)
    }

    notes = notes
    flatDeals = notes.flatMap((n) => n.deals)
    flatDeals.sort(sortDeals)
    clickedBack = false
  }

  /**
   * Display a push notifications about new notes processed
   * @param amount the amount of new notes processed
   */
  function pushNotificationsOfNewNotes(amount: number): void {
    let notification: Notifications
    if (amount > 0) {
      notification = new Notifications({
        target: mainDiv,
        props: {
          type: 'success',
          message: $_({ id: amount > 1 ? 'notes_page.notes_added' : 'notes_page.note_added', values: { amount } }),
        },
      })
    } else {
      notification = new Notifications({
        target: mainDiv,
        props: {
          type: 'warning',
          message: $_('notes_page.no_note_added'),
        },
      })
    }
    notification.$on('destroy', () => {
      notification.$destroy()
    })
  }

  /**
   * Handle updates on the drop-zone
   * @param notesToParse the files updated into the drop-zone
   */
  function onUpdateDropZone(notesToParse: NoteToBeParsed[]): void {
    window.api
      .processNotes(notesToParse, passwords, customAssets)
      .then((response) => {
        handleProcessNotesResponse(notesToParse, response)
      })
      .catch((reason) => {
        console.error('Error processing notes')
        if (reason instanceof Error) console.error(reason.message)
        else console.error(reason)
      })
  }

  $: {
    activeIndex = !clickedBack && notes.length > 0 && flatDeals.length > 0 && typeof notes[0] !== 'undefined' && typeof flatDeals[0] !== 'undefined' ? 1 : 0
  }
</script>

<Styles />

<main bind:this={mainDiv}>
  <Carousel items={[]} bind:activeIndex interval={false}>
    <CarouselItem bind:activeIndex itemIndex={0} class="fade-in">
      <!-- Title -->
      <Container>
        <div class="container title-container">
          <Row>
            <Col>
              <p data-testid="main-page-title" class="title-text position-relative">
                <b>{$_('main_page.title')}</b>
              </p>
            </Col>
          </Row>
        </div>
      </Container>
      <!-- Drop zone -->
      <DropZone onUpdate={onUpdateDropZone} />
      {#if update}
        <Container>
          <Row class="justify-content-center">
            <Col xs="8" style="text-align: center; max-width: 350px">
              {#if !checkingForUpdates}
                <button class="info-text info-text-button" on:click={onUpdateAssets}>
                  {$_('main_page.update')}
                  <Icon style="font-size: 15px; color: white; margin-left: 10px" name="download" />
                </button>
              {:else}
                <p class="info-text">{$_('main_page.updating')}</p>
              {/if}
            </Col>
          </Row>
        </Container>
      {/if}
      <LocaleSwitches />
      {#if clickedBack}
        <Container>
          <Row style="justify-content: center; margin-top: 20px">
            <Col xs={12} style="max-width: 600px; display: flex; justify-content: right">
              <Button
                color="secondary"
                style="margin-bottom: 75px; background: none"
                on:click={() => {
                  activeIndex = 1
                  clickedBack = false
                }}
              >
                <span style="font-size: 20px; color: white">{$_('main_page.back_to_notes')}</span>
                <Icon style="font-size: 20px; color: white; margin-left: 10px" name="arrow-right" />
              </Button>
            </Col>
          </Row>
        </Container>
      {/if}
    </CarouselItem>
    <CarouselItem bind:activeIndex itemIndex={1} class="fade-in">
      {#if notes.length > 0 && flatDeals.length > 0 && typeof notes[0] !== 'undefined' && typeof flatDeals[0] !== 'undefined'}
        <NotesTable
          {notes}
          {flatDeals}
          onClickBack={() => {
            activeIndex = 0
            clickedBack = true
          }}
          onClickClearNotes={async (tab) => {
            return await new Promise((resolve) => {
              const clearNotesModal = new ClearNotesModal({
                target: mainDiv,
                props: {
                  note: tab,
                  onConfirm: () => {
                    if (tab === 'all') {
                      notes = []
                      flatDeals = []
                      notesWithWrongPassword = []
                      notesWithUnknownAssets = []
                    } else {
                      notes = notes.filter((n) => n.number !== tab)
                      flatDeals = notes.flatMap((n) => n.deals)
                      flatDeals.sort(sortDeals)
                    }
                    resolve(true)
                  },
                  onDismiss: () => {
                    resolve(false)
                  },
                },
              })
              clearNotesModal.$on('destroy', () => {
                clearNotesModal.$destroy()
              })
            })
          }}
          onClickExportCsv={(tab) => {
            let data = ''
            if (tab === 'all') {
              data = flatDeals.map((d) => `${d.code}\t${d.cnpj}\t${d.date}\t${d.type === 'buy' ? $_('words.buy') : $_('words.sell')}\t${d.quantity}\t${formatMoneyToDisplay(d.price)}`).join('\n')
            } else {
              const note = notes.find((n) => n.number === tab)
              if (typeof note === 'undefined') {
                const notification = new Notifications({
                  target: mainDiv,
                  props: {
                    type: 'error',
                    message: $_({ id: 'csv_error', values: { tab } }),
                  },
                })
                notification.$on('destroy', () => {
                  notification.$destroy()
                })
              } else {
                data = note.deals.map((d) => `${d.code}\t${d.cnpj}\t${d.date}\t${d.type === 'buy' ? $_('words.buy') : $_('words.sell')}\t${d.quantity}\t${formatMoneyToDisplay(d.price)}`).join('\n')
              }
            }

            const csv = document.createElement('a')
            csv.setAttribute(
              'href',
              'data:text/plain;charset=utf-8,' +
                encodeURIComponent(`${$_('words.code')}\t${$_('words.cnpj')}\t${$_('words.date')}\t${$_('words.buy_sell')}\t${$_('words.amount')}\t${$_('words.price_cost')}\n` + data),
            )
            csv.setAttribute('download', $_('words.notes') + '.csv')
            csv.style.display = 'none'
            csv.click()
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
        .processNotes([...notesWithUnknownAssets, ...notesWithWrongPassword], passwords, customAssets)
        .then((response) => {
          handleProcessNotesResponse([...notesWithUnknownAssets, ...notesWithWrongPassword], response)
        })
        .catch((reason) => {
          console.error('Error on processing notes')
          if (reason instanceof Error) console.error(reason.message)
          else console.error(reason)
        })
    }}
    onDismiss={() => {
      notesWithWrongPassword = []
    }}
  />
  <UnknownAssetModal
    {customAssets}
    {notesWithUnknownAssets}
    onRetry={() => {
      window.api
        .processNotes([...notesWithUnknownAssets, ...notesWithWrongPassword], passwords, customAssets)
        .then((response) => {
          handleProcessNotesResponse([...notesWithUnknownAssets, ...notesWithWrongPassword], response, true)
        })
        .catch((reason) => {
          console.error('Error on processing notes')
          if (reason instanceof Error) console.error(reason.message)
          else console.error(reason)
        })
    }}
    onDismiss={() => {
      notesWithUnknownAssets = []
      customAssets.forEach((c) => {
        if (!ignoreCustomAssets.some((name) => name === c.name)) ignoreCustomAssets.push(c.name)
      })
    }}
  />
</main>

<style global lang="scss">
  main {
    display: flow-root;
  }

  .title-container {
    margin-top: 100px;
    user-select: none;
  }

  .title-text {
    font-family: 'Roboto Slab', serif;
    text-align: center;
    color: #d6d6d6;
    font-size: 50px;
    user-select: none;
    text-shadow:
      0 0 6px #000000,
      0 0 10px #000000;
  }

  .info-text {
    font-family: 'Roboto Slab', serif;
    color: #d6d6d680;
    font-size: 15px;
    text-align: center;
    text-decoration: underline;
    user-select: none;
    text-shadow:
      0 0 6px #000000,
      0 0 10px #000000;
    background-color: #0000006b;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 0;
    &-button {
      cursor: pointer;
      border: none;
      background-color: transparent;
    }
  }

  /* Required to apply to Svelte components */
  :global(.fade-in) {
    animation: fadeIn 1s;
  }

  @keyframes fadIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
