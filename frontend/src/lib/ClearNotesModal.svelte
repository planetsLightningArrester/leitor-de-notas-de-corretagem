<script lang="ts">
  import { get_current_component } from "svelte/internal";
  import { Button, Modal, ModalBody, ModalFooter } from "sveltestrap";

  export let note: string;
  /** Callback when the user confirmed the deletion */
  export let onConfirm: () => void;
  /** Callback when the user dismissed the deletion */
  export let onDismiss: () => void;

  let showModal = true;
  const _thisComponent = get_current_component();

  $: if (!showModal) {
    // Wait for modal fade-out
    setTimeout(() => {
      _thisComponent.$destroy();
    }, 1000);
  }
</script>

<!-- Clear notes modal -->
<Modal
  header={note === "all" ? "♻️ Limpar notas" : `♻️ Remover nota Nº ${note}`}
  isOpen={showModal}
  toggle={onDismiss}
>
  <ModalBody>
    <p style="user-select: none;">
      Você realmente deseja remover {note === "all"
        ? "todas as notas carregadas"
        : `a nota Nº ${note}`}?
    </p>
  </ModalBody>
  <ModalFooter>
    <Button
      color="success"
      on:click={() => {
        showModal = false;
        onDismiss();
      }}>Não</Button
    >
    <Button
      color="danger"
      on:click={() => {
        showModal = false;
        onConfirm();
      }}>Sim</Button
    >
  </ModalFooter>
</Modal>
