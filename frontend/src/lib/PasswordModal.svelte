<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { noTypeCheck } from "./common";

  /** List of possible passwords */
  export let passwords: string[];
  /** Notes with wrong password */
  export let notesWithWrongPassword: NoteToBeParsed[];
  /** Callback when the user changed the passwords and want to try to parse again */
  export let onRetry: () => void;
  /** Callback when the user don't want to re-try to parse the notes and they should be ignored */
  export let onDismiss: () => void;

  /**
   * Handles key down press in the inputs. If `Enter` is pressed, `onRetry` is called
   * @param event the `KeyboardEvent`
   */
  function keyDownHandler(
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (event.key === "Enter") {
      onRetry();
    }
  }
</script>

<!-- Password modal -->
<Modal
  header="⚠️ PDFs com senha"
  isOpen={!!notesWithWrongPassword.length}
  toggle={onDismiss}
>
  <ModalBody>
    <p>
      Os PDFs abaixo precisam de senha. Você pode inserir mais de uma
      possibilidade de senha para os PDFs
    </p>
    {#each notesWithWrongPassword as error}
      <p>🔑 <b>{error.name}</b></p>
    {/each}
    <Row class="justify-content-center">
      <input
        data-testid="password-input-1"
        class="password-input"
        type="password"
        placeholder="Possibilidade 1"
        bind:value={passwords[0]}
        on:keydown={keyDownHandler}
      />
    </Row>
    <Row class="justify-content-center">
      <input
        data-testid="password-input-2"
        class="password-input"
        type="password"
        placeholder="Possibilidade 2"
        bind:value={passwords[1]}
        on:keydown={keyDownHandler}
      />
    </Row>
    <Row class="justify-content-center">
      <input
        data-testid="password-input-3"
        class="password-input"
        type="password"
        placeholder="Possibilidade 3"
        bind:value={passwords[2]}
        on:keydown={keyDownHandler}
      />
    </Row>
  </ModalBody>
  <ModalFooter>
    <Button
      {...noTypeCheck({ "data-testid": "retry-password-button" })}
      color="primary"
      on:click={onRetry}
    >
      Tentar novamente
    </Button>
    <Button
      {...noTypeCheck({ "data-testid": "ignore-password-button" })}
      on:click={onDismiss}
    >
      >Ignorar ></Button
    >
  </ModalFooter>
</Modal>

<style>
  .password-input {
    border-radius: 12px;
    padding: 3px 6px 3px 6px;
    max-width: 200px;
  }
</style>
