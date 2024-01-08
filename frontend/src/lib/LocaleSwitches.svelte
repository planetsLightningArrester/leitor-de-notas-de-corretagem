<script lang="ts">
  import { Container } from '@sveltestrap/sveltestrap'
  import { locale, isLoading } from 'svelte-i18n'
  import zhFlag from '../assets/zh-flag.svg'
  import usFlag from '../assets/us-flag.svg'
  import mxFlag from '../assets/mx-flag.png'
  import brFlag from '../assets/br-flag.png'
  import { resolveImgPath } from './common'
  let zhLoaded = false
  let enLoaded = false
  let esLoaded = false
  let ptLoaded = false
</script>

<Container style="display: flex; justify-content: center;">
  <button
    class="transparent-button"
    on:click={async () => {
      await locale.set('zh-CN')
    }}
  >
    <img
      src={zhFlag}
      alt="简体中文"
      hidden={!$isLoading && !zhLoaded}
      data-testid="zh-CN-button"
      class={$locale === 'zh-CN' ? 'language-button-selected' : 'language-button-not-selected'}
      on:load={() => {
        zhLoaded = true
      }}
    />
  </button>
  <button
    class="transparent-button"
    on:click={async () => {
      await locale.set('en-US')
    }}
  >
    <img
      src={usFlag}
      alt="English"
      hidden={!$isLoading && !enLoaded}
      data-testid="en-US-button"
      class={$locale === 'en-US' ? 'language-button-selected' : 'language-button-not-selected'}
      on:load={() => {
        enLoaded = true
      }}
    />
  </button>
  <button
    class="transparent-button"
    on:click={async () => {
      await locale.set('es-MX')
    }}
  >
    <img
      src={resolveImgPath(mxFlag)}
      alt="Español"
      hidden={!$isLoading && !esLoaded}
      data-testid="es-MX-button"
      class={$locale === 'es-MX' ? 'language-button-selected' : 'language-button-not-selected'}
      on:load={() => {
        esLoaded = true
      }}
    />
  </button>
  <button
    class="transparent-button"
    on:click={async () => {
      await locale.set('pt-BR')
    }}
  >
    <img
      src={resolveImgPath(brFlag)}
      alt="Português"
      hidden={!$isLoading && !ptLoaded}
      data-testid="pt-BR-button"
      class={$locale === 'pt-BR' ? 'language-button-selected' : 'language-button-not-selected'}
      on:load={() => {
        ptLoaded = true
      }}
    />
  </button>
</Container>
<div class="language-container"></div>

<style lang="scss">
  .transparent-button {
    border: none;
    background-color: transparent;
  }
  .language {
    &-button {
      @mixin props {
        width: 35px;
        margin: 20px 5px;
        cursor: pointer;
        border-radius: 50%;
      }
      &-selected {
        @include props();
        border: 3px solid #2ba2ff;
      }
      &-not-selected {
        @include props();
        border: 3px solid transparent;
      }
    }
  }
</style>
