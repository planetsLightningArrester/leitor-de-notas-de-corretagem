<script lang="ts">
  import { Tooltip } from "sveltestrap";
  import githubSvg from "../assets/github.svg";

  let footerTextLeftTextContent = `Planet's Lightning Arrester - ${new Date().getFullYear()}`;
</script>

<!-- Bottom bar -->
<div class="footer fixed-bottom m-auto w-80">
  <footer
    class="d-flex flex-wrap justify-content-center align-items-center py-3 border-top"
  >
    <span
      id="footer-text-left"
      class="footer-text"
      contenteditable
      bind:textContent={footerTextLeftTextContent}
    />
    <span class="footer-text">|</span>
    <Tooltip target="github-icon">Página do GitHub</Tooltip>
    <a
      id="github-icon"
      style="display: flex;"
      href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem"
    >
      <img class="github-cat" src={githubSvg} alt="GitHub" height="20px" />
    </a>
  </footer>
</div>

<style>
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
