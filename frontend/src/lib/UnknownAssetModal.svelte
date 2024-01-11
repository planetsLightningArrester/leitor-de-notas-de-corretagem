<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Button, Icon, Input, InputGroup, Modal, ModalBody, ModalFooter, Tooltip } from '@sveltestrap/sveltestrap'

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
<Modal header={$_('unknown_asset.title')} isOpen={!(notesWithUnknownAssets.length === 0)} toggle={onDismiss}>
  <ModalBody>
    <p>{$_('unknown_asset.info')}</p>
    {#each notesWithUnknownAssets as error, i}
      🏛️ <b>{error.missingAsset}</b>
      <InputGroup class="align-items-center mb-3">
        <Input
          data-testid={error.missingAsset + '-code'}
          type="text"
          class="form-control"
          placeholder={$_('unknown_asset.code_placeholder')}
          bind:value={customAssets[i].code}
          on:keydown={keyDownHandler}
        />
        <Input
          data-testid={error.missingAsset + '-cnpj'}
          type="text"
          style="margin-left: 10px; margin-right: 10px"
          class="form-control"
          placeholder={$_('words.cnpj')}
          bind:value={customAssets[i].cnpj}
          on:keydown={keyDownHandler}
        />
        <Input data-testid={error.missingAsset + '-is-fii'} type="checkbox" label={$_('unknown_asset.fii')} bind:value={customAssets[i].isFII} />
        <Icon id={(error.missingAsset ?? '').replaceAll(' ', '-') + '-is-fii'} name="info-circle" style="margin-left: 5px" />
      </InputGroup>
      <Tooltip target={(error.missingAsset ?? '').replaceAll(' ', '-') + '-is-fii'}>{$_('unknown_asset.fii_info')}</Tooltip>
    {/each}
  </ModalBody>
  <ModalFooter>
    <Button data-testid="retry-unknown-asset-button" color="primary" on:click={onRetry}>{$_('unknown_asset.retry')}</Button>
    <Button data-testid="ignore-unknown-asset-button" on:click={onDismiss}>{$_('unknown_asset.ignore')}</Button>
  </ModalFooter>
</Modal>
