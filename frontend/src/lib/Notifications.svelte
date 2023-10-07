<script lang="ts">
  export let message: string;
  export let duration: number = 3000;
  export let type: "success" | "warning" | "error";
  let animationDuration = 400;
  let div: HTMLDivElement;
  let show: boolean = false;
  let hiding: boolean = false;
  let timeout: number | undefined;

  /** Animate the notification out of the screen */
  function onHide() {
    hiding = true;
    div.classList.add("push-up");
    setTimeout(() => {
      div.classList.remove("push-up");
      show = false;
      hiding = false;
    }, animationDuration);
  }

  /** Listen to 'Escape' to dismiss the notification */
  function onKeyDown(e: KeyboardEvent) {
    if (show && e.key === "Escape") {
      onHide();
    }
  }

  $: {
    show = !!message;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(onHide, duration);
  }
</script>

{#if show || hiding}
  <div
    bind:this={div}
    class="push {type} push-down"
    style="width: {message.length *
      14}px; animation-duration: {animationDuration}ms;"
  >
    <span class="push-text">
      {message}
    </span>
    <span class="close-icon" on:click={onHide} on:keydown={onKeyDown}>×</span>
  </div>
{/if}

<div style="--animationDuration:{animationDuration};" />

<style lang="scss">
  :global(.push) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 20px;
    color: white;
    text-align: center;
    z-index: 10000;
    max-width: 500px;
    min-width: 150px;
    border-radius: 3px;
    margin: auto;
    padding: 5px 5px 5px 5px;
  }

  .push-text {
    padding: 0px 15px 0px 0px;
    text-align: center;
  }

  .push-down {
    animation-name: slide-down;
  }

  :global(.push-up) {
    animation-name: slide-up !important;
    animation-fill-mode: forwards !important;
  }

  .close-icon {
    position: absolute;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }

  .success {
    background-color: #39b449;
  }

  .error {
    background-color: #cc2727;
  }

  .warning {
    color: black;
    background-color: #e3c800;
  }

  @keyframes slide-down {
    0% {
      top: 0px;
      opacity: 0;
    }
    50% {
      opacity: 0.5;
      top: 30px;
    }
    100% {
      top: 20px;
    }
  }

  @keyframes slide-up {
    100% {
      top: 0px;
      opacity: 0;
    }
    25% {
      opacity: 1;
      top: 15px;
    }
    50% {
      top: 30px;
    }
    0% {
      top: 20px;
    }
  }
</style>
