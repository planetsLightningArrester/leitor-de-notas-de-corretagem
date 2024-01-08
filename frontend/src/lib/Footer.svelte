<script lang="ts">
  import { _ } from 'svelte-i18n'
  import githubSvg from '../assets/github.svg'
  import { Tooltip } from '@sveltestrap/sveltestrap'

  let footerTextLeftTextContent = `Planet's Lightning Arrester - ${new Date().getFullYear()}`
</script>

<!-- Bottom bar -->
<div class="footer fixed-bottom justify-content-center">
  <footer class="d-flex flex-wrap justify-content-center align-items-center py-3 border-top w-80 m-auto">
    <span id="footer-text-left" class="footer-text" spellcheck="false" contenteditable bind:textContent={footerTextLeftTextContent} />
    <span class="footer-text">|</span>
    <Tooltip target="github-icon-anchor">{$_('footer.github_page')}</Tooltip>
    <a id="github-icon-anchor" style="display: flex;" href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem">
      <img id="github-icon-image" class="github-cat" src={githubSvg} alt={$_('footer.github_page')} height="20px" />
    </a>
  </footer>
</div>

<style>
  .w-80 {
    width: 80%;
  }

  .footer {
    background-color: #171b26;
  }

  .footer-text {
    color: #d6d6d6;
    font-size: 15px;
    margin-right: 20px;
  }

  .github-cat {
    filter: invert(0);
    transition: 300ms;
  }

  .github-cat:hover {
    filter: invert(48%);
    transition: 300ms;
  }
</style>
