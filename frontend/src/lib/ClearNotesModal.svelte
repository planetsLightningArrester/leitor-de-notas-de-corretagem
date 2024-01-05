<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
  } from '@sveltestrap/sveltestrap'
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
      if (typeof nodeRef !== 'undefined' && nodeRef.parentNode !== null) { nodeRef.parentNode.removeChild(nodeRef) }
    }, 1000)
  }
</script>

<!-- Clear notes modal -->
<Modal
  bind:this={nodeRef}
  header={note === 'all' ? '♻️ Limpar notas' : `♻️ Remover nota Nº ${note}`}
  isOpen={showModal}
  toggle={onDismiss}
>
  <ModalBody>
    <p style="user-select: none;">
      Você realmente deseja remover {note === 'all'
        ? 'todas as notas carregadas'
        : `a nota Nº ${note}`}?
    </p>
  </ModalBody>
  <ModalFooter>
    <Button
      color="success"
      on:click={() => {
        showModal = false
        onDismiss()
      }}>Não</Button
    >
    <Button
      color="danger"
      on:click={() => {
        showModal = false
        onConfirm()
      }}>Sim</Button
    >
  </ModalFooter>
</Modal>
