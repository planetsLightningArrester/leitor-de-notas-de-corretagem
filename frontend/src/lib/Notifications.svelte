<script lang="ts">
  import { Icon } from '@sveltestrap/sveltestrap'

  export let message: string
  export let duration: number = 3000
  export let type: 'success' | 'warning' | 'error'
  const animationDuration = 400
  let div: HTMLDivElement
  let show: boolean = false
  let hiding: boolean = false
  let timeout: number | undefined

  /** Animate the notification out of the screen */
  function onHide(): void {
    if (!hiding && div !== null) {
      hiding = true
      div.classList.add('push-up')
      setTimeout(() => {
        if (div !== null) {
          div.classList.remove('push-up')
          show = false
          hiding = false
        }
      }, animationDuration)
    }
  }

  $: {
    show = message !== ''
    if (typeof timeout !== 'undefined') clearTimeout(timeout)
    timeout = setTimeout(onHide, duration)
  }
</script>

{#if show || hiding}
  <div
    data-testid="push-notification"
    bind:this={div}
    class="push {type} push-down"
    style="width: {message.length *
      14}px; animation-duration: {animationDuration}ms;"
  >
    <span class="push-text">
      {#if type === 'success'}
        <Icon class="push-text-icon" name="check-lg" />
      {:else if type === 'warning'}
        <Icon class="push-text-icon" name="exclamation-triangle" />
      {:else if type === 'error'}
        <Icon class="push-text-icon" name="exclamation-circle" />
      {/if}
      {message}
    </span>
    <button
      data-testid="push-notification-close"
      class="close-icon"
      on:click={onHide}>×</button
    >
  </div>
{/if}

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
    user-select: none;
    &-icon {
      font-size: 20px;
    }
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
    background-color: transparent;
    border: none;
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
