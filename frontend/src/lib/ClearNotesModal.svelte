<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Button, Modal, ModalBody, ModalFooter } from '@sveltestrap/sveltestrap'
  import type { SvelteComponent } from 'svelte'

  export let note: string
  /** Callback when the user confirmed the deletion */
  export let onConfirm: () => void
  /** Callback when the user dismissed the deletion */
  export let onDismiss: () => void

  let showModal = true
  let nodeRef: SvelteComponent | undefined

  $: if (!showModal) {
    // Wait for modal fade-out
    setTimeout(() => {
      if (typeof nodeRef !== 'undefined' && nodeRef.parentNode !== null) {
        nodeRef.parentNode.removeChild(nodeRef)
      }
    }, 1000)
  }
</script>

<!-- Clear notes modal -->
<Modal bind:this={nodeRef} header={note === 'all' ? $_('clear_notes.clear_all_notes.header') : $_({ id: 'clear_notes.clear_note.header', values: { note } })} isOpen={showModal} toggle={onDismiss}>
  <ModalBody>
    <p style="user-select: none;">
      {note === 'all' ? $_('clear_notes.clear_all_notes.info') : $_({ id: 'clear_notes.clear_note.info', values: { note } })}
    </p>
  </ModalBody>
  <ModalFooter>
    <Button
      color="success"
      on:click={() => {
        showModal = false
        onDismiss()
      }}>{$_('words.cancel')}</Button
    >
    <Button
      color="danger"
      on:click={() => {
        showModal = false
        onConfirm()
      }}>{$_('words.confirm')}</Button
    >
  </ModalFooter>
</Modal>
