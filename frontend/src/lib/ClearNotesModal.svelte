<script lang="ts">
  import { get_current_component } from "svelte/internal";
  import { Button, Modal, ModalBody, ModalFooter } from "sveltestrap";

  /** Callback when the user changed the passwords and want to try to parse again */
  export let onConfirm: () => void;

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
<Modal header="♻️ Limpar notas" isOpen={showModal}>
  <ModalBody>
    <p style="user-select: none;">
      Você realmente quer remover todas as notas carregadas?
    </p>
  </ModalBody>
  <ModalFooter>
    <Button color="success" on:click={() => (showModal = false)}>Não</Button>
    <Button
      color="danger"
      on:click={() => {
        showModal = false;
        onConfirm();
      }}>Sim</Button
    >
  </ModalFooter>
</Modal>
