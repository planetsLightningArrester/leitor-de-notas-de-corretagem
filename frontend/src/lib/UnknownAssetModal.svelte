<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Button, Input, InputGroup, Modal, ModalBody, ModalFooter } from '@sveltestrap/sveltestrap'

  /** List of custom assets */
  export let customAssets: CustomAsset[]
  /** Notes with wrong password */
  export let notesWithUnknownAssets: NoteToBeParsed[]
  /** Callback when the user changed the passwords and want to try to parse again */
  export let onRetry: () => void
  /** Callback when the user don't want to re-try to parse the notes and they should be ignored */
  export let onDismiss: () => void

  /**
   * Handles key down press in the inputs. If `Enter` is pressed, `onRetry` is called
   * @param event the `KeyboardEvent`
   */
  function keyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      onRetry()
    }
  }
</script>

<!-- Unknown assets modal -->
<Modal header={$_('unkown_asset.title')} isOpen={!(notesWithUnknownAssets.length === 0)} toggle={onDismiss}>
  <ModalBody>
    <p>{$_('unkown_asset.info')}</p>
    {#each notesWithUnknownAssets as error, i}
      🏛️ <b>{error.missingAsset}</b>
      <InputGroup class="align-items-center mb-3">
        <Input type="text" class="form-control" placeholder={$_('unkown_asset.code_placeholder')} bind:value={customAssets[i].code} on:keydown={keyDownHandler} />
        <Input type="text" style="margin-left: 10px; margin-right: 10px" class="form-control" placeholder={$_('words.cnpj')} bind:value={customAssets[i].cnpj} on:keydown={keyDownHandler} />
        <Input type="checkbox" label={$_('unkown_asset.fii')} bind:value={customAssets[i].isFII} />
      </InputGroup>
    {/each}
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={onRetry}>{$_('unkown_asset.retry')}</Button>
    <Button on:click={onDismiss}>{$_('unkown_asset.ignore')}</Button>
  </ModalFooter>
</Modal>
